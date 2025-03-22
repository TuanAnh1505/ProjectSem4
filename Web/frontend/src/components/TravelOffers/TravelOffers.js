import React from "react";
import Header from "./Header";
import SpecialDeals from "./SpecialDeals";
import Partners from "./Partners";
import YouMayAlsoLike from "./YouMayAlsoLike";
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import styles from "./TravelOffers.module.css";

function TravelOffers() {
  return (
    <div className={styles.divpageWraphover}>
      <Header />
      <div className={styles.divcontainerFluidhover}>
        <div className={styles.div4}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/e45e0bfbea9149fad017585f36656e9a4a2eb63d?apiKey=540684bd11b7482cbc2dc74299173efd&"
            className={styles.img4}
            alt="Travel offers background"
          />
          <div className={styles.pdescrightStyle}>Travel offers</div>
        </div>
      </div>
      <SpecialDeals />
      <Partners />
      <YouMayAlsoLike />
      <div className={styles.divbreadcrumbContainer}>
        <div className={styles.div93}>
          <div className={styles.youarehere}>You are here:</div>
          <div>Home</div>
          <div className={styles.div94}>&gt;</div>
          <div>Travel offers</div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
}

export default TravelOffers;
