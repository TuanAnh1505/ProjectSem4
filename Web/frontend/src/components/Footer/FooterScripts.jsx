import React, { useEffect } from 'react';

const FooterScripts = () => {
  useEffect(() => {
    // Preloader
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }
    }, 500);

    // Newsletter functionality
    const setCookie = (cname, cvalue, exdays, displayTime) => {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      document.cookie = "newsletter_display_time=" + displayTime + ";" + expires + ";path=/";
    };

    const getCookie = (cname) => {
      const name = cname + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    };

    const submit_newsletter = getCookie("submit_newsletter");
    let displayTime = Number(getCookie("newsletter_display_time")) || 0;

    if (displayTime < 2 && (submit_newsletter === "false" || submit_newsletter === "")) {
      displayTime++;
      // Newsletter form submission
      const newsletterForm = document.getElementById('popup-newsletter');
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(newsletterForm);
          
          fetch('//vietnam.us18.list-manage.com/subscribe/post-json?u=353d79bea84aaa546cb236660&id=096b99895b&c=?', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            if (data.result === 'error') {
              const errorResponse = document.getElementById('error-response');
              if (errorResponse) {
                errorResponse.style.display = 'block';
                errorResponse.innerHTML = data.msg === "0 - Please enter a value" ? 
                  "Please type your email!" : data.msg;
              }
            }
            if (data.result === 'success') {
              setCookie("submit_newsletter", true, 365, displayTime);
              const successResponse = document.getElementById('success-response');
              const errorResponse = document.getElementById('error-response');
              if (successResponse) successResponse.style.display = 'block';
              if (errorResponse) {
                errorResponse.style.display = 'none';
                errorResponse.innerHTML = '';
              }
              setTimeout(() => {
                const surveyModal = document.getElementById('surveyModal');
                if (surveyModal) surveyModal.style.display = 'none';
              }, 1000);
            }
          })
          .catch(error => {
            const errorResponse = document.getElementById('error-response');
            if (errorResponse) {
              errorResponse.style.display = 'block';
              errorResponse.innerHTML = error.msg;
            }
          });
        });
      }
    }

    // Instagram gallery functionality
    const instagramMore = document.getElementById('instagram-static-more');
    if (instagramMore) {
      let idx_ig = 1;
      instagramMore.addEventListener('click', (e) => {
        e.preventDefault();
        const group = document.querySelector(`.static-ig-group.static-ig-group-${idx_ig}`);
        if (group) {
          group.style.display = 'block';
          idx_ig++;
        }
      });
    }

    // Inspired navigation
    const inspiredNav = document.querySelector('.inspired-nav-v2');
    if (inspiredNav) {
      const links = inspiredNav.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const id = link.getAttribute('href');
          const inspires = document.querySelectorAll('#inspired .inspires>div');
          inspires.forEach(div => {
            div.style.display = 'none';
            div.classList.remove('active');
          });
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          const targetDiv = document.querySelector(id);
          if (targetDiv) {
            targetDiv.classList.add('active');
            targetDiv.style.display = 'block';
          }
        });
      });
    }

    // Select inspiration
    const selectInspire = document.querySelector('.select-insprise-v2 select');
    if (selectInspire) {
      selectInspire.addEventListener('change', (e) => {
        e.preventDefault();
        const inspires = document.querySelectorAll('#inspired .inspires>div');
        inspires.forEach(div => {
          div.style.display = 'none';
          div.classList.remove('active');
        });
        const id = selectInspire.value;
        const targetDiv = document.querySelector(id);
        if (targetDiv) {
          targetDiv.classList.add('active');
          targetDiv.style.display = 'block';
        }
      });
    }

    // View more button
    const viewMoreBtn = document.querySelector('#inspired .btn-view-more');
    if (viewMoreBtn) {
      viewMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeDiv = document.querySelector('#inspired .inspires> div.active');
        if (activeDiv) {
          const id = activeDiv.id;
          let row = parseInt(activeDiv.getAttribute('data-row')) || 0;
          row += 2;
          activeDiv.setAttribute('data-row', row);
          const nextRow = document.querySelector(`#${id} > div.row:nth-child(${row})`);
          const nextNextRow = document.querySelector(`#${id} > div.row:nth-child(${row + 1})`);
          if (nextRow) nextRow.classList.add('active');
          if (nextNextRow) nextNextRow.classList.add('active');
        }
      });
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager */}
      <script dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-W988G8');`
      }} />
      {/* End Google Tag Manager */}

      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-W988G8" 
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
      {/* End Google Tag Manager (noscript) */}

      {/* External CSS */}
      <link 
        rel="stylesheet" 
        href="/sites/default/files/css/css_gCPQEZA0QYz2dic7PivL4zpzwcpzVrnhXLmcknAj6jc.css?svviq0" 
        media="all" 
      />
      <link 
        rel="stylesheet" 
        href="/sites/default/files/css/css_5aI2cxdQO2AFmdjzlFHcJZQpCzd0lVPW9VFKfUAbx3E.css?svviq0" 
        media="all" 
      />

      {/* IE8 Script */}
      {/*[if lte IE 8]*/}
      <script src="/sites/default/files/js/js_VtafjXmRvoUgAzqzYTA3Wrjkx9wcWhjP0G4ZnnqRamA.js" />
      {/*[endif]*/}

      {/* Đã xóa Swiper JS thuần để tránh xung đột với Swiper React */}
    </>
  );
};

export default FooterScripts; 