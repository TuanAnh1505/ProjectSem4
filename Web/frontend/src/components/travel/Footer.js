import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-flex">
        <div className="newsletter">
          <h3>SIGN UP FOR OUR NEWSLETTER</h3>
          <p>Receive new travel stories from Vietnam once a month in your inbox.</p>
          <form>
            <input type="email" placeholder="Your email" />
            <button type="submit">SIGN UP</button>
          </form>
        </div>
        <div className="footer-right">
          <h3>FOLLOW US ON</h3>
          <div className="footer-socials">
            <a href="https://www.facebook.com/vietnamtourismboard/" target="_blank" rel="noopener noreferrer">
              <img src="https://ext.same-assets.com/2511696692/1840890354.jpeg" alt="Facebook" />
            </a>
            <a href="https://www.youtube.com/vietnamtourismboard/" target="_blank" rel="noopener noreferrer">
              <img src="https://ext.same-assets.com/2511696692/139189484.jpeg" alt="Youtube" />
            </a>
            <a href="https://www.instagram.com/vietnamtourismboard/" target="_blank" rel="noopener noreferrer">
              <img src="https://ext.same-assets.com/2511696692/1603573033.jpeg" alt="Instagram" />
            </a>
            <a href="https://www.pinterest.com/vietnamtourismboard/" target="_blank" rel="noopener noreferrer">
              <img src="https://ext.same-assets.com/2511696692/978114934.jpeg" alt="Pinterest" />
            </a>
            <a href="https://www.tiktok.com/@vietnamtourismboard?lang=en" target="_blank" rel="noopener noreferrer">
              <img src="https://ext.same-assets.com/2511696692/3436305151.jpeg" alt="TikTok" />
            </a>
          </div>
          <div className="footer-bottom">
            <p className="desc">Welcome to the official website of Viet Nam National Authority of Tourism. Visit our social media pages for more travel inspiration.</p>
            <div className="footer-cert">
              <img src="https://ext.same-assets.com/2511696692/2206523039.png" alt="Chung nhan Tin Nhiem Mang" />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copy">
        <p>© 2016 Official Website Vietnam Tourism</p>
      </div>
    </footer>
  );
};

export default Footer; 