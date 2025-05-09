// src/components/Practicalities.js
import React from 'react';
import '../styles/styles.css';

const items = [
  {
    src: "https://ext.same-assets.com/677349141/3643677369.jpeg",
    alt: "Currency",
    title: "Currency",
    desc: "Vietnam's unit of currency is the Vietnamese đồng (VND), represented by the '₫' symbol. Notes range from 200 to 500,000. Cash is mostly used, but Visa cards and ATMs are common in big cities."
  },
  {
    src: "https://ext.same-assets.com/677349141/2105118760.jpeg",
    alt: "Taxi services",
    title: "Taxi Services",
    desc: "Vietnam has modern, efficient taxi services. To avoid scams, stick with reputable companies like Vinasun and Mai Linh. Ride-hailing apps like Grab are also available in main cities."
  },
  {
    src: "https://ext.same-assets.com/677349141/417640499.jpeg",
    alt: "Public holidays",
    title: "Public holidays",
    desc: "Lunar New Year (Tet) is the biggest holiday. Most businesses close and transport is busy. See the ",
    link: "https://www.timeanddate.com/holidays/vietnam/"
  },
  {
    src: "https://ext.same-assets.com/677349141/598451847.jpeg",
    alt: "Power plugs",
    title: "Power plugs",
    desc: "Vietnam uses 220V supply. Most sockets take plugs with two round prongs. Adaptors are easy to find at electrical shops and hotels can help."
  },
  {
    src: "https://ext.same-assets.com/677349141/770208551.jpeg",
    alt: "SIM cards & helpful numbers",
    title: "SIM cards & helpful numbers",
    desc: "Buying a local SIM is fast & cheap. Major networks: Viettel, Vinaphone, Mobifone. Show your passport to register. See “useful numbers” like: Police 113, Fire 114, Ambulance 115."
  },
  {
    src: "https://ext.same-assets.com/677349141/3723335500.jpeg",
    alt: "Internet & postal services",
    title: "Internet & postal services",
    desc: "Free wifi is common in cities, hotels, and cafes. 3G/4G packages are affordable. Postal delivery is reliable but can be slow. Mail postcards from hotels or post offices."
  },
  {
    src: "https://ext.same-assets.com/677349141/872359099.jpeg",
    alt: "Hospitals",
    title: "Hospitals",
    desc: "Major cities have international hospitals and clinics. English-speaking staff are available. Buy travel insurance before your trip for peace of mind."
  },
  {
    src: "https://ext.same-assets.com/677349141/2139196023.jpeg",
    alt: "Embassies",
    title: "Embassies & Consulates",
    desc: "Foreign embassies and consulates are located in Hanoi and Ho Chi Minh City and provide support for travelers if required."
  }
];

const Practicalities = () => (
  <section className="practicalities">
    <div className="container">
      <h2>PRACTICALITIES</h2>
      <p className="section-sub">Get ready for your visit</p>
      <div className="practicalities-grid">
        {items.map((item, i) => (
          <div className="pract-item" key={i}>
            <img src={item.src} alt={item.alt} />
            <span>{item.title}</span>
            <p className="pract-desc">
              {item.desc}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  full list of public holidays
                </a>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Practicalities;