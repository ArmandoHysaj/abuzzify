import { ReactNode } from "react";
import "./globals.scss";
import "./fonts.scss";
import CustomScrollbar from "../utils/customScrollbar";
import MainNavigation from "./components/MainNavigation/MainNavigation";
import ClientSessionProvider from "../app/components/ClientSessionProvider";

export default function RootLayout({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body>
        {/* <CustomScrollbar> */}
        <MainNavigation></MainNavigation>
        <ClientSessionProvider session={session}>
          {children}
        </ClientSessionProvider>
        {/* </CustomScrollbar> */}
      </body>
    </html>
  );
}
