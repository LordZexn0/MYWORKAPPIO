# PowerShell script to set up environment variables for MyWorkApp.io CMS
# Run this script in the project root directory

Write-Host "🔧 Setting up environment variables for MyWorkApp.io CMS..." -ForegroundColor Green

# Create .env.local file with the provided credentials
$envContent = @"
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL="https://rested-jaguar-42761.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AacJAAIncDFmNjI3Nzg1MTNlMzc0YzU2YjIyZTFjNGU1OTRlOTEzM3AxNDI3NjE"

# Optional: Vercel Blob Storage (for image uploads)
# BLOB_READ_WRITE_TOKEN=your-blob-token
"@

# Write to .env.local file
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Environment file created: .env.local" -ForegroundColor Green
Write-Host "📝 Added your Upstash Redis credentials" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your development server (npm run dev)" -ForegroundColor White
Write-Host "2. Test the CMS at http://localhost:3000/admin" -ForegroundColor White
Write-Host "3. Try saving changes - should now use Redis!" -ForegroundColor White
Write-Host ""
Write-Host "💡 For production, add these same variables to your Vercel dashboard" -ForegroundColor Yellow
