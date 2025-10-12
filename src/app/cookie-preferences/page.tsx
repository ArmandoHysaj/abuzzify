"use client";

import { useEffect, useState } from "react";
import "./cookie-preferences.scss";

export default function CookiePreferences() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functionality: false,
    analytics: false,
    advertising: false,
  });

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPrefs = localStorage.getItem('cookiePreferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPreferences(prev => ({
          ...prev,
          ...parsed,
          essential: true, // Always keep essential cookies enabled
        }));
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const handlePreferenceChange = (category: keyof typeof preferences, value: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    const newPreferences = { ...preferences, [category]: value };
    setPreferences(newPreferences);
    localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences));
    
    // Trigger Google CMP update if available
    if (typeof window !== 'undefined' && (window as any).google_cmp) {
      (window as any).google_cmp.updateConsent();
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    // Show success message
    alert('Cookie preferences saved successfully!');
    
    // Redirect to home page
    window.location.href = '/';
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functionality: true,
      analytics: true,
      advertising: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    
    // Trigger Google CMP update if available
    if (typeof window !== 'undefined' && (window as any).google_cmp) {
      (window as any).google_cmp.acceptAll();
    }
    
    alert('All cookies accepted!');
    window.location.href = '/';
  };

  const handleRejectAll = () => {
    const rejected = {
      essential: true, // Essential cookies remain enabled
      functionality: false,
      analytics: false,
      advertising: false,
    };
    setPreferences(rejected);
    localStorage.setItem('cookiePreferences', JSON.stringify(rejected));
    
    // Trigger Google CMP update if available
    if (typeof window !== 'undefined' && (window as any).google_cmp) {
      (window as any).google_cmp.rejectAll();
    }
    
    alert('Non-essential cookies rejected!');
    window.location.href = '/';
  };

  return (
    <div className="cookie-preferences-page">
      <div className="header">
        <div className="header-title">
          <h1>Cookie Preferences</h1>
          <p>Manage your cookie settings and privacy preferences</p>
        </div>
      </div>

      <div className="cookie-preferences-content container">
        <div className="preferences-intro">
          <p>
            We use cookies to enhance your browsing experience, serve personalized content, 
            and analyze our traffic. You can customize your cookie preferences below.
          </p>
          <p>
            <strong>Note:</strong> Essential cookies are required for the website to function 
            properly and cannot be disabled.
          </p>
        </div>

        <div className="cookie-categories">
          <div className="cookie-category essential">
            <div className="category-header">
              <h3>Essential Cookies</h3>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="essential"
                  checked={preferences.essential}
                  disabled
                  className="toggle-input"
                />
                <label htmlFor="essential" className="toggle-label disabled">
                  Always Active
                </label>
              </div>
            </div>
            <p className="category-description">
              These cookies are necessary for the website to function and cannot be switched off. 
              They are usually only set in response to actions made by you which amount to a request 
              for services, such as setting your privacy preferences, logging in or filling in forms.
            </p>
            <ul>
              <li>User authentication and session management</li>
              <li>Security and fraud prevention</li>
              <li>Basic website functionality</li>
              <li>Remember your login state</li>
            </ul>
          </div>

          <div className="cookie-category">
            <div className="category-header">
              <h3>Functionality Cookies</h3>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="functionality"
                  checked={preferences.functionality}
                  onChange={(e) => handlePreferenceChange('functionality', e.target.checked)}
                  className="toggle-input"
                />
                <label htmlFor="functionality" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="category-description">
              These cookies enable enhanced functionality and personalization, such as videos 
              and live chats. They may be set by us or by third party providers whose services 
              we have added to our pages.
            </p>
            <ul>
              <li>Theme preferences (dark/light mode)</li>
              <li>Language settings</li>
              <li>User interface customizations</li>
              <li>Price alert preferences</li>
            </ul>
          </div>

          <div className="cookie-category">
            <div className="category-header">
              <h3>Analytics Cookies</h3>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={preferences.analytics}
                  onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                  className="toggle-input"
                />
                <label htmlFor="analytics" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="category-description">
              These cookies allow us to count visits and traffic sources so we can measure 
              and improve the performance of our site. They help us to know which pages are 
              the most and least popular and see how visitors move around the site.
            </p>
            <ul>
              <li>Google Analytics tracking</li>
              <li>Page view statistics</li>
              <li>User behavior analysis</li>
              <li>Website performance monitoring</li>
            </ul>
          </div>

          <div className="cookie-category">
            <div className="category-header">
              <h3>Advertising Cookies</h3>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="advertising"
                  checked={preferences.advertising}
                  onChange={(e) => handlePreferenceChange('advertising', e.target.checked)}
                  className="toggle-input"
                />
                <label htmlFor="advertising" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="category-description">
              These cookies may be set through our site by our advertising partners to build 
              a profile of your interests and show you relevant adverts on other sites. They 
              do not store directly personal information, but are based on uniquely identifying 
              your browser and internet device.
            </p>
            <ul>
              <li>Google AdSense personalized ads</li>
              <li>Ad targeting and optimization</li>
              <li>Campaign performance tracking</li>
              <li>Cross-site advertising</li>
            </ul>
          </div>
        </div>

        <div className="preferences-actions">
          <div className="action-buttons">
            <button 
              onClick={handleRejectAll}
              className="btn btn-outline"
              type="button"
            >
              Reject All
            </button>
            <button 
              onClick={handleSavePreferences}
              className="btn btn-primary"
              type="button"
            >
              Save Preferences
            </button>
            <button 
              onClick={handleAcceptAll}
              className="btn btn-success"
              type="button"
            >
              Accept All
            </button>
          </div>
        </div>

        <div className="preferences-info">
          <p>
            <strong>Need more information?</strong> Read our full{' '}
            <a href="/cookies" target="_blank" rel="noopener noreferrer">
              Cookie Policy
            </a>{' '}
            or{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>.
          </p>
          <p>
            You can change these settings at any time by visiting this page again.
          </p>
        </div>
      </div>
    </div>
  );
}
