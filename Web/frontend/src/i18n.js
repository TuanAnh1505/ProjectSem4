// src/i18n.js
import { max, min } from "date-fns";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Bản dịch cho AdminDashboard và DashboardPage
      admin_dashboard_title: "Admin Dashboard",
      welcome_message: "Welcome to the admin dashboard!",
      chart_user_title: "Account Statistics Chart",
      chart_destination_title: "Destination Statistics Chart",
      number_destination_title : "Number of Destinations",
      activated_accounts: "Activated",
      non_activated_accounts: "Non-Activated",
      main_pages: "MAIN PAGES",
      dashboard: "Dashboard",
      destination: "Destination",
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

      // Destination

      destination_title: "Destinations List",
      create: "Create",
      name:"Name",
      category:"Category",
      file_paths:"File Paths",
      destinations:"Description",
      location: "Location",
      rating: "Rating",

      event: "Event",
      event_management: "Event Management",
      filter_by_month:"Filter By Month",
      filter_by_status:"Filter By Status ",
      ticket_price: "Ticket Price",
      all_months:"All Months ",
      all_statuses:"All Statuses ",
      description:"Description ",
      start_date:"Start Date ",
      end_date:" Start End",
      total_events:"Total events", 
      filter_by_price: "Filter By Ticket Price",
      min_price: "Min Price",
      max_price: "Max Price",

    },
  },
  vi: {
    translation: {
      // Bản dịch cho AdminDashboard và DashboardPage
      admin_dashboard_title: "Trang Dành Cho Quản Trị Viên",
      welcome_message: "Chào mừng bạn đến với dashboard dành cho quản trị viên!",
      chart_user_title: "Biểu đồ tài khoản",
      chart_destination_title: "Biểu đồ địa điểm",
      number_destination_title: "Số lượng địa điểm",
      activated_accounts: "Đã kích hoạt",
      non_activated_accounts: "Chưa kích hoạt",
      main_pages: "TRANG CHÍNH",
      dashboard: "Bảng Điều Khiển",
      destination: "Điểm Đến",
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

      // Bản dịch cho Destination

      destination_title: "Danh Sách Điểm Đến",
      create: "Tạo Mới",
      name:"Tên",
      category:" Danh Mục",
      file_paths:" Đường Dẫn Tệp",
      destinations:" Điểm Đến",
      location: " Vị Trí",
      rating: " Xếp Hạng",




      // Bản dịch cho Event
      event: "Sự kiện",
      event_management: "Quản lý sự kiện",
      filter_by_month: "Lọc theo tháng",
      filter_by_status: "Lọc theo trạng thái",
      ticket_price: "Giá vé",
      all_months: "Tất cả các tháng",
      all_statuses: "Tất cả các trạng thái",
      description: "Mô tả",
      start_date: "Ngày bắt đầu",
      end_date: "Bắt đầu kết thúc",
      total_events: "Tổng số sự kiện",
      filter_by_price: "Lọc theo giá vé",
      min_price: "Giá tối thiểu",
      max_price: "Giá tối đa",
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