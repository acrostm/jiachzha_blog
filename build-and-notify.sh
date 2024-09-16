#!/bin/bash

# 运行 next build
echo "Starting Next.js build and notify system..."
next build

# 获取 build 的退出状态码
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
  echo "Build successful, sending success notification..."
  # 构建成功后调用 API 发送成功推送
  curl -X POST "https://sctapi.ftqq.com/SCT187769TLs8kElhV6A14sCW4rQRx34pX.send" \
    -H "Content-Type: application/json;charset=utf-8" \
    -d '{
      "title": "[Next Build Success！] ",
      "desp": "Next build Success! 🎉 at '["$(date +'%Y-%m-%d %H:%M:%S')"]' on server ip '["$(hostname -I | awk '{print $1}')"]'",
      "short": "'["$(date +'%Y-%m-%d %H:%M:%S')"]' on server ip '["$(hostname -I | awk '{print $1}')"]'",
      "channel": "9|18"
    }'
else
  echo "Build failed, sending failure notification..."
  # 构建失败后调用 API 发送失败推送
  curl -X POST "https://sctapi.ftqq.com/SCT187769TLs8kElhV6A14sCW4rQRx34pX.send" \
    -H "Content-Type: application/json;charset=utf-8" \
    -d '{
      "title": "[Next Build Failed！] ",
      "desp": "Next build Failed! at '["$(date +'%Y-%m-%d %H:%M:%S')"]' on server ip '["$(hostname -I | awk '{print $1}')"]'",
      "short": "'["$(date +'%Y-%m-%d %H:%M:%S')"]' on server ip '["$(hostname -I | awk '{print $1}')"]'",
      "channel": "9|18"
    }'
fi

# 退出脚本时返回构建的退出状态码
exit $BUILD_STATUS
