import React from "react";
import styles from "./VietnamTourism.module.css";

const PracticalInfoItem = ({ image, title, content }) => {
  return (
    <div className={styles.practicalInfoItem}>
      <img src={image} alt={title} className={styles.practicalInfoIcon} />
      <h3 className={styles.practicalInfoTitle}>{title}</h3>
      <p className={styles.practicalInfoContent}>{content}</p>
    </div>
  );
};

export default PracticalInfoItem;
