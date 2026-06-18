const CLOUDFLARE_API_BASE_URL = "https://api.cloudflare.com/client/v4";

type EmailAddress = string | { address: string; name: string };

type EmailAttachment = {
  content: string;
  disposition: "attachment" | "inline";
  filename: string;
  type: string;
  content_id?: string;
};

export type CloudflareEmailPayload = {
  from: EmailAddress;
  subject: string;
  to?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: EmailAddress;
  headers?: Record<string, string>;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
};

type CloudflareApiMessage = {
  code?: number | string;
  message: string;
};

type CloudflareEmailApiResponse = {
  success: boolean;
  errors: CloudflareApiMessage[];
  messages: CloudflareApiMessage[];
  result: CloudflareEmailResult | null;
};

export type CloudflareEmailResult = {
  message_id: string;
  delivered: string[];
  queued: string[];
  permanent_bounces: string[];
};

export class CloudflareEmailError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly errors: CloudflareApiMessage[] = [],
  ) {
    super(message);
    this.name = "CloudflareEmailError";
  }
}

const getRequiredEnv = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new CloudflareEmailError(`Missing required email env: ${name}`);
  }

  return value;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseJson = (text: string): unknown => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const toStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const toApiMessages = (value: unknown): CloudflareApiMessage[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (!isRecord(item)) {
      return { message: String(item) };
    }

    const code = item.code;
    const message = item.message;

    return {
      code:
        typeof code === "number" || typeof code === "string" ? code : undefined,
      message: typeof message === "string" ? message : "Unknown error",
    };
  });
};

const parseEmailResult = (value: unknown): CloudflareEmailResult | null => {
  if (!isRecord(value)) {
    return null;
  }

  const messageId = value.message_id;

  if (typeof messageId !== "string") {
    return null;
  }

  return {
    message_id: messageId,
    delivered: toStringArray(value.delivered),
    queued: toStringArray(value.queued),
    permanent_bounces: toStringArray(value.permanent_bounces),
  };
};

const parseCloudflareResponse = (
  value: unknown,
): CloudflareEmailApiResponse => {
  if (!isRecord(value)) {
    return {
      success: false,
      errors: [{ message: "Cloudflare returned a non-JSON response" }],
      messages: [],
      result: null,
    };
  }

  return {
    success: value.success === true,
    errors: toApiMessages(value.errors),
    messages: toApiMessages(value.messages),
    result: parseEmailResult(value.result),
  };
};

const formatErrors = (errors: CloudflareApiMessage[]) => {
  if (errors.length === 0) {
    return "Unknown Cloudflare Email Service error";
  }

  return errors
    .map((error) =>
      error.code ? `${error.code}: ${error.message}` : error.message,
    )
    .join("; ");
};

export const sendCloudflareEmail = async (
  payload: CloudflareEmailPayload,
): Promise<CloudflareEmailResult> => {
  if (!payload.html && !payload.text) {
    throw new CloudflareEmailError(
      "Cloudflare Email Service requires html or text content",
    );
  }

  const accountId = getRequiredEnv("CLOUDFLARE_ACCOUNT_ID");
  const apiToken = getRequiredEnv("CLOUDFLARE_EMAIL_API_TOKEN");
  const response = await fetch(
    `${CLOUDFLARE_API_BASE_URL}/accounts/${accountId}/email/sending/send`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
  const responseBody = await response.text();
  const cloudflareResponse = parseCloudflareResponse(parseJson(responseBody));

  if (!response.ok || !cloudflareResponse.success) {
    throw new CloudflareEmailError(
      `Cloudflare Email Service request failed: ${formatErrors(
        cloudflareResponse.errors,
      )}`,
      response.status,
      cloudflareResponse.errors,
    );
  }

  if (!cloudflareResponse.result) {
    throw new CloudflareEmailError(
      "Cloudflare Email Service did not return an email result",
      response.status,
      cloudflareResponse.messages,
    );
  }

  if (cloudflareResponse.result.permanent_bounces.length > 0) {
    throw new CloudflareEmailError(
      `Cloudflare Email Service permanently bounced recipient(s): ${cloudflareResponse.result.permanent_bounces.join(
        ", ",
      )}`,
      response.status,
      cloudflareResponse.messages,
    );
  }

  return cloudflareResponse.result;
};
