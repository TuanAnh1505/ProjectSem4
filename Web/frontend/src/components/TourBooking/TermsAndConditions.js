import React from "react";
import styles from "./TourBooking.module.css";

const TermsAndConditions = () => {
  return (
    <>
      <div className={styles.iukhonbtbuckhingkonline}>
        Điều khoản bắt buộc khi đăng ký online
      </div>
      <div className={styles.divbookingContainerBlock}>
        <div className={styles.iukhonthathunsdngdchvdulchnia}>
          ĐIỀU KHOẢN THỎA THUẬN SỬ DỤNG DỊCH VỤ DU LỊCH NỘI ĐỊA
        </div>
        <div
          className={
            styles.qukhchcncnhngiukhondiytrckhingkvtringhimdchvdoVietraveltchcVicQukhchtiptcsdngtrangwebnyxcnhnvicQukhchchpthunvtunthnhngiukhondiy
          }
        >
          Quý khách cần đọc những điều khoản dưới đây trước khi đăng ký và trải
          nghiệm dịch vụ do Vietravel tổ chức. Việc Quý khách tiếp tục sử dụng
          trang web này xác nhận việc Quý khách đã chấp thuận và tuân thủ những
          điều khoản dưới đây.
        </div>
        <div className={styles.nidungdiygmc02Phn}>
          Nội dung dưới đây gồm có 02 phần:
        </div>
        <div className={styles.phnIiukinbnvccchngtrnhdulchnia}>
          Phần I: Điều kiện bán vé các chương trình du lịch nội địa
        </div>
        <div className={styles.phnIiChnhschbovdliucnhn}>
          Phần II: Chính sách bảo vệ dữ liệu cá nhân
        </div>
        <div className={styles.chititnidungnhsau}>
          Chi tiết nội dung như sau:
        </div>
        <div className={styles.phniiukinbnvccchngtrnhdulchnia}>
          PHẦN I: ĐIỀU KIỆN BÁN VÉ CÁC CHƯƠNG TRÌNH DU LỊCH NỘI ĐỊA
        </div>
        <div className={styles.givdulch}>1. GIÁ VÉ DU LỊCH</div>
        <div
          className={
            styles.givdulchctnhtheotinngVitNamVnTrnghpkhchthanhtonbngngoitscquyiraVNtheotgicaNgnhngutvPhttrinVitNamChinhnhTphcMtithiimthanhton
          }
        >
          Giá vé du lịch được tính theo tiền Đồng (Việt Nam - VNĐ). Trường hợp
          khách thanh toán bằng ngoại tệ sẽ được quy đổi ra VNĐ theo tỷ giá của
          Ngân hàng Đầu tư và Phát triển Việt Nam - Chi nhánh TP.HCM tại thời
          điểm thanh toán.
        </div>
      </div>
      <div className={styles.div104}>
        <input type="checkbox" className={styles.inputacceptPayment} />
        <div className={styles.div105}>
          <div className={styles.tingvi}>Tôi đồng ý với</div>
          <div className={styles.chnhsch}>Chính sách</div>
          <div className={styles.bovdliucnhn}>bảo vệ dữ liệu cá nhân</div>
        </div>
        <div className={styles.div106}>
          <div className={styles.v}>và</div>
          <div className={styles.cciukhontrn}>các điều khoản trên</div>
          <div>.</div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
