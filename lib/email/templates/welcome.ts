import { PATHS } from "@/constants";

type WelcomeEmailInput = {
  name: string;
  siteUrl: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildUrl = (siteUrl: string, path: string) =>
  new URL(path, siteUrl).toString();

const createFeatureLink = ({
  description,
  href,
  label,
}: {
  description: string;
  href: string;
  label: string;
}) => `<td width="50%" style="padding:8px;">
  <a href="${href}" style="display:block;text-decoration:none;color:#18212f;border:1px solid #dce3eb;background:#ffffff;padding:16px;">
    <strong style="display:block;margin:0 0 6px 0;font-size:15px;line-height:20px;color:#111827;">${label}</strong>
    <span style="display:block;font-size:13px;line-height:20px;color:#64748b;">${description}</span>
  </a>
</td>`;

export const createWelcomeEmail = ({ name, siteUrl }: WelcomeEmailInput) => {
  const safeName = escapeHtml(name);
  const homeUrl = buildUrl(siteUrl, PATHS.SITE_HOME);
  const blogUrl = buildUrl(siteUrl, PATHS.SITE_BLOG);
  const newsUrl = buildUrl(siteUrl, PATHS.SITE_NEWS);
  const heroUrl = buildUrl(
    siteUrl,
    "/images/home-showcase/sequence-datacenter.jpg",
  );

  const dailyReportsLink = createFeatureLink({
    label: "日报",
    description: "按日期归档的自动化观察",
    href: buildUrl(siteUrl, PATHS.SITE_DAILY_REPORTS),
  });
  const steamPricesLink = createFeatureLink({
    label: "Steam 比价",
    description: "多区官方价格实时比价",
    href: buildUrl(siteUrl, PATHS.SITE_STEAM_PRICES),
  });
  const aboutLink = createFeatureLink({
    label: "关于",
    description: "站点和作者的工作现场",
    href: buildUrl(siteUrl, PATHS.SITE_ABOUT),
  });
  const messagesLink = createFeatureLink({
    label: "留言",
    description: "留下想法或反馈",
    href: buildUrl(siteUrl, PATHS.SITE_MESSAGES),
  });

  const text = `${name}，欢迎来到 jiachz.com。

这里写给 AI 时代的软件开发现场，记录产品、工程、自动化与技术信号。

进入博客：${blogUrl}
查看今日信号：${newsUrl}
日报：${buildUrl(siteUrl, PATHS.SITE_DAILY_REPORTS)}
Steam 比价：${buildUrl(siteUrl, PATHS.SITE_STEAM_PRICES)}
关于：${buildUrl(siteUrl, PATHS.SITE_ABOUT)}
留言：${buildUrl(siteUrl, PATHS.SITE_MESSAGES)}

如果不是本人注册，可忽略本邮件。`;

  return {
    subject: "欢迎来到 jiachz.com",
    text,
    html: `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>欢迎来到 jiachz.com</title>
  </head>
  <body style="margin:0;background:#eef2f6;padding:24px 0;font-family:Arial,'PingFang SC','Microsoft YaHei',sans-serif;color:#18212f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#eef2f6;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:collapse;background:#ffffff;border:1px solid #d8e0ea;">
            <tr>
              <td>
                <a href="${homeUrl}" style="display:block;text-decoration:none;">
                  <img src="${heroUrl}" alt="jiachz.com" width="640" style="display:block;width:100%;max-width:640px;height:auto;border:0;" />
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 34px 20px 34px;">
                <div style="font-size:13px;line-height:20px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">jiachz.com</div>
                <h1 style="margin:8px 0 14px 0;font-size:28px;line-height:36px;font-weight:700;color:#111827;">欢迎，${safeName}</h1>
                <p style="margin:0;font-size:16px;line-height:26px;color:#475569;">这里写给 AI 时代的软件开发现场，记录产品、工程、自动化与技术信号。</p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 34px 26px 34px;">
                <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:0 12px 12px 0;">
                      <a href="${blogUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:13px 18px;font-size:14px;line-height:20px;font-weight:700;">进入博客</a>
                    </td>
                    <td style="padding:0 0 12px 0;">
                      <a href="${newsUrl}" style="display:inline-block;background:#ffffff;color:#111827;text-decoration:none;padding:12px 17px;font-size:14px;line-height:20px;font-weight:700;border:1px solid #cbd5e1;">查看今日信号</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 26px 28px 26px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    ${dailyReportsLink}
                    ${steamPricesLink}
                  </tr>
                  <tr>
                    ${aboutLink}
                    ${messagesLink}
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 34px;background:#f8fafc;border-top:1px solid #dce3eb;">
                <p style="margin:0;font-size:13px;line-height:20px;color:#64748b;">如果不是本人注册，可忽略本邮件。</p>
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
