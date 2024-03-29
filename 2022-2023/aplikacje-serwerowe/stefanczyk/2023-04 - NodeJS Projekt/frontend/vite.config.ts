import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5555,
    proxy: {
      '/api': 'http://localhost:5556'
    }
  },
  plugins: [svgr(), react()],
})
