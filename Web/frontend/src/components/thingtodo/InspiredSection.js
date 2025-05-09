import React from 'react';

const inspiredItems = [
  { label: 'Food', img: 'https://ext.same-assets.com/341254039/4188256899.png' },
  { label: 'Nature', img: 'https://ext.same-assets.com/341254039/2418737586.png' },
  { label: 'Culture', img: 'https://ext.same-assets.com/341254039/2493385761.png' },
  { label: 'Cities', img: 'https://ext.same-assets.com/341254039/471946565.jpeg' },
  { label: 'Beaches', img: 'https://ext.same-assets.com/341254039/3264561710.png' },
  { label: 'Adventure', img: 'https://ext.same-assets.com/341254039/2976228756.jpeg' },
  { label: 'Wellness', img: 'https://ext.same-assets.com/341254039/2708542927.jpeg' },
  { label: 'Family', img: 'https://ext.same-assets.com/341254039/4148663910.png' },
  { label: 'Luxury', img: 'https://ext.same-assets.com/341254039/1757988326.jpeg' },
  { label: 'Golf', img: 'https://ext.same-assets.com/341254039/1497932344.jpeg' },
];

const InspiredSection = () => (
  <section className="get-inspired">
    <div className="container">
      <h2 className="get-inspired-title">GET INSPIRED</h2>
      <p className="get-inspired-desc">
        There are so many insightful tours, amazing dishes and fun activities in Vietnam, you’ll never run out of interesting things to do. Here are some handpicked ideas to get you started.
      </p>
      <div className="inspired-grid">
        {inspiredItems.map((item, index) => (
          <a key={index} href="#" className="inspired-item">
            <img src={item.img} alt={item.label} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default InspiredSection;
