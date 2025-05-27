import React, { useEffect, useState } from "react";
import AdminDashboard from "../admin/AdminDashboard";
import "../styles/admin/DashboardPage.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";

const DashboardPage = () => {
  // Fake data cho 4 box thống kê tổng quan (bạn có thể thay bằng API thật nếu có)
  const [summary, setSummary] = useState({
    totalTours: 124,
    totalUsers: 3567,
    totalBookings: 2189,
    monthRevenue: 235000000,
    month: 5,
    revenueChange: 10,
    tourChange: 12,
    userChange: 8,
    bookingChange: 15
    
  });

  // State cho bảng Tour mới nhất
  const [latestTours, setLatestTours] = useState([]);
  const [statuses, setStatuses] = useState([]);
  // State cho bảng Đặt tour gần đây
  const [latestBookings, setLatestBookings] = useState([]);

  // Dữ liệu mẫu cho biểu đồ doanh thu
  const revenueData = [
    { name: "T1", revenue: 210 },
    { name: "T2", revenue: 220 },
    { name: "T3", revenue: 195 },
    { name: "T4", revenue: 250 },
    { name: "T5", revenue: 270 },
    { name: "T6", revenue: 290 },
    { name: "T7", revenue: 310 },
    { name: "T8", revenue: 300 },
    { name: "T9", revenue: 280 },
    { name: "T10", revenue: 260 },
    { name: "T11", revenue: 250 },
    { name: "T12", revenue: 320 }
  ];

  useEffect(() => {
    const fetchToursAndStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const [tourRes, statusRes] = await Promise.all([
          fetch("http://localhost:8080/api/tours", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/tour-status", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const tours = await tourRes.json();
        const statuses = await statusRes.json();
        // Sắp xếp và lấy 5 tour mới nhất
        const sortedTours = tours.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        setLatestTours(sortedTours);
        setStatuses(statuses);
      } catch (err) {
        setLatestTours([]);
        setStatuses([]);
      }
    };
    fetchToursAndStatus();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/bookings/admin-bookings", { headers: { Authorization: `Bearer ${token}` } });
        const bookings = await res.json();
        // Sắp xếp và lấy 5 booking mới nhất
        const sortedBookings = bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        setLatestBookings(sortedBookings);
      } catch (err) {
        setLatestBookings([]);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const [toursRes, usersRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:8080/api/tours", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/bookings/admin-bookings", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const tours = await toursRes.json();
        const users = await usersRes.json();
        const bookings = await bookingsRes.json();

        setSummary(prev => ({
          ...prev,
          totalTours: Array.isArray(tours) ? tours.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalBookings: Array.isArray(bookings) ? bookings.length : 0,
          // monthRevenue: ... // Nếu có API doanh thu thì fetch và set ở đây
        }));
      } catch (err) {
        // Có thể giữ lại fake data hoặc set về 0
      }
    };
    fetchSummary();
  }, []);

  // Helper lấy trạng thái tour
  const getStatusName = (statusId) => {
    const status = statuses.find(s => s.tourStatusId === statusId);
    return status ? status.statusName : 'N/A';
  };

  // Helper format tiền
  const formatVND = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  // Helper format ngày
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };

  // Helper trạng thái booking
  const getBookingStatusColor = (status) => {
    switch (status) {
      case "Đã xác nhận": return "#28a745";
      case "Chờ thanh toán": return "#ffc107";
      case "Đã huỷ": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getStatusColor = (statusName) => {
    switch (statusName) {
      case "Đang hoạt động":
        return { background: "#e0fce4", color: "#22c55e" };
      case "Sắp mở":
        return { background: "#e0e7ff", color: "#6366f1" };
      case "Đã kết thúc":
        return { background: "#ffeaea", color: "#dc3545" };
      default:
        return { background: "#f3f4f6", color: "#6c757d" };
    }
  };

  return (
    <AdminDashboard>
      <div style={{ marginBottom: 16 }}>
        <h2>Bảng Điều Khiển</h2>
        <div style={{ color: '#888', fontSize: 14 }}>
          Xin chào, hôm nay là ngày {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>
      {/* 4 box thống kê */}
      <div className="dashboard-summary-boxes">
        <div className="dashboard-summary-box">
          <div className="dashboard-summary-icon" style={{ background: '#e0e7ff', color: '#6366f1' }}>
            <i className="fas fa-route"></i>
          </div>
          <div>
            <div className="dashboard-summary-title">Tổng số Tour</div>
            <div className="dashboard-summary-value">{summary.totalTours}</div>
            <div className="dashboard-summary-change up">↑ {summary.tourChange}% so với tháng trước</div>
          </div>
        </div>
        <div className="dashboard-summary-box">
          <div className="dashboard-summary-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
            <i className="fas fa-users"></i>
          </div>
          <div>
            <div className="dashboard-summary-title">Tổng số Người dùng</div>
            <div className="dashboard-summary-value">{summary.totalUsers}</div>
            <div className="dashboard-summary-change up">↑ {summary.userChange}% so với tháng trước</div>
          </div>
        </div>
        <div className="dashboard-summary-box">
          <div className="dashboard-summary-icon" style={{ background: '#fef9c3', color: '#f59e42' }}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <div>
            <div className="dashboard-summary-title">Tổng số Đặt tour</div>
            <div className="dashboard-summary-value">{summary.totalBookings}</div>
            <div className="dashboard-summary-change up">↑ {summary.bookingChange}% so với tháng trước</div>
          </div>
        </div>
        <div className="dashboard-summary-box">
          <div className="dashboard-summary-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <i className="fas fa-coins"></i>
          </div>
          <div>
            <div className="dashboard-summary-title">Doanh thu tháng {summary.month}</div>
            <div className="dashboard-summary-value">{formatVND(summary.monthRevenue)}</div>
            <div className="dashboard-summary-change up">↑ {summary.revenueChange}% so với tháng trước</div>
          </div>
        </div>
      </div>
      {/* Biểu đồ doanh thu */}
      <div className="dashboard-chart-card">
        <div className="dashboard-chart-header">
          <span>Biểu Đồ Doanh Thu</span>
          <div>
            Năm: <button className="dashboard-year-btn">2025</button>
          </div>
        </div>
        <div className="dashboard-chart-title">Doanh Thu Theo Tháng (Triệu VND)</div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7b6ef6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7b6ef6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#7b6ef6" fillOpacity={1} fill="url(#colorRevenue)" />
            <Line type="monotone" dataKey="revenue" stroke="#7b6ef6" dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* 2 bảng dưới */}
      <div className="dashboard-tables">
        {/* Tour mới nhất */}
        <div className="dashboard-table-box">
          <div className="dashboard-table-header">
            <span>Tour Mới Nhất</span>
            {/* <a href="#">Xem tất cả &rarr;</a> */}
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>TÊN TOUR</th>
                <th>NGÀY TẠO</th>
                <th>GIÁ</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {latestTours.map((tour) => (
                <tr key={tour.id}>
                  <td>{tour.name}</td>
                  <td>{formatDate(tour.createdAt)}</td>
                  <td>{formatVND(tour.price)}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={getStatusColor(getStatusName(tour.statusId))}
                    >
                      {getStatusName(tour.statusId)}
                    </span>
                  </td>
                </tr>
              ))}
              {latestTours.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa' }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Đặt tour gần đây */}
        <div className="dashboard-table-box">
          <div className="dashboard-table-header">
            <span>Đặt Tour Gần Đây</span>
            {/* <a href="#">Xem tất cả &rarr;</a> */}
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>KHÁCH HÀNG</th>
                <th>TOUR</th>
                <th>NGÀY ĐẶT</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.map((booking) => (
                <tr key={booking.id}>
                  <td style={{ fontWeight: 600 }}>{booking.userFullName}</td>
                  <td>{booking.tourName}</td>
                  <td>{formatDate(booking.bookingDate)}</td>
                  <td>
                    <span className="status-badge" style={{ background: getBookingStatusColor(booking.statusName), color: '#fff' }}>
                      {booking.statusName}
                    </span>
                  </td>
                </tr>
              ))}
              {latestBookings.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa' }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboard>
  );
};

export default DashboardPage;