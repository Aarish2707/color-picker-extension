const RESTRICTED = [
  /^chrome:\/\//,
  /^chrome-extension:\/\//,
  /^https:\/\/chromewebstore\.google\.com/,
  /^edge:\/\//,
  /^extension:\/\//,
  /^https:\/\/microsoftedge\.microsoft\.com\/addons/,
  /^about:/,
  /^moz-extension:\/\//,
  /^https:\/\/addons\.mozilla\.org/,
  /^opera:\/\//,
  /^brave:\/\//,
  /^vivaldi:\/\//,
  /^view-source:/,
  /^data:/,
  /^javascript:/,
];

const isRestricted = (url) => !url || RESTRICTED.some((p) => p.test(url));

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  if (isRestricted(tab.url)) {
    // Open the how-to page instead of trying to inject
    chrome.tabs.create({ url: "https://pixel-pick.onrender.com/how-to-open" });
    // chrome.tabs.create({ url: "http://localhost:3000/how-to-open" });
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/inject.js"],
    });
  } catch (err) {
    // Fallback safety net — catches any edge cases the regex misses
    console.warn("PixelPick: Could not inject on this page.", err.message);
    chrome.tabs.create({ url: "https://pixel-pick.onrender.com/how-to-open" });
    // chrome.tabs.create({ url: "http://localhost:3000/how-to-open" });
  }
});