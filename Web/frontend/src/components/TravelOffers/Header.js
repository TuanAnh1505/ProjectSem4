import React from "react";
import styles from "./VietnamTourism.module.css";

function Header() {
  return (
    <>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/38eac18c6865d9fcebde2c9efa6778fc93694d1b?apiKey=540684bd11b7482cbc2dc74299173efd&"
        className={styles.img}
      />
      <div className={styles.div}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/8d49c7b53b46b929143ad320c8f40f1016027ab7?apiKey=540684bd11b7482cbc2dc74299173efd&"
          className={styles.img2}
        />
        <div className={styles.div2}>
          <div className={styles.livefullyinVietnam}>Live fully in Vietnam</div>
          <div
            className={
              styles.vietnamopensitsdoorwidelytowelcomevisitorsallaroundtheworldStartingfrom15thAugust2023VietnamextendseVisavalidityto90Daysandunilateralvisaexemptionwillbevalidin45Days
            }
          >
            Vietnam opens its door widely to welcome visitors all around the
            world! Starting from 15th August 2023, Vietnam extends e-visa
            validity to 90 days and unilateral visa exemption will be valid in
            45 days!
          </div>
          <div
            className={
              styles.wearemorethanhappytowelcomeyouallhereandadmireourstunninglandscapesfreeyoursoulonwhitesandybeachesexperienceouruniqueandbeautifulcultureandmeetthepeopleinthemostfriendlycountryParticularlytoindulgeinourscrumptiouscuisineatMichelinratedrestaurantsortojoinusinoutstandingmegaculturemusicsportsandtourismevents
            }
          >
            We are more than happy to welcome you all here and admire our
            stunning landscapes, free your soul on white sandy beaches,
            experience our unique and beautiful culture and meet the people in
            the most friendly country. Particularly, to indulge in our
            scrumptious cuisine at Michelin rated restaurants or to join us in
            outstanding mega culture, music, sports and tourism events!
          </div>
          <div className={styles.letslivetothefullestinVietnam}>
            Let's live to the fullest in Vietnam!
          </div>
          <div className={styles.div3}>
            <div className={styles.div4}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/8a2f908f65d2bf9f3310a68a2f6024458ce72ff7?apiKey=540684bd11b7482cbc2dc74299173efd&"
                className={styles.img3}
              />
              <div className={styles.after}>All</div>
            </div>
            <div className={styles.a}>Explore</div>
            <div className={styles.a2}>Relax</div>
            <div className={styles.a3}>Play</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
