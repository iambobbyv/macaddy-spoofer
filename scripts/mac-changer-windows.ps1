# Windows MAC Address Changer
# Run as Administrator

param(
    [Parameter(Mandatory=$true)]
    [string]$InterfaceName,
    
    [Parameter(Mandatory=$true)]
    [string]$NewMAC
)

$ErrorActionPreference = "Stop"

# Remove colons from MAC address
$CleanMAC = $NewMAC -replace ":", ""

Write-Host "Changing MAC address for $InterfaceName to $NewMAC" -ForegroundColor Cyan

try {
    # Get network adapter
    $adapter = Get-NetAdapter | Where-Object { $_.Name -eq $InterfaceName }
    
    if (-not $adapter) {
        Write-Host "Error: Interface $InterfaceName not found" -ForegroundColor Red
        exit 1
    }
    
    # Disable adapter
    Write-Host "Disabling adapter..." -ForegroundColor Yellow
    Disable-NetAdapter -Name $InterfaceName -Confirm:$false
    Start-Sleep -Seconds 2
    
    # Set new MAC address in registry
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4D36E972-E325-11CE-BFC1-08002BE10318}"
    $adapters = Get-ChildItem $regPath
    
    foreach ($a in $adapters) {
        $driverDesc = (Get-ItemProperty -Path $a.PSPath).DriverDesc
        if ($driverDesc -eq $adapter.InterfaceDescription) {
            Set-ItemProperty -Path $a.PSPath -Name "NetworkAddress" -Value $CleanMAC
            Write-Host "Registry updated" -ForegroundColor Green
            break
        }
    }
    
    # Enable adapter
    Write-Host "Enabling adapter..." -ForegroundColor Yellow
    Enable-NetAdapter -Name $InterfaceName -Confirm:$false
    Start-Sleep -Seconds 3
    
    Write-Host "✓ MAC address changed successfully!" -ForegroundColor Green
    Write-Host "New MAC: $NewMAC" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
