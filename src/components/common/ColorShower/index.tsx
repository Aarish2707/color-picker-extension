import React from "react";

import "./ColorShower.css";

import QuestionIcon from "../../../assets/images/icons/question-icon.svg";

interface ColorShowerProps {
  color?: string;
  showQuestion?: boolean;
}

const ColorShower: React.FC<ColorShowerProps> = ({ color, showQuestion = false }) => {
  return (
    <div
      className="color-shower"
      style={color ? { backgroundColor: color } : undefined}
    >
      {showQuestion && (
        <img className="color-shower-question" src={QuestionIcon} alt="?" />
      )}
    </div>
  );
};

export default ColorShower;
