// Background service worker for the Web Color Picker extension
// Currently, we are using direct messaging between popup and content script,
// so this file is mostly a placeholder but required by manifest.

console.log('Web Color Picker background service worker started');

// You can add any background logic here if needed, e.g., handling installation, etc.

// Example: handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Color Picker extension installed');
});
