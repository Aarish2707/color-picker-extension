import type { ReactNode } from "react";

import "./PopupWrapper.css";

import BgSvg from "../../assets/images/bg.svg";
import { getExtensionURL } from "../../hooks/useExtensionURL";

type PopupWrapperProps = {
  children?: ReactNode;
  closing?: boolean;
};

const PopupWrapper = ({ children, closing }: PopupWrapperProps) => {
  return (
    <div className={`popup-wrapper${closing ? " closing" : ""}`}>
      <img src={getExtensionURL(BgSvg)} alt="Background" className="popup-bg" />
      {children}
    </div>
  );
};

export default PopupWrapper;
