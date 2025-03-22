import React from "react";
import styles from "./VietnamTourism.module.css";

const Infographics = () => {
  return (
    <section className={styles.infographicsSection}>
      <h2 className={styles.sectionTitle}>Infographics</h2>
      <p className={styles.sectionDescription}>Learn more about Vietnam</p>
      <div className={styles.infographicsGrid}>
        <img
          src="http://b.io/ext_59-"
          alt="Vietnam Infographic 1"
          className={styles.infographicImage}
        />
        <img
          src="http://b.io/ext_60-"
          alt="Vietnam Infographic 2"
          className={styles.infographicImage}
        />
        <img
          src="http://b.io/ext_61-"
          alt="Vietnam Infographic 3"
          className={styles.infographicImage}
        />
      </div>
    </section>
  );
};

export default Infographics;
