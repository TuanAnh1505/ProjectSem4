import React from "react";

const Navbar = () => {
  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottom: '1px solid #e5e7eb',
    height: '4rem',
  };
  const logoContainerStyle = {
    position: 'absolute',
    left: '240px',
    top: '0',
    height: '4rem',
    width: '6rem',
  };
  const logoImgStyle = {
    height: '110%',
    width: '108%',
    objectFit: 'cover',
  };
  const ulStyle = {
    display: 'flex',
    gap: '2rem',
    fontSize: '1rem',
    color: '#4b5563',
    fontWeight: '400',
    listStyle: 'none',
    padding: '0',
    margin: '0',
  };
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    transition: 'color 0.2s ease-in-out',
  };
  const searchBtnStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#4b5563',
    cursor: 'pointer',
    fontSize: '1.25rem',
    transition: 'color 0.2s ease-in-out',
  };

  return (
    <nav style={navStyle}>
      <div style={logoContainerStyle}>
        <img
          alt="Vietnam tourism logo"
          src={process.env.PUBLIC_URL + "/assets/images/ChatGPT_Image_10_46_29_16_thg_4__2025-removebg-preview.png"} // Corrected path
          style={logoImgStyle}
        />
      </div>
      <ul style={ulStyle}>
        {['Live fully in Vietnam', 'Places to go', 'Things to do', 'Plan your trip', 'Travel offers', 'EN'].map((item) => (
          <li key={item}>
            <button
              style={{ ...linkStyle, background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
              onMouseOver={(e) => (e.target.style.color = '#111827')}
              onMouseOut={(e) => (e.target.style.color = '#4b5563')}
              onClick={() => console.log(`${item} clicked`)} // Replace with actual navigation logic
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
      <button aria-label="Search" style={searchBtnStyle}>
        <i className="fas fa-search"></i>
      </button>
    </nav>
  );
};

export default Navbar;