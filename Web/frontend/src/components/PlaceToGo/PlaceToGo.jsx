import React, { useState } from "react";
import styles from "./PlacesToGo.module.css";

const regions = [
    {
      id: "north",
      name: "Northern Vietnam",
      description:
        "Discover the mountainous landscapes, ethnic cultures, and the bustling capital of Hanoi in Northern Vietnam.",
      destinations: [
        {
          id: "hanoi",
          name: "Hanoi",
          description:
            "Vietnam's capital city blends ancient temples with French colonial architecture and a vibrant street food scene.",
          image:
            "https://readdy.ai/api/search-image?query=Hanoi%20Vietnam%20cityscape%20with%20traditional%20architecture%2C%20French%20colonial%20buildings%2C%20and%20busy%20street%20scenes.%20Modern%20photography%20with%20natural%20lighting%2C%20showing%20the%20blend%20of%20old%20and%20new%20in%20Vietnam%20capital%20city&width=600&height=400&seq=hanoi1&orientation=landscape",
          region: "north",
          experiences: ["culture", "food", "urban"],
          seasons: ["spring", "autumn"],
        },
        {
          id: "halong-bay",
          name: "Ha Long Bay",
          description:
            "UNESCO World Heritage site featuring thousands of limestone karsts and isles in various shapes and sizes.",
          image:
            "https://readdy.ai/api/search-image?query=Ha%20Long%20Bay%20Vietnam%20with%20emerald%20waters%20and%20thousands%20of%20towering%20limestone%20islands%20topped%20with%20rainforests.%20Dramatic%20sunset%20lighting%20creating%20golden%20reflections%20on%20the%20calm%20water.%20Professional%20travel%20photography&width=600&height=400&seq=halong1&orientation=landscape",
          region: "north",
          experiences: ["nature", "adventure"],
          seasons: ["spring", "autumn", "winter"],
        },
        {
          id: "sapa",
          name: "Sapa",
          description:
            "Mountain town known for its terraced rice fields and home to many ethnic minority villages.",
          image:
            "https://readdy.ai/api/search-image?query=Sapa%20Vietnam%20terraced%20rice%20fields%20with%20morning%20mist%20rolling%20over%20green%20mountains.%20Local%20ethnic%20minority%20villagers%20in%20traditional%20colorful%20clothing%20working%20in%20the%20fields.%20Golden%20sunrise%20light%20creating%20dramatic%20shadows&width=600&height=400&seq=sapa1&orientation=landscape",
          region: "north",
          experiences: ["nature", "culture", "adventure"],
          seasons: ["spring", "summer", "autumn"],
        },
        {
          id: "ninh-binh",
          name: "Ninh Binh",
          description:
            "Known as Ha Long Bay on land, featuring limestone karsts, ancient temples, and scenic boat rides through rice paddies.",
          image:
            "https://readdy.ai/api/search-image?query=Ninh%20Binh%20Vietnam%20landscape%20with%20towering%20limestone%20mountains%2C%20traditional%20boats%20rowing%20through%20scenic%20rivers%2C%20ancient%20temples%20nestled%20in%20caves%2C%20and%20vibrant%20green%20rice%20fields.%20Soft%20morning%20light%20creating%20mystical%20atmosphere&width=600&height=400&seq=ninhbinh1&orientation=landscape",
          region: "north",
          experiences: ["nature", "culture", "adventure"],
          seasons: ["spring", "autumn"],
        },
        {
          id: "mai-chau",
          name: "Mai Chau",
          description:
            "Peaceful valley surrounded by emerald mountains, home to Thai ethnic villages and traditional stilt houses.",
          image:
            "https://readdy.ai/api/search-image?query=Mai%20Chau%20Vietnam%20valley%20with%20traditional%20wooden%20stilt%20houses%2C%20surrounded%20by%20lush%20green%20rice%20terraces%20and%20mountains.%20Thai%20ethnic%20villagers%20in%20colorful%20traditional%20clothing%20working%20in%20fields.%20Golden%20sunset%20light%20casting%20long%20shadows&width=600&height=400&seq=maichau1&orientation=landscape",
          region: "north",
          experiences: ["nature", "culture", "relaxation"],
          seasons: ["spring", "autumn"],
        },
        {
          id: "ha-giang",
          name: "Ha Giang",
          description:
            "Remote mountainous province with dramatic landscapes, winding roads, and diverse ethnic minority cultures.",
          image:
            "https://readdy.ai/api/search-image?query=Ha%20Giang%20Vietnam%20with%20winding%20mountain%20roads%20through%20dramatic%20karst%20peaks%2C%20terraced%20fields%20on%20steep%20hillsides%2C%20and%20traditional%20ethnic%20minority%20villages.%20Misty%20morning%20atmosphere%20with%20soft%20sunlight%20breaking%20through%20clouds&width=600&height=400&seq=hagiang1&orientation=landscape",
          region: "north",
          experiences: ["adventure", "nature", "culture"],
          seasons: ["spring", "autumn"],
        },
      ],
    },
    {
      id: "central",
      name: "Central Vietnam",
      description:
        "Experience the historical richness, pristine beaches, and cultural heritage of Vietnam's central region.",
      destinations: [
        {
          id: "hue",
          name: "Hue",
          description:
            "Former imperial capital with the historic Citadel, royal tombs, and a rich culinary tradition.",
          image:
            "https://readdy.ai/api/search-image?query=Hue%20Vietnam%20Imperial%20City%20with%20ancient%20architecture%2C%20ornate%20gates%20and%20pavilions.%20Purple%20Forbidden%20City%20with%20traditional%20Vietnamese%20design%20elements.%20Historical%20site%20with%20lush%20gardens%20and%20water%20features.%20Professional%20travel%20photography&width=600&height=400&seq=hue1&orientation=landscape",
          region: "central",
          experiences: ["culture", "history", "food"],
          seasons: ["spring", "autumn"],
        },
        {
          id: "danang",
          name: "Da Nang",
          description:
            "Modern city with beautiful beaches, the Marble Mountains, and the iconic Golden Bridge.",
          image:
            "https://readdy.ai/api/search-image?query=Da%20Nang%20Vietnam%20with%20golden%20bridge%20held%20by%20giant%20stone%20hands%20at%20Ba%20Na%20Hills.%20Modern%20city%20skyline%20with%20Dragon%20Bridge%20and%20pristine%20beaches.%20Sunset%20lighting%20with%20vibrant%20colors.%20Professional%20travel%20photography&width=600&height=400&seq=danang1&orientation=landscape",
          region: "central",
          experiences: ["beach", "urban", "adventure"],
          seasons: ["spring", "summer"],
        },
        {
          id: "hoian",
          name: "Hoi An",
          description:
            "Ancient town famous for its well-preserved architecture, colorful lanterns, and tailor shops.",
          image:
            "https://readdy.ai/api/search-image?query=Hoi%20An%20Vietnam%20ancient%20town%20at%20night%20with%20colorful%20lanterns%20reflecting%20in%20the%20river.%20Traditional%20yellow%20buildings%20with%20wooden%20architecture.%20Atmospheric%20scene%20with%20warm%20lighting%20and%20tourists%20exploring%20the%20UNESCO%20heritage%20site&width=600&height=400&seq=hoian1&orientation=landscape",
          region: "central",
          experiences: ["culture", "history", "food"],
          seasons: ["spring", "autumn", "winter"],
        },
        {
          id: "my-son",
          name: "My Son Sanctuary",
          description:
            "Ancient Hindu temple complex from the Champa kingdom, showcasing remarkable architecture and sculptures.",
          image:
            "https://readdy.ai/api/search-image?query=My%20Son%20Sanctuary%20Vietnam%20with%20ancient%20red%20brick%20temples%20surrounded%20by%20lush%20jungle.%20Hindu%20architectural%20details%20and%20carved%20stone%20reliefs.%20Early%20morning%20mist%20and%20sunbeams%20filtering%20through%20trees%20creating%20mystical%20atmosphere&width=600&height=400&seq=myson1&orientation=landscape",
          region: "central",
          experiences: ["history", "culture", "nature"],
          seasons: ["winter", "spring"],
        },
        {
          id: "quy-nhon",
          name: "Quy Nhon",
          description:
            "Emerging coastal city with pristine beaches, ancient Cham towers, and excellent seafood cuisine.",
          image:
            "https://readdy.ai/api/search-image?query=Quy%20Nhon%20Vietnam%20with%20pristine%20white%20sand%20beaches%2C%20crystal%20clear%20turquoise%20waters%2C%20and%20ancient%20Cham%20towers%20on%20hillside.%20Modern%20beachfront%20promenade%20with%20palm%20trees.%20Sunset%20creating%20golden%20reflections%20on%20calm%20ocean&width=600&height=400&seq=quynhon1&orientation=landscape",
          region: "central",
          experiences: ["beach", "food", "culture"],
          seasons: ["summer", "spring"],
        },
        {
          id: "phong-nha",
          name: "Phong Nha",
          description:
            "Home to the world's largest caves, stunning karst mountains, and underground rivers.",
          image:
            "https://readdy.ai/api/search-image?query=Phong%20Nha%20Vietnam%20with%20massive%20cave%20entrance%20in%20limestone%20mountain%2C%20underground%20river%20with%20crystal%20clear%20water%2C%20and%20stunning%20rock%20formations.%20Natural%20lighting%20from%20cave%20opening%20creating%20dramatic%20shadows%20and%20highlights&width=600&height=400&seq=phongnha1&orientation=landscape",
          region: "central",
          experiences: ["adventure", "nature"],
          seasons: ["spring", "summer"],
        },
      ],
    },
    {
      id: "south",
      name: "Southern Vietnam",
      description:
        "Explore the vibrant metropolis of Ho Chi Minh City, the lush Mekong Delta, and pristine island getaways.",
      destinations: [
        {
          id: "ho-chi-minh",
          name: "Ho Chi Minh City",
          description:
            "Vietnam's largest city with a fascinating mix of modern skyscrapers, colonial buildings, and war history.",
          image:
            "https://readdy.ai/api/search-image?query=Ho%20Chi%20Minh%20City%20Vietnam%20skyline%20with%20modern%20skyscrapers%20and%20colonial%20architecture.%20Busy%20streets%20with%20motorbikes%20and%20street%20vendors.%20Night%20scene%20with%20city%20lights%20reflecting%20on%20Saigon%20River.%20Professional%20travel%20photography&width=600&height=400&seq=hcmc1&orientation=landscape",
          region: "south",
          experiences: ["urban", "history", "food"],
          seasons: ["winter", "spring"],
        },
        {
          id: "mekong-delta",
          name: "Mekong Delta",
          description:
            "Network of rivers, swamps and islands with floating markets, rice paddies, and fruit orchards.",
          image:
            "https://readdy.ai/api/search-image?query=Mekong%20Delta%20Vietnam%20with%20traditional%20wooden%20boats%20on%20winding%20river%20channels.%20Floating%20market%20with%20colorful%20fruits%20and%20vegetables.%20Local%20farmers%20in%20conical%20hats%20harvesting%20rice%20in%20lush%20green%20fields.%20Morning%20light%20with%20slight%20mist%20over%20water&width=600&height=400&seq=mekong1&orientation=landscape",
          region: "south",
          experiences: ["nature", "culture", "food"],
          seasons: ["winter", "spring"],
        },
        {
          id: "phu-quoc",
          name: "Phu Quoc Island",
          description:
            "Tropical island with white-sand beaches, clear waters, and pepper plantations.",
          image:
            "https://readdy.ai/api/search-image?query=Phu%20Quoc%20Island%20Vietnam%20with%20pristine%20white%20sand%20beaches%20and%20crystal%20clear%20turquoise%20waters.%20Tropical%20palm%20trees%20lining%20the%20shore%20with%20luxury%20resorts%20in%20the%20background.%20Perfect%20sunset%20with%20golden%20and%20pink%20sky.%20Professional%20travel%20photography&width=600&height=400&seq=phuquoc1&orientation=landscape",
          region: "south",
          experiences: ["beach", "nature", "relaxation"],
          seasons: ["winter", "spring"],
        },
        {
          id: "can-tho",
          name: "Can Tho",
          description:
            "The heart of the Mekong Delta with famous floating markets, riverside restaurants, and traditional craft villages.",
          image:
            "https://readdy.ai/api/search-image?query=Can%20Tho%20Vietnam%20floating%20market%20at%20sunrise%20with%20wooden%20boats%20full%20of%20colorful%20tropical%20fruits%20and%20vegetables.%20Local%20vendors%20in%20traditional%20conical%20hats%20trading%20goods.%20Morning%20mist%20rising%20from%20Mekong%20River%20creating%20atmospheric%20scene&width=600&height=400&seq=cantho1&orientation=landscape",
          region: "south",
          experiences: ["culture", "food", "nature"],
          seasons: ["winter", "spring"],
        },
        {
          id: "con-dao",
          name: "Con Dao Islands",
          description:
            "Remote archipelago with pristine beaches, diverse marine life, and historical sites.",
          image:
            "https://readdy.ai/api/search-image?query=Con%20Dao%20Islands%20Vietnam%20with%20untouched%20white%20sand%20beaches%2C%20crystal%20clear%20turquoise%20waters%2C%20and%20lush%20green%20mountains.%20Marine%20life%20visible%20in%20shallow%20waters.%20Dramatic%20sunset%20with%20pink%20and%20purple%20sky%20reflecting%20on%20calm%20ocean&width=600&height=400&seq=condao1&orientation=landscape",
          region: "south",
          experiences: ["beach", "nature", "history"],
          seasons: ["spring", "summer"],
        },
        {
          id: "cat-tien",
          name: "Cat Tien National Park",
          description:
            "Vast tropical forest home to diverse wildlife, ancient trees, and ethnic minority villages.",
          image:
            "https://readdy.ai/api/search-image?query=Cat%20Tien%20National%20Park%20Vietnam%20with%20dense%20tropical%20rainforest%2C%20ancient%20trees%20covered%20in%20vines%2C%20and%20natural%20streams.%20Early%20morning%20sunlight%20filtering%20through%20canopy%20creating%20magical%20atmosphere.%20Wildlife%20visible%20in%20natural%20habitat&width=600&height=400&seq=cattien1&orientation=landscape",
          region: "south",
          experiences: ["nature", "adventure", "culture"],
          seasons: ["winter", "spring"],
        },
      ],
    },
  ];

