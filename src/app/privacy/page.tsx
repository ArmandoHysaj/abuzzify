import "../privacy/privacy.scss";

export default function Privacy() {
  return (
    <div>
      <div className="header">
        <div className="header-title">
          <h1>Privacy Policy</h1>
        </div>
      </div>
      <div className="privacy-policy cp-text container">
        <h4>Last Updated: October 11, 2025</h4>
        <p>
          Welcome to Abuzzify (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to protecting your privacy and being transparent about how we collect, use, store, and protect your personal information. This Privacy Policy explains our data practices and your rights regarding your personal data.
        </p>
        <p>
          By using Abuzzify, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
        </p>

        <h4>1. Information We Collect</h4>
        
        <h5>1.1 Information You Provide Directly</h5>
        <p>When you create an account or use our services, we collect:</p>
        <ul>
          <li><strong>Account Information:</strong> Email address, display name, password (encrypted)</li>
          <li><strong>Investment Tracking Data:</strong> Self-reported cryptocurrency investment information you manually enter for tracking purposes (investment amounts, purchase dates, and portfolio calculations). <em>Note: No actual financial transactions occur on our platform. You are simply tracking investments you made elsewhere.</em></li>
          <li><strong>Price Alert Preferences:</strong> Alert thresholds, notification preferences, and coin selections</li>
          <li><strong>Profile Information:</strong> Any additional information you choose to provide</li>
        </ul>

        <h5>1.2 Information Collected Automatically</h5>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, interaction patterns</li>
          <li><strong>Device Information:</strong> Browser type, operating system, IP address, device identifiers</li>
          <li><strong>Cookies and Similar Technologies:</strong> Session cookies, authentication tokens, preference settings</li>
          <li><strong>Analytics Data:</strong> User behavior, feature usage, and performance metrics via Google Analytics</li>
        </ul>

        <h5>1.3 Information from Third Parties</h5>
        <ul>
          <li><strong>Google OAuth:</strong> If you sign in with Google, we receive your name, email address, and profile information</li>
          <li><strong>Social Media:</strong> Information from social media platforms if you choose to connect them</li>
        </ul>

        <h4>2. How We Use Your Information</h4>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li><strong>Service Delivery:</strong> To provide, maintain, and improve our cryptocurrency analytics and tracking platform</li>
          <li><strong>Account Management:</strong> To create and manage your account, authenticate users, and provide customer support</li>
          <li><strong>Portfolio Tracking:</strong> To store your self-reported investment data, calculate portfolio metrics, and display performance analytics for investments you track. <em>We do not process, facilitate, or execute any financial transactions.</em></li>
          <li><strong>Price Alerts:</strong> To monitor cryptocurrency prices and send notifications when your alert conditions are met</li>
          <li><strong>Communication:</strong> To send service-related emails, password reset instructions, and important updates</li>
          <li><strong>Analytics and Improvement:</strong> To analyze usage patterns, improve user experience, and develop new features</li>
          <li><strong>Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems</li>
          <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
        </ul>

        <h4>3. Data Storage and Security</h4>
        
        <h5>3.1 Where We Store Your Data</h5>
        <p>
          Your data is securely stored using Firebase Cloud Firestore, a Google Cloud Platform service. Firebase infrastructure is distributed across multiple regions with enterprise-grade security measures. Your data may be stored in data centers located in the United States and other jurisdictions where Firebase operates.
        </p>

        <h5>3.2 Security Measures</h5>
        <p>We implement industry-standard security measures to protect your data:</p>
        <ul>
          <li><strong>Encryption:</strong> All data is encrypted in transit using SSL/TLS and at rest using Firebase&apos;s encryption</li>
          <li><strong>Authentication:</strong> Secure password hashing and Firebase Authentication</li>
          <li><strong>Access Controls:</strong> Strict access controls and security rules on our database</li>
          <li><strong>Session Management:</strong> Secure session cookies with proper expiration and security flags</li>
          <li><strong>Regular Security Audits:</strong> Ongoing security assessments and updates</li>
        </ul>
        <p>
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
        </p>

        <h4>4. Third-Party Services</h4>
        <p>We use the following third-party services that may collect and process your data:</p>
        
        <h5>4.1 Authentication and Database</h5>
        <ul>
          <li><strong>Firebase (Google):</strong> Authentication, database, and hosting services</li>
          <li><strong>Google OAuth:</strong> Optional social login functionality</li>
        </ul>

        <h5>4.2 Analytics and Advertising</h5>
        <ul>
          <li><strong>Google Analytics:</strong> Website analytics and user behavior tracking</li>
          <li><strong>Google Tag Manager:</strong> Tag and analytics management</li>
          <li><strong>Google AdSense:</strong> Advertising services</li>
        </ul>

        <h5>4.3 Data Sources</h5>
        <ul>
          <li><strong>NewsAPI.org:</strong> Cryptocurrency news content</li>
          <li><strong>CoinLore API:</strong> Cryptocurrency price and market data</li>
          <li><strong>Football-data.org:</strong> Sports data and scores</li>
        </ul>
        
        <p>
          These third-party services have their own privacy policies. We encourage you to review their privacy practices:
        </p>
        <ul>
          <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase Privacy</a></li>
          <li><a href="https://newsapi.org/privacy" target="_blank" rel="noopener noreferrer">NewsAPI Privacy</a></li>
        </ul>

        <h4>5. Cookies and Tracking Technologies</h4>
        <p>We use cookies and similar tracking technologies to enhance your experience:</p>
        
        <h5>5.1 Essential Cookies</h5>
        <ul>
          <li><strong>Session Cookies:</strong> Required for authentication and maintaining your logged-in state</li>
          <li><strong>Security Cookies:</strong> Used to detect authentication abuse and protect user accounts</li>
        </ul>

        <h5>5.2 Analytics Cookies</h5>
        <ul>
          <li><strong>Google Analytics:</strong> Track usage patterns, page views, and user interactions</li>
        </ul>

        <h5>5.3 Advertising Cookies</h5>
        <ul>
          <li><strong>Google AdSense:</strong> Deliver relevant advertisements</li>
        </ul>

        <h5>5.4 Managing Cookies</h5>
        <p>
          You can control cookies through our cookie preferences page or your browser settings. We use Google's certified Consent Management Platform (CMP) to provide you with easy-to-use consent controls. However, disabling essential cookies may affect the functionality of our services.
        </p>
        <p>
          <strong>Cookie Preferences:</strong> You can manage your cookie preferences at any time by visiting our{' '}
          <a href="/cookie-preferences" target="_blank" rel="noopener noreferrer">
            Cookie Preferences page
          </a>{' '}
          or clicking the "Manage options" button in our consent banner.
        </p>
        <p>
          <strong>Browser Settings:</strong> Most browsers also allow you to:
        </p>
        <ul>
          <li>View and delete cookies</li>
          <li>Block third-party cookies</li>
          <li>Block all cookies</li>
          <li>Delete all cookies when closing the browser</li>
        </ul>
        <p>
          For detailed information about our cookie practices, please review our{' '}
          <a href="/cookies" target="_blank" rel="noopener noreferrer">
            Cookie Policy
          </a>.
        </p>

        <h4>6. Data Sharing and Disclosure</h4>
        <p>We do not sell your personal information. We may share your data only in the following circumstances:</p>
        <ul>
          <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
          <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform (e.g., Firebase, Google Cloud)</li>
          <li><strong>Legal Requirements:</strong> When required by law, legal process, or governmental request</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>Protection of Rights:</strong> To protect our rights, property, safety, or that of our users</li>
        </ul>

        <h4>7. Your Rights and Choices</h4>
        <p>Depending on your location, you may have the following rights:</p>
        
        <h5>7.1 Access and Portability</h5>
        <ul>
          <li>Request access to your personal data</li>
          <li>Receive a copy of your data in a portable format</li>
        </ul>

        <h5>7.2 Correction and Deletion</h5>
        <ul>
          <li>Update or correct inaccurate information</li>
          <li>Request deletion of your account and associated data</li>
        </ul>

        <h5>7.3 Opt-Out Rights</h5>
        <ul>
          <li>Disable email notifications in your account settings</li>
          <li>Opt out of marketing communications</li>
          <li>Disable price alerts</li>
        </ul>

        <h5>7.4 California Privacy Rights (CCPA)</h5>
        <p>If you are a California resident, you have additional rights:</p>
        <ul>
          <li>Right to know what personal information is collected</li>
          <li>Right to know if personal information is sold or disclosed</li>
          <li>Right to opt-out of the sale of personal information</li>
          <li>Right to deletion of personal information</li>
          <li>Right to non-discrimination for exercising CCPA rights</li>
        </ul>

        <h5>7.5 European Privacy Rights (GDPR)</h5>
        <p>If you are in the European Economic Area (EEA), you have rights under GDPR:</p>
        <ul>
          <li>Right to access, rectification, and erasure</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
          <li>Right to withdraw consent</li>
          <li>Right to lodge a complaint with a supervisory authority</li>
        </ul>

        <h5>7.6 Exercising Your Rights</h5>
        <p>
          To exercise any of these rights, please contact us at <strong>armandohysaj7@gmail.com</strong>. We will respond to your request within 30 days. You may be required to verify your identity before we process your request.
        </p>

        <h4>8. Data Retention</h4>
        <p>
          We retain your personal information for as long as your account is active or as needed to provide services. Specific retention periods:
        </p>
        <ul>
          <li><strong>Account Data:</strong> Retained until you delete your account</li>
          <li><strong>Investment Data:</strong> Retained until you delete specific investments or your account</li>
          <li><strong>Price Alerts:</strong> Retained until you delete them or your account</li>
          <li><strong>Log Data:</strong> Typically retained for 12-24 months</li>
          <li><strong>Backup Data:</strong> May be retained for up to 60 days after deletion</li>
        </ul>
        <p>
          After account deletion, some information may remain in backups and archives for a limited period but will not be accessible or used for any purpose.
        </p>

        <h4>9. International Data Transfers</h4>
        <p>
          Your information may be transferred to and maintained on servers located outside your country of residence. By using our services, you consent to the transfer of your information to the United States and other countries where Firebase operates. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
        </p>

        <h4>10. Children&apos;s Privacy</h4>
        <p>
          Our services are not intended for children under 13 years of age (or 16 in the EEA). We do not knowingly collect personal information from children. If we discover that a child under 13 has provided us with personal information, we will promptly delete it from our systems. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
        </p>

        <h4>11. Financial Disclaimer and Data Accuracy</h4>
        <p>
          <strong>Abuzzify is a cryptocurrency tracking and analytics tool only. We do not facilitate, process, or execute any financial transactions, purchases, or sales of cryptocurrencies.</strong> While we strive to provide accurate cryptocurrency market data through third-party APIs, we do not guarantee the accuracy, completeness, or timeliness of any financial information. Investment calculations are for informational purposes only and should not be considered financial advice. We are not responsible for any investment decisions you make based on data provided through our platform. All investment data stored on our platform is self-reported by users for tracking purposes only.
        </p>

        <h4>12. Changes to This Privacy Policy</h4>
        <p>
          We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of significant changes by:
        </p>
        <ul>
          <li>Posting the updated policy on this page</li>
          <li>Updating the &quot;Last Updated&quot; date</li>
          <li>Sending an email notification for material changes (if you have an account)</li>
        </ul>
        <p>
          Your continued use of our services after changes are posted constitutes your acceptance of the updated Privacy Policy. We encourage you to review this policy periodically.
        </p>

        <h4>13. Contact Information</h4>
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> armandohysaj7@gmail.com</li>
          <li><strong>Website:</strong> <a href="https://abuzzify.com/contact">https://abuzzify.com/contact</a></li>
        </ul>
        <p>
          We will respond to all legitimate requests within 30 days. For GDPR-related inquiries, please clearly indicate your location and the specific rights you wish to exercise.
        </p>

        <h4>14. Legal Basis for Processing (GDPR)</h4>
        <p>If you are in the EEA, our legal basis for collecting and processing your personal information includes:</p>
        <ul>
          <li><strong>Consent:</strong> You have given explicit consent for specific processing purposes</li>
          <li><strong>Contract:</strong> Processing is necessary to fulfill our contract with you (providing services)</li>
          <li><strong>Legal Obligation:</strong> We must process your data to comply with legal requirements</li>
          <li><strong>Legitimate Interests:</strong> Processing is in our legitimate business interests (e.g., fraud prevention, security)</li>
        </ul>

        <h4>15. Do Not Track Signals</h4>
        <p>
          Some browsers support &quot;Do Not Track&quot; (DNT) signals. Currently, there is no industry standard for DNT implementation. Our platform does not specifically respond to DNT signals, but you can control tracking through cookie settings and browser preferences.
        </p>

        <p className="policy-footer">
          <strong>This Privacy Policy is effective as of the date listed above and governs our collection and use of your personal information.</strong>
        </p>
      </div>
    </div>
  );
}
