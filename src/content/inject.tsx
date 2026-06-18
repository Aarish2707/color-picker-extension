import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";
import "./inject.css";

const HOST_ID = "color-picker-ext-host";

(function toggle() {
  const existing = document.getElementById(HOST_ID);
  if (existing) {
    existing.remove();
    return;
  }

  // Host lives in the page, but all rendering happens inside a Shadow DOM so
  // the page's styles can't affect us and our styles can't affect the page.
  const host = document.createElement("div");
  host.id = HOST_ID;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  // Load our extracted, isolated stylesheet into the shadow root.
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("content/inject.css");
  shadow.appendChild(link);

  // React mounts on this element; inject.css selectors are scoped to its id.
  const mount = document.createElement("div");
  mount.id = "color-picker-ext-root";
  shadow.appendChild(mount);

  const root = ReactDOM.createRoot(mount);

  const close = () => {
    root.unmount();
    host.remove();
  };

  root.render(
    <React.StrictMode>
      <App onClose={close} />
    </React.StrictMode>
  );
})();
