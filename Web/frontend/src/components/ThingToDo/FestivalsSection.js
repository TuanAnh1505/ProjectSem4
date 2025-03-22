import React from "react";
import styles from "./VietnamTourism.module.css";

const FestivalsSection = () => {
  const festivals = [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/599e50220316fa245273337eabd4a4253d77e912",
      title: "Vietnam's magical Mid-autumn Festival",
      alt: "Mid-autumn Festival",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/e770a88f03d812f5fc8d3c6ab0153e04a4c2d290",
      title: "Top 10 festivals & holidays in Vietnam",
      alt: "Festivals and holidays",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/06331021041fa966e644889838068d5a279ce8a4",
      title: "A traveller's guide to Tet holiday",
      alt: "Tet holiday",
    },
  ];

  return (
    <section className={styles.section7}>
      <h2 className={styles.h22}>festivals and special events</h2>
      <div className={styles.div65}>
        {festivals.map((festival, index) => (
          <div key={index} className={styles[`div${66 + index * 2}`]}>
            <img
              src={festival.image}
              alt={festival.alt}
              className={styles.festivalImage}
            />
            <div className={styles[`div${67 + index * 2}`]}>
              {festival.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FestivalsSection;
