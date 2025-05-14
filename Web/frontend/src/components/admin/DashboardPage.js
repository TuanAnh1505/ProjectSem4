import React, { useState, useEffect } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import AdminDashboard from "../admin/AdminDashboard";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
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

  const [eventStatusData, setEventStatusData] = useState({
    labels: [],
    datasets: [{
      label: 'Events by Status',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });

  const [eventTrendData, setEventTrendData] = useState({
    datasets: [{
      label: 'Events Created Over Time',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });

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

  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const events = await response.json();
          
          // Process status data
          const statusCount = events.reduce((acc, event) => {
            acc[event.statusName] = (acc[event.statusName] || 0) + 1;
            return acc;
          }, {});

          setEventStatusData({
            labels: Object.keys(statusCount),
            datasets: [{
              label: t("events_by_status"),
              data: Object.values(statusCount),
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
              ],
              borderWidth: 1
            }]
          });

          // Process trend data
          const eventsByDate = events.reduce((acc, event) => {
            const date = new Date(event.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});

          const sortedDates = Object.keys(eventsByDate).sort();
          setEventTrendData({
            labels: sortedDates,
            datasets: [{
              label: t("events_created_over_time"),
              data: sortedDates.map(date => ({
                x: new Date(date),
                y: eventsByDate[date]
              })),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          });
        }
      } catch (error) {
        console.error("Failed to fetch event statistics:", error);
      }
    };

    fetchEventStats();
  }, [t]);

  const eventStatusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t("events_by_status_title")
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

  const eventTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t("event_creation_trend_title")
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        title: {
          display: true,
          text: t("date")
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t("number_of_events")
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

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
        <div className="chart-box">
          <h4>{t("events_by_status_title")}</h4>
          <Bar data={eventStatusData} options={eventStatusOptions} />
        </div>
        <div className="chart-box">
          <h4>{t("event_creation_trend_title")}</h4>
          <Line data={eventTrendData} options={eventTrendOptions} />
        </div>
      </div>
      <div>
      </div>
    </AdminDashboard>
  );
};

export default DashboardPage;