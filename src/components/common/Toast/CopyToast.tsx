import { useEffect, useState } from "react";
import GreenCheckIcon from "../../../assets/images/icons/green-check.svg";
import { getExtensionURL } from "../../../hooks/useExtensionURL";

interface CopyToastProps {
  value: string | null;
  visible: boolean;
}

export const CopyToast = ({ value, visible }: CopyToastProps) => {
  const [show, setShow]         = useState(false);
  const [render, setRender]     = useState(false);
  const [exiting, setExiting]   = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null); 

  useEffect(() => {
    if (visible) {
      setExiting(false);
      setSnapshot(value); 
      setRender(true);
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShow(true))
      );
      return () => cancelAnimationFrame(frame);
    } else {
      setExiting(true);
      setShow(false);
      const timer = setTimeout(() => {
        setRender(false);
        setExiting(false);
        setSnapshot(null); 
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!render) return null;

  const displayValue = snapshot; 

  const swatchColor = (() => {
    if (!displayValue) return "#cccccc";
    if (displayValue.startsWith("#")) return displayValue;
    if (
      displayValue.toLowerCase().startsWith("rgb") ||
      displayValue.toLowerCase().startsWith("hsl")
    ) return displayValue;
    return "#cccccc";
  })();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: "50%",
        display: "flex",
        alignItems: "stretch",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: "18px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 2147483647,
        opacity: show ? 1 : 0,
        transform: show
          ? "translateX(-50%) translateY(0) scale(1)"
          : exiting
          ? "translateX(-50%) translateY(8px) scale(0.96)"
          : "translateX(-50%) translateY(14px) scale(0.94)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.08)",
        transition: exiting
          ? "opacity 200ms cubic-bezier(0.55,0,1,0.45), transform 200ms cubic-bezier(0.55,0,1,0.45)"
          : "opacity 380ms cubic-bezier(0.22,1,0.36,1), transform 380ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <span
        style={{
          width: "56px",
          alignSelf: "stretch",
          background: swatchColor,
          flexShrink: 0,
          display: "block",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 20px",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#111827",
            fontFamily: "Poppins, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {displayValue}
        </span>
        <span
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: "#6B7280",
            fontFamily: "Poppins, sans-serif",
            marginLeft: "6px",
          }}
        >
          Copied!
        </span>
      </div>

      {/* Section 3: green check icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 18px 0 4px",
          flexShrink: 0,
        }}
      >
        <img src={getExtensionURL(GreenCheckIcon)} alt="Copied" width={28} height={28} />
      </div>
    </div>
  );
};