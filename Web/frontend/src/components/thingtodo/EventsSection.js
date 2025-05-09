import React from 'react';

const events = [
  'https://ext.same-assets.com/341254039/2001932791.jpeg',
  'https://ext.same-assets.com/341254039/2712733397.jpeg',
  'https://ext.same-assets.com/341254039/3811194866.jpeg'
];

const EventsSection = () => (
  <section className="events-section">
    <div className="container">
      <h2 className="section-title events-title">Festivals and special events</h2>
      <div className="section-grid events-grid">
        {events.map((src, idx) => (
          <a key={idx} href="#" className="section-grid-item">
            <img src={src} alt={`Event ${idx + 1}`} />
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
