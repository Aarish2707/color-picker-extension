import "./PopupHeader.css";

import BrandLogo from "../../assets/images/brand-logo.svg";
import BrandName from "../../assets/images/brand-name.svg";
import Menu from "../common/Menu";
import { getExtensionURL } from "../../hooks/useExtensionURL";

type ColorFormat = "hex" | "rgb" | "hsl";

interface PopupHeaderProps {
  selectedFormat: ColorFormat;
  onFormatChange: (format: ColorFormat) => void;
}

const PopupHeader = ({ selectedFormat, onFormatChange }: PopupHeaderProps) => {

  return (
    <div className="popup-header">
      <div className="brand-wrapper">
        <img
          className="brand-logo"
          src={getExtensionURL(BrandLogo)}
          alt="Brand Logo"
        />
        <div className="">
          <img
            src={getExtensionURL(BrandName)}
            alt="Brand Name"
            className="title"
          />
          <div className="lead">Point. Pick. Copy.</div>
        </div>
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
