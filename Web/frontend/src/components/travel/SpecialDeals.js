import React, { useState } from 'react';
import '../styles/SpecialDeals.css';

const TEXT = {
  en: {
    title: 'SPECIAL DEALS',
    desc: 'Uncover unique promotions on hotels and tours',
    offers: [
      null,
      'Vivu Travel',
      'Cruise tour by Halong Bay Junkboat',
      'Halong cruises deal - BestPrice Travel',
      'An Island Wellness Escape',
      'Visa Cashback on Booking.com',
      'Ha Long Combo with Syrena Cruise',
      'Extra Perks at the InterContinental',
      'Phu Quoc Villa Seclusion Experience',
      'InterContinental Kids Camp',
      'Early bird savings at Victoria Chau Doc Hotel',
      'Visa Hotel Promotion',
      'Vietnam Airlines & Vinpearl Package',
      'VinHolidays Wonder Combo',
      'Dinner by the beach in Phu Quoc',
      null,
      'Private Tours with Sens Asia',
      'Three Days with Syrena Cruises',
      'Easy Vietnam tours with Sens Asia',
      'Hai Au Aviation Charter Flights',
    ]
  },
  vi: {
    title: 'ƯU ĐÃI ĐẶC BIỆT',
    desc: 'Khám phá khuyến mãi khách sạn và tour du lịch',
    offers: [
      null,
      'Vivu Travel',
      'Du thuyền vịnh Hạ Long',
      'Ưu đãi du thuyền BestPrice',
      'Nghỉ dưỡng đảo & chăm sóc sức khỏe',
      'Hoàn tiền Visa trên Booking.com',
      'Combo Hạ Long với Syrena Cruise',
      'Ưu đãi tại InterContinental',
      'Trải nghiệm biệt thự Phú Quốc',
      'Trại hè trẻ em InterContinental',
      'Ưu đãi sớm tại Victoria Chau Doc',
      'Khuyến mãi khách sạn Visa',
      'Gói Vietnam Airlines & Vinpearl',
      'Combo VinHolidays Wonder',
      'Bữa tối bên biển Phú Quốc',
      null,
      'Tour riêng với Sens Asia',
      'Ba ngày với Syrena Cruises',
      'Tour dễ dàng cùng Sens Asia',
      'Chuyến bay thuê bao Hai Âu',
    ]
  }
};

const offers = [
  {
    type: 'icon',
    image: 'https://ext.same-assets.com/2511696692/3154533412.png',
    title: ''
  },
  {
    image: 'https://ext.same-assets.com/2511696692/1444175859.jpeg',
    desc: {
      en: 'Special offer from Vivu Travel.',
      vi: 'Ưu đãi đặc biệt từ Vivu Travel.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/1471557405.jpeg',
    desc: {
      en: 'Enjoy a cruise tour in Halong Bay.',
      vi: 'Trải nghiệm du thuyền vịnh Hạ Long.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/3389780441.jpeg',
    desc: {
      en: 'Best deals for Halong cruises.',
      vi: 'Ưu đãi tốt nhất cho du thuyền Hạ Long.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/2770776324.jpeg',
    desc: {
      en: 'Relax and escape to the island.',
      vi: 'Thư giãn và nghỉ dưỡng trên đảo.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/2112675931.jpeg',
    desc: {
      en: 'Get cashback with Visa on Booking.com.',
      vi: 'Hoàn tiền khi đặt Booking.com bằng Visa.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/639156888.jpeg',
    desc: {
      en: 'Combo offer with Syrena Cruise.',
      vi: 'Ưu đãi combo với Syrena Cruise.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/4226520133.jpeg',
    desc: {
      en: 'Enjoy extra perks at InterContinental.',
      vi: 'Nhận ưu đãi thêm tại InterContinental.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/382419739.jpeg',
    desc: {
      en: 'Experience seclusion at Phu Quoc Villa.',
      vi: 'Trải nghiệm biệt thự riêng tư tại Phú Quốc.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/322416120.jpeg',
    desc: {
      en: 'Fun for kids at InterContinental.',
      vi: 'Trại hè vui nhộn cho trẻ em tại InterContinental.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/195926283.jpeg',
    desc: {
      en: 'Save more with early bird at Victoria Chau Doc.',
      vi: 'Tiết kiệm với ưu đãi đặt sớm tại Victoria Chau Doc.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/249463616.jpeg',
    desc: {
      en: 'Special Visa hotel promotion.',
      vi: 'Khuyến mãi khách sạn dành cho chủ thẻ Visa.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/3265346639.jpeg',
    desc: {
      en: 'Package with Vietnam Airlines & Vinpearl.',
      vi: 'Gói ưu đãi Vietnam Airlines & Vinpearl.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/3700630008.jpeg',
    desc: {
      en: 'VinHolidays Wonder Combo offer.',
      vi: 'Ưu đãi combo VinHolidays Wonder.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/3963814872.jpeg',
    desc: {
      en: 'Enjoy dinner by the beach in Phu Quoc.',
      vi: 'Thưởng thức bữa tối bên bãi biển Phú Quốc.'
    }
  },
  {
    type: 'icon',
    image: 'https://ext.same-assets.com/2511696692/4155823180.png',
    title: ''
  },
  {
    image: 'https://ext.same-assets.com/2511696692/850567426.jpeg',
    desc: {
      en: 'Private tours with Sens Asia.',
      vi: 'Tour riêng với Sens Asia.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/1388332819.jpeg',
    desc: {
      en: 'Three days with Syrena Cruises.',
      vi: 'Ba ngày cùng Syrena Cruises.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/3435953427.jpeg',
    desc: {
      en: 'Easy Vietnam tours with Sens Asia.',
      vi: 'Tour Việt Nam dễ dàng cùng Sens Asia.'
    }
  },
  {
    image: 'https://ext.same-assets.com/2511696692/3919851195.jpeg',
    desc: {
      en: 'Charter flights with Hai Au Aviation.',
      vi: 'Chuyến bay thuê bao cùng Hai Âu Aviation.'
    }
  }
];

const SpecialDeals = ({ lang }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleOfferClick = (offer) => {
    if (!offer.type) setSelectedOffer(offer);
  };

  const closeModal = () => setSelectedOffer(null);

  return (
    <section className="special-deals">
      <h2 className="section-title"><span>{TEXT[lang].title}</span></h2>
      <p className="section-desc">{TEXT[lang].desc}</p>
      <div className="offers-grid">
        {offers.map((offer, index) => (
          <div
            key={index}
            className={`offer ${offer.type === 'icon' ? 'offer-icon' : ''}`}
            onClick={() => handleOfferClick(offer)}
            style={{ cursor: offer.type ? 'default' : 'pointer' }}
          >
            <img src={offer.image} alt={TEXT[lang].offers[index] || ''} />
            {TEXT[lang].offers[index] && (
              <div className="offer-info">
                <h3>{TEXT[lang].offers[index]}</h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedOffer && (
        <div className="offer-modal-backdrop" onClick={closeModal}>
          <div className="offer-modal" onClick={e => e.stopPropagation()}>
            <img src={selectedOffer.image} alt={selectedOffer.title} className="offer-modal-img" />
            <div className="offer-modal-content">
              <h2>{selectedOffer.title || ''}</h2>
              <p>{selectedOffer.desc ? selectedOffer.desc[lang] : ''}</p>
              <button className="offer-modal-close" onClick={closeModal}>{lang === 'en' ? 'Close' : 'Đóng'}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SpecialDeals; 