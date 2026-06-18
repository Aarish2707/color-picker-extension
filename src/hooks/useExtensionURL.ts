export function getExtensionURL(path: string): string {
  // Already a usable, self-contained or absolute URL — use as-is.
  // (data: URIs from inlined assets, or full chrome-extension:// / http(s) URLs.)
  if (/^(data:|blob:|https?:|chrome-extension:)/.test(path)) return path;

  if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
    // Vite may emit file assets as "./assets/x" or "../assets/x"; strip the
    // leading relative prefix so it resolves against the extension root.
    const cleaned = path.replace(/^(\.\.?\/)+/, "");
    return chrome.runtime.getURL(cleaned);
  }
  return path;
}
