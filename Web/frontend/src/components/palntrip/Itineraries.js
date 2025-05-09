// src/components/Itineraries.js
import React from 'react';
import '../styles/styles.css';

const data = [
  { src: "https://ext.same-assets.com/677349141/3101246732.jpeg", alt: "Ha Noi", title: "The perfect weekend in Ha Noi" },
  { src: "https://ext.same-assets.com/677349141/3079056901.jpeg", alt: "Hue", title: "3 days in Hue for Culture Seekers" },
  { src: "https://ext.same-assets.com/677349141/3069157901.jpeg", alt: "HCMC", title: "The perfect weekend in HCMC" }
];

const Itineraries = () => (
  <section className="itineraries">
    <div className="container">
      <h2 className="itineraries-title">Itineraries</h2>
      <div className="itinerary-grid">
        {data.map((item, index) => (
          <div className="itinerary-item" key={index}>
            <img src={item.src} alt={item.alt} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Itineraries;
