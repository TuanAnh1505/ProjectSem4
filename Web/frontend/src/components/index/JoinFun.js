import React from "react";

const JoinFun = () => {
    const sectionStyle = {
      textAlign: 'center',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px',
      marginBottom: '40px',
    };
    const titleStyle = {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#a4161a',
      marginBottom: '10px',
    };
    const subtitleStyle = {
      fontSize: '16px',
      color: '#444',
      marginBottom: '20px',
    };
    const decoratedBoxStyle = {
      width: '220px',
      height: '70px',
      backgroundColor: '#a4161a',
      margin: '0 auto',
      position: 'relative',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    const cornerStyle = {
      width: '10px',
      height: '10px',
      border: '2px solid #ff9f1c',
      position: 'absolute',
    };
    const topLeftStyle = { ...cornerStyle, top: '0', left: '0', borderRight: 'none', borderBottom: 'none' };
    const topRightStyle = { ...cornerStyle, top: '0', right: '0', borderLeft: 'none', borderBottom: 'none' };
    const bottomLeftStyle = { ...cornerStyle, bottom: '0', left: '0', borderRight: 'none', borderTop: 'none' };
    const bottomRightStyle = { ...cornerStyle, bottom: '0', right: '0', borderLeft: 'none', borderTop: 'none' };
    const bottomBorderStyle = {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '2px',
      backgroundColor: '#ff9f1c',
    };
  
    return (
      <section style={sectionStyle}>
        <p style={titleStyle}>JOIN THE FUN</p>
        <p style={subtitleStyle}>Follow us and share your Vietnam moments on Facebook and Instagram.</p>
        <div style={decoratedBoxStyle}>
          <div style={topLeftStyle}></div>
          <div style={topRightStyle}></div>
          <div style={bottomLeftStyle}></div>
          <div style={bottomRightStyle}></div>
          <div style={bottomBorderStyle}></div>
        </div>
      </section>
    );
  };


  export default JoinFun;