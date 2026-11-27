@echo off
title Chinify Admin Panel
cd /d "%~dp0tools"
netstat -ano | findstr ":8090" | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 goto open
echo Starting Chinify admin server...
start "Chinify Admin Server" /min python -X utf8 admin_server.py
timeout /t 3 /nobreak >nul
:open
start "" "http://127.0.0.1:8090/admin"
exit
