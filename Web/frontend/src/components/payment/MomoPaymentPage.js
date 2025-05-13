import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function MomoPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, passengers, tourInfo } = location.state || {};
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Missing authentication:", { token, userId });
        navigate('/login');
        return;
      }

      // Tính toán tổng tiền và chuyển đổi thành số nguyên
      const totalAmount = Math.round(tourInfo.price * (passengers.adult + passengers.child + passengers.infant));

      const paymentData = {
        bookingId: parseInt(bookingId),
        userId: parseInt(userId),
        amount: totalAmount
      };

      console.log("Sending payment request with data:", paymentData);

      const response = await axios.post(
        "http://localhost:8080/api/payment/momo-create",
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Payment response:", response.data);
      const { payUrl } = response.data;
      window.location.href = payUrl;
    } catch (error) {
      console.error("Payment error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        requestData: error.config?.data
      });
      alert(error.response?.data || "Có lỗi xảy ra khi tạo thanh toán. Vui lòng kiểm tra console để biết thêm chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId || !passengers || !tourInfo) {
    return <div className="text-center mt-10">Không tìm thấy thông tin đặt tour</div>;
  }

  const totalAmount = Math.round(tourInfo.price * (passengers.adult + passengers.child + passengers.infant));

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Thanh toán qua MoMo</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Thông tin thanh toán</h3>
        <p>Mã đặt tour: {bookingId}</p>
        <p>Tên tour: {tourInfo.name}</p>
        <p>Ngày khởi hành: {new Date(tourInfo.departureDate).toLocaleDateString('vi-VN')}</p>
        <p>Số người lớn: {passengers.adult}</p>
        <p>Số trẻ em: {passengers.child}</p>
        <p>Số em bé: {passengers.infant}</p>
        <p className="font-bold mt-2">
          Tổng tiền: {totalAmount.toLocaleString()}đ
        </p>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Thanh toán với MoMo"}
      </button>
    </div>
  );
}

export default MomoPaymentPage;
