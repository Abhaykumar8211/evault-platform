@echo off
title eVault Platform - Startup Launcher
echo ==============================================================================
echo        DECENTRALIZED LEGAL DOCUMENT & COURT EVIDENCE VAULT (eVault)
echo                  Smart India Hackathon (SIH) Showcase
echo ==============================================================================
echo.
echo [1/2] Starting Spring Boot Backend (Port 8080)...
start "eVault Spring Boot Backend" cmd /k "cd /d %~dp0evault-backend && .\mvnw.cmd spring-boot:run"

echo.
echo [2/2] Starting Angular 21 Frontend (Port 4200)...
start "eVault Angular Frontend" cmd /k "cd /d %~dp0evault-frontend && npm start"

echo.
echo ==============================================================================
echo eVault services are launching!
echo Backend:   http://localhost:8080 (Swagger: http://localhost:8080/swagger-ui.html)
echo Frontend:  http://localhost:4200
echo Demo user: judge@evault.demo / Password@123
echo ==============================================================================
pause
