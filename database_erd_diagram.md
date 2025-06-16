# Sơ Đồ ERD - Database Hệ Thống Du Lịch

## 1. Sơ Đồ Tổng Quan

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    USERS    │    │    ROLES    │    │ USERROLES   │    │ USERTOKENS  │
│             │    │             │    │             │    │             │
│ userid (PK) │◄───┤ roleid (PK) │◄───┤ userid (FK) │◄───┤ userid (FK) │
│ username    │    │ role_name   │    │ roleid (FK) │    │ token       │
│ email       │    │ description │    │             │    │ expires_at  │
│ password    │    │             │    │             │    │             │
│ full_name   │    │             │    │             │    │             │
│ phone       │    │             │    │             │    │             │
│ address     │    │             │    │             │    │             │
│ status      │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  BOOKINGS   │    │BOOKING_PASS │    │BOOKING_STAT │
│             │    │  ENGERS     │    │     US      │
│ booking_id  │◄───┤ booking_id  │◄───┤ status_id   │
│ tour_id (FK)│    │ userid (FK) │    │ status_name │
│ userid (FK) │    │ full_name   │    │             │
│ schedule_id │    │ phone       │    │             │
│ status_id   │    │ email       │    │             │
│ total_price │    │ passenger_  │    │             │
│ booking_code│    │ type        │    │             │
│ discount_id │    │ birth_date  │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       │ N:1
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    TOURS    │    │TOUR_SCHEDULE│    │TOUR_STATUS  │    │TOUR_GUIDES  │
│             │    │     S       │    │             │    │             │
│ tour_id (PK)│◄───┤ tour_id (FK)│◄───┤ status_id   │◄───┤ guide_id    │
│ title       │    │ schedule_id │    │ status_name │    │ name        │
│ description │    │ start_date  │    │             │    │ phone       │
│ price       │    │ end_date    │    │             │    │ email       │
│ capacity    │    │ max_capacity│    │             │    │ experience  │
│ status_id   │    │ current_cap │    │             │    │ rating      │
│ created_at  │    │ price       │    │             │    │ status      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │
       │ N:M
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│DESTINATIONS │    │TOUR_DESTINA │    │TOUR_GUIDE_  │
│             │    │   TIONS     │    │ASSIGNMENTS  │
│ dest_id (PK)│◄───┤ tour_id (FK)│◄───┤ tour_id (FK)│
│ name        │    │ dest_id (FK)│    │ guide_id(FK)│
│ category    │    │             │    │ start_date  │
│ description │    │             │    │ end_date    │
│ location    │    │             │    │ status      │
│ rating      │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│DEST_FILE_   │    │   EVENTS    │    │EVENT_STATUS │
│  PATHS      │    │             │    │             │
│ file_id (PK)│◄───┤ event_id    │◄───┤ status_id   │
│ dest_id (FK)│    │ name        │    │ status_name │
│ file_path   │    │ description │    │             │
│ file_type   │    │ location    │    │             │
│ uploaded_at │    │ start_date  │    │             │
│             │    │ end_date    │    │             │
│             │    │ status_id   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│EVENT_FILE_  │    │  PAYMENTS   │    │PAYMENT_STAT │
│  PATHS      │    │             │    │     US      │
│ file_id (PK)│◄───┤ payment_id  │◄───┤ status_id   │
│ event_id(FK)│    │ booking_id  │    │ status_name │
│ file_path   │    │ amount      │    │             │
│ file_type   │    │ method_id   │    │             │
│ uploaded_at │    │ status_id   │    │             │
│             │    │ created_at  │    │             │
│             │    │ updated_at  │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       │ N:1
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│PAYMENT_METH │    │PAYMENT_HIST │    │ DISCOUNTS   │
│    ODS      │    │    ORY      │    │             │
│ method_id   │◄───┤ payment_id  │◄───┤ discount_id │
│ method_name │    │ action      │    │ code        │
│ description │    │ amount      │    │ percentage  │
│ status      │    │ created_at  │    │ valid_from  │
│             │    │             │    │ valid_to    │
│             │    │             │    │ max_uses    │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│USER_DISCOUN │    │ FEEDBACKS   │    │FEEDBACK_STA │
│     TS      │    │             │    │     TUS     │
│ userid (FK) │◄───┤ feedback_id │◄───┤ status_id   │
│ discount_id │    │ userid (FK) │    │ status_name │
│ used_at     │    │ tour_id (FK)│    │             │
│             │    │ rating      │    │             │
│             │    │ comment     │    │             │
│             │    │ status_id   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 2. Mô Tả Chi Tiết Các Bảng

