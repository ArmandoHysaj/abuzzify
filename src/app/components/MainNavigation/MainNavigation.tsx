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
                {/* <div className="hdl-4">
                  <Link href="/buzzyball">Buzzyball</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/buzzeting">Buzzeting</Link>
                </div> */}
                <div className="hdl-4">
                  <Link href="/about">About Abuzzy</Link>
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
            {/* <div className="hdl-4">
              <Link href="/buzzyball">Buzzyball</Link>
            </div>
            <div className="hdl-4">
              <Link href="/buzzeting">Buzzeting</Link>
            </div> */}
            <div className="hdl-4 left-space">
              <Link href="/about">About Abuzzy</Link>
            </div>
            {/* <div className="user-account">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <ellipse
                  cx="15.9999"
                  cy="9.45466"
                  rx="5.81818"
                  ry="5.81818"
                  stroke="#223341"
                ></ellipse>
                <path
                  d="M20 18.2634L20.0677 17.768L19.8903 17.7438L19.7378 17.8377L20 18.2634ZM12.0158 18.2634L12.2788 17.8382L12.1249 17.743L11.9458 17.7684L12.0158 18.2634ZM16 20.7274L15.737 21.1526L15.9995 21.3149L16.2622 21.1531L16 20.7274ZM19.9323 18.7588C24.1566 19.3362 27.1364 23.449 27.1364 28.3637H28.1364C28.1364 23.0967 24.9209 18.4314 20.0677 17.768L19.9323 18.7588ZM4.86365 28.3637C4.86365 23.4596 8.04057 19.3308 12.0858 18.7585L11.9458 17.7684C7.29324 18.4266 3.86365 23.086 3.86365 28.3637H4.86365ZM11.7528 18.6887L15.737 21.1526L16.263 20.3021L12.2788 17.8382L11.7528 18.6887ZM16.2622 21.1531L20.2622 18.6891L19.7378 17.8377L15.7378 20.3016L16.2622 21.1531Z"
                  fill="#223341"
                ></path>
                <path d="M16 23.2727L16 28.3636" stroke="#223341"></path>
              </svg>
            </div> */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
