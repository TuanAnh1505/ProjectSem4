import React from "react";
import ExperienceItem from "./ExperienceItem";
import styles from "./VietnamTourism.module.css";

const Experiences = () => {
  const experienceItems = [
    {
      image: "https://example.com/vinoasis-phu-quoc.jpg",
      title: "VinOasis Phu Quoc",
      icon: "https://example.com/vinoasis-icon.png",
    },
    {
      image: "https://example.com/intercontinental-phu-quoc.jpg",
      title: "InterContinental Phu Quoc",
      icon: "https://example.com/intercontinental-icon.png",
    },
    {
      image: "https://example.com/vinwonders-nha-trang.jpg",
      title: "VinWonders Nha Trang",
      icon: "https://example.com/vinwonders-icon.png",
    },
    {
      image: "https://example.com/sailing-club-phu-quoc.jpg",
      title: "Sailing Club Phu Quoc",
      icon: "https://example.com/sailing-club-icon.png",
    },
  ];

  return (
    <section className={styles.experiencesSection}>
      <h2 className={styles.sectionTitle}>Experiences</h2>
      <p className={styles.sectionDescription}>
        See outstanding travel products from our partners
      </p>
      <div className={styles.experiencesGrid}>
        {experienceItems.map((item, index) => (
          <ExperienceItem
            key={index}
            image={item.image}
            title={item.title}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default Experiences;
