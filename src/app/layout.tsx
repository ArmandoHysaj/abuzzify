"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import "./globals.scss";
import "./main-nav.scss";
import "./fonts.scss";
import CustomScrollbar from "../utils/customScrollbar";
import Abuzzify from "../app/images/Abuzzify.png";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };

    handleResize(); // check initial size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <body>
        <CustomScrollbar>
          <nav className="main-nav">
            <div className="main-header container">
              <div className="nav-logo">
                <img src={Abuzzify.src} alt="CryptoLytics Logo" />
              </div>
              {isMobile ? (
                <>
                  <div className={`nav-layer ${isMenuOpen ? "open" : ""}`}>
                    <div className="nav-items">
                      <div className="hdl-4">
                        <Link href="/">Abuzzy Home</Link>
                      </div>
                      <div className="hdl-4">
                        <Link href="/Buzzylytics">Buzzylytics</Link>
                      </div>
                      <div className="hdl-4">
                        <Link href="/Buzzyball">Buzzyball</Link>
                      </div>
                      <div className="hdl-4">
                        <Link href="/Buzzeting">Buzzeting</Link>
                      </div>
                      <div className="hdl-4">
                        <Link href="/AbuzzyAbout">About Abuzzy</Link>
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
                          <g id="SVGRepo_bgCarrier" stroke-width="0" />

                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke="#CCCCCC"
                            stroke-width="2.4"
                          >
                            <path
                              d="M5 8H13.75M5 12H19M10.25 16L19 16"
                              stroke="#464455"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>

                          <g id="SVGRepo_iconCarrier">
                            <path
                              d="M5 8H13.75M5 12H19M10.25 16L19 16"
                              stroke="#464455"
                              stroke-linecap="round"
                              stroke-linejoin="round"
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
                            stroke-linecap="round"
                            stroke-linejoin="round"
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
                    <Link href="/Buzzylytics">Buzzylytics</Link>
                  </div>
                  <div className="hdl-4">
                    <Link href="/Buzzyball">Buzzyball</Link>
                  </div>
                  <div className="hdl-4">
                    <Link href="/Buzzeting">Buzzeting</Link>
                  </div>
                  <div className="hdl-4 left-space">
                    <Link href="/AbuzzyAbout">About Abuzzy</Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
          <main>{children}</main>
        </CustomScrollbar>
      </body>
    </html>
  );
}
