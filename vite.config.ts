import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "node_modules/onlyoffice-web-comp/src"),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, "node_modules/onlyoffice-web-comp/public/packages/onlyoffice/*"),
          dest: "packages/onlyoffice",
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "OnlyOfficeWebComp",
      formats: ["es"],
      fileName: () => "onlyoffice-web-comp.es.js",
    },
    outDir: path.resolve(__dirname, "dist"),
    minify: false,
    sourcemap: true,
  },
})
