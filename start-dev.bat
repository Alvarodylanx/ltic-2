@echo off
title LTIC SARL — Dev Servers

echo [1/4] Killing any processes on ports 3000 and 4000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 " ^| findstr LISTENING 2^>nul') do (
  taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000 " ^| findstr LISTENING 2^>nul') do (
  taskkill /PID %%a /F >nul 2>&1
)

echo [2/4] Clearing Next.js cache to prevent corruption issues...
if exist "apps\web\.next" (
  rmdir /s /q "apps\web\.next"
  echo      .next cache cleared.
) else (
  echo      No cache found, skipping.
)

echo [3/4] Starting API server (port 4000)...
start "LTIC API — Port 4000" cmd /k "cd /d %~dp0apps\api && pnpm dev"

echo [4/4] Starting Web server (port 3000 + Turbopack)...
start "LTIC Web — Port 3000" cmd /k "cd /d %~dp0apps\web && pnpm dev"

echo.
echo Both servers are starting. Wait ~15 seconds then open:
echo   http://localhost:3000
echo.
timeout /t 15 /nobreak >nul
start http://localhost:3000
