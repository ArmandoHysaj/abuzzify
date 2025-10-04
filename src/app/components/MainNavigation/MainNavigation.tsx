"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Abuzzify from "../../images/Abuzzify.png";
import "./main-nav.scss";
import { usePathname } from "next/navigation";
import ReactGA from "react-ga4";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useAuth } from "@/app/contexts/AuthContext";
import AuthModal from "../Auth/AuthModal";
import UserProfile from "../Auth/UserProfile";

const MainNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { currentUser } = useAuth();

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
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node)
      ) {
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

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    ReactGA.event({
      category: "User",
      action: "Toggle Navigation",
      label: "Navigation",
    });
  };

  return (
    <nav className="main-nav">
      <div className="main-header container">
        <div className="nav-logo">
          <Link href="/">
            <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
              <text
                x="100"
                y="35"
                fontFamily="Arial, sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="#333333"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                ABUZZIFY
              </text>
            </svg>
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
                  <Link href="/">Home</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/cryptolytics">Crypto Analytics</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/exchanges">Crypto Exchanges</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/articles">Crypto Articles</Link>
                </div>
                <div className="hdl-4">
                  <Link href="/about">About Us</Link>
                </div>
                <div className="hdl-4 theme-toggle-mobile">
                  <div className="theme-toggle-label">Theme</div>
                  <ThemeToggle />
                </div>
                {currentUser ? (
                  <div className="hdl-4 auth-user-mobile">
                    <button 
                      className="user-button"
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      <div className="user-avatar-small">
                        {currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="Profile" />
                        ) : (
                          <span>{currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <span className="user-name">{currentUser.displayName || 'User'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="hdl-4 auth-buttons-mobile">
                    <button 
                      className="auth-button"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              className="burger-menu" 
              ref={burgerRef} 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="burger-icon">
                {isMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35px"
                    height="35px"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="#464455"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35px"
                    height="35px"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
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
            </button>
          </>
        ) : (
          <div className="desktop nav-items">
            <div className="hdl-4 line-separator">
              <Link href="/">Home</Link>
            </div>
            <div className="hdl-4">
              <Link href="/cryptolytics">Crypto Analytics</Link>
            </div>
            <div className="hdl-4">
              <Link href="/exchanges">Crypto Exchanges</Link>
            </div>
            <div className="hdl-4">
              <Link href="/articles">Crypto Articles</Link>
            </div>
            <div className="hdl-4 left-space">
              <Link href="/about">About Us</Link>
            </div>
            <div className="theme-toggle-container">
              <ThemeToggle />
            </div>
            {currentUser ? (
              <div className="auth-user-desktop">
                <button 
                  className="user-button"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <div className="user-avatar-small">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" />
                    ) : (
                      <span>{currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <span className="user-name">{currentUser.displayName || 'User'}</span>
                </button>
              </div>
            ) : (
              <div className="auth-buttons-desktop">
                <button 
                  className="auth-button"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Authentication Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <UserProfile 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </nav>
  );
};

export default MainNavigation;
