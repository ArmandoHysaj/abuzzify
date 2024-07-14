"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect, useRef } from "react";
import Abuzzify from "../../images/Abuzzify.png";
import "./main-nav.scss";
import { usePathname } from "next/navigation";

const MainNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="main-nav">
      <div className="main-header container">
        <div className="nav-logo">
          <Link href="/">
            <img src={Abuzzify.src} alt="Abuzzify Logo" />
          </Link>
        </div>
        {isMobile ? (
          <>
            <div
              ref={menuRef}
              className={`nav-layer ${isMenuOpen ? "open" : ""}`}
            >
              <div className="nav-items">
                <div className="hdl-4">
                  <Link href="/">Abuzzy Home</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/buzzylytics">Buzzylytics</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/buzzyball">Buzzyball</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/buzzeting">Buzzeting</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/abuzzy-about">About Abuzzy</Link>
                </div>
              </div>
            </div>

            <div className="burger-menu" onClick={toggleMenu}>
              <div className="burger-icon">
                {isMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35px"
                    height="35px"
                    viewBox="-2.4 -2.4 28.80 28.80"
                    fill="none"
                    stroke="#000000"
                    transform="rotate(0)"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="#CCCCCC"
                      strokeWidth="2.4"
                    >
                      <path
                        d="M5 8H13.75M5 12H19M10.25 16L19 16"
                        stroke="#464455"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M5 8H13.75M5 12H19M10.25 16L19 16"
                        stroke="#464455"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35px"
                    height="35px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 8H13.75M5 12H19M10.25 16L19 16"
                      stroke="#464455"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="desktop nav-items">
            <div className="hdl-4 line-separator">
              <Link href="/">Abuzzy Home</Link>
            </div>
            <div className="hdl-4">
              <Link href="/buzzylytics">Buzzylytics</Link>
            </div>
            <div className="hdl-4">
              <Link href="/buzzyball">Buzzyball</Link>
            </div>
            <div className="hdl-4">
              <Link href="/buzzeting">Buzzeting</Link>
            </div>
            <div className="hdl-4 left-space">
              <Link href="/abuzzy-about">About Abuzzy</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
