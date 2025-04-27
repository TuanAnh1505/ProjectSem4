import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import AdminDashboard from "../admin/AdminDashboard";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const DashboardPage = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState({
    labels: [t("activated_accounts"), t("non_activated_accounts")],
    datasets: [
      {
        label: t("chart_title"),
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

  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{
      label: 'Number of Destinations by Category',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1
    }]
  });

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Destinations by Category'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
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
          labels: [t("activated_accounts"), t("non_activated_accounts")],
          datasets: [
            {
              label: t("chart_title"),
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
  }, [t]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/destinations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const destinations = await response.json();
          const categoryCount = destinations.reduce((acc, dest) => {
            acc[dest.category] = (acc[dest.category] || 0) + 1;
            return acc;
          }, {});

          setCategoryData({
            labels: Object.keys(categoryCount),
            datasets: [{
              label: [t("number_destination_title")],
              data: Object.values(categoryCount),
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1
            }]
          });
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };

    fetchCategoryData();
  }, [t]);

  return (
    <AdminDashboard>
      <h1>{t("admin_dashboard_title")}</h1>
      <p>{t("welcome_message")}</p>
      <div className="charts-container">
        <div className="chart-box pie-chart-box">
          <h4>{t("chart_user_title")}</h4>
          <Pie data={chartData} options={chartOptions} />
        </div>
        <div className="chart-box">
          <h4>{t("chart_destination_title")}</h4>
          <Bar data={categoryData} options={barOptions} />
        </div>
      </div>
    </AdminDashboard>
  );
};

export default DashboardPage;