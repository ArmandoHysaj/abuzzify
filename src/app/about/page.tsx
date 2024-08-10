import "../about/about.scss";

// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <div className="header">
        <div className="header-title">
          <h1>About Page</h1>
        </div>
      </div>
      <div className="about-page cp-text container">
        <span className="cp-text--medium">About Us</span> Welcome to Abuziffy,
        your one-stop platform for cryptocurrency analysis, calculations, and
        news. Our mission is to empower crypto enthusiasts and investors with
        the tools and information they need to make informed decisions. Whether
        you&apos;re a seasoned trader or just starting, our platform provides
        comprehensive data on various cryptocurrencies, allows you to track your
        investments, and helps you stay updated with the latest news in the
        crypto world. <span className="cp-text--medium"> Our Vision </span>We
        aim to simplify the complex world of cryptocurrencies and make it
        accessible to everyone. We believe in the power of blockchain technology
        and are dedicated to helping our users navigate this evolving landscape
        with confidence. What We Offer Crypto Calculator: Calculate your profit
        or loss by entering the amount you invested in a particular
        cryptocurrency. Coin Tracking: Save and monitor your favorite coins, and
        check their performance over time. Similar Coins: Discover
        cryptocurrencies similar to the ones you&apos;re interested in. Crypto
        News: Stay informed with the latest news and trends in the
        cryptocurrency market. Our Team Our team is composed of cryptocurrency
        experts, developers, and enthusiasts who are passionate about providing
        a reliable and user-friendly platform for all your crypto needs.
      </div>
    </div>
  );
}
