import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';


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
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch events data
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const res = await axios.get('http://localhost:8080/api/tours', config);
        setTours(res.data);
        setFilteredTours(res.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch tours:', err);
        setError('Failed to load tours. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
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


      {/* Tour List Section */}
      <section className={styles.tourSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>OUTSTANDING TOURS</div>
          <div className={styles.sectionDesc}>Discover our curated selection of Vietnam tours</div>

          {filteredTours.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              margin: '20px 0'
            }}>
              <h3 style={{ color: '#666', marginBottom: '10px' }}>No tours found</h3>
              <p style={{ color: '#888' }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              padding: '20px 0'
            }}>
              {filteredTours.map(tour => (
                <div key={tour.tourId} style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <div style={{
                    position: 'relative',
                    height: '200px',
                    overflow: 'hidden'
                  }}>
                    {tour.imageUrl ? (
                      <img
                        src={`http://localhost:8080${tour.imageUrl}`}
                        alt={tour.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666'
                      }}>No Image</div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>${tour.price.toLocaleString()}</div>
                  </div>
                  <div style={{
                    padding: '15px'
                  }}>
                    <h3 style={{
                      margin: '0 0 10px 0',
                      fontSize: '18px',
                      color: '#333'
                    }}>{tour.name}</h3>
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      marginBottom: '10px',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <FaCalendarAlt /> {tour.duration} days
                      </span>
                      {tour.destinations?.length > 0 && (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <FaMapMarkerAlt /> {tour.destinations[0].name}
                        </span>
                      )}
                    </div>
                    <p style={{
                      color: '#666',
                      fontSize: '14px',
                      marginBottom: '15px',
                      lineHeight: '1.4'
                    }}>
                      {tour.description?.substring(0, 100)}...
                    </p>
                    <Link
                      to={`/tour-dashboard/detail/${tour.tourId}`}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'background-color 0.2s',
                        ':hover': {
                          backgroundColor: '#0056b3'
                        }
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
          marginBottom: '40px'
        }}>
          <Link 
            to="/tour-dashboard"
            style={{
              display: 'inline-block',
              backgroundColor: '#ff6b6b',
              color: '#fff',
              padding: '15px 40px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: 'none',
              cursor: 'pointer',
              ':hover': {
                backgroundColor: '#ff5252',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)'
              }
            }}
          >
            View All Tours
          </Link>
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
    </div>
  );
};

const TourDashboard = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  return null; // Add your TourDashboard JSX here
};

export default Home;