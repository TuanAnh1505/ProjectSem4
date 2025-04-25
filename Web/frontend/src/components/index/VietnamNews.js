import React from "react";



const VietnamNews = () => {
    const sectionStyle = {
      maxWidth: '96rem',
      margin: '0 auto',
      padding: '2rem 2rem 10rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '42%',
      position: 'relative',
      background: 'white',
    };
    const titleStyle = {
      fontSize: '25px',
      color: '#ca8a04',
      fontWeight: '600',
      letterSpacing: '0.05em',
      marginBottom: '0.25rem',
      textTransform: 'uppercase',
    };
    const subtitleStyle = {
      fontSize: '18px',
      color: '#4b5563',
      marginBottom: '2rem',
    };
    const newsContainerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '2rem',
      fontSize: '12px',
      color: '#111827',
    };
    const newsItemStyle = {
      width: '220px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    };
    const newsImgStyle = {
      width: '210px',
      height: '200px',
      objectFit: 'cover',
      marginBottom: '0.5rem',
    };
    const brandStyle = {
      position: 'absolute',
      bottom: '100px',
      left: '10px',
      fontWeight: '700',
      fontSize: '10px',
      textTransform: 'uppercase',
      backgroundColor: '#b91c1c',
      color: 'white',
      padding: '2px 6px',
      lineHeight: '2',
    };
    const textStyle = {
      fontSize: '11px',
      lineHeight: '1.4',
      margin: '0',
      color: '#374151',
    };
  
    const newsItems = [
      {
        src: 'https://storage.googleapis.com/a1aa/image/b109aa64-13fb-4615-7af2-d0b302f959ff.jpg',
        alt: 'Travel Leisure cover',
        brand: 'TRAVEL + LEISURE',
        text: ['Tổ quốc poster ‘Đẩy lùi ta hoa lompoly healeu.', 'Vẻ goarchẻn’s ‘Tổ quốc short ở Phú Quốc’ has earned a spot in Travel + Leisure’s list of the absolute 0...'],
      },
      {
        src: 'https://storage.googleapis.com/a1aa/image/fe742438-93a6-4ced-c93f-be96e5da99a8.jpg',
        alt: 'The Times cover',
        brand: 'THE TIMES',
        text: ['Vietnam’s Gulf of arghter ở Mềnhule, Phú Quốc that tan...', 'The Times reveals 12 best places to visit in Vietnam, The Times full article'],
      },
      {
        src: 'https://storage.googleapis.com/a1aa/image/329cc8b9-440b-4f90-7c08-3b0ccf21d54d.jpg',
        alt: 'Condé Nast Traveller cover',
        brand: 'CRTRAVELLER',
        text: ['Fledgeforty form out point at Yennhule, Phú Quốc tan...', 'Hồ Chí Minh City, the metropolis hub of Vietnam features in the top 25 best places to go in the...'],
      },
      {
        src: 'https://storage.googleapis.com/a1aa/image/4820b36c-5826-4ce8-3605-34cf5978fd0e.jpg',
        alt: 'CNN Travel cover',
        brand: 'CNN TRAVEL',
        text: ['Vietnam’s perfect shores and reefs by D. tổ the outer coast Cape of Chill head, out...', 'Vietnamese beef Pho has been listed on the Top 20 of the world’s best soups by CNN Travel – a s...'],
      },
    ];
  
    return (
      <section style={sectionStyle}>
        <p style={titleStyle}>VIETNAM IN THE NEWS</p>
        <p style={subtitleStyle}>Read about how Vietnam successfully contained the coronavirus.</p>
        <div style={newsContainerStyle}>
          {newsItems.map((item, index) => (
            <div key={index} style={newsItemStyle}>
              <img src={item.src} alt={item.alt} style={newsImgStyle} />
              <p style={brandStyle}>{item.brand}</p>
              {item.text.map((text, i) => (
                <p key={i} style={textStyle}>{text}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  };


  export default VietnamNews;