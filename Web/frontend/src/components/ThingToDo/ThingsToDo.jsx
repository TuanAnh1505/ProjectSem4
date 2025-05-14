import React from 'react';
import styles from "./ThingToDo.module.css";
const ThingsToDo = () => {
  return (
    <div className={styles['ttd-page']}>
      <section className={styles['ttd-hero']}>
        <img className={styles['ttd-hero-bg']} src="https://ext.same-assets.com/341254039/1975030877.jpeg" alt="Kayaking in Ha Long Bay" />
        <div className={styles['ttd-hero-title']}>
          <h1>Things to do</h1>
        </div>
      </section>

      {/* Get Inspired Section - use ttd- prefixed class names to avoid CSS conflicts */}
      <section id="categories">
        <div className={styles['ttd-container']}>
          <h2 className={styles['ttd-section-heading'] + ' ' + styles['ttd-text-uppercase'] + ' ' + styles['ttd-gothambold']}>get inspired</h2>
          <p className={styles['ttd-section-desc']}>There are so many insightful tours, amazing dishes and fun activities in Vietnam, you'll never run out of interesting things to do. Here are some handpicked ideas to get you started.</p>
          <div className={styles['ttd-row']}>
            <div className={styles['ttd-col-md-1']}></div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/food">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2019-09/FOOD.png?itok=XOqhHekL" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Food</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/nature">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2019-09/NATURE.png?itok=mcGz1tXg" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Nature</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/culture">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2019-09/CULTURE.png?itok=8yZ1jZSz" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Culture</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/cities">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2019-09/CITIES.jpg?itok=WdS7lAOK" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Cities</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/beaches">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2019-09/BEACHES.png?itok=hF0-_Jh9" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Beaches</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-1']}></div>
          </div>
          <div className={styles['ttd-row']}>
            <div className={styles['ttd-col-md-1']}></div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/adventure">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2021-05/Adventure%20in%20Vietnam-2.jpg?itok=hyI-n0lt" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Adventure</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/wellness">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2021-05/Vietnam%20spas.jpeg?itok=IQsbcqPX" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Wellness</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/family">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2019-09/FAMILY.png?itok=OEO7wp8l" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Family</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/luxury">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2020-11/vietnam%20best%20luxury%20resorts-2.jpg?itok=ko9W41Py" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Luxury</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-2'] + ' ' + styles['ttd-text-center']}>
              <div className={styles['ttd-thumbnail']}>
                <a href="/things-to-do/golf">
                  <img src="//image.vietnam.travel/sites/default/files/styles/thumbnail/public/2021-05/Golfing%20in%20Vietnam.jpg?itok=et5NPJvW" alt="" />
                  <div className={styles['ttd-caption'] + ' ' + styles['ttd-text-uppercase']}>
                    <p><strong>Golf</strong></p>
                  </div>
                </a>
              </div>
            </div>
            <div className={styles['ttd-col-md-1']}></div>
          </div>
        </div>
      </section>

      {[
        {
          title: "FABULOUS FOOD",
          desc: "If there's one characteristic that unites Vietnamese food, it's freshness. Pass by any Vietnamese market, you'll be amazed by the abundance of the sea and soil: feathery herbs, plump vegetables and flapping-fresh proteins. Freshness is where the fun begins. Vietnamese cooks enhance beautiful ingredients with aromatic herbs and contrasting textures for maximum delight. Simply put, it's one of the world's healthiest and most delicious cuisines.",
          img: "453320992.jpeg",
          items: ["2073108004", "3820585415", "3659209329"],
          light: true
        },
        {
          title: "STRIKING SCENERY",
          desc: "Vietnam is chock-full of forested peaks, thundering waterfalls, and breezy coastline, so it's no wonder the country is luring more and more outdoor enthusiasts. With so many options at your fingertips, you may need a second (or third) trip to take it all in. And while there are plenty of pulse-pounding activities, Vietnam also presents more leisurely ways to enjoy its vast natural attractions.",
          img: "3452143680.jpeg",
          items: ["801161293", "3107441456", "3942348887"]
        },
        {
          title: "TIMELESS CULTURE",
          desc: "In a country like Vietnam, the word 'culture' has a thousand meanings. It might mean the red and gold gilded doors of the Hue Citadel, or the tin-filter drip coffee served on every street corner. It might mean the sensitive watercolours hanging in a contemporary gallery, or the throaty cry of Ca Trù sung poetry. It could even encompass the embroidered costumes of the Flower Hmong, or the subtle lines of the áo dài. Past and present, hand-in-hand, are what makes Vietnamese culture so compelling.",
          img: "874833956.jpeg",
          items: ["4195570691.png", "3931725044.jpeg", "3930720519.jpeg"],
          light: true
        },
        {
          title: "CHANGING CITIES",
          desc: "Spend a few days in its urban centres, and you'll see why so many travellers are taken with Vietnam's captivating energy. In the streets and you'll encounter chaotic markets and colonial-era cafes, sparkling malls, hip rooftop lounges, and tidy boutiques. At least once in your stay, do as the locals do and enjoy an evening of barbecue and beer on the sidewalk, or chat over a cup of tea in the shade of a city park",
          img: "4056722554.jpeg",
          items: ["1518605977", "1253051165", "363991872"]
        },
        {
          title: "BLISSFUL BEACHES",
          desc: "Vietnam is a country with a long, curving coastline. Scattered offshore are dozens of beautiful islets, teeming with sea life and blessed with pristine shores. Vietnam's coastal cities are packed with activities and on-the-water adventures, while its fishing villages still hold their simple, seaside charms. Wherever you choose, chilled coconuts, basket boats, and seafood dinners are guaranteed.",
          img: "461672827.jpeg",
          items: ["1484154488", "1170826115", "4019784839"],
          light: true
        }
      ].map((section, index) => (
        <section key={index} className={styles['ttd-main-section'] + (section.light ? ' ' + styles['ttd-bg-light'] : '')}>
          <div className={styles['ttd-section-image-large']}>
            <img src={`https://ext.same-assets.com/341254039/${section.img}`} alt={section.title} />
          </div>
          <div className={styles['ttd-container']}>
            <h2 className={styles['ttd-section-title'] + ' ' + styles['ttd-gold-text']}>{section.title}</h2>
            <p className={styles['ttd-section-desc']}>{section.desc}</p>
            <div className={styles['ttd-section-grid']}>
              {section.title === 'FABULOUS FOOD' ? (
                <>
                  <a href="#" className={styles['ttd-section-grid-item']}>
                    <img src="/" alt="Banh Mi Ha Noi" />
                  </a>
                  <a href="#" className={styles['ttd-section-grid-item']}>
                    <img src="/images/bun-ca-ha-noi-3_1686916683_1.jpg" alt="Bun Ca Ha Noi" />
                  </a>
                  <a href="#" className={styles['ttd-section-grid-item']}>
                    <img src="/images/hagiangfood_0.jpg" alt="Ha Giang Food" />
                  </a>
                </>
              ) : (
                section.items.map((id, idx) => (
                  <a href="#" key={idx} className={styles['ttd-section-grid-item']}>
                    <img src={`https://ext.same-assets.com/341254039/${id}`} alt={`${section.title} ${idx}`} />
                  </a>
                ))
              )}
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <a href="#" className={styles['ttd-view-more-btn']}>View more</a>
            </div>
          </div>
        </section>
      ))}

      <section className={styles['ttd-events-section']}>
        <div className={styles['ttd-container']}>
          <h2 className={styles['ttd-section-title'] + ' ' + styles['ttd-events-title']}>Festivals and special events</h2>
          <div className={styles['ttd-section-grid'] + ' ' + styles['ttd-events-grid']}>
            {["2001932791", "2712733397", "3811194866"].map((id, idx) => (
              <a href="#" key={idx} className={styles['ttd-section-grid-item']}>
                <img src={`https://ext.same-assets.com/341254039/${id}.jpeg`} alt={`Event ${idx}`} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThingsToDo;
