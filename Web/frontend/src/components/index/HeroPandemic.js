import React from "react";


const HeroPandemic = () => {
    const containerStyle = {
      position: 'relative',
      width: '100%',
      height: '320px',
    };
    const imgStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    };
    const h1Style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      textAlign: 'center',
      fontWeight: '400',
      lineHeight: '1.1',
      textShadow: '0 0 5px rgba(0,0,0,0.7)',
      fontSize: '30px',
    };
  
    return (
      <div style={containerStyle}>
        <img
          alt="Vietnam river scene"
          src="https://storage.googleapis.com/a1aa/image/4a487a0e-4d6d-4d8d-27f9-7e80a5362e20.jpg"
          style={imgStyle}
        />
        <h1 style={h1Style}>How Vietnam<br/>overcame a<br/>pandemic</h1>
      </div>
    );
  };


  export default HeroPandemic;