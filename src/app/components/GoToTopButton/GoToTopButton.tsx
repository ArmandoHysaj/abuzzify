"use client";
import React, { useState, useEffect } from "react";
import backToTop from "../../images/backtotop.gif";
import "../GoToTopButton/go-to-top.scss";

const GoToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="go-to-top">
      {isVisible && (
        <div onClick={scrollToTop} className="go-to-top-button">
          {/* <img src={backToTop.src} alt="" /> */}
        </div>
      )}
    </div>
  );
};

export default GoToTopButton;
