import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const envDir = path.resolve(__dirname, '../server');
  const env = loadEnv(mode, envDir, '');
  const BACKEND_PORT = env.PORT || 5000;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${BACKEND_PORT}`,
          changeOrigin: true,
        },
      },
    },
  }
})