### 2.1. Bảng Người Dùng (User Management)
```sql
-- Bảng chính lưu thông tin người dùng
users (userid, username, email, password, full_name, phone, address, status, created_at, updated_at)

-- Bảng phân quyền
roles (roleid, role_name, description)

-- Bảng liên kết user-role (Many-to-Many)
userroles (userid, roleid)

-- Bảng token xác thực
usertokens (userid, token, expires_at, created_at)

-- Bảng mã giảm giá của user
user_discounts (userid, discount_id, used_at)
```

### 2.2. Bảng Du Lịch (Tour Management)
```sql
-- Bảng tour chính
tours (tour_id, title, description, price, capacity, status_id, created_at, updated_at)

-- Bảng lịch trình tour
tour_schedules (schedule_id, tour_id, start_date, end_date, max_capacity, current_capacity, price)

-- Bảng trạng thái tour
tour_status (status_id, status_name)

-- Bảng hướng dẫn viên
tour_guides (guide_id, name, phone, email, experience, rating, status)

-- Bảng phân công hướng dẫn viên
tour_guide_assignments (tour_id, guide_id, start_date, end_date, status)

-- Bảng điểm đến
destinations (destination_id, name, category, description, location, rating, created_at, updated_at)

-- Bảng liên kết tour-destination (Many-to-Many)
tour_destinations (tour_id, destination_id)

-- Bảng hành trình tour
tour_itinerary (itinerary_id, tour_id, day_number, description, location)
```

### 2.3. Bảng Đặt Tour (Booking Management)
```sql
-- Bảng đặt tour
bookings (booking_id, tour_id, schedule_id, userid, booking_date, status_id, total_price, 
          booking_code, discount_id, created_at, updated_at)

-- Bảng hành khách
booking_passengers (passenger_id, booking_id, userid, full_name, phone, email, 
                   address, passenger_type, birth_date, gender)

-- Bảng trạng thái đặt tour
booking_status (status_id, status_name)
```

### 2.4. Bảng Thanh Toán (Payment Management)
```sql
-- Bảng thanh toán
payments (payment_id, booking_id, amount, method_id, status_id, created_at, updated_at)

-- Bảng phương thức thanh toán
payment_methods (method_id, method_name, description, status)

-- Bảng trạng thái thanh toán
payment_status (status_id, status_name)

-- Bảng lịch sử thanh toán
payment_history (history_id, payment_id, action, amount, created_at)
```

### 2.5. Bảng Quản Lý (Management Tables)
```sql
-- Bảng sự kiện
events (event_id, name, description, location, start_date, end_date, status_id, created_at, updated_at)

-- Bảng liên kết tour-event (Many-to-Many)
tour_events (tour_id, event_id)

-- Bảng mã giảm giá
discounts (discount_id, code, percentage, valid_from, valid_to, max_uses, created_at)

-- Bảng đánh giá
feedbacks (feedback_id, userid, tour_id, rating, comment, status_id, created_at)

-- Bảng trạng thái đánh giá
feedback_status (status_id, status_name)

-- Bảng thông báo
notifications (notification_id, userid, title, message, type, read_status, created_at)

-- Bảng nhật ký hoạt động
audit_logs (log_id, userid, action, description, created_at)

-- Bảng media
media (media_id, file_path, file_type, entity_type, entity_id, uploaded_at)
```

## 3. Mối Quan Hệ Chính

