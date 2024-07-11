"use client";

import { ReactNode } from "react";
import Link from "next/link";
import "./globals.scss";
import "./fonts.scss";
import CustomScrollbar from "../utils/customScrollbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomScrollbar>
          <nav className="main-nav">
            <div className="main-header container">
              <div className="hdl-4 line-separator">
                <Link href="/">Abuzzy Home</Link>
              </div>
              <div className="hdl-4">
                <Link href="/Buzzylytics">Buzzylytics</Link>
              </div>
              <div className="hdl-4">
                <Link href="/Buzzeting">Buzzeting</Link>
              </div>
              <div className="hdl-4 left-space">
                <Link href="/AbuzzyAbout">Abuzzy About</Link>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </CustomScrollbar>
      </body>
    </html>
  );
}
