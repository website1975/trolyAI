import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // 'base' giúp đường dẫn file css/js là tương đối (./), 
    // giúp web chạy được kể cả khi không nằm ở thư mục gốc (root) của server
    base: './', 
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});