import React from "react";
import styles from "./VietnamTourism.module.css";

function UrbanHubs() {
  return (
    <div className={styles.div}>
      <div className={styles.div2}>
        <div className={styles.column}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/663cde5af4865e1ace0e55b634989ab79ad66945?apiKey=540684bd11b7482cbc2dc74299173efd&"
            className={styles.img2}
            alt="Urban Hub 1"
          />
        </div>
        <div className={styles.column2}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/e19877afff1c9c4b9c68f4341bc533c5eb0a1a66?apiKey=540684bd11b7482cbc2dc74299173efd&"
            className={styles.img3}
            alt="Urban Hub 2"
          />
        </div>
        <div className={styles.column3}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/0d05a9336621f2b45f5916cc85567083f186156d?apiKey=540684bd11b7482cbc2dc74299173efd&"
            className={styles.img4}
            alt="Urban Hub 3"
          />
        </div>
      </div>
    </div>
  );
}

export default UrbanHubs;
