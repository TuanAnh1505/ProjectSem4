import React from 'react';
import styles from './PlanYourTrip.module.css';

// Hero Banner
const HeroBanner = () => (
  <section className={styles['pyt-hero-banner']}>
    <img src="https://ext.same-assets.com/677349141/2637908159.jpeg" alt="Train Vietnam" className={styles['pyt-hero-img']} />
    <div className={styles['pyt-hero-title']}>Plan your trip</div>
  </section>
);

// Travel Tips
const tips = [
  { src: "https://ext.same-assets.com/677349141/599388804.jpeg", alt: "Visas", label: "Visas" },
  { src: "https://ext.same-assets.com/677349141/523499759.jpeg", alt: "Transport", label: "Transport" },
  { src: "https://ext.same-assets.com/677349141/1946432494.jpeg", alt: "Weather", label: "Weather" },
  { src: "https://ext.same-assets.com/677349141/2752473398.jpeg", alt: "Safety", label: "Safety" },
  { src: "https://ext.same-assets.com/677349141/566150099.jpeg", alt: "History", label: "History" },
  { src: "https://ext.same-assets.com/677349141/50552589.jpeg", alt: "Airports", label: "Airports" },
  { src: "https://ext.same-assets.com/677349141/1791203638.jpeg", alt: "Itineraries", label: "Itineraries" },
  { src: "https://ext.same-assets.com/677349141/4288775657.jpeg", alt: "Festivals", label: "Festivals" },
  { src: "https://ext.same-assets.com/677349141/3502506549.jpeg", alt: "Etiquette", label: "Etiquette" },
  { src: "https://ext.same-assets.com/677349141/856358668.jpeg", alt: "Payments", label: "Payments" },
];
const TravelTips = () => (
  <section className={styles['pyt-travel-tips'] + ' ' + styles['pyt-container']}>
    <h2>TRAVEL TIPS</h2>
    <p className={styles['pyt-section-sub']}>Read up before you go</p>
    <div className={styles['pyt-tips-grid']}>
      {tips.map((tip, index) => (
        <div className={styles['pyt-tip-item']} key={index}>
          <img src={tip.src} alt={tip.alt} />
          <span>{tip.label}</span>
        </div>
      ))}
    </div>
  </section>
);

