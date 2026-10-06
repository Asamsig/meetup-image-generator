import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      // See src/lib/harfbuzz.ts
      { find: /^harfbuzzjs$/, replacement: path.resolve(__dirname, "./src/lib/harfbuzz.ts") },
    ],
  },
})
