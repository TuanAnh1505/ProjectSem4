import React from "react";
import styles from "./VietnamTourism.module.css";

const TravelTipItem = ({ image, title }) => {
  return (
    <div className={styles.travelTipItem}>
      <img src={image} alt={title} className={styles.travelTipIcon} />
      <h3 className={styles.travelTipTitle}>{title}</h3>
    </div>
  );
};

export default TravelTipItem;
