// src/components/Header.js
import React from 'react';

function Header() {
  return (
    <header>
      <div className="container header-inner">
        <a href="#" className="logo">
          <img
            src="https://ext.same-assets.com/341254039/2206523039.png"
            alt="Vietnam Tourism Logo"
          />
        </a>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Live fully in Vietnam</a></li>
            <li><a href="#">Places to go</a></li>
            <li><a href="#" className="active">Things to do</a></li>
            <li><a href="#">Plan your trip</a></li>
            <li><a href="#">Travel offers</a></li>
            <li><a href="#">Green travel</a></li>
            <li><a href="#">EN</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
