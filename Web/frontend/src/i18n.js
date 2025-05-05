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

      // Event
      // Bản dịch cho Event
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
      events_by_status_title: "Events By Status Chart",
      event_creation_trend_title: "Event Creation Trend",
      events_by_status: "Events By Status",
      events_created_over_time: "Events Created Over Time",
      number_of_events: "Number of Events",
      date: "Date",

      //Add, Update Event
      update_event: "Update Event",
      add_event: "Add New Event",
      event_name: "Event Name",
      event_description: "Event Description",
      event_start_date: "Event Start Date",
      event_end_date: "Event End Date",
      event_location: "Event Location",
      event_ticket_price: "Event Ticket Price",
      event_status: "Event Status",
      choose_image_video: "Choose Image/Video",
      create_event: "Create Event",
      


      // Dịch tháng
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
      
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



      // Event
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
      events_by_status_title: "Biểu đồ sự kiện theo trạng thái",
      event_creation_trend_title: "Xu hướng tạo sự kiện",
      events_by_status: "Sự kiện theo trạng thái",
      events_created_over_time: "Sự kiện được tạo theo thời gian",
      number_of_events: "Số lượng sự kiện",
      date: "Ngày",

      //Add, Update Event
      update_event: "Cập nhật sự kiện",
      add_event: "Thêm sự kiện",
      event_name: "Tên sự kiện",
      event_description: "Mô tả sự kiện",
      event_start_date: "Ngày bắt đầu sự kiện",
      event_end_date: "Ngày kết thúc sự kiện",
      event_location: "Địa điểm sự kiện",
      event_ticket_price: "Giá vé sự kiện",
      event_status: "Trạng thái sự kiện",
      choose_image_video: "Chọn hình ảnh/video",
      create_event: "Tạo sự kiện",

      
      // Dịch tháng
      january: "Tháng Một",
      february: "Tháng Hai",
      march: "Tháng Ba",
      april: "Tháng Tư",
      may: "Tháng Năm",
      june: "Tháng Sáu",
      july: "Tháng Bảy",
      august: "Tháng Tám",
      september: "Tháng Chín",
      october: "Tháng Mười",
      november: "Tháng Mười Một",
      december: "Tháng Mười Hai",

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