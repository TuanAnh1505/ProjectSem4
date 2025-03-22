import React from "react";
import ExploreItem from "./ExploreItem";
import styles from "./VietnamTourism.module.css";

const ExploreFromHome = () => {
  const exploreItems = [
    {
      image: "https://example.com/fun-at-home.jpg",
      title: "Fun at Home",
      description: "Recipes, colouring sheets, and more",
    },
    {
      image: "https://example.com/books-art-music.jpg",
      title: "Books, Art & Music",
      description: "A primer on Vietnamese culture",
    },
    {
      image: "https://example.com/my-vietnam.jpg",
      title: "My Vietnam",
      description: "Local stories from north to south",
    },
    {
      image: "https://example.com/travel-advisory.jpg",
      title: "Travel advisory",
      description: "Precautions and prevention for COVID-19",
    },
    {
      image: "https://example.com/safety-strategy.jpg",
      title: "Safety strategy",
      description: "How Vietnam contains the virus",
    },
    {
      image: "https://example.com/inspiring-stories.jpg",
      title: "Inspiring stories",
      description: "Kindness and community spirit",
    },
  ];

  return (
    <section className={styles.exploreFromHomeSection}>
      <h2 className={styles.sectionTitle}>Explore From Home</h2>
      <p className={styles.sectionDescription}>
        Explore Vietnam more from home and start planning your holidays.
      </p>
      <div className={styles.exploreGrid}>
        {exploreItems.map((item, index) => (
          <ExploreItem
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ExploreFromHome;
