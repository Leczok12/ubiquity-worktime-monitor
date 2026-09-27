const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const backendPublicDir = path.join(rootDir, 'backend', 'public');

console.log('Building frontend.\n');

try {
    execSync('npm run build --prefix frontend', {
        cwd: rootDir,
        stdio: 'inherit',
    });
    console.log('Frontend build completed.\n');
} catch (error) {
    console.error('Frontend build failed.\n');
    process.exit(1);
}

fs.cpSync(path.join(rootDir, 'frontend', 'dist'), path.join(backendPublicDir), {
    recursive: true,
    force: true,
});

fs.rmSync(path.join(rootDir, 'frontend', 'dist'), {
    force: true,
    recursive: true,
});
