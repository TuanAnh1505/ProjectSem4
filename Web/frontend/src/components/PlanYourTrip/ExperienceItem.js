import React from "react";
import styles from "./VietnamTourism.module.css";

const ExperienceItem = ({ image, title, icon }) => {
  return (
    <div className={styles.experienceItem}>
      <img src={image} alt={title} className={styles.experienceImage} />
      <div className={styles.experienceInfo}>
        <h3 className={styles.experienceTitle}>{title}</h3>
        <img
          src={icon}
          alt={`${title} icon`}
          className={styles.experienceIcon}
        />
      </div>
    </div>
  );
};

export default ExperienceItem;
