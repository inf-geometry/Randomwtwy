import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a relative base so the built site works when served from any
// sub-path (e.g. GitHub Pages project sites) as well as the root.
export default defineConfig({
  base: './',
  plugins: [react()],
})
