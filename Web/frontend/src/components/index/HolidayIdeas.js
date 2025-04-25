import React from "react";

const HolidayIdeas = () => {
    const sectionStyle = {
      maxWidth: '96rem',
      margin: '0 auto',
      padding: '2rem 1rem',
      textAlign: 'center',
    };
    const titleStyle = {
      fontSize: '50px',
      color: '#ca8a04',
      fontWeight: '600',
      letterSpacing: '0.05em',
      marginBottom: '0.25rem',
    };
    const subtitleStyle = {
      fontSize: '15px',
      color: '#4b5563',
      marginBottom: '2rem',
    };
    const iconsContainerStyle = {
      maxWidth: '100rem',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '3rem',
      fontSize: '12px',
      color: '#111827',
    };
    const iconItemStyle = {
      width: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };
    const iconImgStyle = {
      marginBottom: '0.25rem',
      width: '80px',
      height: '80px',
    };
    const spanStyle = {
      textTransform: 'uppercase',
      fontWeight: '600',
      letterSpacing: '0.1em',
      lineHeight: '1',
      whiteSpace: 'pre-line',
    };
  
    const icons = [
      { src: 'https://storage.googleapis.com/a1aa/image/2d783342-404c-4693-1eab-b90dc7a9620b.jpg', alt: 'Red motorcycle icon', text: 'AUTHENTIC\nADVENTURES' },
      { src: 'https://storage.googleapis.com/a1aa/image/b6bc3940-a15a-4b9c-06b5-605d2e173a71.jpg', alt: 'Red lotus flower icon', text: 'HEALING\nHOLIDAYS' },
      { src: 'https://storage.googleapis.com/a1aa/image/21ef63c5-092d-435f-968f-9088bbc8d764.jpg', alt: 'Red leaf icon', text: 'GREEN\nGETAWAYS' },
      { src: 'https://storage.googleapis.com/a1aa/image/929b8378-f8a3-4c39-edab-0e6f1d488541.jpg', alt: 'Red boat icon', text: 'BEACH\nBREAKS' },
      { src: 'https://storage.googleapis.com/a1aa/image/c8875b46-4f72-4f83-0f24-16147a638b37.jpg', alt: 'Red coffee cup icon', text: 'FOODIE\nFORAYS' },
    ];
  
    return (
      <section style={sectionStyle}>
        <p style={titleStyle}>HOLIDAY IDEAS</p>
        <p style={subtitleStyle}>See top recommendations for your next vacation in Vietnam.</p>
        <div style={iconsContainerStyle}>
          {icons.map((icon, index) => (
            <div key={index} style={iconItemStyle}>
              <img src={icon.src} alt={icon.alt} style={iconImgStyle} />
              <span style={spanStyle}>{icon.text}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };


  export default HolidayIdeas;