### 3.1. Quan Hệ 1:N (One-to-Many)
- `users` → `bookings` (1 user có thể có nhiều booking)
- `tours` → `tour_schedules` (1 tour có thể có nhiều lịch trình)
- `tours` → `bookings` (1 tour có thể có nhiều booking)
- `destinations` → `destination_file_paths` (1 destination có nhiều file)
- `events` → `event_file_paths` (1 event có nhiều file)

### 3.2. Quan Hệ N:M (Many-to-Many)
- `tours` ↔ `destinations` (qua bảng `tour_destinations`)
- `tours` ↔ `events` (qua bảng `tour_events`)
- `users` ↔ `roles` (qua bảng `userroles`)
- `users` ↔ `discounts` (qua bảng `user_discounts`)

### 3.3. Quan Hệ 1:1 (One-to-One)
- `bookings` ↔ `payments` (1 booking có 1 payment)
- `tour_schedules` ↔ `tour_guide_assignments` (1 schedule có 1 assignment)

## 4. Các Ràng Buộc Quan Trọng

### 4.1. Foreign Key Constraints
```sql
-- Booking constraints
ALTER TABLE bookings ADD CONSTRAINT fk_booking_user 
    FOREIGN KEY (userid) REFERENCES users(userid);

ALTER TABLE bookings ADD CONSTRAINT fk_booking_tour 
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id);

-- Payment constraints
ALTER TABLE payments ADD CONSTRAINT fk_payment_booking 
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id);

-- Tour constraints
ALTER TABLE tour_schedules ADD CONSTRAINT fk_schedule_tour 
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id);
```

### 4.2. Unique Constraints
```sql
-- Unique booking codes
ALTER TABLE bookings ADD CONSTRAINT uk_booking_code UNIQUE (booking_code);

-- Unique discount codes
ALTER TABLE discounts ADD CONSTRAINT uk_discount_code UNIQUE (code);

-- Unique user emails
ALTER TABLE users ADD CONSTRAINT uk_user_email UNIQUE (email);
```

### 4.3. Check Constraints
```sql
-- Price must be positive
ALTER TABLE tours ADD CONSTRAINT chk_tour_price CHECK (price > 0);

-- Capacity must be positive
ALTER TABLE tours ADD CONSTRAINT chk_tour_capacity CHECK (capacity > 0);

-- Rating must be between 1 and 5
ALTER TABLE destinations ADD CONSTRAINT chk_destination_rating CHECK (rating >= 1 AND rating <= 5);
```

## 5. Indexes Được Khuyến Nghị

```sql
-- Performance indexes
CREATE INDEX idx_bookings_userid ON bookings(userid);
CREATE INDEX idx_bookings_tourid ON bookings(tour_id);
CREATE INDEX idx_bookings_status ON bookings(status_id);
CREATE INDEX idx_payments_bookingid ON payments(booking_id);
CREATE INDEX idx_tour_schedules_tourid ON tour_schedules(tour_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tours_status ON tours(status_id);
CREATE INDEX idx_destinations_category ON destinations(category);
CREATE INDEX idx_events_status ON events(status_id);
```

## 6. Triggers Quan Trọng

### 6.1. Auto-generate Booking Code
```sql
DELIMITER //
CREATE TRIGGER generate_booking_code 
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    SET NEW.booking_code = CONCAT('BK', DATE_FORMAT(NOW(), '%Y%m%d'), 
                                 LPAD(FLOOR(RAND() * 1000000), 6, '0'));
END//
DELIMITER ;
```

### 6.2. Update Tour Capacity
```sql
DELIMITER //
CREATE TRIGGER update_tour_capacity
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    UPDATE tour_schedules 
    SET current_capacity = current_capacity + 1
    WHERE schedule_id = NEW.schedule_id;
END//
DELIMITER ;
```

### 6.3. Audit Log
```sql
DELIMITER //
CREATE TRIGGER audit_booking_changes
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (userid, action, description)
    VALUES (NEW.userid, 'BOOKING_UPDATE', 
            CONCAT('Booking ', NEW.booking_code, ' status changed from ', 
                   OLD.status_id, ' to ', NEW.status_id));
END//
DELIMITER ;
``` 