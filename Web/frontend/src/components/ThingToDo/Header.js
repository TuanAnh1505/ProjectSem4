import React from "react";
import styles from "./VietnamTourism.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.div2}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3df081e8fd86245b1884ea128081783c9fe7d208"
          alt="Logo"
          className={styles.logo}
        />
        <nav className={styles.nav}>
          <ul className={styles.ul}>
            <li className={styles.div3}>Live fully in Vietnam</li>
            <li className={styles.div4}>Places to go</li>
            <li className={styles.div5}>Things to do</li>
            <li className={styles.div6}>Plan your trip</li>
            <li className={styles.div7}>Travel offers</li>
            <li className={styles.div8}>EN</li>
          </ul>
        </nav>
        <div className={styles.div9}>
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg id="43:576" layer-name="Frame" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="search-svg" style="margin: 0; padding: 0; box-sizing: border-box; width: 13px; height: 13px"> <g clip-path="url(#clip0_43_576)"> <path d="M8.30301 8.02078C8.98967 7.34078 9.33301 6.51745 9.33301 5.55078C9.33301 4.58411 8.98967 3.76078 8.30301 3.08078C7.62301 2.39411 6.79967 2.05078 5.83301 2.05078C4.86634 2.05078 4.04301 2.39411 3.36301 3.08078C2.67634 3.76078 2.33301 4.58411 2.33301 5.55078C2.33301 6.51745 2.67634 7.34078 3.36301 8.02078C4.04301 8.70745 4.86634 9.05078 5.83301 9.05078C6.79967 9.05078 7.62301 8.70745 8.30301 8.02078ZM13.333 12.0508C13.333 12.3241 13.233 12.5574 13.033 12.7508C12.8397 12.9508 12.6063 13.0508 12.333 13.0508C12.053 13.0508 11.8197 12.9508 11.633 12.7508L8.95301 10.0808C8.01967 10.7274 6.97967 11.0508 5.83301 11.0508C5.08634 11.0508 4.37301 10.9074 3.69301 10.6208C3.01301 10.3274 2.42967 9.93411 1.94301 9.44078C1.44967 8.95411 1.05634 8.37078 0.763008 7.69078C0.476341 7.01078 0.333008 6.29745 0.333008 5.55078C0.333008 4.80411 0.476341 4.09078 0.763008 3.41078C1.05634 2.73078 1.44967 2.14745 1.94301 1.66078C2.42967 1.16745 3.01301 0.774115 3.69301 0.480782C4.37301 0.194115 5.08634 0.0507812 5.83301 0.0507812C6.57967 0.0507812 7.29301 0.194115 7.97301 0.480782C8.65301 0.774115 9.23634 1.16745 9.72301 1.66078C10.2163 2.14745 10.6097 2.73078 10.903 3.41078C11.1897 4.09078 11.333 4.80411 11.333 5.55078C11.333 6.69745 11.0097 7.73745 10.363 8.67078L13.043 11.3508C13.2363 11.5441 13.333 11.7774 13.333 12.0508Z" fill="#252525"></path> </g> <defs> <clipPath id="clip0_43_576"> <rect width="13" height="13" fill="white" transform="translate(0.333008 0.0507812)"></rect> </clipPath> </defs> </svg>',
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
