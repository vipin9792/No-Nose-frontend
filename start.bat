@echo off
echo Starting Kaivailayam MERN Application...
echo.

REM Start backend
echo Starting Backend Server...
start cmd /k "cd server && npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting Frontend...
start cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:5174
echo Backend: http://localhost:5000
pause

