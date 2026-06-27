import { OnlyOfficeManager, FILE_TYPE, STATIC_RESOURCE, onlyofficeEventbus, ONLYOFFICE_EVENT_KEYS } from "@/components/onlyoffice-web-comp"

// Use page origin as base (SDK assets are at site root, not in /assets/)
const base = window.location.origin
const sdkRoot = `${base}/packages/onlyoffice/9.3.0`

// Patch static resource paths to use same-origin assets
Object.assign(STATIC_RESOURCE.onlyoffice, {
  root: sdkRoot,
  apiUrl: `${sdkRoot}/web-apps/apps/api/documents/api.js`,
  preloadUrl: `${sdkRoot}/web-apps/apps/api/documents/preload.html`,
})
Object.assign(STATIC_RESOURCE.x2t, {
  root: `${sdkRoot}/x2t`,
  script: `${sdkRoot}/x2t/x2t.js`,
  wasm: `${sdkRoot}/x2t/x2t.wasm`,
  pdfFonts: {
    root: `${sdkRoot}/x2t-fonts`,
    default: `${sdkRoot}/x2t-fonts/Carlito-Regular.ttf`,
  },
})

let manager: InstanceType<typeof OnlyOfficeManager> | null = null

// Listen for messages from parent window
window.addEventListener("message", async (e) => {
  const { type, payload } = e.data || {}
  if (type === "open") {
    try {
      const { url, fileName, fileType, readOnly, theme, lang } = payload
      const resp = await fetch(url)
      const blob = await resp.blob()
      const file = new File([blob], fileName, { type: blob.type })

      if (manager) manager.destroy()

      manager = await OnlyOfficeManager.createWithFile(
        {
          containerId: "onlyoffice-container",
          fileType: fileType || FILE_TYPE.DOCX,
          defaultFileName: fileName,
          readOnly: readOnly ?? false,
          theme: theme || "theme-white",
          lang: lang || "zh",
        },
        file,
      )

      // Native autosave: when user saves (Ctrl+S / toolbar), export and notify parent
      onlyofficeEventbus.on(ONLYOFFICE_EVENT_KEYS.SAVE_DOCUMENT, async () => {
        try {
          if (!manager) return
          const { blob, fileName: name } = await manager.exportAsBlob()
          const reader = new FileReader()
          reader.onload = () => {
            parent.postMessage(
              { type: "save-result", payload: { data: reader.result, fileName: name } },
              "*",
            )
          }
          reader.readAsDataURL(blob)
        } catch (err) {
          console.error("AutoSave export failed:", err)
        }
      })

      parent.postMessage({ type: "ready" }, "*")
    } catch (err) {
      console.error("OnlyOffice open failed:", err)
      parent.postMessage({ type: "error", payload: String(err) }, "*")
    }
  } else if (type === "export") {
    try {
      if (!manager) throw new Error("No document open")
      const { blob, fileName } = await manager.exportAsBlob()
      const reader = new FileReader()
      reader.onload = () => {
        parent.postMessage(
          { type: "export-result", payload: { data: reader.result, fileName } },
          "*",
        )
      }
      reader.readAsDataURL(blob)
    } catch (err) {
      parent.postMessage({ type: "error", payload: String(err) }, "*")
    }
  } else if (type === "set-theme") {
    if (manager) await manager.setTheme(payload)
  } else if (type === "set-readonly") {
    if (manager) await manager.setReadOnly(payload)
  } else if (type === "destroy") {
    if (manager) {
      manager.destroy()
      manager = null
    }
  }
})

// Notify parent that iframe is ready
parent.postMessage({ type: "iframe-ready" }, "*")
