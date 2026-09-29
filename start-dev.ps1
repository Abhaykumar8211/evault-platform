Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "       DECENTRALIZED LEGAL DOCUMENT & COURT EVIDENCE VAULT (eVault)           " -ForegroundColor Yellow
Write-Host "                 Smart India Hackathon (SIH) Showcase                         " -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Launching Spring Boot Backend on http://localhost:8080..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\evault-backend'; .\mvnw.cmd spring-boot:run"

Write-Host "[2/2] Launching Angular 21 Frontend on http://localhost:4200..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\evault-frontend'; npm start"

Write-Host ""
Write-Host "eVault services are starting up!" -ForegroundColor Cyan
Write-Host "Frontend Portal:  http://localhost:4200" -ForegroundColor White
Write-Host "Backend REST API: http://localhost:8080" -ForegroundColor White
Write-Host "Swagger Docs:     http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "H2 Web Console:   http://localhost:8080/h2-console" -ForegroundColor White
Write-Host ""
Write-Host "Demo Credentials (all accounts use password: Password@123):" -ForegroundColor Yellow
Write-Host " - Judge:                 judge@evault.demo" -ForegroundColor Gray
Write-Host " - Investigating Officer: officer@evault.demo" -ForegroundColor Gray
Write-Host " - Public Prosecutor:     prosecutor@evault.demo" -ForegroundColor Gray
Write-Host " - Defense Lawyer:        lawyer@evault.demo" -ForegroundColor Gray
Write-Host " - Super Administrator:   admin@evault.demo" -ForegroundColor Gray
Write-Host ""
