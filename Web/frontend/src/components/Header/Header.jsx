import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from './logo.png'; // chỉnh path đúng thư mục chứa ảnh


const Header = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <div className={styles.toplinks}>
        <ul className={styles.headerActions}>
          {/* Đã xoá icon search */}
        </ul>
      </div>
      <div className={styles.row}>
        <h1 className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="Vietnam Tourism Logo" style={{width: '120px', height: 'auto'}}/>


          </Link>
        </h1>
        <nav className={styles.mainNav}>
          <ul>

          <li className={styles.hasFlyout}>
              <Link to="/live-fully" className={styles.lang}>
                Live fully in Vietnam <span className={styles.arrow}></span>
              </Link>
              <div className={styles.flyout}>
                <ul>
                  <li><Link to="/vietnamnow">Vietnam Now</Link></li>
                  <li><Link to="/whynotvietnam">Why not VN</Link></li>
                  <li><Link to="/myvietnam">My Vietnam</Link></li>
                  <li><Link to="/virtual-vietnam">Virtual VN</Link></li>
                </ul>
              </div>
            </li>
            <li className={styles.hasFlyout}>
              <Link to="/places-to-go">
                Places to go <span className={styles.arrow}></span>
              </Link>
              <div className={`${styles.flyout} ${styles['flyout--places']}`}>
                <div className={styles.flyoutRow}>
                  <div className={styles.flyoutCol}>
                    <p>NORTHERN VIETNAM</p>
                    <img src="//image.vietnam.travel/sites/default/files/styles/inspired_thumbnail_box/public/2017-06/hanoi-vietnam.jpg?itok=_KznfLHU" alt="Ha Noi" />
                    <ul>
                      <li className={styles.mainCity}><Link to="/places-to-go/northern-vietnam/ha-noi">HA NOI</Link></li>
                      <li><Link to="/places-to-go/northern-vietnam/ha-giang">Ha Giang</Link></li>
                      <li><Link to="/places-to-go/northern-vietnam/ha-long">Ha Long</Link></li>
                      <li><Link to="/places-to-go/northern-vietnam/mai-chau">Mai Chau</Link></li>
                      <li><Link to="/places-to-go/northern-vietnam/ninh-binh">Ninh Binh</Link></li>
                      <li><Link to="/places-to-go/northern-vietnam/sapa">Sapa</Link></li>
                    </ul>
                  </div>
                  <div className={styles.flyoutCol}>
                    <p>CENTRAL VIETNAM</p>
                    <img src="//image.vietnam.travel/sites/default/files/styles/inspired_thumbnail_box/public/2018-10/danang%20travel%20guide%20thumb.jpg?itok=nY3_-wA4" alt="Da Nang" />
                    <ul>
                      <li className={styles.mainCity}><Link to="/places-to-go/central-vietnam/da-nang">DA NANG</Link></li>
                      <li><Link to="/places-to-go/central-vietnam/dalat">Da Lat</Link></li>
                      <li><Link to="/places-to-go/central-vietnam/hoi-an">Hoi An</Link></li>
                      <li><Link to="/places-to-go/central-vietnam/hue">Hue</Link></li>
                      <li><Link to="/places-to-go/central-vietnam/nha-trang">Nha Trang</Link></li>
                      <li><Link to="/places-to-go/central-vietnam/phong-nha">Phong Nha</Link></li>
                    </ul>
                  </div>
                  <div className={styles.flyoutCol}>
                    <p>SOUTHERN VIETNAM</p>
                    <img src="//image.vietnam.travel/sites/default/files/styles/inspired_thumbnail_box/public/2017-07/travel-vietnam-4.jpg?itok=Tq5SAR65" alt="Ho Chi Minh City" />
                    <ul>
                      <li className={styles.mainCity}><Link to="/places-to-go/southern-vietnam/ho-chi-minh-city">HO CHI MINH CITY</Link></li>
                      <li><Link to="/places-to-go/southern-vietnam/con-dao">Con Dao</Link></li>
                      <li><Link to="/places-to-go/southern-vietnam/binh-thuan">Binh Thuan</Link></li>
                      <li><Link to="/places-to-go/southern-vietnam/can-tho">Can Tho</Link></li>
                      <li><Link to="/places-to-go/southern-vietnam/chau-doc">Chau Doc</Link></li>
                      <li><Link to="/places-to-go/southern-vietnam/phu-quoc">Phu Quoc</Link></li>
                    </ul>
                  </div>
                  <div className={styles.flyoutMap}>
                    <img src="//image.vietnam.travel/themes/custom/vietnamtourism/images/flyout-map.png" alt="Vietnam Map" />
                    <Link to="/places-to-go/northern-vietnam">NORTHERN VIETNAM</Link>
                    <Link to="/places-to-go/central-vietnam">CENTRAL VIETNAM</Link>
                    <Link to="/places-to-go/southern-vietnam">SOUTHERN VIETNAM</Link>
                  </div>
                </div>
              </div>
            </li>
            <li className={styles.hasFlyout}>
              <Link to="/things-to-do">
                Things to do <span className={styles.arrow}></span>
              </Link>
              <div className={styles.flyout}>
                <div className={styles.flyoutRow}>
                  <div className={styles.flyoutCol}>
                    <p><Link to="/things-to-do?#inspires--activities">HIGHLIGHTS</Link></p>
                    <ul>
                      <li><Link to="/things-to-do/food">Food</Link></li>
                      <li><Link to="/things-to-do/nature">Nature</Link></li>
                      <li><Link to="/things-to-do/culture">Culture</Link></li>
                      <li><Link to="/things-to-do/cities">Cities</Link></li>
                      <li><Link to="/things-to-do/beaches">Beaches</Link></li>
                    </ul>
                  </div>
                  <div className={styles.flyoutCol}>
                    <p><Link to="/things-to-do?#inspires--interests">HOLIDAYS</Link></p>
                    <ul>
                      <li><Link to="/things-to-do/adventure">Adventure</Link></li>
                      <li><Link to="/things-to-do/wellness">Wellness</Link></li>
                      <li><Link to="/things-to-do/family">Family</Link></li>
                      <li><Link to="/things-to-do/luxury">Luxury</Link></li>
                      <li><Link to="/things-to-do/golf">Golf</Link></li>
                    </ul>
                  </div>
                  <div className={styles.flyoutCol}>
                    <p><a href="/event">UPCOMING FESTIVALS & EVENTS</a></p>
                    <ul>
                      <li>
                        <a href="/things-to-do/festival-event/hue-festival-2025?month=may&year=2025">
                          <span>Hue Festival 2025</span>
                          <span>01 Jan 2025 - 31 Dec 2025</span>
                        </a>
                      </li>
                      <li>
                        <a href="/things-to-do/festival-event/nha-trang-khanh-hoa-sea-festival-2025?month=may&year=2025">
                          <span>Nha Trang - Khanh Hoa Sea Festival 2025</span>
                          <span>10 Apr 2025 - 27 Jun 2025</span>
                        </a>
                      </li>
                      <li>
                        <a href="/things-to-do/festival-event/ninh-binh-tourism-week-2025?month=may&year=2025">
                          <span>Ninh Binh Tourism Week 2025</span>
                          <span>29 May 2025 - 31 May 2025</span>
                        </a>
                      </li>
                    </ul>
                    <a href="/event" style={{ color: '#a61a19', fontWeight: 700 }}>View all</a>
                  </div>
                </div>
              </div>
            </li>
            <li className={styles.hasFlyout}>
              <Link to="/plan-your-trip">
                Plan your trip <span className={styles.arrow}></span>
              </Link>
              <div className={styles.flyout}>
                <div className={styles.flyoutRow}>
                  <div className={styles.flyoutCol}>
                    <ul>
                      <li><Link to="/plan/visa-requirements">Visa Requirements</Link></li>
                      <li><Link to="/plan/official-vietnam-evisa-application">E-visa Applications</Link></li>
                      <li><Link to="/plan/getting-vietnam">Getting to Vietnam</Link></li>
                      <li><Link to="/plan/transport-within-vietnam">Getting Around Vietnam</Link></li>
                      <li><Link to="/plan/health-safety">Health & Safety</Link></li>
                      <li><Link to="/plan/vietnamese-phrases">Vietnamese Phrases</Link></li>
                    </ul>
                  </div>
                  <div className={styles.flyoutCol}>
                    <p><Link to="/plan/itineraries">ITINERARIES</Link></p>
                    <ul>
                      <li><Link to="/plan/itineraries">View all trips</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <Link to="/tour-detail-dashboard">Tour booking</Link>
            </li>
            <li className={styles.hasFlyout}>
              <a href="#" className={styles.lang}>
                EN <span className={styles.arrow}></span>
              </a>
              <div className={styles.flyout}>
                
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

export default Header; 