import React from 'react';

const SectionBlock = ({ title, description, image, items, lightBg = false }) => (
  <section className={`main-section ${lightBg ? 'bg-light' : ''}`}>
    <div className="section-image-large">
      <img src={image} alt={title} />
    </div>
    <div className="container">
      <h2 className="section-title gold-text">{title}</h2>
      <p className="section-desc">{description}</p>
      <div className="section-grid">
        {items.map((src, idx) => (
          <a key={idx} href="#" className="section-grid-item">
            <img src={src} alt={`${title} ${idx + 1}`} />
          </a>
        ))}
      </div>
      <a href="#" className="view-more-btn">View more</a>
    </div>
  </section>
);

export default SectionBlock;
