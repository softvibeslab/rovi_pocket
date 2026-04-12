#!/bin/bash

# Rovi Pocket - Production Build Script
# This script builds production versions of Rovi Pocket for Android and Web

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Rovi Pocket - Production Build${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from rovi-pocket root directory${NC}"
    exit 1
fi

# Check environment variables
if [ -z "$EXPO_PUBLIC_API_URL" ]; then
    echo -e "${YELLOW}Warning: EXPO_PUBLIC_API_URL not set${NC}"
    echo -e "${YELLOW}Using default: http://srv1318804.hstgr.cloud:8000${NC}"
    export EXPO_PUBLIC_API_URL="http://srv1318804.hstgr.cloud:8000"
fi

echo -e "${GREEN}Configuration:${NC}"
echo "API URL: $EXPO_PUBLIC_API_URL"
echo ""

# Function to build Android
build_android() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Building Android APK (Production)${NC}"
    echo -e "${GREEN}========================================${NC}"

    echo -e "${YELLOW}Running: eas build --platform android --profile production --non-interactive${NC}"

    eas build --platform android --profile production --non-interactive

    echo -e "${GREEN}Android build started! Check Expo dashboard for progress.${NC}"
}

# Function to build Android APK
build_android_apk() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Building Android APK (Preview)${NC}"
    echo -e "${GREEN}========================================${NC}"

    echo -e "${YELLOW}Running: eas build --platform android --profile preview --non-interactive${NC}"

    eas build --platform android --profile preview --non-interactive

    echo -e "${GREEN}Android APK build started! Check Expo dashboard for progress.${NC}"
}

# Function to list builds
list_builds() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Listing Recent Builds${NC}"
    echo -e "${GREEN}========================================${NC}"

    eas build:list --platform android --limit=10
}

# Function to build Web
build_web() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Building Web Version${NC}"
    echo -e "${GREEN}========================================${NC}"

    echo -e "${YELLOW}Running: expo export:web${NC}"

    # Install web dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi

    # Build web version
    expo export:web

    echo -e "${GREEN}Web build complete! Output in ./web-build/${NC}"
}

# Main menu
case "${1:-}" in
    "android")
        build_android
        ;;
    "apk")
        build_android_apk
        ;;
    "web")
        build_web
        ;;
    "list")
        list_builds
        ;;
    "all")
        build_android
        build_web
        ;;
    *)
        echo -e "${GREEN}Usage:${NC}"
        echo "  ./scripts/build-production.sh android   - Build Android production (AAB)"
        echo "  ./scripts/build-production.sh apk        - Build Android APK"
        echo "  ./scripts/build-production.sh web        - Build Web version"
        echo "  ./scripts/build-production.sh list       - List recent builds"
        echo "  ./scripts/build-production.sh all        - Build Android + Web"
        echo ""
        echo -e "${YELLOW}Examples:${NC}"
        echo "  ./scripts/build-production.sh apk"
        echo "  ./scripts/build-production.sh android"
        echo "  EXPO_PUBLIC_API_URL=http://prod-api.com ./scripts/build-production.sh apk"
        exit 0
        ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Build process complete!${NC}"
echo -e "${GREEN}========================================${NC}"
