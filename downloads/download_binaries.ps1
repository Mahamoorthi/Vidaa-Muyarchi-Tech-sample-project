$downloads = @(
    @{
        Name = "Keycloak 21.1.2"
        Url  = "https://github.com/keycloak/keycloak/releases/download/21.1.2/keycloak-21.1.2.zip"
        Dest = "C:\Users\monakarni\.gemini\antigravity\scratch\student-management-system\downloads\keycloak-21.1.2.zip"
    },
    @{
        Name = "Prometheus 2.53.0"
        Url  = "https://github.com/prometheus/prometheus/releases/download/v2.53.0/prometheus-2.53.0.windows-amd64.zip"
        Dest = "C:\Users\monakarni\.gemini\antigravity\scratch\student-management-system\downloads\prometheus-2.53.0.zip"
    },
    @{
        Name = "Grafana 10.4.2"
        Url  = "https://dl.grafana.com/oss/release/grafana-10.4.2.windows-amd64.zip"
        Dest = "C:\Users\monakarni\.gemini\antigravity\scratch\student-management-system\downloads\grafana-10.4.2.zip"
    }
)

foreach ($item in $downloads) {
    if (Test-Path $item.Dest) {
        Write-Host "$($item.Name) already exists at $($item.Dest). Skipping download."
    } else {
        Write-Host "Downloading $($item.Name) from $($item.Url)..."
        try {
            Invoke-WebRequest -Uri $item.Url -OutFile $item.Dest -UserAgent "Mozilla/5.0"
            Write-Host "Successfully downloaded $($item.Name)."
        } catch {
            Write-Error "Failed to download $($item.Name): $_"
        }
    }
}
