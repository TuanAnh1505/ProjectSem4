import React, { useState } from 'react';
import '../styles/Header.css';

const LANGS = {
  en: 'EN',
  vi: 'VI'
};

const Header = ({ lang, onLangChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLangClick = () => setShowDropdown((v) => !v);
  const handleSelect = (lng) => {
    setShowDropdown(false);
    if (lng !== lang) onLangChange(lng);
  };

  return (
    <header className="header">
      <div className="container header-flex">
        <a href="/" className="logo">
          <img
            src="/logo-hivietnam.png"
            alt="hiVietnam Logo"
            style={{ height: '76px', maxWidth: '220px', objectFit: 'contain', display: 'block' }}
          />
        </a>
        <nav className="main-nav">
          <ul>
            <li><a href="#">{lang === 'en' ? 'Live fully in Vietnam' : 'Sống trọn vẹn ở Việt Nam'}</a></li>
            <li><a href="#">{lang === 'en' ? 'Places to go' : 'Điểm đến'}</a></li>
            <li><a href="#">{lang === 'en' ? 'Things to do' : 'Hoạt động'}</a></li>
            <li><a href="#">{lang === 'en' ? 'Plan your trip' : 'Lên kế hoạch'}</a></li>
            <li><a href="#" className="active">{lang === 'en' ? 'Travel offers' : 'Ưu đãi du lịch'}</a></li>
            <li><a href="#">{lang === 'en' ? 'Green travel' : 'Du lịch xanh'}</a></li>
          </ul>
        </nav>
        <div className="lang-switch" style={{ position: 'relative' }}>
          <button onClick={handleLangClick} style={{ fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: '#983926', fontSize: 16 }}>
            {LANGS[lang]}
          </button>
          {showDropdown && (
            <div style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid #ccc', borderRadius: 4, zIndex: 10 }}>
              {Object.entries(LANGS).map(([lng, label]) => (
                <div
                  key={lng}
                  onClick={() => handleSelect(lng)}
                  style={{ padding: '6px 18px', cursor: 'pointer', color: lng === lang ? '#b39447' : '#26302e', fontWeight: lng === lang ? 700 : 400 }}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 