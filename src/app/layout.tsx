"use client";

import { ReactNode, useEffect } from "react";
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
        {/* Primary Meta Tags */}
        <title>ABUZZIFY - Your Crypto Analytics Hub</title>
        <meta name="title" content="ABUZZIFY - Your Crypto Analytics Hub" />
        <meta 
          name="description" 
          content="Abuzzify - Your Ultimate Crypto Analytics Hub. Track cryptocurrency prices, read latest news, analyze market trends, and manage your crypto portfolio with real-time data and insights." 
        />
        <meta 
          name="keywords" 
          content="cryptocurrency, crypto, bitcoin, ethereum, trading, analytics, news, portfolio, market trends, blockchain, DeFi, altcoins, investment tracking, crypto prices, trading signals" 
        />
        <meta name="author" content="Abuzzify" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://abuzzify.com/" />
        <meta property="og:title" content="ABUZZIFY - Your Crypto Analytics Hub" />
        <meta property="og:description" content="Your Ultimate Crypto Analytics Hub. Track cryptocurrency prices, read latest news, analyze market trends, and manage your crypto portfolio with real-time data and insights." />
        <meta property="og:image" content="https://abuzzify.com/images/Abuzzify.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Abuzzify" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://abuzzify.com/" />
        <meta property="twitter:title" content="ABUZZIFY - Your Crypto Analytics Hub" />
        <meta property="twitter:description" content="Your Ultimate Crypto Analytics Hub. Track cryptocurrency prices, read latest news, analyze market trends, and manage your crypto portfolio with real-time data and insights." />
        <meta property="twitter:image" content="https://abuzzify.com/images/Abuzzify.png" />
        <meta property="twitter:creator" content="@abuzzify" />
        
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#007bff" />
        <meta name="msapplication-TileColor" content="#007bff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Abuzzify" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://abuzzify.com" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Google AdSense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Abuzzify",
              "url": "https://abuzzify.com",
              "description": "Your Ultimate Crypto Analytics Hub. Track cryptocurrency prices, read latest news, analyze market trends, and manage your crypto portfolio with real-time data and insights.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://abuzzify.com/cryptolytics/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Abuzzify",
                "url": "https://abuzzify.com"
              }
            })
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager */}
        {gtmConfig.containerId && (
          <GoogleTagManager gtmId={gtmConfig.containerId} />
        )}
        
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <ThemeProvider>
          <AuthProvider>
            <MainNavigation />
            <main id="main-content">{children}</main>
            
            <footer role="contentinfo">
              <div className="footer-content">
                <div className="quick-links">
                  <ul>
                    <li>
                      <a href="/about" aria-label="Learn more about Abuzzify">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="/privacy" aria-label="Read our privacy policy">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="/terms" aria-label="Read our terms of service">
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a href="/cookies" aria-label="Read our cookie policy">
                        Cookie Policy
                      </a>
                    </li>
                    <li>
                      <a href="/cookie-preferences" aria-label="Manage your cookie preferences">
                        Cookie Preferences
                      </a>
                    </li>
                    <li>
                      <a href="/disclaimer" aria-label="Read our disclaimer">
                        Disclaimer
                      </a>
                    </li>
                    <li>
                      <a href="/contact" aria-label="Contact us for support">
                        Contact Us
                      </a>
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