// src/components/Experiences.js
import React from 'react';
import '../styles/styles.css';

const data = [
  { src: "https://ext.same-assets.com/677349141/1251794232.jpeg", alt: "VinOasis Phu Quoc", label: "VinOasis Phu Quoc" },
  { src: "https://ext.same-assets.com/677349141/4080396102.jpeg", alt: "InterContinental Phu Quoc", label: "InterContinental Phu Quoc" },
  { src: "https://ext.same-assets.com/677349141/1644321882.jpeg", alt: "VinWonders Nha Trang", label: "VinWonders Nha Trang" },
  { src: "https://ext.same-assets.com/677349141/4208420702.jpeg", alt: "Sailing Club Phu Quoc", label: "Sailing Club Phu Quoc" }
];

const Experiences = () => (
  <section className="experiences container">
    <h2>EXPERIENCES</h2>
    <p className="section-sub">See outstanding travel products from our partners</p>
    <div className="exp-grid">
      {data.map((item, index) => (
        <div className="exp-item" key={index}>
          <img src={item.src} alt={item.alt} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default Experiences;
