@echo off
chcp 65001 >nul
title Portal Emdad - Local Runner
cd /d "%~dp0"

echo ============================================================
echo    Portal Emdad  -  Portal Emdad - Local Runner
echo ============================================================
echo.

:: ---- Check Node.js ----
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js LTS from: https://nodejs.org
    echo Then run this file again.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo [OK] Node.js %%v detected

:: ---- Install dependencies (first run only) ----
if not exist "node_modules\" (
    echo.
    echo [1/3] Installing dependencies... this may take a few minutes
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed. Check your internet connection.
        pause
        exit /b 1
    )
) else (
    echo [1/3] Dependencies already installed - skipping
)

:: ---- Prepare database ----
echo [2/3] Generating Prisma client...
call npx prisma generate
if not exist "db\custom.db" (
    echo Creating database and seed data...
    call npx prisma db push --accept-data-loss
    call node scripts/seed.js
)

:: ---- Start server ----
echo [3/3] Starting server...
echo.
echo ============================================================
echo    Open in browser:  http://localhost:3000
echo    Admin panel:      http://localhost:3000/admin  (pass: emdad1404)
echo    To stop:          press Ctrl+C
echo ============================================================
echo.
start "" http://localhost:3000
call npx next dev -p 3000
pause
