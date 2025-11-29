# Deployment script for CompanionHub to GitHub Pages

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion"
} catch {
    Write-Host "Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
}

# Get GitHub username
$username = Read-Host "Enter your GitHub username"

# Get repository name
$repoName = Read-Host "Enter repository name (default: companionhub)"

if (-not $repoName) {
    $repoName = "companionhub"
}

# Create repository using GitHub API
Write-Host "Creating GitHub repository..."
$token = Read-Host "Enter your GitHub personal access token"

$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    "name" = $repoName
    "private" = $false
    "auto_init" = $false
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body
    Write-Host "Repository created successfully!"
} catch {
    Write-Host "Failed to create repository: $($_.Exception.Message)"
    exit 1
}

# Add remote origin
git remote add origin "https://github.com/$username/$repoName.git"

# Push to GitHub
Write-Host "Pushing code to GitHub..."
git push -u origin master

Write-Host "Code deployed to GitHub successfully!"
Write-Host "Repository URL: https://github.com/$username/$repoName"