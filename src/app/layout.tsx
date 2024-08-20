"use client";
import { ReactNode } from "react";
import Script from "next/script";
import "./globals.scss";
import "./fonts.scss";
import CustomScrollbar from "../utils/customScrollbar";
import MainNavigation from "./components/MainNavigation/MainNavigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  // const handlePrivacySettings = () => {
  //   if (window.googlefc?.showRevocationMessage) {
  //     window.googlefc.showRevocationMessage();
  //   } else {
  //     console.warn("GoogleFC or showRevocationMessage is not available.");
  //   }
  // };

  return (
    <html lang="en">
      <head>
        {/* Google AdSense script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6603814119164780"
          strategy="afterInteractive"
        />
        {/* Google Privacy & Messaging script */}
        {/* <Script
          id="googlefc-script"
          dangerouslySetInnerHTML={{
            __html: `
              window.googlefc = window.googlefc || {};
              window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
              window.googlefc.controlledMessagingFunction = async (message) => {
                // Example logic for controlled messaging
                const isSubscriber = await new Promise(resolve => setTimeout(() => resolve(false), 1000));
                if (isSubscriber) {
                  message.proceed(false);
                } else {
                  message.proceed(true);
                }
              };
              window.googlefc.showRevocationMessage = () => {
                // Example implementation
                console.log("Revocation message shown.");
              };
            `,
          }}
          strategy="afterInteractive"
        /> */}
      </head>
      <body>
        {/* <CustomScrollbar> */}
        <MainNavigation />
        <main>{children}</main>
        {/* </CustomScrollbar> */}
        {/* Footer */}
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
                {/* <li><a href="#" onClick={handlePrivacySettings}>Privacy and cookie settings</a></li> */}
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
