import React from "react";
import ItineraryItem from "./ItineraryItem";
import styles from "./VietnamTourism.module.css";

const Itineraries = () => {
  const itineraryItems = [
    {
      image: "https://example.com/hanoi-weekend.jpg",
      title: "The perfect weekend in Ha Noi",
    },
    {
      image: "https://example.com/hue-culture.jpg",
      title: "3 days in Hue for culture seekers",
    },
    {
      image: "https://example.com/hcmc-weekend.jpg",
      title: "The perfect weekend in HCMC",
    },
  ];

  return (
    <section className={styles.itinerariesSection}>
      <h2 className={styles.sectionTitle}>Itineraries</h2>
      <div className={styles.itinerariesGrid}>
        {itineraryItems.map((item, index) => (
          <ItineraryItem key={index} image={item.image} title={item.title} />
        ))}
      </div>
    </section>
  );
};

export default Itineraries;
