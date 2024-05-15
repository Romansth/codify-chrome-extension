import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    target:"esnext",
    rollupOptions:{
      input:{
        popup: "./popup/index.html",
      },
      output:{
        entryFileNames: "assets/[name].js"
      }
    },
  },
})