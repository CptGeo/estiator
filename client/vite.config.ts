import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 3000
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
