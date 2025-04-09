import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="https://via.placeholder.com/100x40?text=VIETNAM" alt="Vietnam Logo" />
      </div>
      <nav className="nav">
        <ul>
          <li><a href="#live">Live fully in Vietnam</a></li>
          <li><a href="#places">Places to go</a></li>
          <li><a href="#things">Things to do</a></li>
          <li><a href="#plan">Plan your trip</a></li>
          <li><a href="#travel">Travel updates</a></li>
        </ul>
      </nav>
      <div className="language">
        <button>Tiếng Việt</button>
        <button>Đăng ký</button>
      </div>
    </header>
  );
};

export default Header;