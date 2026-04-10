const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const backendDistDir = path.join(rootDir, 'backend', 'dist');

console.log('Starting build process...\n');

// 1. Clean backend dist directory
console.log('Cleaning backend dist directory...');
if (fs.existsSync(backendDistDir)) {
    fs.rmSync(backendDistDir, { recursive: true, force: true });
}
fs.mkdirSync(backendDistDir, { recursive: true });
console.log('Backend dist directory is ready.\n');

try {
    // 2. Build backend first
    console.log('Building backend...');
    execSync('npm run build --prefix backend', {
        cwd: rootDir,
        stdio: 'inherit',
    });
    console.log('Backend build completed.\n');

    // 3. Build frontend
    console.log('Building frontend...');
    execSync('npm run build --prefix frontend', {
        cwd: rootDir,
        stdio: 'inherit',
    });
    console.log('Frontend build completed.\n');

    // 4. Copy frontend build output into backend/dist
    console.log('Copying frontend files into backend/dist...');
    const frontendDistSrc = path.join(rootDir, 'frontend', 'dist');
    if (fs.existsSync(frontendDistSrc)) {
        fs.cpSync(frontendDistSrc, backendDistDir, { recursive: true, force: true });
        console.log('Frontend files copied successfully.\n');
    } else {
        throw new Error(`Frontend dist folder not found: ${frontendDistSrc}`);
    }

    console.log('Build finished successfully.');
    console.log(`Output directory: ${backendDistDir}`);
    process.exit(0);
} catch (error) {
    console.error('\nBuild failed:', error.message);
    process.exit(1);
}
