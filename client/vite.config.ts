import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 8080,
    strictPort: true,
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true
  },
  assetsInclude: ['**/*.jpg', '**/*.png'],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/components"),
      "@context": resolve(__dirname, "./src/context"),
      "@core": resolve(__dirname, "./src/core"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@layouts": resolve(__dirname, "./src/layouts"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@settings": resolve(__dirname, "./src/settings.json"),
    }
  }
})
