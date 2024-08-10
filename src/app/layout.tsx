import { ReactNode } from "react";
import "./globals.scss";
import "./fonts.scss";
import CustomScrollbar from "../utils/customScrollbar";
import MainNavigation from "./components/MainNavigation/MainNavigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <CustomScrollbar> */}
        <MainNavigation></MainNavigation>
        <main>{children}</main>
        {/* </CustomScrollbar> */}
        {/* Footer */}
        <footer>
          <div className="footer-content">
            <div className="quick-links">
              <h2>Quick Links</h2>
              <ul>
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
              </ul>
            </div>
            <div className="contact-info">
              <h2>Contact Us</h2>
              <p>Email: support@abuzzify.com</p>
              <form>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message"></textarea>
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
