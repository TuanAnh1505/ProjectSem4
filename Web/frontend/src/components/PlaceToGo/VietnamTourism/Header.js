import React from "react";
import styles from "./VietnamTourism.module.css";

function Header() {
  return (
    <>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/c7656547283fb9cdc583837893fdaa7ed01138e5?apiKey=540684bd11b7482cbc2dc74299173efd&"
        className={styles.img}
        alt="Vietnam Tourism Header"
      />
      <div className={styles.urbanhubs}>URBAN HUBS</div>
      <div
        className={
          styles.eachVietnamesecityexudesitsowndistinctcharacterGetafeelforVietnamsfascinatingurbancentresintheseinteractivetours
        }
      >
        Each Vietnamese city exudes its own distinct character. Get a feel for
        Vietnam's fascinating urban centres in these interactive tours.
      </div>
    </>
  );
}

export default Header;
