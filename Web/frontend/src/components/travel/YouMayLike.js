import React from 'react';
import '../styles/YouMayLike.css';

const recommendations = [
  {
    image: 'https://ext.same-assets.com/2511696692/2752713953.jpeg',
    title: 'TOP 10 LUXURIOUS HOTELS IN VIETNAM'
  },
  {
    image: 'https://ext.same-assets.com/2511696692/3132267745.jpeg',
    title: '7 SENSATIONAL SWIMMING POOLS IN VIETNAM'
  },
  {
    image: 'https://ext.same-assets.com/2511696692/1953548895.jpeg',
    title: '3 AMAZING AMUSEMENT PARKS FOR FAMILIES'
  }
];

const YouMayLike = () => {
  return (
    <section className="you-may-like">
      <h2>You may also like</h2>
      <div className="maylike-grid">
        {recommendations.map((item, index) => (
          <div key={index} className="like-item">
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YouMayLike; 