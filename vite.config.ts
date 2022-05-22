import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    proxy: {
      // Proxying websockets or socket.io
      '/api/chat': {
        target: 'ws://127.0.0.1:12450',
        ws: true
      }
    }
  },
  plugins: [react()]
})
