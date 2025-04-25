
import React from "react";

const TextSection = () => {
    const sectionStyle = {
      maxWidth: '64rem',
      margin: '0 auto',
      padding: '2.5rem 1rem',
      textAlign: 'center',
    };
    const h2Style = {
      color: '#fbbf24',
      fontWeight: '600',
      fontSize: '2rem',
      marginBottom: '0.75rem',
    };
    const pStyle = {
      color: '#4b5563',
      fontSize: '1.25rem',
      maxWidth: '68rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.5',
    };
  
    return (
      <section style={sectionStyle}>
        <h2 style={h2Style}>WHY NOT VIETNAM?</h2>
        <p style={pStyle}>
          There's never been a better time to choose Vietnam as your holiday destination. With a strong commitment to safety and fast response to health crises, Vietnam is a place you can travel with peace of mind. The country's untrammelled landscapes and seascapes are bursting with beautiful views you can have all to yourself. Even if it's been a while, you can be sure Vietnam's people are as friendly as ever, its food is as delicious as ever, its culture is as alluring as ever — and all of it is waiting for you. When you're ready to travel again, we look forward to welcoming you back to Vietnam.
        </p>
      </section>
    );
  };

  export default TextSection;