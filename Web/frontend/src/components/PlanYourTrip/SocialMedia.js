import React from "react";
import styles from "./VietnamTourism.module.css";

const SocialMedia = () => {
  const socialLinks = [
    {
      name: "Facebook",
      icon: "https://example.com/facebook-icon.png",
      url: "https://facebook.com/vietnamtourism",
    },
    {
      name: "Twitter",
      icon: "https://example.com/twitter-icon.png",
      url: "https://twitter.com/vietnamtourism",
    },
    {
      name: "Instagram",
      icon: "https://example.com/instagram-icon.png",
      url: "https://instagram.com/vietnamtourism",
    },
    {
      name: "YouTube",
      icon: "https://example.com/youtube-icon.png",
      url: "https://youtube.com/vietnamtourism",
    },
    {
      name: "Pinterest",
      icon: "https://example.com/pinterest-icon.png",
      url: "https://pinterest.com/vietnamtourism",
    },
  ];

  return (
    <section className={styles.socialMediaSection}>
      <h2 className={styles.socialMediaTitle}>Follow us on</h2>
      <div className={styles.socialMediaLinks}>
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialMediaLink}
          >
            <img
              src={link.icon}
              alt={link.name}
              className={styles.socialMediaIcon}
            />
          </a>
        ))}
      </div>
      <p className={styles.socialMediaDescription}>
        Welcome to the official website of Viet Nam National Authority of
        Tourism. Visit our social media pages for more travel inspiration.
      </p>
    </section>
  );
};

export default SocialMedia;
