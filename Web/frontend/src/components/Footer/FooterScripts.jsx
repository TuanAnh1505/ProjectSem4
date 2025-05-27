import React, { useEffect } from 'react';

const FooterScripts = () => {
  useEffect(() => {
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
    </>
  );
};

export default FooterScripts; 