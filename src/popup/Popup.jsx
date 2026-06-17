import React, { useState } from 'react';
import './Popup.css';

// Helper: Convert hex to rgb
function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  const cleaned = hex.replace('#', '');
  // Support shorthand hex like #fff
  const fullHex = cleaned.length === 3 
    ? cleaned.split('').map(x => x + x).join('')
    : cleaned;
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  return { r, g, b };
}

// Helper: Convert rgb to hsl
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Helper: Format color based on format selection
function formatColor(hex, format) {
  if (!hex) return '';
  const uppercaseHex = hex.toUpperCase();
  if (format === 'HEX') {
    return uppercaseHex;
  }
  const { r, g, b } = hexToRgb(uppercaseHex);
  if (format === 'RGB') {
    return `rgb(${r}, ${g}, ${b})`;
  }
  if (format === 'HSL') {
    const { h, s, l } = rgbToHsl(r, g, b);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return uppercaseHex;
}

export default function Popup() {
  const [pickedColor, setPickedColor] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);
  const [format, setFormat] = useState('HEX'); // 'HEX' | 'RGB' | 'HSL'
  const [showToast, setShowToast] = useState(false);
  const [copiedLabelActive, setCopiedLabelActive] = useState(false);
  const [error, setError] = useState(null);

  const isSupported = typeof window !== 'undefined' && 'EyeDropper' in window;

  const handlePick = async () => {
    if (!isSupported) {
      setError('EyeDropper API not supported in this browser.');
      return;
    }
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setPickedColor(result.sRGBHex);
      setError(null);
    } catch (err) {
      // User cancelled the eyedropper, do nothing
      console.log('EyeDropper cancelled or failed', err);
    }
  };

  const handleCopy = async () => {
    if (!pickedColor) return;
    const valueToCopy = formatColor(pickedColor, format);
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopiedColor(pickedColor);
      setShowToast(true);
      setCopiedLabelActive(true);
      
      const timer = setTimeout(() => {
        setShowToast(false);
        setCopiedLabelActive(false);
      }, 1500);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const selectText = (e) => {
    e.target.select();
  };

  return (
    <div className="popup-container">
      {/* Background glow effects */}
      <div className="glow-bg">
        <div className="glow-circle glow-circle-1"></div>
        <div className="glow-circle glow-circle-2"></div>
      </div>

      {/* Toast notification */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        <span className="toast-icon">✓</span>
        <span>Copied to clipboard!</span>
      </div>

      {/* Header */}
      <header className="glass-header">
        <img src="icons/logo.png" alt="Color Picker" className="header-icon" />
        <h1 className="header-title">Color Picker</h1>
      </header>

      {/* Error Overlay if not supported */}
      {!isSupported && (
        <div className="error-overlay">
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <h2 className="error-title">Not Supported</h2>
            <p className="error-text">
              The EyeDropper API is not supported in this browser. Please use a Chromium-based browser like Google Chrome.
            </p>
          </div>
        </div>
      )}

      {/* Swatch Display */}
      <div className="swatch-panel">
        <div className="swatch-wrapper">
          {pickedColor ? (
            <div 
              className="swatch-circle" 
              style={{ 
                backgroundColor: pickedColor,
                boxShadow: `0 0 24px ${pickedColor}, inset 0 2px 4px rgba(255, 255, 255, 0.4)`
              }}
            />
          ) : (
            <div className="swatch-circle empty" />
          )}
        </div>
        <div className={`swatch-label ${!pickedColor ? 'empty' : ''}`}>
          {pickedColor ? formatColor(pickedColor, format) : 'No color picked'}
        </div>
      </div>

      {/* Format Toggle */}
      <div className="toggle-container">
        {['HEX', 'RGB', 'HSL'].map((f) => (
          <button
            key={f}
            type="button"
            className={`toggle-pill ${format === f ? 'active' : ''}`}
            onClick={() => setFormat(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Text Output Input Field */}
      <div className="input-container">
        <input
          type="text"
          className="copied-input"
          readOnly
          onClick={selectText}
          value={copiedColor ? formatColor(copiedColor, format) : ''}
          placeholder="No color copied yet..."
        />
      </div>

      {/* Action Buttons */}
      <div className="actions-container">
        <button
          type="button"
          className="btn btn-pick"
          onClick={handlePick}
        >
          🎯 Pick Color
        </button>
        <button
          type="button"
          className={`btn btn-copy ${copiedLabelActive ? 'success' : ''}`}
          onClick={handleCopy}
          disabled={!pickedColor}
        >
          {copiedLabelActive ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}
