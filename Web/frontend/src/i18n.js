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
      // Bản dịch cho bộ lọc
      total_users: "Total Users",
      all_users: "All Users",

      // Bản dịch cho UserRegister
      register_title: "Register",
      register_new: "Register New User",
      register_success: "User registered successfully!",
      register_error: "Error registering user.",
      full_name_placeholder: "Enter full name",
      email_placeholder: "Enter email",
      password_placeholder: "Enter password",
      phone_placeholder: "Enter phone number",
      address_placeholder: "Enter address",
      role_placeholder: "Select role",
      register_button: "Register",

      // Bản dịch cho các thông báo lỗi
      no_accounts_found: "No accounts found.",
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
      // Bản dịch cho bộ lọc
      total_users: "Tổng số người dùng",
      all_users: "Tất cả người dùng",
      // Bản dịch cho UserRegister
      register_title: "Đăng Ký",
      register_new: "Đăng Ký Người Dùng Mới",
      register_success: "Người dùng đã được đăng ký thành công!",
      register_error: "Lỗi khi đăng ký người dùng.",
      full_name_placeholder: "Nhập họ và tên",
      email_placeholder: "Nhập email",
      password_placeholder: "Nhập mật khẩu",
      phone_placeholder: "Nhập số điện thoại",
      address_placeholder: "Nhập địa chỉ",
      role_placeholder: "Chọn vai trò",
      register_button: "Đăng Ký",
      // Bản dịch cho các thông báo lỗi
      no_accounts_found: "Không tìm thấy tài khoản nào.",
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