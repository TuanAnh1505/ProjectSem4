import React from 'react';
import '../styles/Partners.css';

const partners = [
  {
    logo: 'https://ext.same-assets.com/2511696692/2527426042.jpeg',
    name: 'ABSOLUTE ASIA TRAVEL',
    address: '2nd Floor, 60 Mai Hac De, Long Bien District, Hanoi, Vietnam',
    phone: '+84 24 3927 6076',
    website: 'www.absoluteasiatravel.com',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/1386512779.png',
    name: 'TRAVELOKA',
    address: 'Floor 2, An Phu Plaza Building, 117-119 Ly Chinh Thang, Vo Thi Sau Ward, District 3, Ho Chi Minh City',
    phone: '+84 28 6285 9300',
    website: 'www.traveloka.com',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/717337232.png',
    name: 'THIEN MINH GROUP',
    address: '12th floor, 70-72 Ba Trieu, Hoan Kiem, Hanoi',
    phone: '+84 24 3628 3146',
    website: 'www.tmgcorp.vn',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/788742068.jpeg',
    name: 'VINGROUP',
    address: '20A Vincom Center Dong Khoi, 72 Le Thanh Ton, Ho Chi Minh City',
    phone: '+84 24 3974 9999',
    website: 'www.vingroup.net',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/2119596158.png',
    name: 'ASIA DMC',
    address: '47 Phan Chau Trinh, Hoan Kiem, Hanoi',
    phone: '+84 34 646 1068',
    website: 'www.asiadmc.com',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/694668074.jpeg',
    name: 'MUONG THANH GROUP',
    address: 'CC2 North Linh Dam, Hoang Mai, Hanoi',
    phone: '1 800 1833',
    website: 'www.muongthanh.com',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/2127748924.png',
    name: 'SUN GROUP',
    address: '9th floor, 218 Bach Dang, Hai Chau, Danang',
    phone: '+84 236 3 819 181',
    website: 'www.sungroup.com.vn',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/3793338299.png',
    name: 'SAIGONTOURIST HOLDING COMPANY',
    address: '23 Le Loi Street, District 1, Ho Chi Minh City',
    phone: '+84 28 3822 8687',
    website: 'www.saigontourist.com.vn',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/542467253.jpeg',
    name: 'VIETNAM AIRLINES',
    address: '200 Nguyen Son, Long Bien, Hanoi',
    phone: '+84 24 3832 732',
    website: 'www.vietnamairlines.com',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/2345043988.jpeg',
    name: 'VISA',
    address: '5th floor, Deutsches Haus 33 Le Duan, District 1, Ho Chi Minh City',
    phone: '+84 28 3821 9901',
    website: 'www.visa.com.vn',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/3107961301.jpeg',
    name: 'H.I.S. SONG HAN VIETNAM',
    address: 'M Floor, 233 Dong Khoi Street, Ben Nghe Ward, District 1, Ho Chi Minh City',
    phone: '+84 28 3827 5068',
    website: 'https://his-discover.com.vn/en/vietnam/',
  },
  {
    logo: 'https://ext.same-assets.com/2511696692/1812372224.jpeg',
    name: 'HANATOUR VIETNAM',
    address: '428 Truong Sa, Phu Nhuan District, Ho Chi Minh City',
    phone: '+84 28 6256 1212',
    website: 'www.hanatour.com',
  },
];

const iconStyle = { width: 16, height: 16, marginRight: 4, verticalAlign: 'middle', opacity: 0.7 };

const Partners = () => {
  return (
    <section className="partners">
      <div className="partners-grid partners-centered">
        {partners.map((p, idx) => (
          <div className="partner-card" key={idx}>
            <img className="partner-logo" src={p.logo} alt={p.name} />
            <div className="partner-info">
              <div className="partner-name">{p.name}</div>
              <div className="partner-detail">
                <span role="img" aria-label="address" style={iconStyle}>📍</span>{p.address}
              </div>
              <div className="partner-detail">
                <span role="img" aria-label="phone" style={iconStyle}>📞</span>{p.phone}
              </div>
              <div className="partner-detail">
                <span role="img" aria-label="website" style={iconStyle}>🌐</span>
                <a href={`https://${p.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer">{p.website}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners; 