import React from "react";
import styles from "./VietnamTourism.module.css";

const GetInspired = () => {
  const categories = [
    {
      name: "Food",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/600f11fba4f50511bd61e71a648cea3511eef3aa",
    },
    {
      name: "Nature",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1e3dcd2d77c768d4283fbd73459d82bee422b411",
    },
    {
      name: "Culture",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8c86927f2158425866e2f9dd4a7d4ccb572a6f31",
    },
    {
      name: "Cities",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/64624f2aa50266acd60d12cf67889dbc8f656b31",
    },
    {
      name: "Beaches",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/771a16805e4d374c0b595c59922e0e53bc6add60",
    },
    {
      name: "Adventure",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/230c192f66fae4850c4a4e1a794c1945d34cf27f",
    },
    {
      name: "Wellness",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/08fe5acf8200a7bc35f0a4c0bce3e17bafed1ae6",
    },
    {
      name: "Family",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d9a564e727dc936d1c98cf99910d68105090f782",
    },
    {
      name: "Luxury",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/e380396e8469cdfde46cd7724f2de9dc3d6504dd",
    },
    {
      name: "Golf",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/805c280cc5d2ae4510a71b8c75426c6e101518e8",
    },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>get inspired</h2>
      <p className={styles.p}>
        There are so many insightful tours, amazing dishes and fun activities in
        Vietnam, you'll never run out of interesting things to do. Here are some
        handpicked ideas to get you started.
      </p>
      <div className={styles.div13}>
        {categories.slice(0, 5).map((category, index) => (
          <div key={index} className={styles[`div${14 + index}`]}>
            <img
              src={category.image}
              alt={category.name}
              className={styles.categoryImage}
            />
            <span className={styles.span}>{category.name}</span>
          </div>
        ))}
      </div>
      <div className={styles.div19}>
        {categories.slice(5).map((category, index) => (
          <div key={index} className={styles[`div${20 + index}`]}>
            <img
              src={category.image}
              alt={category.name}
              className={styles.categoryImage}
            />
            <span className={styles.span}>{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GetInspired;
