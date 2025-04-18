// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Bản dịch cho AdminDashboard và DashboardPage
      admin_dashboard_title: "Admin Dashboard",
      welcome_message: "Welcome to the admin dashboard!",
      chart_title: "Account Statistics Chart",
      activated_accounts: "Activated",
      non_activated_accounts: "Non-Activated",
      main_pages: "MAIN PAGES",
      dashboard: "Dashboard",
      account_pages: "ACCOUNT PAGES",
      user: "User",
      logout: "Logout",
      account: "Account",
      change_password: "Change Password",
      footer: "© 2025 Admin Dashboard. All rights reserved.",
      // Bản dịch cho UserIndex
      user_list_title: "User List",
      loading: "Loading...",
      id: "ID",
      full_name: "Full Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      status: "Status",
      created_at: "Created At",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
    },
  },
  vi: {
    translation: {
      // Bản dịch cho AdminDashboard và DashboardPage
      admin_dashboard_title: "Trang Dành Cho Quản Trị Viên",
      welcome_message: "Chào mừng bạn đến với dashboard dành cho quản trị viên!",
      chart_title: "Biểu đồ số lượng tài khoản",
      activated_accounts: "Đã kích hoạt",
      non_activated_accounts: "Chưa kích hoạt",
      main_pages: "TRANG CHÍNH",
      dashboard: "Bảng Điều Khiển",
      account_pages: "TRANG TÀI KHOẢN",
      user: "Người Dùng",
      logout: "Đăng Xuất",
      account: "Tài khoản",
      change_password: "Đổi Mật Khẩu",
      footer: "© 2025 Bảng Quản Trị. Mọi quyền được bảo lưu.",
      // Bản dịch cho UserIndex
      user_list_title: "Danh sách người dùng",
      loading: "Đang tải...",
      id: "ID",
      full_name: "Họ và tên",
      email: "Email",
      phone: "Số điện thoại",
      address: "Địa chỉ",
      status: "Trạng thái",
      created_at: "Ngày tạo",
      actions: "Hành động",
      active: "Hoạt động",
      inactive: "Ngưng",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "vi",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;