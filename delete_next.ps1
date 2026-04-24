$target = Join-Path $PSScriptRoot "node_modules\next"
if (Test-Path $target) {
    Write-Host "Deleting $target..."
    Remove-Item -Recurse -Force $target -ErrorAction SilentlyContinue
    if (Test-Path $target) {
        # Try with cmd.exe as fallback
        cmd /c "rmdir /s /q `"$target`""
    }
    if (Test-Path $target) {
        Write-Host "WARNING: Could not fully delete. Try closing other programs."
    } else {
        Write-Host "Deleted successfully!"
    }
} else {
    Write-Host "Directory not found: $target"
}
