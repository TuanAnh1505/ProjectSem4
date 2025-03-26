import React from "react";
import styles from "./VietnamTourism.module.css";

const ContentSection = ({ title, description, articles }) => {
  return (
    <section className={styles.section2}>
      <div className={styles.div25}>
        <h2 className={styles.h2}>{title}</h2>
        <p className={styles.p}>{description}</p>
        <div className={styles.div26}>
          {articles.map((article, index) => (
            <div key={index} className={styles[`div${27 + index * 2}`]}>
              <img
                src={article.image}
                alt={article.title}
                className={styles.articleImage}
              />
              <div className={styles[`div${28 + index * 2}`]}>
                {article.title}
              </div>
            </div>
          ))}
        </div>
        <button className={styles.button}>view more</button>
      </div>
    </section>
  );
};

export default ContentSection;
