import "./PopupHeader.css";

import React from "react";

import BrandLogo from "../../assets/images/brand-logo.svg";
import BrandName from "../../assets/images/brand-name.svg";
import Menu from "../common/Menu";
import { getExtensionURL } from "../../hooks/useExtensionURL";

type ColorFormat = "hex" | "rgb" | "hsl";

interface PopupHeaderProps {
  selectedFormat: ColorFormat;
  onFormatChange: (format: ColorFormat) => void;
  copied?: boolean;
  onClose?: () => void;
}

const PopupHeader = ({
  selectedFormat,
  onFormatChange,
  copied,
  onClose,
}: PopupHeaderProps) => {
  const [isCopiedVisible, setIsCopiedVisible] = React.useState(false);

  React.useEffect(() => {
    if (copied) {
      setIsCopiedVisible(true);
      const timeout = setTimeout(() => onClose?.(), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied, onClose]);
  return (
    <div className="popup-header">
      <div className="brand-wrapper">
        <>
          <img
            className="brand-logo"
            src={getExtensionURL(BrandLogo)}
            alt="Brand Logo"
          />

          <div>
            <div
              className={`brand-title-wrapper ${isCopiedVisible ? "visible" : ""}`}
            >
              <div className="wp">
                <div className="copied-label">COPIED 👍</div>
                <img
                  src={getExtensionURL(BrandName)}
                  alt="Brand Name"
                  className="title"
                />
              </div>
            </div>
            <div className="lead">Point. Pick. Copy.</div>
          </div>
        </>
      </div>
      <Menu
        options={[
          { label: "HEX", value: "hex" },
          { label: "RGB", value: "rgb" },
          { label: "HSL", value: "hsl" },
        ]}
        selected={selectedFormat}
        onChange={(value) => onFormatChange(value as ColorFormat)}
      />
    </div>
  );
};

export default PopupHeader;
