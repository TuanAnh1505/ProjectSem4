import React from "react";
import styles from "./TourBooking.module.css";

const TourBookingHeader = () => {
  return (
    <div className={styles.div}>
      <div className={styles.div2}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/cfdb900acef9396df87094caa41928b5229c6662?apiKey=b83079aa3b064aefaad9423de3864312&"
          className={styles.img}
          alt="Back arrow"
        />
        <div>Quay lại</div>
      </div>
      <div className={styles.div3}>
        <div className={styles.div4}>
          <div className={styles.column}>
            <div className={styles.div5}>
              <div className={styles.div6}>
                <div className={styles.ul} />
                <div className={styles.ttour}>Đặt tour</div>
              </div>
              <button
                className={
                  styles.buttonMuiButtonBaseRootMuiButtonRootMuiButtonContainedjss111MuiButtonContainedSecondary
                }
              >
                Đăng nhập
              </button>
            </div>
          </div>
          <div className={styles.column2}>
            <div className={styles.div7}>
              <button
                className={
                  styles.buttonMuiButtonBaseRootMuiButtonRootMuiButtonOutlinedjss111Jss112MuiButtonOutlinedSecondary
                }
              >
                Đăng ký
              </button>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/5d792ed1ef3b6fc091d7152838a8261b6f5a9d77?apiKey=b83079aa3b064aefaad9423de3864312&"
                className={styles.img2}
                alt="User icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourBookingHeader;
