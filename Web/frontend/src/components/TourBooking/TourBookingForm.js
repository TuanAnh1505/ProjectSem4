import React from "react";
import styles from "./TourBooking.module.css";

const TourBookingForm = () => {
  return (
    <div className={styles.column3}>
      <div className={styles.div15}>
        <div className={styles.divalertalertPrimary}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/1399f3f20dabc3b6be806773410c6e2769224de2?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img8}
            alt="Info icon"
          />
          <div className={styles.div16}>
            <div className={styles.ngnhp}>Đăng nhập</div>
            <div className={styles.nhnuitchimvqunlnhngddnghn}>
              để nhận ưu đãi, tích điểm và quản lý đơn hàng dễ dàng hơn!
            </div>
          </div>
        </div>
        <div className={styles.div17}>
          <div className={styles.div18}>
            <div className={styles.column4}>
              <div className={styles.div19}>
                <div className={styles.divbookingContactCollineR}>
                  <div className={styles.div20}>
                    <div className={styles.htn}>Họ tên</div>
                    <div className={styles.div21}>*</div>
                  </div>
                  <input
                    className={styles.inputinputBorderInput}
                    placeholder="Liên hệ"
                  />
                </div>
                <div className={styles.divbookingContactCollineR2}>
                  <div className={styles.div22}>
                    <div className={styles.email}>Email</div>
                    <div className={styles.div23}>*</div>
                  </div>
                  <input
                    className={styles.inputinputBorderInput2}
                    placeholder="Nhập email"
                  />
                </div>
                <div className={styles.hnhkhch}>Hành khách</div>
              </div>
            </div>
            <div className={styles.column5}>
              <div className={styles.div24}>
                <div className={styles.div25}>
                  <div className={styles.inthoi}>Điện thoại</div>
                  <div className={styles.div26}>*</div>
                </div>
                <input
                  className={styles.inputinputBorderInput3}
                  placeholder="Nhập số điện thoại"
                />
                <div className={styles.ach}>Địa chỉ</div>
                <input
                  className={styles.inputinputBorderInput4}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Passenger count selectors */}
        <div className={styles.div27}>
          {/* Adult */}
          <div className={styles.divwrapper}>
            <div className={styles.div28}>
              <div className={styles.ngiln}>Người lớn</div>
              <div className={styles.div29}>
                <div className={styles.t12Trln}>Từ 12 trở lên</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/97a62c32ca807d6a4112521a20bc49c568e0db8a?apiKey=b83079aa3b064aefaad9423de3864312&"
                  className={styles.img9}
                  alt="Info"
                />
              </div>
            </div>
            <div className={styles.div30}>-</div>
            <div className={styles.css1}>1</div>
            <div className={styles.div31}>+</div>
          </div>
          {/* Young child */}
          <div className={styles.divwrapper2}>
            <div className={styles.div32}>
              <div className={styles.trnh}>Trẻ nhỏ</div>
              <div className={styles.div33}>
                <div className={styles.t24Tui}>Từ 2 - 4 tuổi</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/6ebef8bedbb648f78477fe91eaf6c56c49b7bf54?apiKey=b83079aa3b064aefaad9423de3864312&"
                  className={styles.img10}
                  alt="Info"
                />
              </div>
            </div>
            <div className={styles.div34}>-</div>
            <div className={styles.css0}>0</div>
            <div className={styles.div35}>+</div>
          </div>
        </div>
        <div className={styles.div36}>
          {/* Child */}
          <div className={styles.divwrapper3}>
            <div className={styles.div37}>
              <div className={styles.trem}>Trẻ em</div>
              <div className={styles.div38}>
                <div className={styles.t511Tui}>Từ 5 - 11 tuổi</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/d38632662cd12a37c1058e8d911727d06463fbbc?apiKey=b83079aa3b064aefaad9423de3864312&"
                  className={styles.img11}
                  alt="Info"
                />
              </div>
            </div>
            <div className={styles.div39}>-</div>
            <div className={styles.css0}>0</div>
            <div className={styles.div40}>+</div>
          </div>
          {/* Infant */}
          <div className={styles.divwrapper4}>
            <div className={styles.div41}>
              <div className={styles.emb}>Em bé</div>
              <div className={styles.div42}>
                <div className={styles.di2Tui}>Dưới 2 tuổi</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/1ad7e6e8be63f966ac4515994d858ed66f718722?apiKey=b83079aa3b064aefaad9423de3864312&"
                  className={styles.img12}
                  alt="Info"
                />
              </div>
            </div>
            <div className={styles.div43}>
              <div>-</div>
              <div className={styles.css02}>0</div>
              <div>+</div>
            </div>
          </div>
        </div>
        <div className={styles.thngtinhnhkhch}>Thông tin hành khách</div>
        <div className={styles.divbookingPaxColInputChoice}>
          <input type="checkbox" className={styles.inputwaitForAdvise} />
          <div className={styles.ticncnhnvintvnVietraveltrgipnhpthngtinngkdchv}>
            Tôi cần được nhân viên tư vấn Vietravel trợ giúp nhập thông tin đăng
            ký dịch vụ
          </div>
        </div>
        <div className={styles.divitembookingInfoDivider} />
        <div className={styles.div44}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/eb345959605b448a962a75979d85a22605e3db42?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img13}
            alt="Adult icon"
          />
          <div className={styles.ngiln2}>Người lớn</div>
          <div className={styles.t12Trln2}>Từ 12 trở lên</div>
        </div>
        <div className={styles.div45}>
          <div className={styles.div46}>
            <div className={styles.div47}>
              <div className={styles.div48}>
                <div className={styles.htn}>Họ tên:</div>
                <div className={styles.div49}>*</div>
              </div>
              <input
                className={styles.inputinputNoBorder}
                defaultValue="Liên hệ"
              />
            </div>
            <div className={styles.after} />
          </div>
          <div className={styles.div50}>
            <div className={styles.div51}>
              <div className={styles.div52}>
                <div className={styles.giitnh}>Giới tính</div>
                <div className={styles.div53}>*</div>
              </div>
              <div className={styles.div54}>
                <div>Nam</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/b4651114e3b3f354af68dd1142700405877c4685?apiKey=b83079aa3b064aefaad9423de3864312&"
                  className={styles.img14}
                  alt="Dropdown"
                />
              </div>
            </div>
            <div className={styles.after} />
          </div>
          <div className={styles.div55}>
            <div className={styles.div56}>
              <div className={styles.div57}>
                <div className={styles.ngysinh}>Ngày sinh:</div>
                <div className={styles.div58}>*</div>
              </div>
              <div className={styles.div59}>
                <div className={styles.div60}>--</div>
                <div className={styles.div61}>/</div>
                <div className={styles.div62}>--</div>
                <div className={styles.div63}>/</div>
                <div className={styles.div64}>----</div>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/c59b1972f427ba344345076eda3229a942f6075e?apiKey=b83079aa3b064aefaad9423de3864312&"
              className={styles.img15}
              alt="Calendar"
            />
            <div className={styles.after2} />
          </div>
          <div className={styles.div65}>
            <div className={styles.div66}>
              <div className={styles.phngn}>Phòng đơn</div>
              <label className={styles.labelreactSwitchLabel}>
                <input type="checkbox" />
                <span className={styles.spanreactSwitchButton} />
              </label>
              <div className={styles.css1200000}>1.200.000 ₫</div>
            </div>
            <div className={styles.after} />
          </div>
        </div>
        <div className={styles.ghich}>Ghi chú</div>
        <div className={styles.qukhchcghichlughynivichngti}>
          Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi
        </div>
      </div>
    </div>
  );
};

export default TourBookingForm;
