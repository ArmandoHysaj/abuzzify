"use client";

import { ReactNode, useEffect } from "react";
import Script from "next/script";
import ReactGA from "react-ga4";
import { usePathname } from "next/navigation";
import "./globals.scss";
import "./fonts.scss";
import MainNavigation from "./components/MainNavigation/MainNavigation";

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
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body>
        <MainNavigation />
        <main>{children}</main>
        <footer>
          <div className="footer-content">
            <div className="quick-links">
              <ul>
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
                <li>
                  <a href="/contact">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
