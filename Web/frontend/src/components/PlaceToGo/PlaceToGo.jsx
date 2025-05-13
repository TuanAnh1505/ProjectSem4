import React from "react";
import styles from "./PlacesToGo.module.css";
import banner from "../PlaceToGo/Places_to_Go_Vietnam_Travel.jpg";

export default function PlacesToGo() {
  return (
    <main>
      {/* Hero Banner */}
      <section
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${banner})` }}
      >
        {/* Visually hidden image for SEO */}
        <img src={banner} alt="Vietnam Travel" className={styles.heroImg} />
        <h1 className={styles.heroTitle}>Places to go</h1>
      </section>

      {/* Urban Hubs */}
      <section id="also-like" data-module="alsoLike">
        <div className={styles.placesContainer}>
          <div style={{ textAlign: 'center' }}>
            <h2 className={styles.placesSectionHeading}>URBAN HUBS</h2>
          </div>
          <p className={styles.placesSectionDesc}>
            Each Vietnamese city exudes its own distinct character. Get a feel for Vietnam's fascinating urban centres in these interactive tours.
          </p>
          <div className={styles.placesRow}>
            <div className={styles.placesCol}>
              <ul className={styles.placesList}>
                {[
                  { name: "Hanoi", img: "//image.vietnam.travel/sites/default/files/360Tour/HaNoi/socialThumbnail.jpg", link: "/sites/default/files/360Tour/HaNoi/index.htm", label: "Hanoi" },
                  { name: "Da Nang", img: "//image.vietnam.travel/sites/default/files/360Tour/DaNang/socialThumbnail.jpg", link: "/sites/default/files/360Tour/DaNang/index.htm", label: "Da Nang" },
                  { name: "Ho Chi Minh City", img: "//image.vietnam.travel/sites/default/files/360Tour/HoChiMinhCity/socialThumbnail.jpg", link: "/sites/default/files/360Tour/HoChiMinhCity/index.htm", label: "Ho Chi Minh City" }
                ].map((city, idx) => (
                  <li className={styles.placesItem} key={idx}>
                    <div className={styles.placesWrapThumb}>
                      <a target="_blank" rel="noopener noreferrer" href={city.link}>
                        <img className={styles.placesThumb} src={city.img} alt={city.name} />
                        <span className={styles.handwriting}>{city.label}</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Sites */}
      <section id="also-like" data-module="alsoLike" className={styles.second}>
        <div className={styles.placesContainer}>
          <div style={{ textAlign: 'center' }}>
            <h2 className={styles.placesSectionHeading}>HERITAGE SITES</h2>
          </div>
          <p className={styles.placesSectionDesc}>
            Curious what awaits you in Vietnam? Take a 360-degree tour of some of the country's most compelling natural wonders and cultural attractions right here.
          </p>
          <div className={styles.placesRow}>
            <div className={styles.placesCol}>
              <ul className={styles.placesList}>
                {[
                  { name: "Ha Long", img: "//image.vietnam.travel/sites/default/files/360Tour/HaLong/socialThumbnail.jpg", link: "/sites/default/files/360Tour/HaLong/index.htm", label: "Ha Long" },
                  { name: "Ninh Binh", img: "//image.vietnam.travel/sites/default/files/360Tour/NinhBinh/socialThumbnail.jpg", link: "/sites/default/files/360Tour/NinhBinh/index.htm", label: "Ninh Binh" },
                  { name: "Phong Nha", img: "//image.vietnam.travel/sites/default/files/360Tour/PhongNha/socialThumbnail.jpg", link: "/sites/default/files/360Tour/PhongNha/index.htm", label: "Phong Nha" },
                  { name: "Hue", img: "//image.vietnam.travel/sites/default/files/360Tour/Hue/socialThumbnail.jpg", link: "/sites/default/files/360Tour/Hue/index.htm", label: "Hue" },
                  { name: "Hoi An", img: "//image.vietnam.travel/sites/default/files/360Tour/HoiAn/socialThumbnail.jpg", link: "/sites/default/files/360Tour/HoiAn/index.htm", label: "Hoi An" },
                  { name: "My Son", img: "//image.vietnam.travel/sites/default/files/360Tour/MySon/socialThumbnail.jpg", link: "/sites/default/files/360Tour/MySon/index.htm", label: "My Son" }
                ].map((place, idx) => (
                  <li className={styles.placesItem} key={idx}>
                    <div className={styles.placesWrapThumb}>
                      <a target="_blank" rel="noopener noreferrer" href={place.link}>
                        <img className={styles.placesThumb} src={place.img} alt={place.name} />
                        <span className={styles.handwriting}>{place.label}</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* #MYVIETNAM */}
      <section>
        <h2 className={styles.sectionTitle}>#MYVIETNAM</h2>
        <p className={styles.sectionDesc}>
          Get an insider look at Vietnam's best destinations. Let these local Vietnamese show you around their hometowns with personal stories, top tips, and must-do experiences.
        </p>
        <div className={styles.myvietnamGrid}>
          {[
            ["My HCMC", "Entrepreneur Nam Quan", 1843254175],
            ["My Da Nang", "Restaurateur Mai Thuy Tram", 2940689654],
            ["My Dalat", "Adventure Expert Phu Nguyen", 3981053404],
            ["My Sapa", "Local Guide Ly Thy Ker", 1306797690],
            ["My Nha Trang", "Vibe Director TK Nguyen", 3770801827],
            ["My Ha Noi", "Art Enthusiast Maia Do", 606937233],
            ["My Mui Ne", "Kite-boarding Instructor Tom Pham", 1183490999],
            ["My Hoi An", "Chef Tran Thanh Duc", 3103599218],
            ["My Ninh Binh", "Founder and Tour Operator Pham Minh Tam", 2807876912]
          ].map(([city, title, id], idx) => (
            <div className={styles.myvnCard} key={idx}>
              <img src={`https://ext.same-assets.com/1450421094/${id}.jpeg`} alt={city} />
              <span className={styles.myvnLabel}>{city}<br /><strong>{title}</strong></span>
            </div>
          ))}
        </div>
      </section>

      {/* Itineraries */}
      <section id="recommended" data-module="recommended">
        <div className={styles.container}>
          <h2 className={`${styles.sectionHeading} ${styles.northwell}`}>itineraries</h2>
          <div className={styles.row}>
            <div className={styles.colXs12}>
              <ul className={styles.itinList}>
                {[
                  {
                    title: 'Vietnam for Families',
                    img: '//image.vietnam.travel/sites/default/files/styles/reference_thumbnail/public/2018-08/Vietnam%20for%20Families%20Banner.jpg?itok=n4r1mwjs',
                    link: '/plan-your-trip/recommended-trip/vietnam-families'
                  },
                  {
                    title: 'Heritage Sites of Vietnam',
                    img: '//image.vietnam.travel/sites/default/files/styles/reference_thumbnail/public/2018-08/UNESCO%20Vietnam%20Banner.jpg?itok=a0yaxJbc',
                    link: '/plan-your-trip/recommended-trip/heritage-sites-vietnam'
                  },
                  {
                    title: 'Vietnam In Depth',
                    img: '//image.vietnam.travel/sites/default/files/styles/reference_thumbnail/public/2018-08/Best%20of%20Vietnam-17.jpg?itok=D4Pb6cHJ',
                    link: '/plan-your-trip/recommended-trip/vietnam-photo-lovers'
                  }
                ].map((item, idx) => (
                  <li className={styles.itinItem} key={idx}>
                    <div className={styles.itinWrapThumb}>
                      <a href={item.link}>
                        <img src={item.img} className={styles.itinThumb} alt={item.title} />
                        <span className={styles.itinInfo}>{item.title}</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
