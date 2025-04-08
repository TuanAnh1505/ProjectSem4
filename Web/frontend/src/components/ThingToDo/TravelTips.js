import React from "react";
import styles from "./TravelTips.module.css";

function TravelTips() {
  return (
    <>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/d32198a83f89a6741406074f3d2a207efcbbab03?apiKey=b83079aa3b064aefaad9423de3864312&"
        className={styles.img32}
        alt=""
      />
      <div className={styles.traveltips}>travel tips</div>
      <div className={styles.prepareforyourtripwiththesepracticalarticles}>
        Prepare for your trip with these practical articles
      </div>
      <div className={styles.div43}>
        <div className={styles.divthumbnail}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/58051c2fb18fa52b63034b3569a5d7a5d5377f86?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img33}
            alt=""
          />
          <div className={styles.visas}>Visas</div>
        </div>
        <div className={styles.divthumbnail2}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/9f40748422ce19d633bbc1caed11bbea0cce9163?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img34}
            alt=""
          />
          <div className={styles.transport}>Transport</div>
        </div>
        <div className={styles.divthumbnail3}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/22d9eb353358f866ace2ff91b82c38876221edb0?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img35}
            alt=""
          />
          <div className={styles.weather}>Weather</div>
        </div>
        <div className={styles.divthumbnail4}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/c6e042c138ea0c7b9b74fd6a1fd9111cae3dfec3?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img36}
            alt=""
          />
          <div className={styles.safety}>Safety</div>
        </div>
        <div className={styles.divthumbnail5}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/9156d67d6093cbb8d6cfe67182b9461c06d75ff0?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img37}
            alt=""
          />
          <div className={styles.history}>History</div>
        </div>
      </div>
    </>
  );
}

export default TravelTips;
