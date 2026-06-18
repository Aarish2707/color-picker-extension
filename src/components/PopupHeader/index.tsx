import "./PopupHeader.css";

// Import Brand Logo from assets/image and use as SVG here
import BrandLogo from "../../assets/images/brand-logo.svg";
import BrandName from "../../assets/images/brand-name.svg";
import Menu from "../common/Menu";
import { useState } from "react";

const PopupHeader = () => {
  const [selectedFormat, setSelectedFormat] = useState("hex");

  return (
    <div className="popup-header">
      <div className="brand-wrapper">
        <img src={BrandLogo} alt="Brand Logo" />
        <div className="">
          <img src={BrandName} alt="Brand Name" className="title" />
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
        onChange={setSelectedFormat}
      />
    </div>
  );
};

export default PopupHeader;
