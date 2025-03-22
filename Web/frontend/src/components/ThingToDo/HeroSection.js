import React from "react";
import styles from "./VietnamTourism.module.css";

const HeroSection = () => {
  return (
    <div className={styles.div10}>
      <div className={styles.div11}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/895aa7cb5e0cb6f855f87a33dd39e0e75d980fdb"
          alt="Hero image"
          className={styles.heroImage}
        />
        <h1 className={styles.h1}>Things to do</h1>
        <div className={styles.div12}>
          Kayaking in Ha Long Bay. Photo by Aaron Joel Santos
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
