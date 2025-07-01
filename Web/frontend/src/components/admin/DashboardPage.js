import React, { useEffect, useState } from "react";
import AdminDashboard from "../admin/AdminDashboard";
import "../styles/admin/DashboardPage.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";

const DashboardPage = () => {
  // Fake data cho 4 box thống kê tổng quan (bạn có thể thay bằng API thật nếu có)
  const [summary, setSummary] = useState({
    totalTours: 0,
    totalUsers: 0,
    totalBookings: 0,
    monthRevenue: 0,
    month: new Date().getMonth() + 1,
    revenueChange: 0,
    tourChange: 0,
    userChange: 0,
    bookingChange: 0
  });

  // State cho bảng Tour mới nhất
  const [latestTours, setLatestTours] = useState([]);
  const [statuses, setStatuses] = useState([]);
  // State cho bảng Đặt tour gần đây
  const [latestBookings, setLatestBookings] = useState([]);
  // State cho biểu đồ doanh thu
  const [revenueData, setRevenueData] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);

  // Hàm tính doanh thu theo tháng
  const calculateMonthlyRevenue = (payments) => {
    const monthlyRevenue = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    
    // Tìm statusId của trạng thái "Completed"
    const completedStatus = paymentStatuses.find(status => status.statusName === "Completed");
    if (!completedStatus) return monthlyRevenue.map((_, index) => ({ name: `T${index + 1}`, revenue: 0 }));

    payments.forEach(payment => {
      if (payment.statusId === completedStatus.paymentStatusId && payment.paymentDate) {
        const paymentDate = new Date(payment.paymentDate);
        if (paymentDate.getFullYear() === currentYear) {
          const month = paymentDate.getMonth();
          monthlyRevenue[month] += Number(payment.amount) || 0;
        }
      }
    });

    return monthlyRevenue.map((revenue, index) => ({
      name: `T${index + 1}`,
      revenue: Number((revenue / 1000000).toFixed(2)) // Chuyển đổi sang triệu VND và giữ 2 số thập phân
    }));
  };

  // Hàm tính tổng doanh thu
  const calculateTotalRevenue = (payments) => {
    const completedStatus = paymentStatuses.find(status => status.statusName === "Completed");
    if (!completedStatus) return 0;

    return payments.reduce((total, payment) => {
      if (payment.statusId === completedStatus.paymentStatusId) {
        return total + (Number(payment.amount) || 0);
      }
      return total;
    }, 0);
  };

  // Fetch trạng thái payment
  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/payments/statuses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statuses = await res.json();
        setPaymentStatuses(statuses);
      } catch (err) {
        console.error('Error fetching payment statuses:', err);
        setPaymentStatuses([]);
      }
    };

    fetchPaymentStatuses();
  }, []);

  // Fetch dữ liệu thanh toán và cập nhật summary
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/payments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const payments = await res.json();
        const monthlyData = calculateMonthlyRevenue(payments);
        setRevenueData(monthlyData);

        // Tính toán doanh thu tháng hiện tại và tháng trước
        const currentMonth = new Date().getMonth();
        const currentMonthRevenue = monthlyData[currentMonth].revenue * 1000000;
        const previousMonthRevenue = currentMonth > 0 
          ? monthlyData[currentMonth - 1].revenue * 1000000 
          : monthlyData[11].revenue * 1000000;

        // Tính phần trăm thay đổi
        const revenueChange = previousMonthRevenue === 0 
          ? 0 
          : Number(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(2));

        // Cập nhật summary
        setSummary(prev => ({
          ...prev,
          monthRevenue: Math.round(currentMonthRevenue),
          month: currentMonth + 1,
          revenueChange: revenueChange
        }));
      } catch (err) {
        console.error('Error fetching payments:', err);
        setRevenueData([]);
      }
    };

    if (paymentStatuses.length > 0) {
      fetchPayments();
    }
  }, [paymentStatuses]);

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
        // Sắp xếp theo ngày tạo mới nhất và lấy 5 tour đầu tiên
        const sortedTours = Array.isArray(tours) 
          ? tours
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
          : [];
        setLatestTours(sortedTours);
        setStatuses(statuses);
      } catch (err) {
        console.error("Error fetching tours:", err);
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
        // Sắp xếp theo ngày đặt mới nhất và lấy 5 booking đầu tiên
        const sortedBookings = Array.isArray(bookings)
          ? bookings
              .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
              .slice(0, 5)
          : [];
        setLatestBookings(sortedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
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

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Helper: Đếm số lượng theo tháng
        const countByMonth = (arr, dateField, month, year) => {
          return arr.filter(item => {
            const d = new Date(item[dateField]);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
          }).length;
        };

        const toursThisMonth = countByMonth(tours, 'createdAt', currentMonth, currentYear);
        const toursLastMonth = countByMonth(tours, 'createdAt', prevMonth, prevYear);
        const usersThisMonth = countByMonth(users, 'createdAt', currentMonth, currentYear);
        const usersLastMonth = countByMonth(users, 'createdAt', prevMonth, prevYear);
        const bookingsThisMonth = countByMonth(bookings, 'bookingDate', currentMonth, currentYear);
        const bookingsLastMonth = countByMonth(bookings, 'bookingDate', prevMonth, prevYear);

        // Tính phần trăm thay đổi
        const calcChange = (now, last) => last === 0 ? 0 : ((now - last) / last) * 100;

        setSummary(prev => ({
          ...prev,
          totalTours: Array.isArray(tours) ? tours.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalBookings: Array.isArray(bookings) ? bookings.length : 0,
          toursThisMonth: Number(toursThisMonth) || 0,
          toursLastMonth: Number(toursLastMonth) || 0,
          usersThisMonth: Number(usersThisMonth) || 0,
          usersLastMonth: Number(usersLastMonth) || 0,
          bookingsThisMonth: Number(bookingsThisMonth) || 0,
          bookingsLastMonth: Number(bookingsLastMonth) || 0,
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
  const formatVND = (amount) => {
    if (!amount) return "0 VND";
    return amount.toLocaleString("vi-VN", { 
      style: "currency", 
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Helper format phần trăm
  const formatPercent = (value) => {
    if (!value) return "0%";
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

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
            <div className="dashboard-summary-value" style={{'textAlign': 'center'}}>{summary.totalTours}</div>
            <div className="dashboard-summary-change" style={{color: '#4caf50'}}>
              Tháng này thêm: {(summary.toursThisMonth || 0)} tour
            </div>
          </div>
        </div>
        <div className="dashboard-summary-box">
          <div className="dashboard-summary-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
            <i className="fas fa-users"></i>
          </div>
          <div>
            <div className="dashboard-summary-title">Tổng số Người dùng</div>
            <div className="dashboard-summary-value" style={{'textAlign': 'center'}}>{summary.totalUsers}</div>
            <div className="dashboard-summary-change" style={{color: '#4caf50'}}>
              Tháng này thêm: {(summary.usersThisMonth || 0)} người dùng
            </div>
          </div>
        </div>
        <div className="dashboard-summary-box">
          <div className="dashboard-summary-icon" style={{ background: '#fef9c3', color: '#f59e42' }}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <div>
            <div className="dashboard-summary-title">Tổng số Đặt tour</div>
            <div className="dashboard-summary-value" style={{'textAlign': 'center'}}>{summary.totalBookings}</div>
            <div className="dashboard-summary-change" style={{color: '#4caf50'}}>
              Tháng này thêm: {(summary.bookingsThisMonth || 0)} đặt tour
            </div>
          </div>
        </div>
        <div className="dashboard-summary-box">
          <div className="dashboard-summary-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <i className="fas fa-coins"></i>
          </div>
          <div>
            <div className="dashboard-summary-title">Doanh thu tháng {summary.month}</div>
            <div className="dashboard-summary-value">{formatVND(summary.monthRevenue)}</div>
            {/* <div className={`dashboard-summary-change ${summary.revenueChange >= 0 ? 'up' : 'down'}`}>
              {summary.revenueChange >= 0 ? (
                <span style={{color: '#4caf50', fontWeight: 700, marginRight: 4}}>▲</span>
              ) : (
                <span style={{color: '#f44336', fontWeight: 700, marginRight: 4}}>▼</span>
              )}
              {formatPercent(summary.revenueChange)} so với tháng trước
            </div> */}
          </div>
        </div>
      </div>
      {/* Biểu đồ doanh thu */}
      <div className="dashboard-chart-card">
        <div className="dashboard-chart-header">
          <span>Biểu Đồ Doanh Thu</span>
          <div>
            Năm: <button className="dashboard-year-btn">{new Date().getFullYear()}</button>
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
            <Tooltip 
              formatter={(value) => [`${value.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} triệu VND`, 'Doanh thu']}
              labelFormatter={(label) => `Tháng ${label.replace('T', '')}`}
            />
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