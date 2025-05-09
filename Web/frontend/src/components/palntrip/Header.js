import React from 'react';
import '../styles/styles.css';

const Header = () => (
  <header className="main-header">
    <div className="container">
      <img src="../logo.png.png" alt="Vietnam Tourism Logo" className="logo" />
      <nav className="main-nav">
        <ul>
          <li><a href="#">Live fully in Vietnam</a></li>
          <li><a href="#">Places to go</a></li>
          <li><a href="#">Things to do</a></li>
          <li><a href="#">Plan your trip</a></li>
          <li><a href="#">Travel offers</a></li>
          <li><a href="#">Green travel</a></li>
        </ul>
      </nav>
      <div className="header-extra">
        <span className="lang">EN</span>
        <span className="search-icon">🔍</span>
      </div>
    </div>
  </header>
);

export default Header;

