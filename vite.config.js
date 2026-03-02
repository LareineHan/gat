import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change 'gat' to your actual GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: '/gat',
})
