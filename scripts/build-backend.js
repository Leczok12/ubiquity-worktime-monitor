const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

console.log('Building backend.\n');

try {
    execSync('npm run build --prefix backend', {
        cwd: rootDir,
        stdio: 'inherit',
    });
    console.log('Backend build completed.\n');
} catch (error) {
    console.error('Backend build failed.\n');
    process.exit(1);
}
