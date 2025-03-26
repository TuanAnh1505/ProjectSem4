import React from "react";
import styles from "./components/VietnamTourism/VietnamTourism.module.css";
import Header from "./components/VietnamTourism/Header";
import MainContent from "./components/VietnamTourism/MainContent";
import Events from "./components/VietnamTourism/Events";
import MustSeeSites from "./components/VietnamTourism/MustSeeSites";
import TravelTips from "./components/VietnamTourism/TravelTips";
import InternationalNews from "./components/VietnamTourism/InternationalNews";
import ShareYourStory from "./components/VietnamTourism/ShareYourStory";
import Newsletter from "./components/VietnamTourism/Newsletter";
import Footer from "./components/VietnamTourism/Footer";

function App() {
    return (
        <div className={styles.appContainer}>
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

export default App;
