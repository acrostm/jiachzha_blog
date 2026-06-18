export type OtpEmailPurpose = "email-verification" | "password-change";

type OtpEmailInput = {
  code: string;
  purpose: OtpEmailPurpose;
};

const OTP_COPY = {
  "email-verification": {
    subject: "邮箱验证码",
    title: "邮箱验证码",
    description: "您的验证码是：",
    detail: "你正在验证 jiachz.com 账号邮箱。请输入以下验证码完成确认。",
  },
  "password-change": {
    subject: "修改密码验证码",
    title: "修改密码验证码",
    description: "您正在修改密码，验证码是：",
    detail: "你正在修改 jiachz.com 账号密码。请输入以下验证码完成确认。",
  },
} as const;

export const createOtpEmail = ({ code, purpose }: OtpEmailInput) => {
  const copy = OTP_COPY[purpose];

  return {
    subject: copy.subject,
    text: `${copy.title}

${copy.description}

${code}

此验证码有效期为60秒，请尽快使用。
如果您没有请求此验证码，请忽略此邮件。`,
    html: `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${copy.subject}</title>
  </head>
  <body style="margin:0;background:#f4f6f8;padding:24px 0;font-family:Arial,'PingFang SC','Microsoft YaHei',sans-serif;color:#18212f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f4f6f8;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border-collapse:collapse;background:#ffffff;border:1px solid #dce3eb;">
            <tr>
              <td style="padding:32px 32px 20px 32px;text-align:center;background:#111827;color:#ffffff;">
                <div style="font-size:13px;line-height:20px;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;">jiachz.com</div>
                <h1 style="margin:10px 0 0 0;font-size:24px;line-height:32px;font-weight:700;">${copy.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 12px 0;font-size:16px;line-height:26px;color:#374151;">${copy.description}</p>
                <p style="margin:0 0 24px 0;font-size:14px;line-height:22px;color:#5f6b7a;">${copy.detail}</p>
                <div style="margin:0 0 24px 0;padding:22px 18px;text-align:center;background:#f8fafc;border:1px solid #d7dee8;font-size:34px;line-height:42px;font-weight:700;letter-spacing:8px;color:#111827;">${code}</div>
                <p style="margin:0 0 8px 0;font-size:14px;line-height:22px;color:#5f6b7a;">此验证码有效期为60秒，请尽快使用。</p>
                <p style="margin:0;font-size:14px;line-height:22px;color:#5f6b7a;">如果您没有请求此验证码，请忽略此邮件。</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
};
