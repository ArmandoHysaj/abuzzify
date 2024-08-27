"use client";
import React, { useState, useEffect } from "react";
import backToTop from "../../images/backtotop.gif";

const GoToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top when button is clicked
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
          <img src={backToTop.src} alt="" />
        </div>
      )}
      <style jsx>{`
        .go-to-top {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        .go-to-top-button {
          transition: opacity 0.3s;
          opacity: 0.6;
          width: 40px;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          height: 40px;
        }
        .go-to-top img {
          position: absolute;
          transform: translate(-50%, -50%);
          left: 49%;
          top: 52%;
          width: 150px;
        }
        .go-to-top-button:hover {
          opacity: 1;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default GoToTopButton;