const DestinationDetail = ({ destination, onClose }) => {
  if (!destination) return null;

  return (
    <div className={styles.detailOverlay} onClick={onClose}>
      <div className={styles.detailContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <img src={destination.image} alt={destination.name} className={styles.detailImageTop} />
        <div className={styles.detailInfoBelow}>
          <h2 className={styles.detailTitleBelow}>{destination.name}</h2>
          <p className={styles.regionTag}>{destination.region}</p>
          <p className={styles.detailDescription}>{destination.description}</p>
          <div className={styles.detailGrid}>
            <div className={styles.detailSection}>
              <h3>Best Experiences</h3>
              <ul>
                {destination.experiences.map((exp, index) => (
                  <li key={index}><span className={styles.experienceIcon}>✦</span>{exp}</li>
                ))}
              </ul>
            </div>
            <div className={styles.detailSection}>
              <h3>Best Time to Visit</h3>
              <ul>
                {destination.seasons.map((season, index) => (
                  <li key={index}><span className={styles.seasonIcon}>🌤</span>{season}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.additionalInfo}>
            <h3>Why Visit {destination.name}?</h3>
            <p>
              {destination.name} offers a unique blend of {destination.experiences.join(', ')} experiences, 
              making it an ideal destination for travelers seeking {destination.experiences[0]}. 
              The best time to visit is during {destination.seasons.join(' and ')}, when the weather is 
              perfect for exploring all that this amazing destination has to offer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PlacesToGo() {
  const [selectedDestination, setSelectedDestination] = useState(null);

  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
  };

  const handleCloseDetail = () => {
    setSelectedDestination(null);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBackground}
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=Vietnam%20landscape%20panorama%20featuring%20iconic%20limestone%20karsts%20of%20Ha%20Long%20Bay%20with%20emerald%20waters%2C%20traditional%20boats%2C%20and%20sunset%20colors.%20Dramatic%20lighting%20with%20golden%20hour%20glow%20creating%20perfect%20reflections%20on%20water%20surface.%20Professional%20travel%20photography%20with%20high%20contrast&width=1440&height=600&seq=hero1&orientation=landscape')"
          }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Places to Go in Vietnam
          </h1>
          <p className={styles.heroDescription}>
            From the terraced rice fields of the north to the bustling cities of
            the south, discover Vietnam's most captivating destinations that
            blend natural beauty, rich history, and vibrant culture.
          </p>
        </div>
      </section>

      {/* Regions */}
      {regions.map(region => (
        <section key={region.id} id={region.id} className={styles.regionSection}>
          <div className={styles.container}>
            <h2 className={styles.regionTitle}>
              {region.name}
            </h2>
            <p className={styles.regionDescription}>
              {region.description}
            </p>
            <div className={styles.placesGrid}>
              {region.destinations.map(place => (
                <div key={place.id} className={styles.placeCard}>
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className={styles.placeImage}
                  />
                  <div className={styles.placeContent}>
                    <h3 className={styles.placeName}>{place.name}</h3>
                    <p className={styles.placeDescription}>{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* MyVietnam Section */}
      <section id="charm" className={styles.myVietnamSection}>
        <div className={styles.container}>
          <h2 className={styles.myVietnamTitle}>#MyVietnam</h2>
          <p className={styles.myVietnamDescription}>
            Get an insider look at Vietnam's best destinations. Let these local Vietnamese show you around their hometowns with personal stories, top tips, and must-do experiences.
          </p>
          <div className={styles.authorGrid}>
            {[
              {
                link: "/things-to-do/my-hcmc-nam",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-06/best%20places%20to%20visit%20vietnam%20tourism.jpg?itok=BiJgMmaG",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-06/Vietnam%20Tourism%20videos-2_0.jpg?itok=C7sFE8_Z",
                author: "My HCMC",
                cap: "Entrepreneur Nam Quan"
              },
              {
                link: "/things-to-do/my-danang-mai-thuy-tram",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-22.jpg?itok=6zRaaxSU",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-11.jpg?itok=FzPNhjzX",
                author: "My Danang",
                cap: "Restaurateur Mai Thuy Tram"
              },
              {
                link: "/things-to-do/my-dalat-phu-nguyen",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-18.jpg?itok=O48ThNpi",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-20.jpg?itok=4YonCt3B",
                author: "My Dalat",
                cap: "Adventure Expert Phu Nguyen"
              },
              {
                link: "/things-to-do/my-sapa-ly-thy-ker",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-06/places%20to%20go%20Vietnam.jpg?itok=0w4piXh8",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-06/Where%20to%20visit%20Vietnam.jpg?itok=vVxW-bES",
                author: "My Sapa",
                cap: "Local Guide Ly Thy Ker"
              },
              {
                link: "/things-to-do/my-nha-trang-tk-nguyen",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-6.jpg?itok=pQJuvW_q",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-4.jpg?itok=8xF2pV6I",
                author: "My Nha Trang",
                cap: "Vibe Director TK Nguyen"
              },
              {
                link: "/things-to-do/my-ha-noi-maia-do",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-26.jpg?itok=5sulmkcn",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-13.jpg?itok=vYBP7t5r",
                author: "My Ha Noi",
                cap: "Art Enthusiast Maia Do"
              },
              {
                link: "/things-to-do/my-mui-ne-tom-pham",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-17.jpg?itok=pZQYXNnT",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-16.jpg?itok=-ebKC-IA",
                author: "My Mui Ne",
                cap: "Kite-boarding Instructor Tom Pham"
              },
              {
                link: "/things-to-do/my-hoi-an",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-32.jpg?itok=rh6b-n5r",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2019-04/Where%20to%20go%20in%20Vietnam%20Tourism-12.jpg?itok=4DtDASjn",
                author: "My Hoi An",
                cap: "Chef Tran Thanh Duc"
              },
              {
                link: "/things-to-do/my-ninh-binh",
                thumb: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-06/where%20to%20travel%20in%20Vietnam.jpg?itok=a5mRj75t",
                avatar: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-06/best%20places%20to%20go%20in%20vietnam.jpg?itok=fTB24rrg",
                author: "My Ninh Binh",
                cap: "Founder and Tour Operator Pham Minh Tam"
              }
            ].map((item, idx) => (
              <a 
                key={idx} 
                href={item.link} 
                className={styles.authorCard}
              >
                <img 
                  src={item.thumb} 
                  alt={item.author} 
                  className={styles.authorThumb}
                />
                <img 
                  src={item.avatar} 
                  alt={item.author} 
                  className={styles.authorAvatar}
                />
                <span className={styles.authorName}>{item.author}</span>
                <span className={styles.authorRole}>{item.cap}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Itineraries Section */}
      <section id="recommended" className={styles.itinerariesSection}>
        <div className={styles.container}>
          <h2 className={styles.itinerariesTitle}>Itineraries</h2>
          <div className={styles.itinerariesGrid}>
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
              <a 
                key={idx} 
                href={item.link} 
                className={styles.itineraryCard}
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className={styles.itineraryImage}
                />
                <div className={styles.itineraryInfo}>
                  {item.title}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detail View */}
      {selectedDestination && (
        <DestinationDetail
          destination={selectedDestination}
          onClose={handleCloseDetail}
        />
      )}
    </main>
  );
}
