import React from "react";
import Header from "./Header";
import UrbanHubs from "./UrbanHubs";
import HeritageSites from "./HeritageSites";
import VietnamMap from "./VietnamMap";
import MyVietnam from "./MyVietnam";
import Itineraries from "./Itineraries";
import Footer from "./Footer";
import styles from "./VietnamTourism.module.css";

function PlacesToGo() {
  return (
    <div className={styles.divpageWraphover}>
      <Header />
      <UrbanHubs />
      <HeritageSites />
      <VietnamMap />
      <MyVietnam />
      <Itineraries />
      <Footer />
    </div>
  );
}

export default PlacesToGo;
