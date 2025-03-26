import React from "react";
import styles from "./VietnamTourism.module.css";

function HeritageSites() {
  return (
    <>
      <div className={styles.heritagesites}>heritage sites</div>
      <div
        className={
          styles.curiouswhatawaitsyouinVietnamTakea360Degreetourofsomeofthecountrysmostcompellingnaturalwondersandculturalattractionsrighthere
        }
      >
        Curious what awaits you in Vietnam? Take a 360-degree tour of some of
        the country's most compelling natural wonders and cultural attractions
        right here.
      </div>
      <div className={styles.div}>
        <div className={styles.div3}>
          <div className={styles.column}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/47536bc1aea4324ec807b18b44da1a3ed06da1f3?apiKey=540684bd11b7482cbc2dc74299173efd&"
              className={styles.img5}
              alt="Heritage Site 1"
            />
          </div>
          <div className={styles.column4}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/129ea0af0ce072b47201fe5c153c8a92a03eb3ee?apiKey=540684bd11b7482cbc2dc74299173efd&"
              className={styles.img6}
              alt="Heritage Site 2"
            />
          </div>
          <div className={styles.column5}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/d515e592af19593ced61539635edd1f23e10f30e?apiKey=540684bd11b7482cbc2dc74299173efd&"
              className={styles.img7}
              alt="Heritage Site 3"
            />
          </div>
        </div>
      </div>
      <div className={styles.div4}>
        <div className={styles.div5}>
          <div className={styles.column}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/32f4de8734ec2f99f15b9ca0aa7ea509af568fa1?apiKey=540684bd11b7482cbc2dc74299173efd&"
              className={styles.img8}
              alt="Heritage Site 4"
            />
          </div>
          <div className={styles.column6}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/e2f3092845707edc02934e4dfe2d08c9ea1402fa?apiKey=540684bd11b7482cbc2dc74299173efd&"
              className={styles.img9}
              alt="Heritage Site 5"
            />
          </div>
          <div className={styles.column7}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/37ea2cbc50759fd16ebd1115533fb6144ecf5ede?apiKey=540684bd11b7482cbc2dc74299173efd&"
              className={styles.img10}
              alt="Heritage Site 6"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeritageSites;
