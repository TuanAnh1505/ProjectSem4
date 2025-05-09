import React from 'react';

const Footer = () => (
  <footer className="footer-main">
    <div className="footer-container">
      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="newsletter-title">SIGN UP FOR<br />OUR NEWSLETTER</div>
        <div className="newsletter-desc">
          Receive new travel stories<br />
          from Vietnam<br />
          once a month in your inbox.
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Your email" required />
          <button type="submit">SIGN UP</button>
        </form>
      </div>
      {/* Social & Logo */}
      <div className="footer-social-block">
        <div className="footer-follow-title">FOLLOW US ON</div>
        <div className="footer-socials">
          {['1840890354', '139189484', '1603573033', '978114934', '3436305151'].map((id, idx) => (
            <a key={idx} href="#">
              <img src={`https://ext.same-assets.com/341254039/${id}.jpeg`} alt="Social Icon" />
            </a>
          ))}
        </div>
        <div className="footer-social-row">
          <div className="footer-about">
            Welcome to the official website of Viet Nam National Authority of Tourism.<br />
            Visit our social media pages for more travel inspiration.
          </div>
          <img
            src="https://ext.same-assets.com/341254039/2206523039.png"
            alt="Vietnam Tourism"
            className="footer-logo"
          />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;