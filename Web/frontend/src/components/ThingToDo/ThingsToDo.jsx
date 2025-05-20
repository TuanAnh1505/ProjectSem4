import React, { useState } from 'react';
import styles from './ThingToDo.module.css';

const ThingsToDo = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    region: null,
    activity: null,
    duration: null,
    price: null,
  });
  const handleFilterClick = (filterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };
  const handleFilterSelect = (type, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [type]: value,
    });
    setActiveFilter(null);
  };
  const clearFilters = () => {
    setSelectedFilters({
      region: null,
      activity: null,
      duration: null,
      price: null,
    });
  };
  const removeFilter = (type) => {
    setSelectedFilters({
      ...selectedFilters,
      [type]: null,
    });
  };
  return (
    <div className={styles.ttdWrapper}>
      {/* Hero Banner */}
      <div className={styles.ttdHeroBanner}>
        <div className={styles.ttdHeroImageWrap}>
          <img
            src="https://readdy.ai/api/search-image?query=breathtaking%20panoramic%20view%20of%20Vietnam%20landscape%20with%20rice%20terraces%2C%20mountains%20in%20background%2C%20morning%20mist%2C%20golden%20sunlight%2C%20vibrant%20green%20fields%2C%20traditional%20Vietnamese%20elements%20visible%2C%20atmospheric%20professional%20photography%2C%20high%20resolution%2C%20cinematic%20lighting&width=1440&height=500&seq=hero1&orientation=landscape"
            alt="Vietnam Landscapes"
            className={styles.ttdHeroImage}
          />
          <div className={styles.ttdHeroOverlay}>
            <div className={styles.ttdHeroContentWrap}>
              <div className={styles.ttdHeroContent}>
                <h1 className={styles.ttdHeroTitle}>Things to Do in Vietnam</h1>
                <p className={styles.ttdHeroSubtitle}>Discover unforgettable experiences in a land of breathtaking landscapes, rich cultural heritage, and warm hospitality.</p>
                <button className={styles.ttdHeroButton}>
                  Explore Experiences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Filter Bar */}
      <div className={styles.ttdFilterBarSticky}>
        <div className={styles.ttdFilterBarContainer}>
          <div className={styles.ttdFilterBarRow}>
            <div className={styles.ttdFilterButtonGroup}>
              {['region', 'activity', 'duration', 'price'].map((type) => (
                <div className={styles.ttdFilterDropdownWrap} key={type}>
                  <button
                    onClick={() => handleFilterClick(type)}
                    className={activeFilter === type ? styles.ttdFilterButtonActive : styles.ttdFilterButton}
                  >
                    <span className={styles.ttdFilterButtonLabel}>{type === 'activity' ? 'Activity Type' : type === 'price' ? 'Price Range' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <i className={`fas fa-chevron-down ${activeFilter === type ? styles.ttdIconRotated : styles.ttdIcon}`}></i>
                  </button>
                  {activeFilter === type && (
                    <div className={styles.ttdDropdownMenu}>
                      {type === 'region' && ['North Vietnam', 'Central Vietnam', 'South Vietnam', 'Mekong Delta', 'Coastal Regions'].map((region) => (
                        <div
                          key={region}
                          onClick={() => handleFilterSelect('region', region)}
                          className={styles.ttdDropdownItem}
                        >
                          {region}
                        </div>
                      ))}
                      {type === 'activity' && ['Culture & Heritage', 'Nature & Adventure', 'Food & Cuisine', 'Beach & Islands', 'Urban Exploration'].map((activity) => (
                        <div
                          key={activity}
                          onClick={() => handleFilterSelect('activity', activity)}
                          className={styles.ttdDropdownItem}
                        >
                          {activity}
                        </div>
                      ))}
                      {type === 'duration' && ['Half Day', 'Full Day', '2-3 Days', '4-7 Days', 'Week+'].map((duration) => (
                        <div
                          key={duration}
                          onClick={() => handleFilterSelect('duration', duration)}
                          className={styles.ttdDropdownItem}
                        >
                          {duration}
                        </div>
                      ))}
                      {type === 'price' && ['Budget', 'Mid-range', 'Luxury', 'All-inclusive'].map((price) => (
                        <div
                          key={price}
                          onClick={() => handleFilterSelect('price', price)}
                          className={styles.ttdDropdownItem}
                        >
                          {price}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.ttdClearFilterWrap}>
              {Object.entries(selectedFilters).some(([_, value]) => value !== null) && (
                <button
                  onClick={clearFilters}
                  className={styles.ttdClearFilterButton}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
          {Object.entries(selectedFilters).some(([_, value]) => value !== null) && (
            <div className={styles.ttdFilterTagGroup}>
              {Object.entries(selectedFilters).map(([key, value]) => {
                if (value) {
                  return (
                    <div key={key} className={styles.ttdFilterTag}>
                      <span>{value}</span>
                      <button
                        onClick={() => removeFilter(key)}
                        className={styles.ttdFilterTagRemove}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
      {/* Main Content - Activity Categories */}
      <section className={styles.ttdSectionGray}>
        <div className={styles.ttdSectionContainer}>
          <h2 className={styles.ttdSectionTitle}>Discover Vietnam's Experiences</h2>
          <div className={styles.ttdCardGrid}>
            {[
              {
                img: 'https://readdy.ai/api/search-image?query=Vietnamese%20cultural%20heritage%20with%20traditional%20temple%20architecture%2C%20ornate%20decorations%2C%20incense%20burning%2C%20locals%20in%20traditional%20attire%20performing%20cultural%20rituals%2C%20vibrant%20colors%2C%20atmospheric%20lighting%2C%20professional%20photography&width=400&height=256&seq=cat1&orientation=landscape',
                title: 'Culture & Heritage',
                desc: `Immerse yourself in Vietnam's rich cultural tapestry through ancient temples, traditional performances, and historical sites that tell the story of this fascinating nation.`,
                count: 42,
              },
              {
                img: 'https://readdy.ai/api/search-image?query=Vietnam%20nature%20adventure%20with%20lush%20green%20mountains%2C%20dramatic%20karst%20formations%2C%20hikers%20exploring%20trails%2C%20crystal%20clear%20water%2C%20dense%20jungle%20vegetation%2C%20mist%20rising%20from%20valleys%2C%20vibrant%20natural%20colors%2C%20professional%20landscape%20photography&width=400&height=256&seq=cat2&orientation=landscape',
                title: 'Nature & Adventure',
                desc: `From the limestone karsts of Halong Bay to the terraced rice fields of Sapa, Vietnam's diverse landscapes offer endless opportunities for trekking, kayaking, and exploration.`,
                count: 56,
              },
              {
                img: 'https://readdy.ai/api/search-image?query=Vietnamese%20cuisine%20with%20colorful%20street%20food%20stalls%2C%20steaming%20bowls%20of%20pho%2C%20fresh%20spring%20rolls%2C%20exotic%20fruits%2C%20local%20chefs%20cooking%20traditional%20dishes%2C%20vibrant%20market%20scene%2C%20authentic%20food%20presentation%2C%20professional%20food%20photography&width=400&height=256&seq=cat3&orientation=landscape',
                title: 'Food & Cuisine',
                desc: `Savor the flavors of Vietnam through cooking classes, street food tours, and market visits. Learn the secrets behind pho, banh mi, and other iconic Vietnamese dishes.`,
                count: 38,
              },
              {
                img: 'https://readdy.ai/api/search-image?query=pristine%20Vietnamese%20beaches%20with%20turquoise%20water%2C%20white%20sand%2C%20palm%20trees%2C%20small%20islands%20visible%20in%20distance%2C%20traditional%20boats%2C%20sunny%20tropical%20weather%2C%20paradise-like%20setting%2C%20professional%20beach%20photography&width=400&height=256&seq=cat4&orientation=landscape',
                title: 'Beach & Islands',
                desc: `Relax on Vietnam's stunning coastline, from the pristine beaches of Phu Quoc to the hidden coves of Con Dao. Enjoy swimming, snorkeling, and island-hopping adventures.`,
                count: 29,
              },
              {
                img: 'https://readdy.ai/api/search-image?query=bustling%20Vietnamese%20urban%20scene%20with%20modern%20skyscrapers%2C%20traditional%20architecture%2C%20busy%20streets%20with%20motorbikes%2C%20street%20vendors%2C%20neon%20lights%2C%20city%20life%2C%20vibrant%20urban%20colors%2C%20professional%20cityscape%20photography&width=400&height=256&seq=cat5&orientation=landscape',
                title: 'Urban Exploration',
                desc: `Discover the dynamic cities of Vietnam, from the colonial architecture of Hanoi to the modern skyline of Ho Chi Minh City. Experience urban life through markets, museums, and more.`,
                count: 34,
              },
              {
                img: 'https://readdy.ai/api/search-image?query=Vietnamese%20rural%20countryside%20with%20rice%20farmers%20in%20conical%20hats%2C%20water%20buffalo%2C%20traditional%20village%20houses%2C%20terraced%20rice%20fields%2C%20early%20morning%20mist%2C%20golden%20sunlight%2C%20authentic%20rural%20life%2C%20professional%20documentary%20photography&width=400&height=256&seq=cat6&orientation=landscape',
                title: 'Rural Experiences',
                desc: `Connect with Vietnam's countryside through homestays, farm visits, and village tours. Experience traditional lifestyles and the warm hospitality of rural communities.`,
                count: 27,
              },
            ].map((cat, idx) => (
              <div key={cat.title} className={styles.ttdCard}>
                <div className={styles.ttdCardImageWrap}>
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className={styles.ttdCardImage}
                  />
                </div>
                <div className={styles.ttdCardContent}>
                  <h3 className={styles.ttdCardTitle}>{cat.title}</h3>
                  <p className={styles.ttdCardDesc}>{cat.desc}</p>
                  <div className={styles.ttdCardFooter}>
                    <span className={styles.ttdCardCount}>{cat.count} experiences</span>
                    <button className={styles.ttdCardArrowButton}>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Popular Experiences Section */}
      <section className={styles.ttdSectionWhite}>
        <div className={styles.ttdSectionContainer}>
          <h2 className={styles.ttdSectionTitle}>Popular Experiences</h2>
          <p className={styles.ttdSectionSubtitle}>Discover the most loved activities by travelers in Vietnam</p>
          <div className={styles.ttdPopularExpWrapper}>
            <div className={styles.ttdPopularExpScroll}>
              {[
                {
                  img: 'https://readdy.ai/api/search-image?query=Ha%20Long%20Bay%20cruise%20with%20limestone%20karsts%2C%20traditional%20wooden%20junk%20boat%2C%20emerald%20waters%2C%20tourists%20enjoying%20the%20view%2C%20sunny%20day%2C%20natural%20wonder%2C%20UNESCO%20site%2C%20professional%20travel%20photography&width=300&height=192&seq=exp1&orientation=landscape',
                  place: 'Halong Bay',
                  title: 'Overnight Cruise Experience',
                  desc: 'Sail through the emerald waters of Halong Bay on a traditional junk boat, exploring caves and enjoying fresh seafood.',
                  price: '$120',
                },
                {
                  img: 'https://readdy.ai/api/search-image?query=Hoi%20An%20ancient%20town%20at%20night%20with%20colorful%20lanterns%2C%20traditional%20yellow%20buildings%2C%20reflections%20in%20water%2C%20tourists%20walking%20on%20streets%2C%20atmospheric%20lighting%2C%20UNESCO%20heritage%20site%2C%20professional%20night%20photography&width=300&height=192&seq=exp2&orientation=landscape',
                  place: 'Hoi An',
                  title: 'Lantern Making & Night Tour',
                  desc: `Create your own silk lantern with local artisans and experience the magic of Hoi An's illuminated Ancient Town.`,
                  price: '$35',
                },
                {
                  img: 'https://readdy.ai/api/search-image?query=Mekong%20Delta%20river%20scene%20with%20traditional%20wooden%20boats%2C%20floating%20market%2C%20local%20vendors%20selling%20fruits%2C%20lush%20tropical%20vegetation%2C%20authentic%20river%20life%2C%20morning%20light%2C%20vibrant%20colors%2C%20professional%20travel%20photography&width=300&height=192&seq=exp3&orientation=landscape',
                  place: 'Mekong Delta',
                  title: 'Floating Markets Exploration',
                  desc: 'Navigate the waterways of the Mekong Delta, visiting floating markets and experiencing the unique river culture.',
                  price: '$45',
                },
                {
                  img: 'https://readdy.ai/api/search-image?query=Sapa%20rice%20terraces%20with%20ethnic%20minority%20people%20in%20traditional%20colorful%20clothing%2C%20mountainous%20landscape%2C%20green%20terraced%20fields%2C%20misty%20atmosphere%2C%20rural%20village%20life%2C%20authentic%20cultural%20scene%2C%20professional%20travel%20photography&width=300&height=192&seq=exp4&orientation=landscape',
                  place: 'Sapa',
                  title: 'Hill Tribe Trek & Homestay',
                  desc: 'Trek through stunning rice terraces and stay with local ethnic minority families to experience their traditional way of life.',
                  price: '$65',
                },
                {
                  img: 'https://readdy.ai/api/search-image?query=Vietnamese%20cooking%20class%20with%20fresh%20ingredients%2C%20colorful%20vegetables%2C%20chef%20demonstrating%20cooking%20techniques%2C%20students%20learning%20to%20prepare%20traditional%20dishes%2C%20authentic%20kitchen%20setting%2C%20professional%20food%20photography&width=300&height=192&seq=exp5&orientation=landscape',
                  place: 'Hanoi',
                  title: 'Traditional Cooking Class',
                  desc: 'Learn to prepare authentic Vietnamese dishes with local chefs, including a market visit to select fresh ingredients.',
                  price: '$40',
                },
              ].map((exp, idx) => (
                <div key={exp.title} className={styles.ttdPopularExpCard}>
                  <div className={styles.ttdPopularExpImageWrap}>
                    <img
                      src={exp.img}
                      alt={exp.title}
                      className={styles.ttdPopularExpImage}
                    />
                    <div className={styles.ttdPopularExpPlace}>{exp.place}</div>
                  </div>
                  <div className={styles.ttdPopularExpContent}>
                    <h3 className={styles.ttdPopularExpTitle}>{exp.title}</h3>
                    <p className={styles.ttdPopularExpDesc}>{exp.desc}</p>
                    <div className={styles.ttdPopularExpFooter}>
                      <span className={styles.ttdPopularExpPrice}>From {exp.price}</span>
                      <button className={styles.ttdPopularExpButton}>
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.ttdPopularExpNavLeft}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className={styles.ttdPopularExpNavRight}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div className={styles.ttdPopularExpViewAllWrapper}>
            <button className={styles.ttdPopularExpViewAllButton}>
              View All Experiences
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ThingsToDo; 