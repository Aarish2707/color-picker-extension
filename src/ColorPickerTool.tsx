import React, { useState, useEffect, useRef } from 'react';

// Helper function to convert RGB string to hex
function rgbToHex(rgb: string): string {
  // Extract numbers from rgb(r, g, b) or rgba(r, g, b, a)
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000'; // fallback

  const [, r, g, b] = match;
  return `#${[r, g, b]
    .map((x) => parseInt(x, 10).toString(16).padStart(2, '0'))
    .join('')}`;
}

const ColorPickerTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipColor, setTooltipColor] = useState<string>('#000000');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipColorRef = useRef<string>('#000000');

  // Activate the color picker
  const activatePicker = () => {
    setIsActive(true);
    // Change cursor to crosshair
    document.body.style.cursor = 'crosshair';
  };

  // Deactivate the color picker
  const deactivatePicker = () => {
    setIsActive(false);
    document.body.style.cursor = 'default';
  };

  // Handle key press (Escape to deactivate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        deactivatePicker();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  // Handle mouse move and click when picker is active
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setTooltipPosition({ x: e.clientX, y: e.clientY });

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;

      const style = window.getComputedStyle(element);
      // We'll get the background-color, but if it's transparent, we might want to look at the color?
      let color = style.backgroundColor;
      if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
        color = style.color;
      }

      tooltipColorRef.current = color;
      setTooltipColor(color);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.color-picker-tool')) return;

      e.preventDefault();
      e.stopPropagation();

      setPickedColor(() => {
        const hex = rgbToHex(tooltipColorRef.current);
        navigator.clipboard.writeText(hex);
        return hex;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [isActive]);

  // Cleanup: reset cursor on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div className="color-picker-tool">
      {/* Toggle button */}
      <button
        className={`toggle-button ${isActive ? 'active' : ''}`}
        onClick={isActive ? deactivatePicker : activatePicker}
      >
        {isActive ? 'Deactivate Picker' : 'Activate Color Picker'}
      </button>

      {/* Picked color display */}
      {pickedColor && (
        <div className="picked-color">
          <div
            className="color-swatch"
            style={{ backgroundColor: pickedColor }}
          ></div>
          <div className="color-info">
            <span>Hex: {pickedColor}</span>
            {/* We could also show RGB and HSL if we converted them */}
          </div>
          <button onClick={() => navigator.clipboard.writeText(pickedColor!)}>
            Copy Hex
          </button>
        </div>
      )}

      {/* Tooltip when picker is active */}
      {isActive && (
        <div
          ref={tooltipRef}
          className="color-tooltip"
          style={{
            left: `${tooltipPosition.x + 20}px`,
            top: `${tooltipPosition.y + 20}px`,
            pointerEvents: 'none',
          }}
        >
          <div
            className="tooltip-swatch"
            style={{ backgroundColor: tooltipColor }}
          ></div>
          <div className="tooltip-text">
            {rgbToHex(tooltipColor)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerTool;