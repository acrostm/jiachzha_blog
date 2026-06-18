import { sendCloudflareEmail } from "./client";
import { type OtpEmailPurpose, createOtpEmail } from "./templates/otp";
import { createWelcomeEmail } from "./templates/welcome";

const DEFAULT_SITE_URL = "https://jiachz.com";
const DEFAULT_EMAIL_FROM = "noreply@jiachz.com";
const SENDER_NAME = "jiachz.com";

const getOptionalEnv = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    return undefined;
  }

  return value;
};

const getSiteUrl = () =>
  (getOptionalEnv("SITE_URL") ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

const getSenderAddress = () =>
  getOptionalEnv("EMAIL_FROM") ??
  getOptionalEnv("DEFAULT_FROM_EMAIL") ??
  DEFAULT_EMAIL_FROM;

const normalizeOtpPurpose = (type: string): OtpEmailPurpose =>
  type === "password-change" ? "password-change" : "email-verification";

export const sendOtpEmail = async ({
  code,
  to,
  type,
}: {
  code: string;
  to: string;
  type: string;
}) => {
  const purpose = normalizeOtpPurpose(type);
  const email = createOtpEmail({ code, purpose });

  return sendCloudflareEmail({
    from: { address: getSenderAddress(), name: SENDER_NAME },
    to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    headers: {
      "X-Jiachz-Email-Type": purpose,
    },
  });
};

export const sendWelcomeEmail = async ({
  name,
  to,
}: {
  name: string;
  to: string;
}) => {
  const email = createWelcomeEmail({ name, siteUrl: getSiteUrl() });

  return sendCloudflareEmail({
    from: { address: getSenderAddress(), name: SENDER_NAME },
    to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    headers: {
      "X-Jiachz-Email-Type": "welcome",
    },
  });
};
