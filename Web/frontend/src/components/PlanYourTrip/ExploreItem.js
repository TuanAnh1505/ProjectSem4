import React from "react";
import styles from "./VietnamTourism.module.css";

const ExploreItem = ({ image, title, description }) => {
  return (
    <div className={styles.exploreItem}>
      <img src={image} alt={title} className={styles.exploreImage} />
      <h3 className={styles.exploreTitle}>{title}</h3>
      <p className={styles.exploreDescription}>{description}</p>
    </div>
  );
};

export default ExploreItem;
