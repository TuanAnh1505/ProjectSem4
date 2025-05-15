import React, { useState } from "react";
import styles from './Tourbooking.module.css';

const Tourbooking = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit form ở đây
  };

  return (
    <div className={styles.mainContent}>
      {/* Ảnh và mô tả tour */}
      <section className={styles.tourIntro}>
        <div className={styles.tourImage}>
          <img src="/images/tour1.jpg" alt="Tour" />
        </div>
        <div className={styles.tourDescription}>
          <h1>Tour Du Lịch Đà Nẵng - Hội An - Bà Nà Hills</h1>
          <p>Khám phá vẻ đẹp của Đà Nẵng, phố cổ Hội An và khu nghỉ dưỡng Bà Nà Hills trong chuyến du lịch 3 ngày 2 đêm đầy thú vị.</p>
          <ul className={styles.tourInfoList}>
            <li>Thời gian: 3 ngày 2 đêm</li>
            <li>Điểm khởi hành: TP. Hồ Chí Minh</li>
            <li>Phương tiện: Máy bay + Ô tô</li>
            <li>Giá từ: 3.990.000đ/người</li>
          </ul>
        </div>
      </section>

      {/* Tabs: Lịch trình, Giới thiệu, Chuẩn bị */}
      <section className={styles.tourTabs}>
        <div className={styles.tabs}>
          <button 
            className={activeTab === 'overview' ? styles.active : ''} 
            onClick={() => handleTabClick('overview')}
          >
            Tổng quan
          </button>
          <button 
            className={activeTab === 'schedule' ? styles.active : ''} 
            onClick={() => handleTabClick('schedule')}
          >
            Lịch trình
          </button>
          <button 
            className={activeTab === 'price' ? styles.active : ''} 
            onClick={() => handleTabClick('price')}
          >
            Bảng giá
          </button>
        </div>
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div>
              <h3>Tổng quan về tour</h3>
              <p>Tour du lịch Đà Nẵng - Hội An - Bà Nà Hills là một hành trình khám phá những điểm đến nổi tiếng nhất của miền Trung Việt Nam. Bạn sẽ được trải nghiệm:</p>
              <ul>
                <li>Tham quan phố cổ Hội An - Di sản văn hóa thế giới</li>
                <li>Khám phá Bà Nà Hills với cầu Vàng nổi tiếng</li>
                <li>Thưởng thức ẩm thực đặc sản địa phương</li>
                <li>Nghỉ dưỡng tại khách sạn 4 sao ven biển</li>
              </ul>
            </div>
          )}
          {activeTab === 'schedule' && (
            <div>
              <h3>Lịch trình chi tiết</h3>
              <div>
                <h4>Ngày 1: TP.HCM - Đà Nẵng - Hội An</h4>
                <p>08:00 - Di chuyển ra sân bay Tân Sơn Nhất</p>
                <p>10:00 - Bay đến Đà Nẵng</p>
                <p>12:00 - Ăn trưa tại nhà hàng địa phương</p>
                <p>14:00 - Khám phá phố cổ Hội An</p>
                <p>18:00 - Ăn tối và nghỉ đêm tại khách sạn</p>
              </div>
              {/* Thêm lịch trình các ngày tiếp theo */}
            </div>
          )}
          {activeTab === 'price' && (
            <div>
              <h3>Bảng giá tour</h3>
              <table>
                <thead>
                  <tr>
                    <th>Loại phòng</th>
                    <th>Giá người lớn</th>
                    <th>Giá trẻ em</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Phòng đôi</td>
                    <td>3.990.000đ</td>
                    <td>2.990.000đ</td>
                  </tr>
                  <tr>
                    <td>Phòng đơn</td>
                    <td>4.990.000đ</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
              <p>* Giá trên đã bao gồm:</p>
              <ul>
                <li>Vé máy bay khứ hồi</li>
                <li>Khách sạn 4 sao</li>
                <li>Ăn uống theo chương trình</li>
                <li>Vé tham quan các điểm du lịch</li>
                <li>Hướng dẫn viên chuyên nghiệp</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Hình ảnh tour */}
      <section className={styles.tourGallery}>
        <h2>Hình ảnh tour</h2>
        <div className={styles.galleryGrid}>
          <img src="/images/tour1.jpg" alt="Tour 1" />
          <img src="/images/tour2.jpg" alt="Tour 2" />
          <img src="/images/tour3.jpg" alt="Tour 3" />
          <img src="/images/tour4.jpg" alt="Tour 4" />
          <img src="/images/tour5.jpg" alt="Tour 5" />
          <img src="/images/tour6.jpg" alt="Tour 6" />
        </div>
      </section>

      {/* Form đặt tour */}
      <section className={styles.tourBookingForm}>
        <h2>Đặt tour ngay</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Họ và tên" required />
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Số điện thoại" required />
          <input type="date" required />
          <input type="number" placeholder="Số người lớn" min="1" required />
          <input type="number" placeholder="Số trẻ em" min="0" />
          <textarea placeholder="Ghi chú thêm" rows="4"></textarea>
          <button type="submit">Đặt tour</button>
        </form>
      </section>

      {/* Điểm khác biệt */}
      <section className={styles.tourHighlights}>
        <h2>Điểm nổi bật của tour</h2>
        <ul>
          <li>Khám phá phố cổ Hội An - Di sản văn hóa thế giới</li>
          <li>Trải nghiệm cầu Vàng tại Bà Nà Hills</li>
          <li>Thưởng thức ẩm thực đặc sản địa phương</li>
          <li>Nghỉ dưỡng tại khách sạn 4 sao ven biển</li>
          <li>Hướng dẫn viên chuyên nghiệp, nhiệt tình</li>
        </ul>
      </section>

      {/* Cảm nhận khách hàng */}
      <section className={styles.customerFeedback}>
        <h2>Đánh giá từ khách hàng</h2>
        <div className={styles.feedbackList}>
          <div className={styles.feedbackItem}>
            <p>"Tour rất tuyệt vời, hướng dẫn viên nhiệt tình, chương trình phù hợp. Tôi sẽ giới thiệu cho bạn bè."</p>
            <span>- Nguyễn Văn A</span>
          </div>
          <div className={styles.feedbackItem}>
            <p>"Dịch vụ tốt, giá cả hợp lý. Đặc biệt là phần khám phá Hội An rất thú vị."</p>
            <span>- Trần Thị B</span>
          </div>
          <div className={styles.feedbackItem}>
            <p>"Chuyến đi đáng nhớ, mọi thứ đều hoàn hảo từ dịch vụ đến địa điểm tham quan."</p>
            <span>- Lê Văn C</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.tourFaq}>
        <h2>Câu hỏi thường gặp</h2>
        <div className={styles.faqList}>
          <div className={styles.faqItem}>
            <strong>Có thể đặt tour riêng không?</strong>
            <p>Có, chúng tôi cung cấp dịch vụ tour riêng cho nhóm từ 6 người trở lên.</p>
          </div>
          <div className={styles.faqItem}>
            <strong>Chính sách hủy tour như thế nào?</strong>
            <p>Hủy trước 7 ngày: Hoàn 100% tiền cọc<br />
               Hủy trước 3 ngày: Hoàn 50% tiền cọc<br />
               Hủy trong vòng 3 ngày: Không hoàn tiền cọc</p>
          </div>
          <div className={styles.faqItem}>
            <strong>Trẻ em có được giảm giá không?</strong>
            <p>Có, trẻ em dưới 12 tuổi được giảm 25% giá tour, trẻ em dưới 5 tuổi được giảm 50%.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tourbooking;
