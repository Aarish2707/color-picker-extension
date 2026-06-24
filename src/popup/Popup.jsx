// import React, { useEffect } from "react";
// import App from "../App";

// const RESTRICTED = [
//   // Chrome
//   /^chrome:\/\//,
//   /^chrome-extension:\/\//,
//   /^https:\/\/chromewebstore\.google\.com/,
//   // Edge
//   /^edge:\/\//,
//   /^extension:\/\//,
//   /^https:\/\/microsoftedge\.microsoft\.com\/addons/,
//   // Firefox
//   /^about:/,
//   /^moz-extension:\/\//,
//   /^https:\/\/addons\.mozilla\.org/,
//   // Opera
//   /^opera:\/\//,
//   /^chrome:\/\//,
//   // Brave
//   /^brave:\/\//,
//   // Vivaldi
//   /^vivaldi:\/\//,
//   // Generic
//   /^view-source:/,
//   /^data:/,
//   /^javascript:/,
// ];

// const isRestricted = (url) => !url || RESTRICTED.some((p) => p.test(url));

// const Popup = () => {
//   useEffect(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
//       if (isRestricted(tab?.url)) {
//         chrome.tabs.create({ url: "https://pixel-pick.onrender.com/how-to-open" });
//         window.close();
//       }
//     });
//   }, []);

//   return <App />;
// };

// export default Popup;
import React, { useEffect, useState } from "react";
import App from "../App";

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

const Popup = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (isRestricted(tab?.url)) {
        chrome.tabs.create(
          // { url: "https://pixel-pick.onrender.com/how-to-open" },
          { url: "http://localhost:3000/how-to-open" },
          () => window.close()
        );
      } else {
        setChecked(true);
      }
    });
  }, []);

  if (!checked) return null;

  return <App />;
};

export default Popup;