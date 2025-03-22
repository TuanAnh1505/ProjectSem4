import React from "react";
import TravelTipItem from "./TravelTipItem";
import styles from "./VietnamTourism.module.css";

const TravelTips = () => {
  const travelTipItems = [
    { image: "https://example.com/visas-icon.png", title: "Visas" },
    { image: "https://example.com/transport-icon.png", title: "Transport" },
    { image: "https://example.com/weather-icon.png", title: "Weather" },
    { image: "https://example.com/safety-icon.png", title: "Safety" },
    { image: "https://example.com/history-icon.png", title: "History" },
    { image: "https://example.com/airports-icon.png", title: "Airports" },
    { image: "https://example.com/itineraries-icon.png", title: "Itineraries" },
    { image: "https://example.com/festivals-icon.png", title: "Festivals" },
    { image: "https://example.com/etiquette-icon.png", title: "Etiquette" },
    { image: "https://example.com/payments-icon.png", title: "Payments" },
  ];

  return (
    <section className={styles.travelTipsSection}>
      <h2 className={styles.sectionTitle}>Travel Tips</h2>
      <p className={styles.sectionDescription}>Read up before you go</p>
      <div className={styles.travelTipsGrid}>
        {travelTipItems.map((item, index) => (
          <TravelTipItem key={index} image={item.image} title={item.title} />
        ))}
      </div>
    </section>
  );
};

export default TravelTips;
