# Sơ Đồ Hoạt Động - Hệ Thống Quản Lý Du Lịch

## 1. Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React.js)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Public Pages  │  │  User Dashboard │  │  Admin Panel    │  │
│  │                 │  │                 │  │                 │  │
│  │ • Home          │  │ • Booking       │  │ • User Mgmt     │  │
│  │ • Places to Go  │  │ • Payment       │  │ • Tour Mgmt     │  │
│  │ • Things to Do  │  │ • Profile       │  │ • Destination   │  │
│  │ • Tour Browse   │  │ • History       │  │ • Event Mgmt    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Spring Boot)                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Controllers   │  │    Services     │  │  Repositories   │  │
│  │                 │  │                 │  │                 │  │
│  │ • AuthController│  │ • AuthService   │  │ • UserRepo      │  │
│  │ • TourController│  │ • TourService   │  │ • TourRepo      │  │
│  │ • BookingCtrl   │  │ • BookingService│  │ • BookingRepo   │  │
│  │ • PaymentCtrl   │  │ • PaymentService│  │ • PaymentRepo   │  │
│  │ • AdminController│ │ • AdminService  │  │ • AdminRepo     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ JPA/Hibernate
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Core Tables   │  │  Booking Tables │  │  Admin Tables   │  │
│  │                 │  │                 │  │                 │  │
│  │ • users         │  │ • bookings      │  │ • audit_logs    │  │
│  │ • tours         │  │ • passengers    │  │ • notifications │  │
│  │ • destinations  │  │ • payments      │  │ • feedbacks     │  │
│  │ • events        │  │ • schedules     │  │ • discounts     │  │
│  │ • tour_guides   │  │ • itineraries   │  │ • media         │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Luồng Hoạt Động Chính

### 2.1. Luồng Đăng Ký/Đăng Nhập
```
User → Frontend (Login/Register) → AuthController → AuthService → UserRepository → Database
     ← JWT Token ← AuthService ← AuthController ← Frontend (Store Token)
```

### 2.2. Luồng Đặt Tour
```
1. User Browse Tours
   User → TourDashboard → TourController → TourService → TourRepository → Database

2. Select Tour & Schedule
   User → TourDetailDashboard → TourController → TourService → ScheduleRepository → Database

3. Book Tour
   User → BookingPassenger → BookingController → BookingService → BookingRepository → Database

4. Payment Process
   User → Payment Page → PaymentController → PaymentService → PaymentRepository → Database
   User → MoMo Payment → External Payment Gateway → PaymentController → Update Booking Status
```

### 2.3. Luồng Quản Lý Admin
```
Admin → Admin Dashboard → AdminController → AdminService → Various Repositories → Database
     ← Analytics Data ← AdminService ← AdminController ← Frontend (Display Charts/Stats)
```

## 3. Cấu Trúc Database

### 3.1. Bảng Người Dùng
- `users` - Thông tin người dùng
- `userroles` - Phân quyền người dùng
- `usertokens` - Token xác thực
- `user_discounts` - Mã giảm giá của user

### 3.2. Bảng Du Lịch
- `tours` - Thông tin tour
- `tour_schedules` - Lịch trình tour
- `tour_itinerary` - Chi tiết hành trình
- `tour_status` - Trạng thái tour
- `tour_guides` - Hướng dẫn viên
- `tour_guide_assignments` - Phân công hướng dẫn viên
- `tour_destinations` - Điểm đến của tour
- `tour_events` - Sự kiện liên quan

### 3.3. Bảng Đặt Tour
- `bookings` - Đơn đặt tour
- `booking_passengers` - Thông tin hành khách
- `booking_status` - Trạng thái đặt tour

### 3.4. Bảng Thanh Toán
- `payments` - Thông tin thanh toán
- `payment_methods` - Phương thức thanh toán
- `payment_status` - Trạng thái thanh toán
- `payment_history` - Lịch sử thanh toán

