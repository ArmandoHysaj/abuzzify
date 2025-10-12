"use client";

import { ReactNode, useEffect } from "react";
import Script from "next/script";
import ReactGA from "react-ga4";
import { usePathname } from "next/navigation";
import "./globals.scss";
import "./fonts.scss";
import MainNavigation from "./components/MainNavigation/MainNavigation";
import GoToTopButton from "./components/GoToTopButton/GoToTopButton";
import { gtmConfig } from "./config";
import { GoogleTagManager } from "@next/third-parties/google";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (GA_TRACKING_ID) {
      // Initialize ReactGA
      ReactGA.initialize(GA_TRACKING_ID);
    }
  }, []);

  useEffect(() => {
    if (GA_TRACKING_ID) {
      // Track page views on pathname changes
      ReactGA.send({ hitType: "pageview", page: pathname });
    }
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <title>ABUZZIFY - Your Crypto Analytics Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Abuzzify - Your Ultimate Crypto Analytics Hub. Track cryptocurrency prices, read latest news, and analyze market trends." />
        <meta name="keywords" content="cryptocurrency, crypto, bitcoin, ethereum, trading, analytics, news" />
        <meta name="author" content="Abuzzify" />
        <link rel="canonical" href="https://abuzzify.com" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          strategy="afterInteractive"
        />
      </head>
        {gtmConfig.containerId && (
          <GoogleTagManager gtmId={gtmConfig.containerId} />
        )}
        <body>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <ThemeProvider>
            <AuthProvider>
              <MainNavigation />
              <main id="main-content">{children}</main>
              <footer role="contentinfo">
                <div className="footer-content">
                  <div className="quick-links">
                    <ul>
                      <li>
                        <a href="/about" aria-label="Learn more about Abuzzify">About Us</a>
                      </li>
                      <li>
                        <a href="/privacy" aria-label="Read our privacy policy">Privacy Policy</a>
                      </li>
                      <li>
                        <a href="/terms" aria-label="Read our terms of service">Terms of Service</a>
                      </li>
                      <li>
                        <a href="/cookies" aria-label="Read our cookie policy">Cookie Policy</a>
                      </li>
                      <li>
                        <a href="/disclaimer" aria-label="Read our disclaimer">Disclaimer</a>
                      </li>
                      <li>
                        <a href="/contact" aria-label="Contact us for support">Contact Us</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </footer>
              <GoToTopButton />
            </AuthProvider>
          </ThemeProvider>
        </body>
    </html>
  );
}