// Practicalities
const practicalities = [
  {
    src: "https://ext.same-assets.com/677349141/3643677369.jpeg",
    alt: "Currency",
    title: "Currency",
    desc: "Vietnam's unit of currency is the Vietnamese đồng (VND), represented by the '₫' symbol. Notes range from 200 to 500,000. Cash is mostly used, but Visa cards and ATMs are common in big cities."
  },
  {
    src: "https://ext.same-assets.com/677349141/2105118760.jpeg",
    alt: "Taxi services",
    title: "Taxi Services",
    desc: "Vietnam has modern, efficient taxi services. To avoid scams, stick with reputable companies like Vinasun and Mai Linh. Ride-hailing apps like Grab are also available in main cities."
  },
  {
    src: "https://ext.same-assets.com/677349141/417640499.jpeg",
    alt: "Public holidays",
    title: "Public holidays",
    desc: "Lunar New Year (Tet) is the biggest holiday. Most businesses close and transport is busy. See the ",
    link: "https://www.timeanddate.com/holidays/vietnam/"
  },
  {
    src: "https://ext.same-assets.com/677349141/598451847.jpeg",
    alt: "Power plugs",
    title: "Power plugs",
    desc: "Vietnam uses 220V supply. Most sockets take plugs with two round prongs. Adaptors are easy to find at electrical shops and hotels can help."
  },
  {
    src: "https://ext.same-assets.com/677349141/770208551.jpeg",
    alt: "SIM cards & helpful numbers",
    title: "SIM cards & helpful numbers",
    desc: "Buying a local SIM is fast & cheap. Major networks: Viettel, Vinaphone, Mobifone. Show your passport to register. See useful numbers like: Police 113, Fire 114, Ambulance 115.",
    link: "https://www.timeanddate.com/holidays/vietnam/"
  },
  {
    src: "https://ext.same-assets.com/677349141/3723335500.jpeg",
    alt: "Internet & postal services",
    title: "Internet & postal services",
    desc: "Free wifi is common in cities, hotels, and cafes. 3G/4G packages are affordable. Postal delivery is reliable but can be slow. Mail postcards from hotels or post offices."
  },
  {
    src: "https://ext.same-assets.com/677349141/872359099.jpeg",
    alt: "Hospitals",
    title: "Hospitals",
    desc: "Major cities have international hospitals and clinics. English-speaking staff are available. Buy travel insurance before your trip for peace of mind."
  },
  {
    src: "https://ext.same-assets.com/677349141/2139196023.jpeg",
    alt: "Embassies",
    title: "Embassies & Consulates",
    desc: "Foreign embassies and consulates are located in Hanoi and Ho Chi Minh City and provide support for travelers if required."
  }
];
const Practicalities = () => (
  <section className={styles['pyt-practicalities']}>
    <div className={styles['pyt-container']}>
      <h2>PRACTICALITIES</h2>
      <p className={styles['pyt-section-sub']}>Get ready for your visit</p>
      <div className={styles['pyt-practicalities-grid']}>
        {practicalities.map((item, i) => (
          <div className={styles['pyt-pract-item']} key={i}>
            <img src={item.src} alt={item.alt} />
            <span>{item.title}</span>
            <p className={styles['pyt-pract-desc']}>
              {item.desc}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  full list of public holidays
                </a>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Explore Home Banner
const sliderData = [
  {
    src: "//image.vietnam.travel/sites/default/files/styles/top_banner/public/2020-02/Vietnam%20local%20culture%20guide-10.jpg?itok=3cEo5QNk",
    alt: "Vietnamese culture",
    title: "What are the Vietnamese like?",
    link: "/things-to-do/what-are-vietnamese-like"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/top_banner/public/2020-02/Vietnam%20Tourism-10.jpg?itok=bGsLC20o",
    alt: "Vietnam e-Visa",
    title: "A guide to e-Visas in Vietnam",
    link: "/plan-your-trip/official-vietnam-evisa-application"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/top_banner/public/2020-02/responsible%20travel%20vietnam-5.jpg?itok=2apgNEX9",
    alt: "Responsible travel",
    title: "How to travel responsibly in Vietnam",
    link: "/things-to-do/how-travel-responsibly-vietnam"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/top_banner/public/2019-11/Vietnam%20Tourism%20-%20plan%20your%20trip.JPG?itok=e87W75MF",
    alt: "Beginner's guide",
    title: "Beginner's guide to Vietnam now",
    link: "/beginners-guide-vietnam"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/top_banner/public/2020-02/homestay%20in%20vietnam.jpg?itok=iUzJ8VFt",
    alt: "Homestay in Vietnam",
    title: "5 reasons to try a homestay in Vietnam",
    link: "/things-to-do/5-reasons-try-homestay-vietnam"
  }
];

const ExploreHomeBanner = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const sliderRef = React.useRef(null);

  const nextSlide = () => {
    if (currentSlide < sliderData.length - 1) {
      setCurrentSlide(currentSlide + 1);
      sliderRef.current?.scrollTo({
        left: (currentSlide + 1) * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      sliderRef.current?.scrollTo({
        left: (currentSlide - 1) * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  // Thêm auto slide
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (currentSlide < sliderData.length - 1) {
        nextSlide();
      } else {
        setCurrentSlide(0);
        sliderRef.current?.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }, 5000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className={styles['pyt-explore-home-banner']}>
      <div className={styles['pyt-container']}>
        <button 
          className={`${styles['pyt-slider-btn']} ${styles['pyt-slider-prev']}`}
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <span>❮</span>
        </button>
        <ul className={styles['pyt-slider-list']} ref={sliderRef}>
          {sliderData.map((item, index) => (
            <li 
              key={index} 
              className={currentSlide === index ? styles['active'] : ''}
            >
              <div className={styles['pyt-wrap-thumb']}>
                <a href={item.link}>
                  <img src={item.src} alt={item.alt} className={styles['pyt-thumb']} />
                  <h1 className={styles['pyt-slider-title']}>{item.title}</h1>
                </a>
              </div>
            </li>
          ))}
        </ul>
        <button 
          className={`${styles['pyt-slider-btn']} ${styles['pyt-slider-next']}`}
          onClick={nextSlide}
          disabled={currentSlide === sliderData.length - 1}
        >
          <span>❯</span>
        </button>
        <div className={styles['pyt-slider-dots']}>
          {sliderData.map((_, index) => (
            <button
              key={index}
              className={`${styles['pyt-slider-dot']} ${currentSlide === index ? styles['active'] : ''}`}
              onClick={() => {
                setCurrentSlide(index);
                sliderRef.current?.scrollTo({
                  left: index * sliderRef.current.offsetWidth,
                  behavior: 'smooth'
                });
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Explore From Home
const exploreData = [
  {
    src: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-04/Vietnam%20Travel-10_0.jpg?itok=i2yGxOaD",
    alt: "Fun at Home",
    title: "Fun at Home",
    desc: "Recipes, colouring sheets, and more",
    link: "/things-to-do/visit-vietnam-from-home"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-04/Vietnam%20Travel-24_1.jpg?itok=lM8q5xcN",
    alt: "Books, Art & Music",
    title: "Books, Art & Music",
    desc: "A primer on Vietnamese culture",
    link: "/things-to-do/best-books-music-art-vietnam"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-04/Vietnam%20Travel-13_0.jpg?itok=8H6GAWTy",
    alt: "My Vietnam",
    title: "My Vietnam",
    desc: "Local stories from north to south",
    link: "/myvietnam"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-02/Vietnam%20Tourism-5.jpg?itok=9dYS3D9u",
    alt: "Travel advisory",
    title: "Travel advisory",
    desc: "Precautions and prevention for COVID-19",
    link: "/things-to-do/information-travellers-novel-coronavirus-vietnam"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-02/Vietnam%20Tourism-6.jpg?itok=4HLVC60N",
    alt: "Safety strategy",
    title: "Safety strategy",
    desc: "How Vietnam contains the virus",
    link: "/things-to-do/how-vietnam-overcame-pandemic"
  },
  {
    src: "//image.vietnam.travel/sites/default/files/styles/large/public/2020-02/Vietnam%20Tourism-7.jpg?itok=G2ILo_9Y",
    alt: "Inspiring stories",
    title: "Inspiring stories",
    desc: "Kindness and community spirit",
    link: "/things-to-do/vietnam-covid-inspiring-stories"
  }
];

const ExploreFromHome = () => (
  <section className={styles['pyt-explore-from-home']}>
    <div className={styles['pyt-container']}>
      <div className={styles['pyt-section-header']}>
        <h2 className={styles['pyt-section-heading']}>EXPLORE FROM HOME</h2>
        <div className={styles['pyt-section-desc']}>
          Explore Vietnam more from home and start planning your holidays.
        </div>
      </div>
      <div className={styles['pyt-wrap-author']}>
        <div className={styles['pyt-wrap-list']}>
          <ul className={styles['pyt-explore-list']}>
            {exploreData.map((item, index) => (
              <li key={index} className={styles['pyt-explore-item']}>
                <a href={item.link} className={styles['pyt-block-item']}>
                  <div className={styles['pyt-wrap-thumb']}>
                    <img src={item.src} alt={item.alt} className={styles['pyt-thumb']} />
                  </div>
                  <span className={styles['pyt-author']}>{item.title}</span>
                  <span className={styles['pyt-cap']}>{item.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// Infographics
const Infographics = () => (
  <section className={styles['pyt-infographics'] + ' ' + styles['pyt-container']}>
    <div className={styles['pyt-infographics-row']}>
      <div className={styles['pyt-infographic-card']}>2 etiquette tips</div>
      <div className={styles['pyt-infographic-card']}>E-visa guide</div>
      <div className={styles['pyt-infographic-card']}>Transport</div>
    </div>
  </section>
);

// Experiences
const expData = [
  { src: "https://ext.same-assets.com/677349141/1251794232.jpeg", alt: "VinOasis Phu Quoc", label: "VinOasis Phu Quoc" },
  { src: "https://ext.same-assets.com/677349141/4080396102.jpeg", alt: "InterContinental Phu Quoc", label: "InterContinental Phu Quoc" },
  { src: "https://ext.same-assets.com/677349141/1644321882.jpeg", alt: "VinWonders Nha Trang", label: "VinWonders Nha Trang" },
  { src: "https://ext.same-assets.com/677349141/4208420702.jpeg", alt: "Sailing Club Phu Quoc", label: "Sailing Club Phu Quoc" }
];
const Experiences = () => (
  <section className={styles['pyt-experiences'] + ' ' + styles['pyt-container']}>
    <h2>EXPERIENCES</h2>
    <p className={styles['pyt-section-sub']}>See outstanding travel products from our partners</p>
    <div className={styles['pyt-exp-grid']}>
      {expData.map((item, index) => (
        <div className={styles['pyt-exp-item']} key={index}>
          <img src={item.src} alt={item.alt} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  </section>
);

// Itineraries
const itinData = [
  { src: "https://ext.same-assets.com/677349141/3101246732.jpeg", alt: "Ha Noi", title: "The perfect weekend in Ha Noi" },
  { src: "https://ext.same-assets.com/677349141/3079056901.jpeg", alt: "Hue", title: "3 days in Hue for Culture Seekers" },
  { src: "https://ext.same-assets.com/677349141/3069157901.jpeg", alt: "HCMC", title: "The perfect weekend in HCMC" }
];
const Itineraries = () => (
  <section className={styles['pyt-itineraries']}>
    <div className={styles['pyt-container']}>
      <h2 className={styles['pyt-itineraries-title']}>Itineraries</h2>
      <div className={styles['pyt-itinerary-grid']}>
        {itinData.map((item, index) => (
          <div className={styles['pyt-itinerary-item']} key={index}>
            <img src={item.src} alt={item.alt} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Main export
const PlanYourTrip = () => (
  <div>
    <HeroBanner />
    <TravelTips />
    <Practicalities />
    <ExploreHomeBanner />
    <ExploreFromHome />
  </div>
);

export default PlanYourTrip; 