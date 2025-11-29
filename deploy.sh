#!/bin/bash

# Deployment script for CompanionHub to GitHub Pages

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI could not be found. Please install it from https://cli.github.com/"
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null
then
    echo "Please log in to GitHub CLI using 'gh auth login'"
    exit 1
fi

# Create a new repository on GitHub
echo "Creating GitHub repository..."
gh repo create companionhub --public --clone

# Navigate to the repository
cd companionhub

# Copy all files from the current directory to the new repository
cp -r ../* .

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit: CompanionHub application"

# Push to GitHub
git push -u origin main

echo "Repository created and code pushed to GitHub!"
echo "You can now enable GitHub Pages in your repository settings."