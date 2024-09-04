import React, { useState } from "react";
import "./dropdown.scss";
interface DropdownProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <div className="dropdown-selected" onClick={() => setIsOpen(!isOpen)}>
        {selectedValue || "All Countries"}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
      </div>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option, index) => (
            <li
              key={index}
              className={`dropdown-option ${
                option === selectedValue ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option || "All Countries"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
