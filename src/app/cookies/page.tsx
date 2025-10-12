import "./cookies.scss";

export default function CookiePolicy() {
  return (
    <div>
      <div className="header">
        <div className="header-title">
          <h1>Cookie Policy</h1>
        </div>
      </div>
      <div className="cookie-policy cp-text container">
        <h4>Last Updated: October 11, 2025</h4>
        <p>
          This Cookie Policy explains how Abuzzify (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and similar tracking technologies when you visit our website. This policy should be read together with our Privacy Policy and Terms of Service.
        </p>

        <h4>1. What Are Cookies?</h4>
        <p>
          Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. Cookies are widely used to make websites work more efficiently, provide a better user experience, and provide information to website owners.
        </p>
        <p>
          Cookies can be &quot;session cookies&quot; (temporary cookies that expire when you close your browser) or &quot;persistent cookies&quot; (cookies that remain on your device until they expire or you delete them).
        </p>

        <h4>2. How We Use Cookies</h4>
        <p>
          We use cookies and similar technologies for the following purposes:
        </p>

        <h5>2.1 Essential Cookies (Strictly Necessary)</h5>
        <p>
          These cookies are necessary for the website to function properly and cannot be disabled in our systems. They are usually set in response to actions you take, such as logging in or filling in forms.
        </p>
        <ul>
          <li><strong>Authentication Cookies:</strong> Remember your login state and keep you signed in as you navigate the platform</li>
          <li><strong>Security Cookies:</strong> Protect your account from unauthorized access and detect suspicious activity</li>
          <li><strong>Session Cookies:</strong> Enable basic website functionality and maintain your session</li>
        </ul>
        <p>
          <strong>Legal Basis:</strong> These cookies are necessary to provide services you have requested (contractual necessity).
        </p>

        <h5>2.2 Functionality Cookies</h5>
        <p>
          These cookies allow us to remember your preferences and provide enhanced features.
        </p>
        <ul>
          <li><strong>Preference Cookies:</strong> Remember your settings such as theme preferences (dark/light mode)</li>
          <li><strong>Language Preferences:</strong> Store your language selection</li>
          <li><strong>User Settings:</strong> Remember customization options you&apos;ve selected</li>
        </ul>

        <h5>2.3 Analytics and Performance Cookies</h5>
        <p>
          These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
        </p>
        <ul>
          <li><strong>Google Analytics:</strong> Track page views, user behavior, and website performance</li>
          <li><strong>Performance Monitoring:</strong> Identify technical issues and improve website speed</li>
          <li><strong>Usage Statistics:</strong> Understand which features are most popular and how users navigate</li>
        </ul>
        <p>
          <strong>Google Analytics specifically collects:</strong>
        </p>
        <ul>
          <li>Pages visited and time spent on each page</li>
          <li>Browser type and version</li>
          <li>Device type (desktop, mobile, tablet)</li>
          <li>Geographic location (country/city level)</li>
          <li>Referral source (how you found our website)</li>
          <li>Click patterns and navigation paths</li>
        </ul>

        <h5>2.4 Advertising Cookies</h5>
        <p>
          These cookies are used to deliver relevant advertisements and track advertising campaign performance.
        </p>
        <ul>
          <li><strong>Google AdSense:</strong> Display personalized advertisements based on your browsing behavior</li>
          <li><strong>Ad Targeting:</strong> Show relevant crypto-related advertisements</li>
          <li><strong>Ad Performance:</strong> Measure the effectiveness of advertising campaigns</li>
        </ul>

        <h4>3. Third-Party Cookies</h4>
        <p>
          In addition to our own cookies, we use cookies from third-party services:
        </p>

        <h5>3.1 Google Services</h5>
        <ul>
          <li><strong>Firebase Authentication:</strong> Manages secure user login and session management</li>
          <li><strong>Google Analytics:</strong> Provides website analytics and insights</li>
          <li><strong>Google Tag Manager:</strong> Manages marketing and analytics tags</li>
          <li><strong>Google AdSense:</strong> Serves targeted advertisements</li>
          <li><strong>Google OAuth:</strong> Enables sign-in with Google functionality</li>
        </ul>
        <p>
          Google&apos;s privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
        </p>

        <h5>3.2 Other Third-Party Services</h5>
        <p>
          We also integrate with external APIs that may set cookies:
        </p>
        <ul>
          <li>NewsAPI.org (cryptocurrency news)</li>
          <li>CoinLore API (market data)</li>
          <li>Football-data.org (sports data)</li>
        </ul>

        <h4>4. Detailed Cookie List</h4>
        <p>
          Below is a list of the main cookies we use:
        </p>

        <table className="cookie-table">
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Purpose</th>
              <th>Type</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>__session</td>
              <td>Authentication and session management</td>
              <td>Essential</td>
              <td>Session / 14 days</td>
            </tr>
            <tr>
              <td>firebase-auth</td>
              <td>Firebase authentication token</td>
              <td>Essential</td>
              <td>1 hour - 1 year</td>
            </tr>
            <tr>
              <td>theme_preference</td>
              <td>Store dark/light mode selection</td>
              <td>Functionality</td>
              <td>1 year</td>
            </tr>
            <tr>
              <td>_ga</td>
              <td>Google Analytics - distinguish users</td>
              <td>Analytics</td>
              <td>2 years</td>
            </tr>
            <tr>
              <td>_ga_*</td>
              <td>Google Analytics - session data</td>
              <td>Analytics</td>
              <td>2 years</td>
            </tr>
            <tr>
              <td>_gid</td>
              <td>Google Analytics - distinguish users</td>
              <td>Analytics</td>
              <td>24 hours</td>
            </tr>
            <tr>
              <td>_gat</td>
              <td>Google Analytics - throttle request rate</td>
              <td>Analytics</td>
              <td>1 minute</td>
            </tr>
            <tr>
              <td>__Secure-1PAPISID</td>
              <td>Google - build profile of interests</td>
              <td>Advertising</td>
              <td>2 years</td>
            </tr>
            <tr>
              <td>__Secure-1PSID</td>
              <td>Google - advertising and analytics</td>
              <td>Advertising</td>
              <td>2 years</td>
            </tr>
            <tr>
              <td>NID</td>
              <td>Google - remember preferences</td>
              <td>Advertising</td>
              <td>6 months</td>
            </tr>
          </tbody>
        </table>

        <h4>5. How to Control and Delete Cookies</h4>
        
        <h5>5.1 Browser Settings</h5>
        <p>
          Most web browsers allow you to control cookies through their settings. You can:
        </p>
        <ul>
          <li>View cookies stored on your device</li>
          <li>Delete cookies (all or selective)</li>
          <li>Block third-party cookies</li>
          <li>Block all cookies from specific websites</li>
          <li>Set your browser to delete cookies when you close it</li>
        </ul>

        <h5>5.2 Browser-Specific Instructions</h5>
        <ul>
          <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
          <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
          <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
        </ul>

        <h5>5.3 Third-Party Opt-Out Tools</h5>
        <ul>
          <li><strong>Google Analytics Opt-out:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
          <li><strong>Google Ad Settings:</strong> Manage your ad personalization at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a></li>
          <li><strong>Network Advertising Initiative:</strong> <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a></li>
          <li><strong>Digital Advertising Alliance:</strong> <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a></li>
        </ul>

        <h5>5.4 Impact of Disabling Cookies</h5>
        <p>
          Please note that if you disable or refuse cookies:
        </p>
        <ul>
          <li><strong>Essential cookies:</strong> You may not be able to log in or use key features of the platform</li>
          <li><strong>Functionality cookies:</strong> Your preferences and settings will not be saved</li>
          <li><strong>Analytics cookies:</strong> We won&apos;t be able to improve our services based on usage data</li>
          <li><strong>Advertising cookies:</strong> Ads will still appear but may be less relevant to you</li>
        </ul>

        <h4>6. Do Not Track Signals</h4>
        <p>
          Some browsers support &quot;Do Not Track&quot; (DNT) signals. Currently, there is no universal standard for how websites should respond to DNT signals. We do not alter our data collection and use practices in response to DNT signals at this time. However, you can control cookies through your browser settings as described above.
        </p>

        <h4>7. Mobile Device Identifiers</h4>
        <p>
          When you access our platform through mobile devices, we may collect mobile device identifiers and similar technologies. You can control this through your device settings:
        </p>
        <ul>
          <li><strong>iOS:</strong> Settings → Privacy → Tracking → Allow Apps to Request to Track</li>
          <li><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
        </ul>

        <h4>8. Cookie Consent and Management</h4>
        <p>
          By using our website and accepting cookies, you consent to our use of cookies as described in this policy. We use Google's certified Consent Management Platform (CMP) to provide you with transparent and easy-to-use consent controls.
        </p>
        
        <h5>8.1 Consent Banner</h5>
        <p>
          When you first visit our website, you will see a consent banner powered by Google's CMP that provides you with three clear options:
        </p>
        <ul>
          <li><strong>Consent:</strong> Accept all cookies for optimal website functionality and personalized experience</li>
          <li><strong>Do not consent:</strong> Reject non-essential cookies while maintaining basic website functionality</li>
          <li><strong>Manage options:</strong> Customize your cookie preferences by category (Essential, Analytics, Advertising, Functionality)</li>
        </ul>
        
        <h5>8.2 Consent Management</h5>
        <p>
          You can change your cookie preferences at any time by:
        </p>
        <ul>
          <li>Clicking on the "Manage options" button in the consent banner</li>
          <li>Accessing cookie settings through our website footer</li>
          <li>Using the "Manage Cookie Preferences" link in our privacy policy</li>
        </ul>
        
        <h5>8.3 Essential Cookies</h5>
        <p>
          Essential cookies will be set regardless of your choice to ensure basic website functionality, including:
        </p>
        <ul>
          <li>User authentication and session management</li>
          <li>Security and fraud prevention</li>
          <li>Basic website navigation and functionality</li>
        </ul>

        <h4>9. Google Consent Management Platform (CMP)</h4>
        <p>
          We have implemented Google's certified Consent Management Platform to ensure compliance with privacy regulations and provide you with better control over your data. This CMP:
        </p>
        <ul>
          <li><strong>Ensures Compliance:</strong> Meets GDPR, CCPA, and other privacy regulation requirements</li>
          <li><strong>Protects Ad Revenue:</strong> Helps maintain Google AdSense revenue by ensuring proper consent collection</li>
          <li><strong>Provides Transparency:</strong> Clear information about what cookies are used and why</li>
          <li><strong>Enables Control:</strong> Easy-to-use interface for managing your preferences</li>
          <li><strong>Automatic Updates:</strong> Stays current with changing privacy laws and Google requirements</li>
        </ul>
        <p>
          For more information about Google's CMP, visit: <a href="https://support.google.com/adsense/answer/10100331" target="_blank" rel="noopener noreferrer">Google AdSense Consent Management</a>
        </p>

        <h4>10. Changes to This Cookie Policy</h4>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our cookie practices. When we make significant changes, we will:
        </p>
        <ul>
          <li>Update the &quot;Last Updated&quot; date at the top of this policy</li>
          <li>Notify users through a banner or notification on the website</li>
          <li>Request renewed consent where required by law</li>
        </ul>
        <p>
          We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
        </p>

        <h4>11. Legal Basis for Processing (GDPR)</h4>
        <p>
          For users in the European Economic Area (EEA), our legal basis for using cookies includes:
        </p>
        <ul>
          <li><strong>Consent:</strong> For analytics and advertising cookies, we rely on your explicit consent</li>
          <li><strong>Legitimate Interest:</strong> For functionality cookies that enhance user experience</li>
          <li><strong>Contractual Necessity:</strong> For essential cookies required to provide our services</li>
        </ul>
        <p>
          You have the right to withdraw your consent at any time by adjusting your cookie settings or contacting us.
        </p>

        <h4>12. Contact Us</h4>
        <p>
          If you have questions about our use of cookies or this Cookie Policy, please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> armandohysaj7@gmail.com</li>
          <li><strong>Website:</strong> <a href="https://abuzzify.com/contact">https://abuzzify.com/contact</a></li>
        </ul>
        <p>
          For more information about how we handle your personal data, please review our <a href="/privacy">Privacy Policy</a>.
        </p>

        <h4>13. Additional Resources</h4>
        <p>
          To learn more about cookies and online privacy:
        </p>
        <ul>
          <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
          <li><a href="https://ico.org.uk/for-the-public/online/cookies/" target="_blank" rel="noopener noreferrer">UK ICO - Cookies</a></li>
          <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
        </ul>

        <p className="policy-footer">
          <strong>This Cookie Policy is effective as of the date listed above.</strong>
        </p>
      </div>
    </div>
  );
}

