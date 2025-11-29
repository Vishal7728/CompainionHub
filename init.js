#!/usr/bin/env node

/**
 * CompanionHub Initialization Script
 * 
 * This script sets up the initial project structure and verifies
 * that all required dependencies are properly configured.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgRed: '\x1b[31m',
  fgCyan: '\x1b[36m'
};

// Utility functions
const log = {
  info: (msg) => console.log(`${colors.fgCyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.fgGreen}${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.fgYellow}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.fgRed}${msg}${colors.reset}`)
};

const checkDirectory = (dirPath) => {
  try {
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
};

const checkFile = (filePath) => {
  try {
    return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

const createDirectory = (dirPath) => {
  if (!checkDirectory(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log.info(`Created directory: ${dirPath}`);
  }
};

const runCommand = (command, description) => {
  try {
    log.info(`Executing: ${description}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error(`Failed to execute: ${description}`);
    return false;
  }
};

// Main initialization function
async function initializeProject() {
  log.success('🚀 Starting CompanionHub Initialization...');
  console.log('');

  // Check if we're in the right directory
  const requiredFiles = [
    'package.json',
    'server.js',
    '.env'
  ];

  log.info('🔍 Checking project structure...');
  
  for (const file of requiredFiles) {
    if (!checkFile(file)) {
      log.error(`Missing required file: ${file}`);
      log.warning('Please ensure you are in the CompanionHub project root directory.');
      process.exit(1);
    }
  }

  log.success('✅ Project structure verified');
  console.log('');

  // Create necessary directories
  log.info('📁 Creating project directories...');
  
  const directories = [
    'controllers',
    'middleware',
    'models',
    'routes',
    'utils',
    'uploads',
    '__tests__'
  ];

  directories.forEach(dir => {
    createDirectory(dir);
  });

  log.success('✅ Directories created');
  console.log('');

  // Check Node.js version
  log.info('🔧 Checking Node.js version...');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));
  
  if (majorVersion < 14) {
    log.warning(`Node.js version ${nodeVersion} detected. Recommended version is 14 or higher.`);
  } else {
    log.success(`✅ Node.js version ${nodeVersion} confirmed`);
  }
  
  console.log('');

  // Check if npm is available
  log.info('📦 Checking package manager...');
  try {
    execSync('npm --version', { stdio: 'ignore' });
    log.success('✅ npm is available');
  } catch (error) {
    log.error('npm is not available. Please install Node.js with npm.');
    process.exit(1);
  }
  
  console.log('');

  // Install dependencies
  log.info('📥 Installing dependencies...');
  if (!runCommand('npm install', 'Installing npm dependencies')) {
    log.error('Failed to install dependencies. Please check your internet connection and try again.');
    process.exit(1);
  }

  log.success('✅ Dependencies installed successfully');
  console.log('');

  // Create .env file if it doesn't exist
  log.info('⚙️  Checking environment configuration...');
  
  if (!checkFile('.env')) {
    log.warning('Creating default .env file. Please update with your configuration.');
    
    const defaultEnv = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/companionhub
JWT_SECRET=companionhub_jwt_secret_key_2025_replace_this_with_a_strong_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password`;

    fs.writeFileSync('.env', defaultEnv);
    log.success('✅ Created default .env file');
  } else {
    log.success('✅ Environment configuration found');
  }
  
  console.log('');

  // Verify MongoDB connection
  log.info('🔌 Checking MongoDB installation...');
  try {
    execSync('mongod --version', { stdio: 'ignore' });
    log.success('✅ MongoDB is installed');
  } catch (error) {
    log.warning('MongoDB is not installed or not in PATH. Please install MongoDB separately.');
  }
  
  console.log('');

  // Final setup instructions
  log.success('🎉 CompanionHub initialization completed!');
  console.log('');
  log.info('📋 Next steps:');
  log.info('   1. Update .env file with your actual configuration values');
  log.info('   2. Ensure MongoDB is running (mongod)');
  log.info('   3. Run "npm run dev" to start the development server');
  log.info('   4. Access the API at http://localhost:5000');
  console.log('');
  log.info('📖 Check the README.md file for detailed documentation');
  log.info('🧪 Run "npm test" to execute the test suite');
  console.log('');
  log.success('Happy coding! 🚀');
}

// Run the initialization
initializeProject().catch(error => {
  log.error('Initialization failed:', error.message);
  process.exit(1);
});