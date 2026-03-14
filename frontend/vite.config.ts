import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, './src'),
            '@shared': path.resolve(__dirname, '../types'),
            '@bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:9999',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
