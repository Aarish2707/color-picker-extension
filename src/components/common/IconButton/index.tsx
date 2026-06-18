import React from "react";

import "./IconButton.css";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: "contained" | "outlined";
  alt?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "contained",
  alt = "",
  className = "",
  ...rest
}) => {
  return (
    <button
      className={`icon-button icon-button--${variant} ${className}`.trim()}
      {...rest}
    >
      <img src={icon} alt={alt} />
    </button>
  );
};

export default IconButton;
