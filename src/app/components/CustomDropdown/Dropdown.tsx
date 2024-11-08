import React, { useState } from "react";
import "./dropdown.scss";

interface DropdownProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  defaultLabel?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onChange,
  defaultLabel = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown cp-text">
      <div className="dropdown-selected" onClick={() => setIsOpen(!isOpen)}>
        {selectedValue || defaultLabel}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
      </div>
      {isOpen && (
        <ul className="dropdown-options custom-scrollbar">
          <li
            className={`dropdown-option ${
              selectedValue === "" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("")}
          >
            {defaultLabel}
          </li>
          {options.map((option, index) => (
            <li
              key={index}
              className={`dropdown-option ${
                option === selectedValue ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
