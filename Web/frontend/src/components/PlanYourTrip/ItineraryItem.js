import React from "react";
import styles from "./VietnamTourism.module.css";

const ItineraryItem = ({ image, title }) => {
  return (
    <div className={styles.itineraryItem}>
      <img src={image} alt={title} className={styles.itineraryImage} />
      <h3 className={styles.itineraryTitle}>{title}</h3>
    </div>
  );
};

export default ItineraryItem;
