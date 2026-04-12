#!/bin/bash

# Rovi Pocket - Web Deployment Script
# Deploys the PWA web version to the production server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="root"
SERVER_HOST="srv1318804.hstgr.cloud"
SERVER_PATH="/var/www/rovi-pocket"
BUILD_DIR="./web-build"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Rovi Pocket - Web Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from rovi-pocket root directory${NC}"
    exit 1
fi

# Function to build web app
build_web() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Building Web App${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        npm install
    fi

    # Set environment variables
    export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-http://srv1318804.hstgr.cloud:8000}"

    echo -e "${YELLOW}API URL: $EXPO_PUBLIC_API_URL${NC}"

    # Build web app
    echo -e "${YELLOW}Building web app...${NC}"
    npm run build:web

    if [ ! -d "$BUILD_DIR" ]; then
        echo -e "${RED}Error: Build directory not found${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Web build complete${NC}"
}

# Function to deploy to server
deploy_to_server() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deploying to Server${NC}"
    echo -e "${GREEN}========================================${NC}"

    echo -e "${YELLOW}Server: $SERVER_USER@$SERVER_HOST${NC}"
    echo -e "${YELLOW}Path: $SERVER_PATH${NC}"
    echo ""

    # Create directory if it doesn't exist
    echo -e "${YELLOW}Creating directory structure...${NC}"
    ssh "$SERVER_USER@$SERVER_HOST" "mkdir -p $SERVER_PATH"

    # Copy files to server
    echo -e "${YELLOW}Copying files to server...${NC}"
    rsync -avz --delete \
        --exclude '*.map' \
        --exclude '.DS_Store' \
        "$BUILD_DIR/" \
        "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/"

    # Set permissions
    echo -e "${YELLOW}Setting permissions...${NC}"
    ssh "$SERVER_USER@$SERVER_HOST" "chown -R www-data:www-data $SERVER_PATH"
    ssh "$SERVER_USER@$SERVER_HOST" "chmod -R 755 $SERVER_PATH"

    echo -e "${GREEN}✓ Deployment complete${NC}"
}

# Function to test deployment
test_deployment() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Testing Deployment${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Test health endpoint
    echo -e "${YELLOW}Testing API health...${NC}"
    API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_HOST:8000/api/health" || echo "000")

    if [ "$API_HEALTH" = "200" ]; then
        echo -e "${GREEN}✓ API is healthy (200)${NC}"
    else
        echo -e "${RED}✗ API health check failed ($API_HEALTH)${NC}"
    fi

    # Test web app
    echo -e "${YELLOW}Testing web app...${NC}"
    WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_HOST/pocket/" || echo "000")

    if [ "$WEB_STATUS" = "200" ]; then
        echo -e "${GREEN}✓ Web app is accessible (200)${NC}"
    else
        echo -e "${RED}✗ Web app check failed ($WEB_STATUS)${NC}"
    fi

    echo ""
    echo -e "${GREEN}Deployment URLs:${NC}"
    echo "  Web App: http://$SERVER_HOST/pocket/"
    echo "  API: http://$SERVER_HOST:8000/api/health"
}

# Function to show help
show_help() {
    echo -e "${GREEN}Rovi Pocket - Web Deployment${NC}"
    echo ""
    echo "Usage: ./scripts/deploy-web.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build     - Build web app only"
    echo "  deploy    - Deploy to server (builds first)"
    echo "  test      - Test deployment only"
    echo "  full      - Build, deploy, and test (default)"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/deploy-web.sh"
    echo "  ./scripts/deploy-web.sh deploy"
    echo "  ./scripts/deploy-web.sh build"
    echo ""
    echo "Environment Variables:"
    echo "  EXPO_PUBLIC_API_URL - Backend API URL (default: http://srv1318804.hstgr.cloud:8000)"
}

# Main script logic
case "${1:-full}" in
    "build")
        build_web
        ;;
    "deploy")
        deploy_to_server
        ;;
    "test")
        test_deployment
        ;;
    "full")
        build_web
        deploy_to_server
        test_deployment
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
