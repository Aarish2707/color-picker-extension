import type { ReactNode } from "react";

import "./PopupWrapper.css";

import BgSvg from "../../assets/images/bg.svg";

type PopupWrapperProps = {
  children?: ReactNode;
};

const PopupWrapper = ({ children }: PopupWrapperProps) => {
  return (
    <div className="popup-wrapper">
      <img src={BgSvg} alt="Background" className="popup-bg" />
      {children}
    </div>
  );
};

export default PopupWrapper;
