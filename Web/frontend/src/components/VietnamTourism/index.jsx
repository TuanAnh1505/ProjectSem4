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
  const heroSlides = [
    {
      imageUrl:
        "https://readdy.ai/api/search-image?query=Breathtaking%20aerial%20view%20of%20Ha%20Long%20Bay%20Vietnam%20with%20emerald%20waters%20and%20limestone%20karsts%20under%20golden%20sunset%20light%2C%20dramatic%20clouds%2C%20misty%20atmosphere%2C%20natural%20wonder%20of%20the%20world%2C%20stunning%20landscape%20photography&width=1440&height=600&seq=1&orientation=landscape",
      title: "Discover Ha Long Bay",
      description:
        "Explore the emerald waters and thousands of towering limestone islands",
    },
    {
      imageUrl:
        "https://readdy.ai/api/search-image?query=Ancient%20Hoi%20An%20Vietnam%20at%20night%20with%20traditional%20yellow%20buildings%20reflected%20in%20water%2C%20colorful%20lanterns%20glowing%2C%20peaceful%20atmosphere%2C%20cultural%20heritage%20site%2C%20traditional%20Vietnamese%20architecture&width=1440&height=600&seq=2&orientation=landscape",
      title: "Experience Hoi An",
      description:
        "Wander through ancient streets illuminated by colorful lanterns",
    },
    {
      imageUrl:
        "https://readdy.ai/api/search-image?query=Terraced%20rice%20fields%20in%20Sapa%20Vietnam%20with%20dramatic%20mountain%20backdrop%2C%20early%20morning%20mist%2C%20golden%20sunlight%2C%20lush%20green%20landscape%2C%20traditional%20farming%20methods%2C%20breathtaking%20natural%20scenery&width=1440&height=600&seq=3&orientation=landscape",
      title: "Explore Sapa",
      description:
        "Trek through stunning terraced rice fields and mountain villages",
    },
  ];

  // Events state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events data
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Banner slider functions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className={styles.home}>
      {/* Banner */}
      <div className={styles.bannerSlider}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.bannerSlide} ${index === currentSlide ? styles.active : ''}`}
          >
            {slide && (
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className={styles.bannerImg}
              />
            )}
          </div>
        ))}
        <div className={styles.bannerContent}>
          {heroSlides[currentSlide] && (
            <>
              <div className={styles.heroBannerTitle}>{heroSlides[currentSlide].title}</div>
              <div className={styles.bannerDesc}>{heroSlides[currentSlide].description}</div>
              <div className={styles.bannerButtons}>
                <button className={styles.sliderBtn}>Plan your trip</button>
                <button className={styles.sliderBtn}>Learn More</button>
              </div>
            </>
          )}
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
                  <div key={event.eventId || index} className={styles.eventCard}>
                    <img
                      src={event.filePaths && event.filePaths.length > 0 ? event.filePaths[0] : '/default-event.jpg'}
                      alt={event.name}
                      className={styles.eventImage}
                    />
                    <div className={styles.eventContent}>
                      <h3 className={styles.eventTitle}>{event.name}</h3>
                      <p className={styles.eventDate}>
                        {event.startDate ? new Date(event.startDate).toLocaleString() : ''}
                        {event.endDate ? ' - ' + new Date(event.endDate).toLocaleString() : ''}
                      </p>
                      {event.location && (
                        <p className={styles.eventLocation}><b>Location:</b> {event.location}</p>
                      )}
                      {event.statusName && (
                        <p className={styles.eventStatus}><b>Status:</b> {event.statusName}</p>
                      )}
                      {event.ticketPrice !== null && event.ticketPrice !== undefined && (
                        <p className={styles.eventPrice}><b>Ticket Price:</b> {event.ticketPrice} VND</p>
                      )}
                      {event.description && (
                        <p className={styles.eventDesc}>{event.description}</p>
                      )}
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
            <a href="https://vietnam.travel/sites/default/files/360Tour/Hue2021/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/Hue2021/socialThumbnail.jpg" alt="Hue 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="https://vietnam.travel/sites/default/files/360Tour/HaLong/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/HaLong/socialThumbnail.jpg" alt="Ha Long 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="https://vietnam.travel/sites/default/files/360Tour/HoiAn/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/HoiAn/socialThumbnail.jpg" alt="Hoi An 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="https://vietnam.travel/sites/default/files/360Tour/HaNoi/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/HaNoi/socialThumbnail.jpg" alt="Ha Noi 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="https://vietnam.travel/sites/default/files/360Tour/PhongNha/index.htm" target="_blank" rel="noopener noreferrer">
              <img src="//image.vietnam.travel/sites/default/files/360Tour/PhongNha/socialThumbnail.jpg" alt="Phong Nha 360 Tour" />
            </a>
          </div>
          <div className={styles.tour360Item}>
            <a href="https://vietnam.travel/sites/default/files/360Tour/MySon/index.htm" target="_blank" rel="noopener noreferrer">
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