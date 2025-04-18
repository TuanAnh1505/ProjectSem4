import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import AdminDashboard from "../admin/AdminDashboard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

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

  return (
    <AdminDashboard>
      <h1>{t("admin_dashboard_title")}</h1>
      <p>{t("welcome_message")}</p>
      <div className="chart-container">
        <h4>{t("chart_title")}</h4>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </AdminDashboard>
  );
};

export default DashboardPage;