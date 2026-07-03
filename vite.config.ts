import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "node_modules/onlyoffice-web-comp/src"),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          // stripBase: 5 strips "node_modules/onlyoffice-web-comp/public/packages/onlyoffice"
          // so files land at dest/9.3.0/... instead of dest/node_modules/.../9.3.0/...
          src: "node_modules/onlyoffice-web-comp/public/packages/onlyoffice",
          dest: "packages/onlyoffice",
          rename: { stripBase: 5 },
        },
      ],
    }),
  ],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
    outDir: path.resolve(__dirname, "dist"),
    minify: false,
    sourcemap: false,
  },
})
