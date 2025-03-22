import React from "react";
import styles from "./VietnamTourism.module.css";

const Footer = () => {
  const socialIcons = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/7d3106f28464c25ff4687cb56858486e1e586e90",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/b5a5ebe21f43cea666781209a5029da159af3529",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/9f597ed652554ffd07134dda1df5f17118d00c75",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/e79a111c8cc3be36eb0f4df49648567d046b2626",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/7d3106f28464c25ff4687cb56858486e1e586e90",
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.div72}>
        <div className={styles.div}>
          <h3 className={styles.h3}>Sign up for our newsletter</h3>
          <p className={styles.p2}>
            Receive new travel stories from Vietnam once a month in your inbox.
          </p>
          <div className={styles.div73}>
            <input
              type="email"
              placeholder="Your email"
              className={styles.input}
            />
            <button className={styles.button}>Sign Up</button>
          </div>
        </div>
        <div className={styles.div}>
          <h3 className={styles.h3}>Follow us on</h3>
          <div className={styles.div74}>
            {socialIcons.map((icon, index) => (
              <img
                key={index}
                src={icon}
                alt="Social icon"
                className={styles.socialIcon}
              />
            ))}
          </div>
          <p className={styles.p3}>
            Welcome to the official website of Viet Nam National Authority of
            Tourism. Visit our social media pages for more travel inspiration.
          </p>
        </div>
      </div>
      <div className={styles.div75}>
        © 2016 Official Website Vietnam Tourism
      </div>
    </footer>
  );
};

export default Footer;
