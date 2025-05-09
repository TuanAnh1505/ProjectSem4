// src/components/ExploreFromHome.js
import React from 'react';
import '../styles/styles.css';

const data = [
  {
    src: "https://ext.same-assets.com/677349141/1048707450.jpeg",
    alt: "Fun at home",
    title: "Fun at home",
    desc: "Snippets, coloring and indoor activities for families and friends."
  },
  {
    src: "https://ext.same-assets.com/677349141/1099343677.jpeg",
    alt: "Books, art & music",
    title: "Books, art & music",
    desc: "A preview of Vietnamese creative culture and must-reads."
  },
  {
    src: "https://ext.same-assets.com/677349141/3001579097.jpeg",
    alt: "My Vietnam",
    title: "My Vietnam",
    desc: "Voices and stories from north to south."
  },
  {
    src: "https://ext.same-assets.com/677349141/1893642352.jpeg",
    alt: "Travel advisory",
    title: "Travel advisory",
    desc: "Official information and precautions for travelers in Vietnam."
  },
  {
    src: "https://ext.same-assets.com/677349141/2587514017.jpeg",
    alt: "Safety strategy",
    title: "Safety strategy",
    desc: "Stay safe and healthy while you explore Vietnam."
  },
  {
    src: "https://ext.same-assets.com/677349141/2313664166.jpeg",
    alt: "Inspiring stories",
    title: "Inspiring stories",
    desc: "See how Vietnamese overcome adversity & keep spirits high."
  }
];

const ExploreFromHome = () => (
  <section className="explore-from-home container">
    <h2>EXPLORE FROM HOME</h2>
    <p className="section-sub">Explore Vietnam more from home and start planning your holidays.</p>
    <div className="explore-grid">
      {data.map((item, index) => (
        <div className="explore-item" key={index}>
          <img src={item.src} alt={item.alt} />
          <span>{item.title}</span>
          <p className="explore-desc">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ExploreFromHome;
