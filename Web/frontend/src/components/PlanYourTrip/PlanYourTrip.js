import React from "react";
import TravelTips from "./TravelTips";
import PracticalInfo from "./PracticalInfo";
import ExploreFromHome from "./ExploreFromHome";
import Infographics from "./Infographics";
import Experiences from "./Experiences";
import Itineraries from "./Itineraries";
import Newsletter from "./Newsletter";
import SocialMedia from "./SocialMedia";
import styles from "./VietnamTourism.module.css";

const PlanYourTrip = () => {
  return (
    <div className={styles.planYourTripContainer}>
      <header className={styles.header}>
        <h1>Plan Your Trip to Vietnam</h1>
      </header>
      <main>
        <TravelTips />
        <PracticalInfo />
        <ExploreFromHome />
        <Infographics />
        <Experiences />
        <Itineraries />
      </main>
      <footer className={styles.footer}>
        <Newsletter />
        <SocialMedia />
        <div className={styles.copyright}>
          © 2024 Official Website Vietnam Tourism
        </div>
      </footer>
    </div>
  );
};

export default PlanYourTrip;
