import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/main.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        historyApiFallback: true,
        host: 'localhost',
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: false,
                secure: false,
                ws: true,
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // Forward cookies from browser to backend
                        if (req.headers.cookie) {
                            proxyReq.setHeader('Cookie', req.headers.cookie);
                        }
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        // Forward Set-Cookie from backend to browser
                        if (proxyRes.headers['set-cookie']) {
                            // Ensure cookies work with the proxy
                            const cookies = proxyRes.headers['set-cookie'];
                            res.setHeader('Set-Cookie', cookies);
                        }
                    });
                },
            },
        },
    },
});