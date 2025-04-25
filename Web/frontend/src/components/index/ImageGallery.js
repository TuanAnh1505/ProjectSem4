import React from "react";

const ImageGallery = () => {
    const [modalSrc, setModalSrc] = React.useState(null);
  
    const galleryStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 150px)',
      gap: '10px',
      padding: '10px',
      position: 'relative',
    };
    const imgStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      borderRadius: '6px',
      cursor: 'pointer',
    };
    const centerImageStyle = {
      gridRow: 'span 2',
      gridColumn: '2 / 3',
    };
    const wideImageStyle = {
      gridColumn: 'span 2',
      gridRow: '3 / 4',
    };
    const navBtnStyle = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      border: 'none',
      padding: '8px 12px',
      fontSize: '18px',
      cursor: 'pointer',
      zIndex: '1',
      borderRadius: '50%',
    };
    const prevStyle = { ...navBtnStyle, left: '10px' };
    const nextStyle = { ...navBtnStyle, right: '10px' };
    const modalStyle = {
      display: modalSrc ? 'flex' : 'none',
      position: 'fixed',
      zIndex: '1000',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    };
    const modalImgStyle = {
      maxWidth: '90%',
      maxHeight: '90%',
      borderRadius: '6px',
    };
    const closeStyle = {
      position: 'absolute',
      top: '20px',
      right: '30px',
      color: 'white',
      fontSize: '40px',
      fontWeight: 'bold',
      cursor: 'pointer',
    };
  
    const images = [
      { src: 'https://storage.googleapis.com/a1aa/image/7481104b-42c0-4822-222c-e59f4df69406.jpg', alt: 'Vietnamese temple' },
      { src: 'https://storage.googleapis.com/a1aa/image/b5731dd5-9eac-4441-ecbc-f8ce54fb8d20.jpg', alt: 'Vietnamese food', style: centerImageStyle },
      { src: 'https://storage.googleapis.com/a1aa/image/5a516b57-d89b-46cb-62a2-e4e75e8a2dfb.jpg', alt: 'Vietnamese beach' },
      { src: 'https://storage.googleapis.com/a1aa/image/815a610d-2c2d-4b92-2b25-426c3c50a60b.jpg', alt: 'Vietnamese bridge' },
      { src: 'https://storage.googleapis.com/a1aa/image/a098c6b8-a09b-49a1-97ba-38985d505cc4.jpg', alt: 'Vietnamese chef' },
      { src: 'https://storage.googleapis.com/a1aa/image/65e276d7-b2a1-4fe6-2793-694c05b6ea1a.jpg', alt: 'Vietnamese waterfall' },
      { src: 'https://storage.googleapis.com/a1aa/image/6d969847-59a0-4650-1e85-112fc7ae093a.jpg', alt: 'Vietnamese river', style: wideImageStyle },
    ];
  
    const openModal = (src) => setModalSrc(src);
    const closeModal = () => setModalSrc(null);
  
    return (
      <section style={galleryStyle}>
        {images.map((img, index) => (
          <div key={index} style={img.style || {}}>
            <img src={img.src} alt={img.alt} style={imgStyle} onClick={() => openModal(img.src)} />
            {index === 0 && (
              <button aria-label="Previous" style={prevStyle}>
                <i className="fas fa-chevron-left"></i>
              </button>
            )}
            {index === 2 && (
              <button aria-label="Next" style={nextStyle}>
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        ))}
        <div style={modalStyle} onClick={closeModal}>
          <span style={closeStyle} onClick={closeModal}>×</span>
          <img src={modalSrc} style={modalImgStyle} alt={modalSrc ? "Expanded view of selected image" : ""} />
        </div>
      </section>
    );
  };


  export default ImageGallery;