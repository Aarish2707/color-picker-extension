import React from "react";

import "./ColorShower.css";

import QuestionIcon from "../../../assets/images/icons/question-icon.svg";
import { getExtensionURL } from "../../../hooks/useExtensionURL";

interface ColorShowerProps {
  color?: string;
  showQuestion?: boolean;
  onClick?: () => void;
}

const ColorShower: React.FC<ColorShowerProps> = ({ color, showQuestion = false, onClick }) => {
  return (
    <div
      className={`color-shower${onClick ? " cursor-pointer" : ""}`}
      style={color ? { backgroundColor: color } : undefined}
      onClick={onClick}
    >
      {showQuestion && (
        <img className="color-shower-question w-8 h-8" src={getExtensionURL(QuestionIcon)} alt="?" />
      )}
    </div>
  );
};

export default ColorShower;
