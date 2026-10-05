import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, './src'),
            '@shared': path.resolve(__dirname, '../shared'),
        },
    },
    server: {
        host: '127.0.0.1',
        port: process.env.DEV_FRONTEND_PORT ? parseInt(process.env.DEV_FRONTEND_PORT) : 5173,
        proxy: {
            '/api': {
                target: (() => {
                    const DEV = process.env.DEV === 'true';
                    const devServerUrl = process.env.DEV_SERVER_URL;
                    const serverUrl = process.env.SERVER_URL;

                    if (DEV && devServerUrl && devServerUrl !== '') {
                        return devServerUrl;
                    } else if (serverUrl && serverUrl !== '') {
                        return serverUrl;
                    }
                    return 'http://localhost:3000';
                })(),
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
