import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import EventsSection from "./EventsSection";
import MustSeeSites from "./MustSeeSites";
import TravelTips from "./TravelTips";
import InternationalNews from "./InternationalNews";
import ShareYourStory from "./ShareYourStory";
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import styles from "./VietnamTourismPage.module.css";

function VietnamTourismPage() {
  return (
    <div className={styles.divpageWraphover}>
      <Header />
      <HeroSection />
      <EventsSection />
      <MustSeeSites />
      <TravelTips />
      <InternationalNews />
      <ShareYourStory />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default VietnamTourismPage;