### 3.5. Bảng Quản Lý
- `destinations` - Điểm đến
- `events` - Sự kiện
- `discounts` - Mã giảm giá
- `media` - Tài liệu đa phương tiện
- `feedbacks` - Đánh giá
- `notifications` - Thông báo
- `audit_logs` - Nhật ký hoạt động

## 4. Các Tính Năng Chính

### 4.1. Phía Người Dùng
- **Trang chủ**: Hiển thị thông tin du lịch Việt Nam
- **Khám phá**: Xem điểm đến, hoạt động, tour
- **Đặt tour**: Chọn tour, nhập thông tin, thanh toán
- **Quản lý tài khoản**: Cập nhật thông tin, xem lịch sử
- **Thanh toán**: Hỗ trợ MoMo và các phương thức khác

### 4.2. Phía Admin
- **Quản lý người dùng**: CRUD user, phân quyền
- **Quản lý tour**: Tạo, sửa, xóa tour và lịch trình
- **Quản lý điểm đến**: Thêm/sửa/xóa destinations
- **Quản lý sự kiện**: Tạo và quản lý events
- **Quản lý thanh toán**: Theo dõi và xử lý payments
- **Báo cáo**: Thống kê, analytics, dashboard

## 5. Bảo Mật

### 5.1. Xác Thực
- JWT Token-based authentication
- Role-based access control (USER/ADMIN)
- Password encryption
- Session management

### 5.2. Bảo Vệ API
- Spring Security
- CORS configuration
- Input validation
- SQL injection prevention

## 6. Công Nghệ Sử Dụng

### 6.1. Frontend
- **React.js** - UI framework
- **React Router** - Routing
- **Ant Design** - UI components
- **Material-UI** - Additional UI components
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Toastify** - Notifications

### 6.2. Backend
- **Spring Boot 3.2.4** - Main framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database access
- **Spring Mail** - Email service
- **JWT** - Token management
- **Lombok** - Code generation
- **MySQL** - Database

### 6.3. Development Tools
- **Maven** - Build tool
- **npm** - Package manager
- **Git** - Version control
- **ESLint** - Code quality

## 7. Luồng Dữ Liệu Chi Tiết

### 7.1. Tạo Tour Mới
```
Admin → AdminPanel → TourController.createTour() → TourService → TourRepository.save() → Database
     ← Success Response ← TourService ← TourController ← Frontend (Display Success)
```

### 7.2. Đặt Tour
```
User → TourDetail → Select Schedule → BookingController.createBooking() → BookingService → 
     → Generate Booking Code → Save Booking → Create Passengers → PaymentController → 
     → PaymentService → External Payment → Update Booking Status → Email Notification
```

### 7.3. Xử Lý Thanh Toán
```
User → Payment Page → PaymentController.processPayment() → PaymentService → 
     → Validate Payment → Update Booking Status → Send Confirmation Email → 
     → Update Tour Capacity → Create Payment Record
```

## 8. Monitoring & Logging

- **Audit Logs**: Ghi lại tất cả hoạt động quan trọng
- **Error Handling**: Xử lý lỗi tập trung
- **Performance Monitoring**: Theo dõi hiệu suất API
- **User Activity Tracking**: Theo dõi hành vi người dùng

## 9. Deployment

### 9.1. Development
- Frontend: `npm start` (port 3000)
- Backend: `mvn spring-boot:run` (port 8080)
- Database: MySQL local

### 9.2. Production
- Frontend: Build static files, serve via Nginx
- Backend: JAR file deployment
- Database: MySQL production server
- Load balancing và caching

## 10. Mở Rộng Tương Lai

- **Mobile App**: React Native
- **Real-time Chat**: WebSocket
- **AI Recommendations**: Machine Learning
- **Multi-language**: i18n support
- **Payment Gateway**: Thêm VNPay, ZaloPay
- **Analytics**: Google Analytics integration 