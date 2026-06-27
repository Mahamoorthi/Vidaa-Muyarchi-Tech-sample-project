# Start scripts for Keycloak, Prometheus, and Grafana

$projectRoot = "C:\Users\monakarni\.gemini\antigravity\scratch\student-management-system"
$binDir = "$projectRoot\bin"

# 1. Start PostgreSQL if not already running
Write-Host "Checking PostgreSQL on port 5434..."
$pgRunning = Get-Process -Name postgres -ErrorAction SilentlyContinue
if (-not $pgRunning) {
    Write-Host "Starting local PostgreSQL server..."
    Start-Process -FilePath "C:\Program Files\PostgreSQL\18\bin\postgres.exe" -ArgumentList "-D `"$projectRoot\pg_data`" -p 5434" -NoNewWindow -RedirectStandardOutput "$projectRoot\postgres_stdout.log" -RedirectStandardError "$projectRoot\postgres_stderr.log"
    Start-Sleep -Seconds 3
} else {
    Write-Host "PostgreSQL is already running."  
}

# 2. Start Keycloak
Write-Host "Starting Keycloak on port 8080 (dev mode)..."
$env:KEYCLOAK_ADMIN = "admin"
$env:KEYCLOAK_ADMIN_PASSWORD = "admin"
$kcBat = "$binDir\keycloak-21.1.2\bin\kc.bat"
Start-Process -FilePath $kcBat -ArgumentList "start-dev --http-port 8080" -NoNewWindow -RedirectStandardOutput "$projectRoot\keycloak.log" -RedirectStandardError "$projectRoot\keycloak_err.log"

# 3. Start Prometheus
Write-Host "Starting Prometheus on port 9090..."
$promExe = "$binDir\prometheus-2.53.0.windows-amd64\prometheus.exe"
$promCfg = "$binDir\prometheus-2.53.0.windows-amd64\prometheus-sms.yml"
Start-Process -FilePath $promExe -ArgumentList "--config.file=`"$promCfg`" --web.listen-address=0.0.0.0:9090" -NoNewWindow -RedirectStandardOutput "$projectRoot\prometheus.log" -RedirectStandardError "$projectRoot\prometheus_err.log"

# 4. Start Grafana
Write-Host "Starting Grafana on port 3000..."
$grafanaExe = "$binDir\grafana-v10.4.2\bin\grafana-server.exe"
Start-Process -FilePath $grafanaExe -WorkingDirectory "$binDir\grafana-v10.4.2" -NoNewWindow -RedirectStandardOutput "$projectRoot\grafana.log" -RedirectStandardError "$projectRoot\grafana_err.log"

Write-Host "All background services started successfully!"
Write-Host "Logs are available at: $projectRoot"
