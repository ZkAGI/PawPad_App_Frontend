#!/bin/bash
cd "$(dirname "$0")"

# Kill any existing Metro
pkill -f metro 2>/dev/null

# Start Metro in background
npm start &
METRO_PID=$!

# Wait for Metro to start
echo "Starting Metro bundler..."
sleep 5

# Port forwarding
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000

# Run Android
npx react-native run-android

# Keep Metro running
wait $METRO_PID
