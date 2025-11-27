import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Force all imports to resolve to the root node_modules
            react: path.resolve(process.cwd(), 'node_modules/react'),
            'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom'),
            'react-router-dom': path.resolve(process.cwd(), 'node_modules/react-router-dom'),
        },
        // dedupe helps when packages are linked
        dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    optimizeDeps: {
        // Force Vite to pre-bundle these
        include: ['react', 'react-dom', 'react-router-dom'],
    },
    server: {
        host: true,
        port: 5173,
    }
})