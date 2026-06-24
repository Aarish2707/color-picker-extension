// src/components/common/CopyToast.tsx
import { useEffect, useState } from "react";

interface CopyToastProps {
  value: string | null;
  visible: boolean;
}

export const CopyToast = ({ value, visible }: CopyToastProps) => {
  const [show, setShow] = useState(false);
  const [render, setRender] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setExiting(false);
      setRender(true);
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShow(true))
      );
      return () => cancelAnimationFrame(frame);
    } else {
      // Mark as exiting so we can switch the curve
      setExiting(true);
      setShow(false);
      const timer = setTimeout(() => {
        setRender(false);
        setExiting(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!render) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: "50%",
        transform: show
          ? "translateX(-50%) translateY(0) scale(1)"
          : exiting
          ? "translateX(-50%) translateY(20px) scale(0.92)"
          : "translateX(-50%) translateY(16px) scale(0.95)",
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#ffffff",
        border: "1px solid #E4E4E7",
        borderRadius: "16px",
        padding: "18px 32px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        fontFamily: "Poppins, sans-serif",
        fontSize: "16px",
        fontWeight: 500,
        color: "#18181B",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        opacity: show ? 1 : 0,
        // Spring curve for entry, sharp ease-in for exit
        transition: exiting
          ? [
              "opacity 240ms cubic-bezier(0.4, 0, 1, 1)",
              "transform 240ms cubic-bezier(0.4, 0, 1, 1)",
            ].join(", ")
          : [
              "opacity 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              "transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            ].join(", "),
      }}
    >
      {/* Check circle */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "#DCFCE7",
          flexShrink: 0,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5L4 7L8 3"
            stroke="#16A34A"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Color swatch */}
      <span
        style={{
          display: "inline-block",
          width: "14px",
          height: "14px",
          borderRadius: "4px",
          background: value?.startsWith("#") ? value : undefined,
          border: "1px solid rgba(0,0,0,0.10)",
          flexShrink: 0,
        }}
      />

      {/* Text */}
      <span style={{ letterSpacing: "0.01em", lineHeight: 1 }}>
        <span style={{ color: "#71717A", fontWeight: 400 }}>Copied </span>
        <span style={{ color: "#18181B", fontWeight: 600 }}>{value}</span>
      </span>
    </div>
  );
};