import React from "react";
import styles from "./Header.module.css";

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.ul} />
      <div className={styles.div}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/d8da1ecd3cb5c0cb22aaec98114c8f2efb754526?apiKey=b83079aa3b064aefaad9423de3864312&"
          className={styles.img}
          alt=""
        />
        <div className={styles.div2}>
          <div className={styles.div3}>
            <div
              className={
                styles.buttonMuiButtonBaseRootMuiButtonRootMuiButtonContainedjss111MuiButtonContainedSecondary
              }
            >
              Đăng nhập
            </div>
            <div
              className={
                styles.buttonMuiButtonBaseRootMuiButtonRootMuiButtonOutlinedjss111Jss112MuiButtonOutlinedSecondary
              }
            >
              Đăng ký
            </div>
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/a7472c8afc85ffe99c7b0107d9318e4f3a2368c3?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img2}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
