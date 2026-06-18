import type { ReactNode } from "react";

import "./PopupWrapper.css";

import BgSvg from "../../assets/images/bg.svg";
import { getExtensionURL } from "../../hooks/useExtensionURL";

type PopupWrapperProps = {
  children?: ReactNode;
};

const PopupWrapper = ({ children }: PopupWrapperProps) => {
  return (
    <div className="popup-wrapper">
      <img src={getExtensionURL(BgSvg)} alt="Background" className="popup-bg" />
      {children}
    </div>
  );
};

export default PopupWrapper;
