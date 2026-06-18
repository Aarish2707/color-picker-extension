import React, { useState, useEffect, useRef } from "react";

import "./Menu.css";

interface MenuOption {
  label: string;
  value: string;
}

interface MenuProps {
  options: MenuOption[];
  selected: string;
  onChange: (value: string) => void;
}

const Menu: React.FC<MenuProps> = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selected);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="menu" ref={menuRef}>
      <button className="menu-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="menu-label">{selectedOption?.label}</span>
        <svg
          className={`menu-icon ${isOpen ? "menu-icon--open" : ""}`}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="#DBE0E4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="menu-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`menu-option ${option.value === selected ? "menu-option--active" : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
