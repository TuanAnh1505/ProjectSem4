import React from 'react';
import styles from './Footer.module.css';
import FooterScripts from './FooterScripts';

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={`${styles.colMd4} ${styles.footerWidget} ${styles.footerWidget1}`}>
              <dl>
                <dt>
                  <h4>Sign up for our newsletter</h4>
                </dt>
                <dd>Receive new travel stories from Vietnam once a month in your inbox.</dd>
                <dd>
                  <form 
                    action="https://vietnam.us18.list-manage.com/subscribe/post?u=353d79bea84aaa546cb236660&amp;id=096b99895b" 
                    method="post" 
                    id="mc-embedded-subscribe-form" 
                    name="form-newsletter" 
                    className={`${styles.validate} ${styles.formNewsletter}`} 
                    target="_blank" 
                    noValidate
                  >
                    <p><input type="email" name="EMAIL" placeholder=" Your email " /></p>
                    <p><button name="sign up" className={styles.bgRedCorners}>Sign Up</button></p>
                    <span className={`${styles.error} ${styles.response}`} id="mce-error-response" style={{ display: 'none' }}></span>
                    <span className={`${styles.error} ${styles.response}`} id="mce-success-response" style={{ display: 'none' }}></span>
                  </form>
                </dd>
              </dl>
            </div>

            <div className={`${styles.colMd4} ${styles.colMdPush2} ${styles.footerWidget} ${styles.footerWidget4} ${styles.alignRight}`}>
              <dl>
                <dt>
                  <h4>Follow us on</h4>
                </dt>
                <dd>
                  <ul className={styles.social}>
                    <li>
                      <a target="_blank" href="https://www.facebook.com/vietnamtourismboard/" title="Facebook" className={styles.social}>
                        <img src="//image.vietnam.travel/sites/default/files/2020-07/Vietnam%20tourism%20social%20web-2_4.jpg" alt="Facebook" />
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.youtube.com/vietnamtourismboard/" title="Youtube" className={styles.social}>
                        <img src="//image.vietnam.travel/sites/default/files/2020-07/Vietnam%20tourism%20social%20web-3_6.jpg" alt="Youtube" />
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.instagram.com/vietnamtourismboard/" title="Instagram" className={styles.social}>
                        <img src="//image.vietnam.travel/sites/default/files/2020-07/Vietnam%20tourism%20social%20web-4_4.jpg" alt="Instagram" />
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.pinterest.com/vietnamtourismboard/" title="Pinterest" className={styles.social}>
                        <img src="//image.vietnam.travel/sites/default/files/2020-07/Vietnam%20tourism%20social%20web_4.jpg" alt="Pinterest" />
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.tiktok.com/@vietnamtourismboard?lang=en" title="TikTok" className={styles.social}>
                        <img src="//image.vietnam.travel/sites/default/files/2021-02/Vietnam%20tourism.jpg" alt="TikTok" />
                      </a>
                    </li>
                  </ul>
                  <a href="https://vietnamtourism.gov.vn/en" className={styles.logo}>
                    <img src="//image.vietnam.travel/themes/custom/vietnamtourism/images/logo-bw.png" alt="Vietnam Tourism" />
                  </a>
                </dd>
                <dd className={styles.inlineFlex}>
                  <div className={styles.halfWidth}>
                    <p className={styles.desc}>
                      Welcome to the official website of Viet Nam National Authority of Tourism. Visit our social media pages for more travel inspiration.
                    </p>
                  </div>
                  <div className={styles.halfWidth} id="ncsc">
                    <a 
                      href="https://tinnhiemmang.vn/danh-ba-tin-nhiem/vietnamtravel-1717729146" 
                      title="Chung nhan Tin Nhiem Mang" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img 
                        src="https://tinnhiemmang.vn/handle_cert?id=vietnam.travel" 
                        width="150" 
                        height="auto" 
                        alt="Chung nhan Tin Nhiem Mang" 
                        className={styles.certificate}
                      />
                    </a>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className={`${styles.copyright} ${styles.container}`}>
          <a href="#" className={styles.btnBacktop}>
            Back to top
            <img src="//image.vietnam.travel/themes/custom/vietnamtourism/images/icon-arrow-up.png" alt="Back to top" />
          </a>
          <div className={styles.row}>
            <div className={`${styles.colMd9} ${styles.colMdPush3}`}>
              <ul className={styles.clearfix}>
                <li> &copy; {new Date().getFullYear()} Official Website Vietnam Tourism</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <FooterScripts />
    </>
  );
};

export default Footer; 
      <FooterScripts />

 
