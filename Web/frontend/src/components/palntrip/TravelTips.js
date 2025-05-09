// src/components/TravelTips.js
import React from 'react';
import '../styles/styles.css';

const tips = [
  { src: "https://ext.same-assets.com/677349141/599388804.jpeg", alt: "Visas", label: "Visas" },
  { src: "https://ext.same-assets.com/677349141/523499759.jpeg", alt: "Transport", label: "Transport" },
  { src: "https://ext.same-assets.com/677349141/1946432494.jpeg", alt: "Weather", label: "Weather" },
  { src: "https://ext.same-assets.com/677349141/2752473398.jpeg", alt: "Safety", label: "Safety" },
  { src: "https://ext.same-assets.com/677349141/566150099.jpeg", alt: "History", label: "History" },
  { src: "https://ext.same-assets.com/677349141/50552589.jpeg", alt: "Airports", label: "Airports" },
  { src: "https://ext.same-assets.com/677349141/1791203638.jpeg", alt: "Itineraries", label: "Itineraries" },
  { src: "https://ext.same-assets.com/677349141/4288775657.jpeg", alt: "Festivals", label: "Festivals" },
  { src: "https://ext.same-assets.com/677349141/3502506549.jpeg", alt: "Etiquette", label: "Etiquette" },
  { src: "https://ext.same-assets.com/677349141/856358668.jpeg", alt: "Payments", label: "Payments" },
];

const TravelTips = () => (
  <section className="travel-tips container">
    <h2>TRAVEL TIPS</h2>
    <p className="section-sub">Read up before you go</p>
    <div className="tips-grid">
      {tips.map((tip, index) => (
        <div className="tip-item" key={index}>
          <img src={tip.src} alt={tip.alt} />
          <span>{tip.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default TravelTips;
