# Rovi Pocket - Production Deployment Guide

This guide covers deploying Rovi Pocket to production environments.

## Prerequisites

### Development Environment
```bash
# Install dependencies
npm install

# Install Expo CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### Environment Variables
Create a `.env` file in the root directory:

```bash
# Production API
EXPO_PUBLIC_API_URL=http://srv1318804.hstgr.cloud:8000

# OR for development
# EXPO_PUBLIC_API_URL=http://localhost:8000
```

## Build Profiles

### 1. Preview Build (APK for Testing)
```bash
npm run build:android:preview
```
- Generates APK for internal testing
- No app store submission
- Direct installation via download

### 2. Production Build (AAB for Play Store)
```bash
npm run build:android:production
```
- Generates AAB for Google Play Store
- Ready for public distribution
- Requires signing configuration

### 3. Web Build (PWA)
```bash
npm run build:web
```
- Generates standalone web app
- Can be deployed to any web server
- PWA capabilities for install on mobile

## Quick Deployment Commands

### Android APK (Quick Testing)
```bash
cd apps/rovi-pocket
npm run build:android:preview:no-wait
```

### Android Production (AAB)
```bash
cd apps/rovi-pocket
npm run build:android:production:no-wait
```

### Web Version
```bash
cd apps/rovi-pocket
npm run build:web
```

### All Platforms
```bash
cd apps/rovi-pocket
npm run build:production all
```

## Build Automation Script

The included `scripts/build-production.sh` provides automated building:

```bash
# Show help
./scripts/build-production.sh

# Build Android APK
./scripts/build-production.sh apk

# Build Android Production
./scripts/build-production.sh android

# Build Web
./scripts/build-production.sh web

# List recent builds
./scripts/build-production.sh list

# Build everything
./scripts/build-production.sh all
```

## Monitoring Builds

After starting a build, monitor progress:

```bash
# List recent builds
npm run build:list

# OR
eas build:list --platform android --limit=10

# View specific build
eas build:view [BUILD_ID]
```

## Deployment Environments

### Production (Hostinger VPS)
- **URL**: `http://srv1318804.hstgr.cloud:8000`
- **Backend API**: FastAPI + MongoDB
- **Web App**: Deployed to `/var/www/rovi-pocket`
- **Android**: Internal testing via APK distribution

### Development (Local)
- **URL**: `http://localhost:8000`
- **Backend**: Local FastAPI server
- **Mobile**: Expo development build

### Preview (Staging)
- **URL**: `http://preview.srv1318804.hstgr.cloud:8200`
- **Purpose**: Pre-production testing
- **Data**: Separate database instance

## Configuration Files

### EAS Configuration (`eas.json`)
- Build profiles for different environments
- Auto-increment version numbers
- Distribution settings

### App Configuration (`app.json`)
- App metadata and display settings
- Bundle identifiers
- Version information

### Environment Variables
- API endpoint configuration
- Feature flags
- Analytics keys

## Web Deployment

### Build Web App
```bash
npm run build:web
```

### Deploy to Server
```bash
# Copy web-build to server
scp -r web-build/* user@srv1318804.hstgr.cloud:/var/www/rovi-pocket/

# OR use rsync for faster sync
rsync -avz web-build/ user@srv1318804.hstgr.cloud:/var/www/rovi-pocket/
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name pocket.rovi.crm;
    root /var/www/rovi-pocket;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment Checklist

### Android
- [ ] Build completed successfully
- [ ] APK/AAB downloaded
- [ ] Basic smoke testing performed
- [ ] API connectivity verified
- [ ] Push notifications tested
- [ ] Performance benchmarks met

### Web
- [ ] Web build completed
- [ ] Deployed to server
- [ ] PWA manifest configured
- [ ] Service worker registered
- [ ] Responsive design verified
- [ ] Cross-browser testing complete

### Backend
- [ ] API endpoints responding
- [ ] Database connection healthy
- [ ] CORS configuration correct
- [ ] Error monitoring active
- [ ] Analytics tracking enabled

## Troubleshooting

### Build Failures
```bash
# Check Expo logs
eas build:view [BUILD_ID]

# Clear cache and retry
eas build --platform android --profile production --clear-cache

# Check for dependency issues
npm install
eas build --platform android --profile production
```

### API Connection Issues
```bash
# Verify backend is running
curl http://srv1318804.hstgr.cloud:8000/api/health

# Check environment variables
echo $EXPO_PUBLIC_API_URL

# Test from device
# Enable remote debugging in Expo app
```

### Performance Issues
- Monitor build size: Keep APK < 50MB
- Optimize images: Use WebP format
- Lazy load components: Code splitting
- Enable gzip compression on server

## Release Process

### 1. Pre-Release
```bash
# Update version in app.json
# Run type checking
npm run typecheck

# Run tests (when available)
npm test

# Create git tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 2. Build
```bash
# Build production APK
npm run build:android:production
```

### 3. Testing
- Deploy to internal testers
- Collect feedback
- Fix critical bugs

### 4. Release
- Submit to Google Play Store
- Deploy web version
- Announce to users

## Monitoring & Analytics

### Sentry (Error Tracking)
Already configured in `app.json` for production builds.

### Analytics
- User behavior tracking
- Performance monitoring
- Crash reporting
- API response times

## Support

For deployment issues:
1. Check Expo build logs
2. Review server logs
3. Verify environment variables
4. Test API connectivity
5. Check GitHub issues

## Next Steps

- Configure Google Play Store submission
- Set up automated testing
- Implement CI/CD pipeline
- Configure push notifications
- Set up analytics dashboard
