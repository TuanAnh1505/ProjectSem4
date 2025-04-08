import React from "react";
import styles from "./VietnamTourism.module.css";
import Header from "./Header";
import MainContent from "./MainContent";
import Events from "./Events";
import MustSeeSites from "./MustSeeSites";
import TravelTips from "./TravelTips";
import InternationalNews from "./InternationalNews";
import ShareYourStory from "./ShareYourStory";
import Newsletter from "./Newsletter";
import Footer from "./Footer";

function VietnamTourism() {
  return (
    <div className={styles.divpageWraphover}>
      <Header />
      <MainContent />
      <Events />
      <MustSeeSites />
      <TravelTips />
      <InternationalNews />
      <ShareYourStory />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default VietnamTourism;
