#!/bin/bash

# 标记开始
echo "Starting Next.js build and notify system..."

# 运行构建命令并捕获退出状态
next build
BUILD_STATUS=$?

# 获取当前时间和服务器IP
CURRENT_TIME=$(date +'%Y-%m-%d %H:%M:%S')
SERVER_IP=$(curl -s http://ip.sb)

# 定义通知函数
send_notification() {
    local status=$1
    local title=$2
    local body=$3
    local sound=$4

    # 发送Server酱通知
    curl -X POST "https://sctapi.ftqq.com/SCT187769TLs8kElhV6A14sCW4rQRx34pX.send" \
        -H "Content-Type: application/json;charset=utf-8" \
        -d '{
            "title": "'"$title"'",
            "desp": "'"$body"'",
            "short": "'"$status Build on $CURRENT_TIME"'",
            "channel": "9"
        }'

    # 发送Bark通知
    curl -X POST "https://bark.zj.cyou/q5QapdtK7oHDyULHxqaS4Y" \
        -H 'Content-Type: application/json; charset=utf-8' \
        -d '{
            "body": "'"$body"'",
            "title": "'"$title"'",
            "sound": "'"$sound"'",
            "group": "Blog",
            "category": "服务监控",
            "icon": "https://r2.jiachzha.com/jiachzha-light.svg"
        }'
}

# 根据构建结果发送通知
if [ $BUILD_STATUS -eq 0 ]; then
    echo "Build succeeded, sending success notification..."
    send_notification "✅" \
        "🚀 [Next Build Success] 🎉" \
        "🎉 **Build Status:** SUCCESS ✅\n\n🕒 **Build Time:** $CURRENT_TIME\n\n🌐 **Server IP:** $SERVER_IP\n\n✨ Congratulations! Your Next.js project has been successfully built! 🎊" \
        "shake.caf"
else
    echo "Build failed, sending failure notification..."
    send_notification "❌" \
        "🚨 [Next Build Failed] ❌" \
        "⚠️ **Build Status:** FAILED ❌\n\n🕒 **Failure Time:** $CURRENT_TIME\n\n🌐 **Server IP:** $SERVER_IP\n\n💥 Please check the logs and fix the issues. Good luck! 💪" \
        "ladder.caf"
fi