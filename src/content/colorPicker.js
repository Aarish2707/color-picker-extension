// Web Color Picker — content script
// Renders a persistent floating panel on the page that:
//   - shows the color currently under the cursor (live)
//   - shows the most recently picked color with a Copy button
//   - has an × button to stop picking
//   - draggable; position and last pick persist via chrome.storage.session
//
// Listens for {action:'startPicking'} / {action:'stopPicking'} from the popup.

function rgbToHex(rgb) {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000';
  const [, r, g, b] = match;
  return `#${[r, g, b].map(x => parseInt(x, 10).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function getColor(element) {
  let el = element;
  while (el) {
    const color = window.getComputedStyle(el).backgroundColor;
    if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') return color;
    el = el.parentElement;
  }
  return 'rgb(255, 255, 255)';
}

// ---------- state ----------
let isPicking = false;
let lastHex = '#000000';
let handleMouseMove, handleClick, handleKeyDown;
let panel = null;
let liveSwatchEl, liveTextEl, pickedSwatchEl, pickedTextEl, copyBtn, stopBtn;
let dragState = null;

// ---------- storage helpers ----------
const storage = (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) ? chrome.storage.session : null;

function saveLast(hex) {
  if (!storage) return;
  try {
    storage.set({ lastPick: { hex, at: Date.now() } });
  } catch (_) { /* storage quota / unavailable — ignore */ }
}

function loadLast() {
  if (!storage) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      storage.get('lastPick', (data) => resolve(data && data.lastPick ? data.lastPick : null));
    } catch (_) { resolve(null); }
  });
}

function loadPanelPos() {
  if (!storage) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      storage.get('cpPanelPos', (data) => resolve(data && data.cpPanelPos ? data.cpPanelPos : null));
    } catch (_) { resolve(null); }
  });
}

function savePanelPos(x, y) {
  if (!storage) return;
  try {
    storage.set({ cpPanelPos: { x, y } });
  } catch (_) { /* ignore */ }
}

// ---------- panel ----------
function setText(el, txt) { if (el) el.textContent = txt; }
function setBg(el, color) { if (el) el.style.backgroundColor = color; }

function updateLiveColor(hex) {
  lastHex = hex;
  setBg(liveSwatchEl, hex);
  setText(liveTextEl, hex);
}

function updatePickedColor(hex) {
  setBg(pickedSwatchEl, hex);
  setText(pickedTextEl, hex);
}

function createPanel(initialPickedHex) {
  if (panel) return panel;

  panel = document.createElement('div');
  panel.id = 'wcp-panel';
  Object.assign(panel.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '2147483647',
    minWidth: '180px',
    maxWidth: '240px',
    backgroundColor: 'rgba(20, 20, 20, 0.92)',
    color: '#fff',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '12px',
    borderRadius: '8px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
    userSelect: 'none',
    overflow: 'hidden',
    pointerEvents: 'auto',
  });

  // header (drag handle + stop button)
  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 8px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    cursor: 'move',
    fontWeight: 'bold',
    letterSpacing: '0.3px',
  });
  const title = document.createElement('span');
  title.textContent = 'Color Picker';
  header.appendChild(title);

  stopBtn = document.createElement('button');
  stopBtn.type = 'button';
  stopBtn.textContent = '×';
  stopBtn.title = 'Stop picking';
  Object.assign(stopBtn.style, {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    lineHeight: '1',
    cursor: 'pointer',
    padding: '0 4px',
  });
  stopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    stopPicking();
  });
  header.appendChild(stopBtn);

  // live section
  const liveRow = document.createElement('div');
  Object.assign(liveRow.style, {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    gap: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  });
  liveSwatchEl = document.createElement('div');
  Object.assign(liveSwatchEl.style, {
    width: '22px',
    height: '22px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.4)',
    backgroundColor: '#000',
    flex: '0 0 auto',
  });
  const liveLabel = document.createElement('span');
  liveLabel.textContent = 'Cursor:';
  liveLabel.style.opacity = '0.7';
  liveTextEl = document.createElement('span');
  liveTextEl.textContent = '#000000';
  Object.assign(liveTextEl.style, { marginLeft: 'auto', fontWeight: 'bold' });
  liveRow.appendChild(liveSwatchEl);
  liveRow.appendChild(liveLabel);
  liveRow.appendChild(liveTextEl);

  // picked section
  const pickedRow = document.createElement('div');
  Object.assign(pickedRow.style, {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    gap: '8px',
  });
  pickedSwatchEl = document.createElement('div');
  Object.assign(pickedSwatchEl.style, {
    width: '22px',
    height: '22px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.4)',
    backgroundColor: initialPickedHex || '#000',
    flex: '0 0 auto',
  });
  const pickedLabel = document.createElement('span');
  pickedLabel.textContent = 'Picked:';
  pickedLabel.style.opacity = '0.7';
  pickedTextEl = document.createElement('span');
  pickedTextEl.textContent = initialPickedHex || '—';
  Object.assign(pickedTextEl.style, { marginLeft: 'auto', fontWeight: 'bold' });
  copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.textContent = 'Copy';
  Object.assign(copyBtn.style, {
    background: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '11px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  });
  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const hex = pickedTextEl.textContent;
    if (!hex || hex === '—') return;
    navigator.clipboard.writeText(hex).then(() => flashCopy());
  });
  pickedRow.appendChild(pickedSwatchEl);
  pickedRow.appendChild(pickedLabel);
  pickedRow.appendChild(pickedTextEl);
  pickedRow.appendChild(copyBtn);

  panel.appendChild(header);
  panel.appendChild(liveRow);
  panel.appendChild(pickedRow);
  document.body.appendChild(panel);

  // drag the panel by its header
  attachDrag(header);

  // restore prior position
  loadPanelPos().then((pos) => {
    if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
      panel.style.left = `${pos.x}px`;
      panel.style.top = `${pos.y}px`;
      panel.style.right = 'auto';
    }
  });

  return panel;
}

function flashCopy() {
  if (!copyBtn) return;
  const old = copyBtn.textContent;
  copyBtn.textContent = 'Copied!';
  copyBtn.style.background = '#4CAF50';
  setTimeout(() => {
    if (!copyBtn) return;
    copyBtn.textContent = old;
    copyBtn.style.background = '#2196F3';
  }, 900);
}

function attachDrag(handle) {
  handle.addEventListener('pointerdown', (e) => {
    if (e.target === stopBtn) return; // don't drag when clicking ×
    e.preventDefault();
    const rect = panel.getBoundingClientRect();
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      origLeft: rect.left,
      origTop: rect.top,
      pointerId: e.pointerId,
    };
    handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointermove', (e) => {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    panel.style.left = `${dragState.origLeft + dx}px`;
    panel.style.top = `${dragState.origTop + dy}px`;
    panel.style.right = 'auto';
  });
  const endDrag = (e) => {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    const rect = panel.getBoundingClientRect();
    savePanelPos(rect.left, rect.top);
    dragState = null;
  };
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
}

function removePanel() {
  if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
  panel = null;
  liveSwatchEl = liveTextEl = pickedSwatchEl = pickedTextEl = copyBtn = stopBtn = null;
}

// ---------- picking lifecycle ----------
function startPicking() {
  if (isPicking) return;
  isPicking = true;
  document.body.style.cursor = 'crosshair';

  // restore last picked color in the panel
  loadLast().then((last) => {
    createPanel(last && last.hex ? last.hex : null);
  });

  handleMouseMove = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const hex = rgbToHex(getColor(el));
    updateLiveColor(hex);
  };

  handleClick = (e) => {
    // ignore clicks that land on the panel itself
    if (panel && (e.target === panel || panel.contains(e.target))) return;
    e.preventDefault();
    e.stopPropagation();
    const hex = lastHex;
    updatePickedColor(hex);
    saveLast(hex);
    navigator.clipboard.writeText(hex).catch(() => { /* clipboard may be denied; ignore */ });
    // picking continues — the user can pick more colors. Stop via × or Escape.
  };

  handleKeyDown = (e) => {
    if (e.key === 'Escape') stopPicking();
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('keydown', handleKeyDown);
}

function stopPicking() {
  if (!isPicking) return;
  isPicking = false;
  document.body.style.cursor = '';
  removePanel();
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('keydown', handleKeyDown);
}

// ---------- message bridge ----------
chrome.runtime.onMessage.addListener((message) => {
  if (message && message.action === 'startPicking') startPicking();
  else if (message && message.action === 'stopPicking') stopPicking();
});
