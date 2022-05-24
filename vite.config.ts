import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    // cors: true,
    proxy: {
      // Proxying websockets or socket.i// 选项写法
      '/bfs/face': {
        target: 'http://i1.hdslb.com',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api/chat': {
        target: 'ws://139.186.162.52',
        // target:  'ws://127.0.0.1:12450',
        // changeOrigin: true,
        ws: true
      }
    }
  },
  plugins: [react()]
})
