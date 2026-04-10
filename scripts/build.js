const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🔨 Rozpoczynanie budowania aplikacji...\n');

// 1. Usuń stary dist folder
console.log('📦 Usuwanie starego folderu dist...');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
console.log('✅ Folder dist usunięty i nowo utworzony\n');

try {
    // 2. Buduj frontend
    console.log('🎨 Budowanie frontend...');
    execSync('npm run build --prefix frontend', {
        cwd: rootDir,
        stdio: 'inherit',
    });
    console.log('✅ Frontend zbudowany\n');

    // 3. Buduj backend
    console.log('⚙️  Budowanie backend...');
    execSync('tsc --project backend/tsconfig.json', {
        cwd: rootDir,
        stdio: 'inherit',
    });
    console.log('✅ Backend zbudowany\n');

    // 4. Kopiuj wyniki frontend do dist
    console.log('📋 Kopiowanie wyników frontend...');
    const frontendDistSrc = path.join(rootDir, 'frontend', 'dist');
    if (fs.existsSync(frontendDistSrc)) {
        fs.cpSync(frontendDistSrc, distDir, { recursive: true, force: true });
        console.log('✅ Frontend skopiowany do dist\n');
    }

    // 5. Kopiuj wyniki backend do dist/backend
    console.log('📋 Kopiowanie wyników backend...');
    const backendDistSrc = path.join(rootDir, 'backend', 'dist');
    const backendDistDest = path.join(distDir, 'backend');
    if (fs.existsSync(backendDistSrc)) {
        fs.cpSync(backendDistSrc, backendDistDest, { recursive: true, force: true });
        console.log('✅ Backend skopiowany do dist/backend\n');
    }

    console.log('🎉 Budowanie zakończone pomyślnie!');
    console.log(`📁 Wyniki znajdują się w: ${distDir}`);
    process.exit(0);
} catch (error) {
    console.error('\n❌ Błąd podczas budowania:', error.message);
    process.exit(1);
}
