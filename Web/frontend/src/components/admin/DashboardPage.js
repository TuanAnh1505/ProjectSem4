import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import AdminDashboard from "../admin/AdminDashboard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);


const DashboardPage = () => {
  const [chartData, setChartData] = useState({
    labels: ["Đã kích hoạt", "Chưa kích hoạt"],
    datasets: [
      {
        label: "Số lượng tài khoản",
        data: [0, 0],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverBackgroundColor: ["#218838", "#c82333"],
      },
    ],
    
  });

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/admin/account-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChartData({
          labels: ["Đã kích hoạt", "Chưa kích hoạt"],
          datasets: [
            {
              label: "Số lượng tài khoản",
              data: [data.activatedAccounts, data.nonActivatedAccounts],
              backgroundColor: ["#28a745", "#dc3545"],
              hoverBackgroundColor: ["#218838", "#c82333"],
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <AdminDashboard>
      <h1>Trang Dành Cho Quản Trị Viên (ADMIN)</h1>
      <p>Chào mừng bạn đến với dashboard dành cho quản trị viên!</p>
      <div className="chart-container">
        <h4>Biểu đồ số lượng tài khoản</h4>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </AdminDashboard>
  );
};

export default DashboardPage;
