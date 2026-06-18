import { type NextRequest, NextResponse } from "next/server";

import { ActivityStatus, ResourceType } from "@prisma/client";
import { randomInt } from "node:crypto";

import { auth } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";
import { notifyOtpCode } from "@/lib/notification";
import { prisma } from "@/lib/prisma";
import { safeLogActivity } from "@/lib/utils/activity-logger-helper";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const type =
      typeof body.type === "string" ? body.type : "email-verification";

    const userEmail = session.user.email;

    // 对于邮箱验证，检查用户是否已经验证
    if (type === "email-verification") {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { emailVerified: true },
      });

      if (user?.emailVerified) {
        return NextResponse.json({ message: "邮箱已验证" }, { status: 400 });
      }
    }

    // 检查是否有未过期的OTP
    const existingOtp = await prisma.verificationToken.findFirst({
      where: {
        identifier: userEmail,
        type: type === "password-change" ? "password-change-otp" : "otp",
        expires: { gt: new Date() },
      },
    });

    if (existingOtp) {
      const secondsLeft = Math.ceil(
        (existingOtp.expires.getTime() - Date.now()) / 1000,
      );
      return NextResponse.json(
        { message: `请等待 ${secondsLeft} 秒后再试` },
        { status: 429 },
      );
    }

    // 生成6位安全随机OTP
    const otp = randomInt(100000, 1000000).toString();

    // 保存OTP到数据库（有效期60秒）
    const expiresAt = new Date(Date.now() + 60 * 1000);
    await prisma.verificationToken.create({
      data: {
        identifier: userEmail,
        token: otp,
        expires: expiresAt,
        type: type === "password-change" ? "password-change-otp" : "otp",
      },
    });

    // 发送邮件
    await sendOtpEmail({ code: otp, to: userEmail, type });

    // 发送bark通知
    try {
      await notifyOtpCode(
        userEmail,
        otp,
        type,
        new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
      );
    } catch (error) {
      // bark通知失败不影响主流程，只记录错误
      // eslint-disable-next-line no-console
      console.error("发送bark通知失败:", error);
    }

    // 发送邮件成功后记录日志
    await safeLogActivity(session.user.id, "SEND_OTP", ActivityStatus.SUCCESS, {
      resourceType: ResourceType.USER,
      resourceId: session.user.id,
      actionDetails: {
        action: "send-otp",
        description: `发送${type}验证码`,
      },
    });
    return NextResponse.json({ message: "验证码已发送" });
  } catch (error: unknown) {
    // 记录失败日志
    let userId = null;
    try {
      const session = await auth();
      userId = session?.user?.id ?? null;
    } catch {
      // Ignore error getting session
    }
    await safeLogActivity(userId, "SEND_OTP", ActivityStatus.FAILED, {
      resourceType: ResourceType.USER,
      resourceId: userId ?? undefined,
      actionDetails: {
        action: "send-otp",
        description: "发送验证码失败",
      },
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ message: "发送验证码失败" }, { status: 500 });
  }
}
