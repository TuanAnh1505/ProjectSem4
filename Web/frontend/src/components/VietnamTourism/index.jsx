import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  // Banner state and data
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: 'https://ext.same-assets.com/895005174/2387322424.jpeg',
      title: 'LIVE FULLY IN VIETNAM',
      description: `Vietnam opens its door widely to welcome visitors all around the world! Vietnam extends e-visa validity to 90 days and visa exemption will be valid in 45 days!

We are more than happy to welcome you all here and admire our stunning landscapes, free your soul on white sandy beaches, experience our unique and beautiful culture and meet friendly people. Particularly, to indulge in our scrumptious cuisine at Michelin rated restaurants or to join us in mega events!`
    },
    {
      image: 'https://ext.same-assets.com/895005174/3675205425.jpeg',
      title: 'EXPLORE VIETNAM',
      description: 'Discover the beauty of Vietnam through its diverse landscapes and rich culture.'
    },
    {
      image: 'https://ext.same-assets.com/895005174/3297304267.jpeg',
      title: 'CULTURAL EXPERIENCES',
      description: 'Immerse yourself in Vietnam\'s unique traditions and festivals.'
    },
    {
      image: 'https://ext.same-assets.com/895005174/1515074473.jpeg',
      title: 'CULINARY JOURNEY',
      description: 'Taste the authentic flavors of Vietnamese cuisine.'
    }
  ];

  // Events state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/vnat/home/event');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Banner slider functions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={styles.home}>
      {/* Banner */}
      <div className={styles.bannerSlider}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.bannerSlide} ${index === currentSlide ? styles.active : ''}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={styles.bannerImg}
            />
          </div>
        ))}
        <div className={styles.bannerContent}>
          <div className={styles.bannerTitle}>{slides[currentSlide].title}</div>
          <div className={styles.bannerDesc}>{slides[currentSlide].description}</div>
          <div className={styles.bannerButtons}>
            <button className={styles.sliderBtn}>Plan your trip</button>
            <button className={styles.sliderBtn}>Learn More</button>
          </div>
        </div>
        <div className={styles.sliderControls}>
          <button className={styles.sliderArrow} onClick={prevSlide}>&#10094;</button>
          <button className={styles.sliderArrow} onClick={nextSlide}>&#10095;</button>
        </div>
      </div>

      {/* Live Fully Text Centered Between Banner and Video */}
      <div className={styles.liveFullyText}>LIVE FULLY IN VIETNAM</div>

      {/* Hero Video Section */}
      <section className={styles.heroVideoSection}>
        <div className={styles.heroVideoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/04Kf_0kppPM?autoplay=1&mute=1&controls=0&loop=1&playlist=04Kf_0kppPM"
            title="Vietnam Hero Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className={styles.heroVideo}
          ></iframe>
          <div className={styles.heroOverlay}></div>
        </div>
      </section>

      {/* What's On */}
      <section id="upcoming-events" className={styles.whatsOn}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>WHAT'S ON</div>
          <div className={styles.sectionDesc}>Check out upcoming events in Vietnam</div>
          <div className={styles.wrapEvents} id="event-container">
            {loading ? (
              <div className={styles.loadingState}>Loading...</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : (
              <div className={styles.eventsGrid}>
                {events.map((event, index) => (
                  <div key={index} className={styles.eventCard}>
                    <img src={event.image} alt={event.title} className={styles.eventImage} />
                    <div className={styles.eventContent}>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <p className={styles.eventDate}>{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.wrapMore}>
            <div className={styles.textCenter}>
              <a href="/event" className={styles.btnViewMore}>
                view all events
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 360 Degree Tour Section */}
      <section className={styles.tour360Section}>
        <div className={styles.sectionTitle}>MUST-SEE SITES</div>
        <div className={styles.sectionDesc}>
          Take a 360-degree tour of some of the country's most compelling natural wonders and cultural attractions right here.
        </div>
        <div className={styles.tour360List}>
          <div className={styles.tour360Item}>
            <a href="/sites/default/files/360Tour/Hue2021/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/Hue2021/socialThumbnail.jpg" alt="Hue 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="/sites/default/files/360Tour/HaLong/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/HaLong/socialThumbnail.jpg" alt="Ha Long 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="/sites/default/files/360Tour/HoiAn/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/HoiAn/socialThumbnail.jpg" alt="Hoi An 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="/sites/default/files/360Tour/HaNoi/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/HaNoi/socialThumbnail.jpg" alt="Ha Noi 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="/sites/default/files/360Tour/PhongNha/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/PhongNha/socialThumbnail.jpg" alt="Phong Nha 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="/sites/default/files/360Tour/MySon/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/MySon/socialThumbnail.jpg" alt="My Son 360 Tour" />
            </a>
          </div>
        </div>
      </section>
      {/* Swiper Banner Section */}
      <section className={styles.homeTopBannerSlider}>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          className={`home-top-slider ${styles.homeTopSlider}`}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <div className={styles.wrapThumb}>
              <a rel="noopener noreferrer" href="/things-to-do/the-best-ways-to-explore-the-ancient-town-of-hoi-an">
                <img src="//image.vietnam.travel/sites/default/files/styles/top_banner/public/2025-04/169-B%E1%BA%A1c%20Li%C3%AAu-ankhuong993%40gmail.com-nang%20luong%20sach.jpg?itok=YhpGY_qD" className="thumb thumb-custom" alt="" />
                <h2 className={`${styles.title} ${styles.textCenter} ${styles.en}`}></h2>
              </a>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.wrapThumb}>
              <a rel="noopener noreferrer" href="/things-to-do/hoi-ans-top-5-most-instagrammable-spots">
                <img src="//image.vietnam.travel/sites/default/files/styles/top_banner/public/2025-04/275-L%C3%A0o%20Cai-lechitrung89%40gmail.com-xuan%20ve%20tren%20doi%20che%20o%20long.jpg?itok=zN2QYYAM" className="thumb thumb-custom" alt="" />
                <h2 className={`${styles.title} ${styles.textCenter} ${styles.en}`}></h2>
              </a>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.wrapThumb}>
              <a rel="noopener noreferrer" href="/things-to-do/the-best-ways-to-explore-the-ancient-town-of-hoi-an">
                <img src="//image.vietnam.travel/sites/default/files/styles/top_banner/public/2025-04/453-B%C3%ACnh%20Thu%E1%BA%ADn-leminhquoc.pt%40gmail.com-mua%20reu%20co%20thach.jpg?itok=dA-Rm72e" className="thumb thumb-custom" alt="" />
                <h2 className={`${styles.title} ${styles.textCenter} ${styles.en}`}></h2>
              </a>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
    </div>
  );
};

export default Home;