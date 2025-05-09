import React from 'react';
import '../styles/HighlightSection.css';

const HighlightSection = () => {
  return (
    <section className="highlight-section">
      <div className="highlight-image-wrap">
        <img 
          className="highlight-img" 
          src="https://ext.same-assets.com/2511696692/1501963789.jpeg" 
          alt="Sailing Club Phu Quoc" 
        />
        <div className="highlight-title">
          <h2>7 reasons to try Sailing Club Phu Quoc</h2>
        </div>
      </div>
    </section>
  );
};

export default HighlightSection; 