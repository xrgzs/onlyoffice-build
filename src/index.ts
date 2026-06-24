/**
 * OnlyOffice CDN Build — Public API
 *
 * Re-exports the framework-agnostic core from onlyoffice-web-comp.
 * The OnlyOffice SDK assets (web-apps, fonts, sdkjs, x2t) are served
 * separately from the CDN; set `setOnlyOfficeBasePath()` before use.
 */
export { OnlyOfficeManager, OnlyOfficeManagerFactory, onlyOfficeManagerFactory } from "@/components/onlyoffice-web-comp/core/onlyoffice-manager"
export type { OnlyOfficeManagerOptions, OpenDocumentInput } from "@/components/onlyoffice-web-comp/core/onlyoffice-manager"

export { EditorManager, editorManagerFactory } from "@/components/onlyoffice-web-comp/core/editor-manager"
export type { CreateEditorViewOptions } from "@/components/onlyoffice-web-comp/core/editor-manager"

export { onlyofficeEventbus } from "@/components/onlyoffice-web-comp/core/eventbus"
export type { LoadingChangeData } from "@/components/onlyoffice-web-comp/core/eventbus"

// Constants
export { ONLYOFFICE_ID, FILE_TYPE, OFFICE_THEME, ONLYOFFICE_LANG_KEY } from "@/components/onlyoffice-web-comp/const"
export type { FileType, OfficeThemeId } from "@/components/onlyoffice-web-comp/const"

// Types
export type { User, OfficeTheme } from "@/components/onlyoffice-web-comp/internal/editor/types"
export type { OnlyOfficeLang } from "@/components/onlyoffice-web-comp/store/lang"

// Utilities
export { initializeOnlyOffice } from "@/components/onlyoffice-web-comp/util/initialize"
export { getDocumentType } from "@/components/onlyoffice-web-comp/const"

// Re-export STATIC_RESOURCE for path configuration
import { STATIC_RESOURCE } from "@/components/onlyoffice-web-comp/const"
export { STATIC_RESOURCE }

/**
 * Override the base path for OnlyOffice SDK assets.
 * Call this BEFORE `initializeOnlyOffice()` or `OnlyOfficeManager.create()`.
 *
 * @param basePath - CDN base URL, e.g. "https://cdn.example.com/onlyoffice"
 *                   No trailing slash.
 */
export function setOnlyOfficeBasePath(basePath: string): void {
  const root = `${basePath}/packages/onlyoffice/9.3.0`
  const apiJs = "/web-apps/apps/api/documents/api.js"
  const preloadHtml = "/web-apps/apps/api/documents/preload.html"

  STATIC_RESOURCE.onlyoffice.root = root
  STATIC_RESOURCE.onlyoffice.apiJs = apiJs
  STATIC_RESOURCE.onlyoffice.preloadHtml = preloadHtml
  STATIC_RESOURCE.onlyoffice.apiUrl = root + apiJs
  STATIC_RESOURCE.onlyoffice.preloadUrl = root + preloadHtml

  STATIC_RESOURCE.x2t.root = `${root}/x2t`
  STATIC_RESOURCE.x2t.script = `${root}/x2t/x2t.js`
  STATIC_RESOURCE.x2t.wasm = `${root}/x2t/x2t.wasm`
  STATIC_RESOURCE.x2t.pdfFonts.root = `${root}/x2t-fonts`
  STATIC_RESOURCE.x2t.pdfFonts.default = `${root}/x2t-fonts/Carlito-Regular.ttf`
}
