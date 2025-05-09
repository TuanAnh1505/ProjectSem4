import React from 'react';
import '../styles/Hero.css';

const HERO_TITLE = {
  en: 'Travel offers',
  vi: 'Ưu đãi du lịch'
};

const Hero = ({ lang }) => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>{HERO_TITLE[lang]}</h1>
      </div>
    </section>
  );
};

export default Hero; 