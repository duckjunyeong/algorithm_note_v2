#!/bin/bash
set -e

echo "=================================="
echo "Docker Build - Pre-build Cleanup"
echo "=================================="
echo ""

echo "🧹 Cleaning build artifacts..."

# Backend build artifacts
if [ -d "apps/backend/build" ]; then
    echo "  - Removing apps/backend/build/ (Java build output)"
    rm -rf apps/backend/build/
fi

if [ -d "apps/backend/.gradle" ]; then
    echo "  - Removing apps/backend/.gradle/ (Gradle cache)"
    rm -rf apps/backend/.gradle/
fi

# Frontend build artifacts
if [ -d "apps/dashboard/dist" ]; then
    echo "  - Removing apps/dashboard/dist/ (Dashboard build output)"
    rm -rf apps/dashboard/dist/
fi

if [ -d "apps/landing-page/dist" ]; then
    echo "  - Removing apps/landing-page/dist/ (Landing page build output)"
    rm -rf apps/landing-page/dist/
fi

# Other build artifacts
if [ -d "libs/ui-components/dist" ]; then
    echo "  - Removing libs/ui-components/dist/ (UI components build output)"
    rm -rf libs/ui-components/dist/
fi

echo ""
echo "✅ Cleanup completed!"
echo ""

echo "🐳 Building Docker image: synapse:latest"
echo "(with production environment variables from .env.production)"
echo ""


docker build \
  --build-arg VITE_DASHBOARD_URL=http://localhost/dashboard \
  --build-arg VITE_LANDING_URL=http://localhost \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_test_c3RhYmxlLXlldGktNzAuY2xlcmsuYWNjb3VudHMuZGV2JA \
  --build-arg VITE_CLERK_SIGN_IN_URL=http://localhost/sign-in \
  --build-arg VITE_CLERK_SIGN_UP_URL=http://localhost/sign-up \
  --build-arg VITE_API_BASE_URL=/api \
  --build-arg VITE_MIN_REPEAT_CYCLE_MS=10000 \
  -t synapse:latest .

BUILD_EXIT_CODE=$?

echo ""
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "=================================="
    echo "✅ Docker build successful!"
    echo "=================================="
    echo ""
    echo "Image: synapse:latest"
    echo ""
    echo "To run the container:"
    echo "  docker run -p 8080:8080 -p 3000:3000 synapse:latest"
    echo ""
else
    echo "=================================="
    echo "❌ Docker build failed!"
    echo "=================================="
    echo ""
    echo "Exit code: $BUILD_EXIT_CODE"
    echo ""
    exit $BUILD_EXIT_CODE
fi
