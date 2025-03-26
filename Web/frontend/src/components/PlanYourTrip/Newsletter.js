import React, { useState } from "react";
import styles from "./VietnamTourism.module.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted email:", email);
    setEmail("");
  };

  return (
    <section className={styles.newsletterSection}>
      <h2 className={styles.newsletterTitle}>Sign up for our newsletter</h2>
      <p className={styles.newsletterDescription}>
        Receive new travel stories from Vietnam once a month in your inbox.
      </p>
      <form onSubmit={handleSubmit} className={styles.newsletterForm}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className={styles.newsletterInput}
        />
        <button type="submit" className={styles.newsletterButton}>
          Sign Up
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
