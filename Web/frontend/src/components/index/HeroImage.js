import React from "react";

const HeroImage = () => {
    const containerStyle = {
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
    };
    const imgStyle = {
      width: '100%',
      height: '600px',
      objectFit: 'cover',
      display: 'block',
    };
    const textStyle = {
      position: 'absolute',
      top: '2.5rem',
      left: '2.5rem',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.875rem',
      lineHeight: '1.2',
      maxWidth: '20rem',
      textShadow: '0 0 5px rgba(0,0,0,0.7)',
      whiteSpace: 'pre-line',
    };
  
    return (
      <div style={containerStyle}>
        <img
          alt="Vietnamese meal with bowls and chopsticks"
          src="https://storage.googleapis.com/a1aa/image/48a89cc0-d108-4503-37c0-5128073a01c6.jpg"
          style={imgStyle}
        />
        <div style={textStyle}>Visit<br/>VIET<br/>NAM</div>
      </div>
    );
  };

  export default HeroImage;