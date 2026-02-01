@echo off
REM StudyBuddy Quick Start Script for Windows

echo.
echo ========================================
echo    StudyBuddy - Quick Start Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
echo.

REM Check if MySQL is running
netstat -an | findstr :3306 >nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: MySQL doesn't seem to be running!
    echo Please start MySQL (XAMPP Control Panel or MySQL Service)
    echo.
)

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo Creating server\.env file...
    (
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=study_buddy
        echo PORT=3000
    ) > server\.env
    echo [OK] Created .env file
    echo     Please edit server\.env if your MySQL credentials are different
    echo.
)

REM Initialize database
echo [1/4] Initializing database...
cd server
call node initDb.js
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Database initialization failed!
    echo Please check your MySQL connection and credentials
    pause
    exit /b 1
)
echo [OK] Database initialized
cd ..
echo.

REM Install backend dependencies
echo [2/4] Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..
echo.

REM Install frontend dependencies
echo [3/4] Installing frontend dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..
echo.

echo [4/4] Starting servers...
echo.
echo ========================================
echo     Setup Complete!
echo ========================================
echo.
echo Starting backend server on http://localhost:3000
start cmd /k "cd server && npm run dev"
echo Waiting 2 seconds before starting frontend...
timeout /t 2 /nobreak
echo.
echo Starting frontend server on http://localhost:5173
start cmd /k "cd client && npm run dev"
echo.
echo Browser will open automatically in a few seconds...
timeout /t 3 /nobreak
start http://localhost:5173
echo.
echo ========================================
echo     StudyBuddy is now running!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo.
echo To stop: Close both command windows
echo.
