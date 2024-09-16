#!/bin/bash

# 标记开始
echo "Starting Next.js build and notify system..."

# 运行构建命令并捕获退出状态
next build
BUILD_STATUS=$?

# 根据构建结果发送通知
if [ $BUILD_STATUS -eq 0 ]; then
  echo "Build succeeded, sending success notification..."
  curl -X POST "https://sctapi.ftqq.com/SCT187769TLs8kElhV6A14sCW4rQRx34pX.send" \
    -H "Content-Type: application/json;charset=utf-8" \
    -d '{
      "title": "🚀 [Next Build Success] 🎉",
      "desp": "🎉 **Build Status:** SUCCESS ✅\n\n🕒 **Build Time:** '["$(date +'%Y-%m-%d %H:%M:%S')"]'\n\n🌐 **Server IP:** '["$(curl -s http://ip.sb)"]'\n\n✨ Congratulations! Your Next.js project has been successfully built! 🎊",
      "short": "✅ Build Success on '["$(date +'%Y-%m-%d %H:%M:%S')"]'",
      "channel": "9|18"
    }'
else
  echo "Build failed, sending failure notification..."
  curl -X POST "https://sctapi.ftqq.com/SCT187769TLs8kElhV6A14sCW4rQRx34pX.send" \
    -H "Content-Type: application/json;charset=utf-8" \
    -d '{
      "title": "🚨 [Next Build Failed] ❌",
      "desp": "⚠️ **Build Status:** FAILED ❌\n\n🕒 **Failure Time:** '["$(date +'%Y-%m-%d %H:%M:%S')"]'\n\n🌐 **Server IP:** '["$(curl -s http://ip.sb)"]'\n\n💥 Please check the logs and fix the issues. Good luck! 💪",
      "short": "❌ Build Failed on '["$(date +'%Y-%m-%d %H:%M:%S')"]'",
      "channel": "9|18"
    }'
fi

