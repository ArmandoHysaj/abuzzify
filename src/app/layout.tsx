import { ReactNode } from "react";
import "./globals.scss";
import "./fonts.scss";
import CustomScrollbar from "../utils/customScrollbar";
import MainNavigation from "./components/MainNavigation/MainNavigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomScrollbar>
          <MainNavigation></MainNavigation>
          <main>{children}</main>
        </CustomScrollbar>
      </body>
    </html>
  );
}
