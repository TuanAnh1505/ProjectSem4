import React from "react";
import styles from "./TravelOffers.module.css";

function Newsletter() {
  return (
    <div className={styles.div95}>
      <div className={styles.div96}>
        <div className={styles.signupforournewsletter}>
          Sign up for our newsletter
        </div>
        <div
          className={
            styles.receivenewtravelstoriesfromVietnamonceamonthinyourinbox
          }
        >
          Receive new travel stories from Vietnam once a month in your inbox.
        </div>
        <input type="email" placeholder="Your email" className={styles.input} />
        <button className={styles.div97}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/e9aae6a45e5c0da16b9dccc648beb99129801cad?apiKey=540684bd11b7482cbc2dc74299173efd&"
            className={styles.img97}
            alt="Sign up button background"
          />
          <div className={styles.after}>Sign Up</div>
        </button>
      </div>
    </div>
  );
}

export default Newsletter;
