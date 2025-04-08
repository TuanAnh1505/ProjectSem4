import React from "react";
import styles from "./TourBooking.module.css";

const TourBookingSteps = () => {
  return (
    <div className={styles.div8}>
      <div className={styles.div9}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/26d01277975a9385666784cbce087116e8cc0edb?apiKey=b83079aa3b064aefaad9423de3864312&"
          className={styles.img3}
          alt="Step 1"
        />
        <div className={styles.nhpthngtin}>Nhập thông tin</div>
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/28a7f57dd797aeaabdef4af5a79bdc302fa2354d?apiKey=b83079aa3b064aefaad9423de3864312&"
        className={styles.img4}
        alt="Arrow"
      />
      <div className={styles.div10}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/576be1954865fb9b1e05f4d78c869d46823b363b?apiKey=b83079aa3b064aefaad9423de3864312&"
          className={styles.img5}
          alt="Step 2"
        />
        <div className={styles.thanhton}>Thanh toán</div>
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/93be6879db9321e194a6c72480d24c1474d3abde?apiKey=b83079aa3b064aefaad9423de3864312&"
        className={styles.img6}
        alt="Arrow"
      />
      <div className={styles.div11}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/f28aebb1fd36ac29b9b6b5e7204dd96d9d7a667f?apiKey=b83079aa3b064aefaad9423de3864312&"
          className={styles.img7}
          alt="Step 3"
        />
        <div className={styles.hontt}>Hoàn tất</div>
      </div>
    </div>
  );
};

export default TourBookingSteps;
