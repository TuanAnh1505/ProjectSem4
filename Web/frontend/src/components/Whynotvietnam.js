import React, { useState } from 'react';
import './Whynotvietnam.css';

const Whynotvietnam = () => {
  const [modalImage, setModalImage] = useState(null);

  const openModal = (src) => {
    setModalImage(src);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div>
      {/* Navbar */}
      <nav>
        <div className="logo-container">
          <img
            alt="Vietnam tourism logo in red background with white text"
            src="imgae/ChatGPT_Image_10_46_29_16_thg_4__2025-removebg-preview.png"
          />
        </div>
        <ul>
          <li><a href="#">Live fully in Vietnam</a></li>
          <li><a href="#">Places to go</a></li>
          <li><a href="#">Things to do</a></li>
          <li><a href="#">Plan your trip</a></li>
          <li><a href="#">Travel offers</a></li>
          <li><a href="#">EN</a></li>
        </ul>
        <button aria-label="Search" className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </nav>

      {/* Hero Image with overlay text */}
      <div className="hero-image-container">
        <img
          alt="Vietnamese meal with bowls and chopsticks arranged on a wooden table"
          src="https://storage.googleapis.com/a1aa/image/48a89cc0-d108-4503-37c0-5128073a01c6.jpg"
        />
        <div className="hero-image-text">
          Visit<br />VIET<br />NAM
        </div>
      </div>

      {/* Text Section */}
      <section className="text-section">
        <h2>WHY NOT VIETNAM?</h2>
        <p>
          There's never been a better time to choose Vietnam as your holiday destination. With a strong
          commitment to safety and fast response to health crises, Vietnam is a place you can travel with
          peace of mind. The country's untrammelled landscapes and seascapes are bursting with beautiful
          views you can have all to yourself. Even if it's been a while, you can be sure Vietnam's people
          are as friendly as ever, its food is as delicious as ever, its culture is as alluring as ever —
          and all of it is waiting for you. When you're ready to travel again, we look forward to welcoming
          you back to Vietnam.
        </p>
      </section>

      {/* Image Gallery */}
      <section className="image-gallery">
        <div>
          <img
            alt="Vietnamese temple with red roof and blue sky"
            src="https://storage.googleapis.com/a1aa/image/7481104b-42c0-4822-222c-e59f4df69406.jpg"
            onClick={() => openModal('https://storage.googleapis.com/a1aa/image/7481104b-42c0-4822-222c-e59f4df69406.jpg')}
          />
          <button aria-label="Previous" className="prev"><i className="fas fa-chevron-left"></i></button>
        </div>
        <div className="center-image">
          <img
            alt="Vietnamese food with rice and vegetables garnished with red chili"
            src="https://storage.googleapis.com/a1aa/image/b5731dd5-9eac-4441-ecbc-f8ce54fb8d20.jpg"
            onClick={() => openModal('https://storage.googleapis.com/a1aa/image/b5731dd5-9eac-4441-ecbc-f8ce54fb8d20.jpg')}
          />
        </div>
        <div>
          <img
            alt="Vietnamese beach with blue sky and white umbrellas"
            src="https://storage.googleapis.com/a1aa/image/5a516b57-d89b-46cb-62a2-e4e75e8a2dfb.jpg"
            onClick={() => openModal('https://storage.googleapis.com/a1aa/image/5a516b57-d89b-46cb-62a2-e4e75e8a2dfb.jpg')}
          />
          <button aria-label="Next" className="next"><i className="fas fa-chevron-right"></i></button>
        </div>
        <div>
          <img
            alt="Vietnamese wooden bridge and mountains"
            src="https://storage.googleapis.com/a1aa/image/815a610d-2c2d-4b92-2b25-426c3c50a60b.jpg"
            onClick={() => openModal('https://storage.googleapis.com/a1aa/image/815a610d-2c2d-4b92-2b25-426c3c50a60b.jpg')}
          />
        </div>
        <div>
          <img
            alt="Vietnamese chef holding tray with food"
            src="https://storage.googleapis.com/a1aa/image/a098c6b8-a09b-49a1-97ba-38985d505cc4.jpg"
            onClick={() => openModal('https://storage.googleapis.com/a1aa/image/a098c6b8-a09b-49a1-97ba-38985d505cc4.jpg')}
          />
        </div>
        <div>
          <img
            alt="Vietnamese waterfall in lush green forest"
            src="https://storage.googleapis.com/a1aa/image/65e276d7-b2a1-4fe6-2793-694c05b6ea1a.jpg"
            onClick={() => openModal('https://storage.googleapis.com/a1aa/image/65e276d7-b2a1-4fe6-2793-694c05b6ea1a.jpg')}
          />
        </div>
        <div className="wide-image">
          <img
            alt="Vietnamese river with yellow kayak"
            src="https://storage.googleapis.com/a1aa/image/6d969847-59a0-4650-1e85-112fc7ae093a.jpg"
            onClick={() => openModal('https://storage.googleapis.com/a1aa/image/6d969847-59a0-4650-1e85-112fc7ae093a.jpg')}
          />
        </div>
      </section>

      {/* Modal */}
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>×</span>
          <img src={modalImage} />
        </div>
      )}

      {/* Hero Pandemic Section */}
      <div className="hero-pandemic">
        <img
          alt="Vietnam river scene with person wearing blue and white helmet looking at water"
          src="https://storage.googleapis.com/a1aa/image/4a487a0e-4d6d-4d8d-27f9-7e80a5362e20.jpg"
        />
        <h1>
          How Vietnam<br />
          overcame a<br />
          pandemic
        </h1>
      </div>

      {/* Holiday Ideas Section */}
      <section className="holiday-ideas">
        <p className="title">HOLIDAY IDEAS</p>
        <p className="subtitle">See top recommendations for your next vacation in Vietnam.</p>
        <div className="icons-container">
          <div className="icon-item">
            <img
              alt="Red motorcycle icon representing authentic adventures"
              src="https://storage.googleapis.com/a1aa/image/2d783342-404c-4693-1eab-b90dc7a9620b.jpg"
            />
            <span>AUTHENTIC<br />ADVENTURES</span>
          </div>
          <div className="icon-item">
            <img
              alt="Red lotus flower icon representing healing holidays"
              src="https://storage.googleapis.com/a1aa/image/b6bc3940-a15a-4b9c-06b5-605d2e173a71.jpg"
            />
            <span>HEALING<br />HOLIDAYS</span>
          </div>
          <div className="icon-item">
            <img
              alt="Red leaf icon representing green getaways"
              src="https://storage.googleapis.com/a1aa/image/21ef63c5-092d-435f-968f-9088bbc8d764.jpg"
            />
            <span>GREEN<br />GETAWAYS</span>
          </div>
          <div className="icon-item">
            <img
              alt="Red boat icon representing beach breaks"
              src="https://storage.googleapis.com/a1aa/image/929b8378-f8a3-4c39-edab-0e6f1d488541.jpg"
            />
            <span>BEACH<br />BREAKS</span>
          </div>
          <div className="icon-item">
            <img
              alt="Red coffee cup icon representing foodie forays"
              src="https://storage.googleapis.com/a1aa/image/c8875b46-4f72-4f83-0f24-16147a638b37.jpg"
            />
            <span>FOODIE<br />FORAYS</span>
          </div>
        </div>
      </section>

      {/* Vietnam in the News Section */}
      <section className="vietnam-news">
        <p className="title">VIETNAM IN THE NEWS</p>
        <p className="subtitle">Read about how Vietnam successfully contained the coronavirus.</p>
        <div className="news-container">
          <div className="news-item">
            <img
              alt="Travel Leisure cover"
              src="https://storage.googleapis.com/a1aa/image/b109aa64-13fb-4615-7af2-d0b302f959ff.jpg"
            />
            <p className="brand">TRAVEL + LEISURE</p>
            <p className="text">Tổ quốc poster ‘Đẩy lùi ta hoa lompoly healeu.</p>
            <p className="text">
              Vẻ goarchẻn’s ‘Tổ quốc short ở Phú Quốc’ has earned a spot in Travel + Leisure’s list of the absolute 0...
            </p>
          </div>
          <div className="news-item">
            <img
              alt="The Times cover"
              src="https://storage.googleapis.com/a1aa/image/fe742438-93a6-4ced-c93f-be96e5da99a8.jpg"
            />
            <p className="brand">THE TIMES</p>
            <p className="text">Vietnam’s Gulf of arghter ở Mềnhule, Phú Quốc that tan...</p>
            <p className="text">The Times reveals 12 best places to visit in Vietnam, The Times full article</p>
          </div>
          <div className="news-item">
            <img
              alt="Condé Nast Traveller cover"
              src="https://storage.googleapis.com/a1aa/image/329cc8b9-440b-4f90-7c08-3b0ccf21d54d.jpg"
            />
            <p className="brand">CRTRAVELLER</p>
            <p className="text">Fledgeforty form out point at Yennhule, Phú Quốc tan...</p>
            <p className="text">
              Hồ Chí Minh City, the metropolis hub of Vietnam features in the top 25 best places to go in the...
            </p>
          </div>
          <div className="news-item">
            <img
              alt="CNN Travel cover"
              src="https://storage.googleapis.com/a1aa/image/4820b36c-5826-4ce8-3605-34cf5978fd0e.jpg"
            />
            <p className="brand">CNN TRAVEL</p>
            <p className="text">Vietnam’s perfect shores and reefs by D. tổ the outer coast Cape of Chill head, out...</p>
            <p className="text">
              Vietnamese beef Pho has been listed on the Top 20 of the world’s best soups by CNN Travel – a s...
            </p>
          </div>
        </div>
      </section>

      {/* Join the Fun Section */}
      <section className="join-fun">
        <p className="title">JOIN THE FUN</p>
        <p className="subtitle">Follow us and share your Vietnam moments on Facebook and Instagram.</p>
        <div className="decorated-box">
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
          <div className="bottom-border"></div>
        </div>
      </section>

      {/* Newsletter and Footer Section */}
      <section className="newsletter-footer">
        <div className="container">
          <div className="left">
            <p className="title">SIGN UP FOR OUR NEWSLETTER</p>
            <p className="desc">Receive new travel stories from Vietnam once a month in your inbox.</p>
            <div>
              <input type="email" placeholder="Your email" required />
              <button type="submit">Subscribe</button>
            </div>
          </div>
          <div className="right">
            <div className="text-content">
              <p className="title">FOLLOW US ON</p>
              <p className="desc">
                Welcome to the official website of Viet Nam National Authority of Tourism. Visit our tourist
                travel pages for news travel regulations.
              </p>
            </div>
            <div className="image">
              <img
                alt="Vietnam National Tourism logo colorful"
                src="https://storage.googleapis.com/a1aa/image/7ede503a-b334-47fc-74fc-da537abc48b7.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      <footer>
        © 2018 Official Website Vietnam Tourism
      </footer>
    </div>
  );
};

export default Whynotvietnam;