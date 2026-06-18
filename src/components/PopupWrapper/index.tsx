import type { ReactNode } from "react";

import "./PopupWrapper.css";

type PopupWrapperProps = {
  children?: ReactNode;
};

const PopupWrapper = ({ children }: PopupWrapperProps) => {
  return <div className="popup-wrapper">{children}</div>;
};

export default PopupWrapper;