"use client";
import { ReactNode, useEffect } from "react";
import Script from "next/script";
import "./globals.scss";
import "./fonts.scss";
import CustomScrollbar from "../utils/customScrollbar";
import MainNavigation from "./components/MainNavigation/MainNavigation";
import CoinCarouselBar from "./components/CoinCarouselBar/CoinCarouselBar"

export default function RootLayout({ children }: { children: ReactNode }) {

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
        <main>
          {children}
          </main>
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
