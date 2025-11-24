@echo off
setlocal

echo ==================================
echo Docker Build - Pre-build Cleanup
echo ==================================
echo.

echo Cleaning build artifacts...

REM Backend build artifacts
if exist "apps\backend\build" (
    echo   - Removing apps\backend\build\ (Java build output^)
    rmdir /s /q "apps\backend\build"
)

if exist "apps\backend\.gradle" (
    echo   - Removing apps\backend\.gradle\ (Gradle cache^)
    rmdir /s /q "apps\backend\.gradle"
)

REM Frontend build artifacts
if exist "apps\dashboard\dist" (
    echo   - Removing apps\dashboard\dist\ (Dashboard build output^)
    rmdir /s /q "apps\dashboard\dist"
)

if exist "apps\landing-page\dist" (
    echo   - Removing apps\landing-page\dist\ (Landing page build output^)
    rmdir /s /q "apps\landing-page\dist"
)

REM Other build artifacts
if exist "libs\ui-components\dist" (
    echo   - Removing libs\ui-components\dist\ (UI components build output^)
    rmdir /s /q "libs\ui-components\dist"
)

echo.
echo Cleanup completed!
echo.

echo Building Docker image: synapse:latest
echo (with production environment variables from .env.production)
echo.

REM 
docker build ^
  --build-arg VITE_DASHBOARD_URL=http://localhost/dashboard ^
  --build-arg VITE_LANDING_URL=http://localhost ^
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_test_c3RhYmxlLXlldGktNzAuY2xlcmsuYWNjb3VudHMuZGV2JA ^
  --build-arg VITE_CLERK_SIGN_IN_URL=http://localhost/sign-in ^
  --build-arg VITE_CLERK_SIGN_UP_URL=http://localhost/sign-up ^
  --build-arg VITE_API_BASE_URL=/api ^
  --build-arg VITE_MIN_REPEAT_CYCLE_MS=10000 ^
  -t synapse:latest .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==================================
    echo Docker build successful!
    echo ==================================
    echo.
    echo Image: synapse:latest
    echo.
    echo To run the container:
    echo   docker run -p 8080:8080 -p 3000:3000 synapse:latest
    echo.
) else (
    echo.
    echo ==================================
    echo Docker build failed!
    echo ==================================
    echo.
    echo Exit code: %ERRORLEVEL%
    echo.
    exit /b %ERRORLEVEL%
)

endlocal
