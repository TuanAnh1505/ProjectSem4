import React from "react";
import PracticalInfoItem from "./PracticalInfoItem";
import styles from "./VietnamTourism.module.css";

const PracticalInfo = () => {
  const practicalInfoItems = [
    {
      image: "https://example.com/currency-icon.png",
      title: "Currency",
      content:
        "Vietnam's unit of currency is the Vietnamese đồng (VND), represented by the '₫' symbol.",
    },
    {
      image: "https://example.com/taxi-icon.png",
      title: "Taxi services",
      content:
        "Vietnam has modern, efficient taxi services to help you get around.",
    },
    {
      image: "https://example.com/holidays-icon.png",
      title: "Public holidays",
      content:
        "Vietnamese Lunar New Year Festival (Tet) is the biggest holiday of the year.",
    },
    {
      image: "https://example.com/power-icon.png",
      title: "Power plugs",
      content:
        "The voltage supply in Vietnam is 220 volts. Most sockets accommodate plugs with two round prongs.",
    },
    {
      image: "https://example.com/sim-icon.png",
      title: "SIM cards & helpful numbers",
      content: "Getting a local SIM card in Vietnam is fast and inexpensive.",
    },
    {
      image: "https://example.com/internet-icon.png",
      title: "Internet and postal services",
      content:
        "Vietnam is well-wired and in most destinations you can easily find a connection in cafes, spas.",
    },
    {
      image: "https://example.com/hospital-icon.png",
      title: "Hospitals",
      content:
        "Vietnam's major cities have excellent clinics and hospitals ready to serve travellers.",
    },
    {
      image: "https://example.com/embassy-icon.png",
      title: "Embassies and consulates",
      content:
        "Embassies and consulates of foreign countries in Vietnam can be found in the cities of Hanoi and Ho Chi Minh City.",
    },
  ];

  return (
    <section className={styles.practicalInfoSection}>
      <h2 className={styles.sectionTitle}>Practicalities</h2>
      <p className={styles.sectionDescription}>Get ready for your visit</p>
      <div className={styles.practicalInfoGrid}>
        {practicalInfoItems.map((item, index) => (
          <PracticalInfoItem
            key={index}
            image={item.image}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
    </section>
  );
};

export default PracticalInfo;
