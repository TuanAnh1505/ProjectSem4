SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET NAMES utf8mb4;

CREATE TABLE users (
  user_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone BLOB,
  address BLOB,
  is_active TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE booking_status (
  booking_status_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  status_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE destinations (
  destination_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  file_type ENUM('image', 'video'),
  description TEXT,
  location VARCHAR(255),
  rating DECIMAL(3,1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK (rating BETWEEN 0 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tour_status (
  tour_status_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  status_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tours (
  tour_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INT,
  max_participants INT,
  destination_id INT,
  status_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES tour_status(tour_status_id) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE bookings (
  booking_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  tour_id INT,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status_id INT,
  total_price DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES booking_status(booking_status_id) ON DELETE NO ACTION,
  CHECK (total_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE discounts (
  discount_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_percent FLOAT,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK (discount_percent BETWEEN 0 AND 100),
  CHECK (start_date < end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE event_status (
  event_status_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  status_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE events (
  event_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  ticket_price DECIMAL(10,2),
  status_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (status_id) REFERENCES event_status(event_status_id) ON DELETE NO ACTION,
  CHECK (start_date < end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE feedback_status (
  feedback_status_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  status_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE feedbacks (
  feedback_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  tour_id INT,
  destination_id INT,
  event_id INT,
  message TEXT NOT NULL,
  status_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE NO ACTION,
  FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE NO ACTION,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE NO ACTION,
  FOREIGN KEY (status_id) REFERENCES feedback_status(feedback_status_id) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE payment_status (
  payment_status_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  status_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE payments (
  payment_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  booking_id INT,
  user_id BIGINT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('credit_card', 'paypal', 'bank_transfer', 'cash'),
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status_id INT,
  transaction_id VARCHAR(255),
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE NO ACTION,
  FOREIGN KEY (status_id) REFERENCES payment_status(payment_status_id) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE notifications (
  notification_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  sender_id BIGINT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('system', 'booking', 'payment', 'tour', 'event', 'feedback') NOT NULL,
  is_read TINYINT DEFAULT 0,
  booking_related_id INT,
  event_related_id INT,
  feedback_related_id INT,
  payment_related_id INT,
  tour_related_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE NO ACTION,
  FOREIGN KEY (booking_related_id) REFERENCES bookings(booking_id) ON DELETE NO ACTION,
  FOREIGN KEY (event_related_id) REFERENCES events(event_id) ON DELETE NO ACTION,
  FOREIGN KEY (feedback_related_id) REFERENCES feedbacks(feedback_id) ON DELETE NO ACTION,
  FOREIGN KEY (payment_related_id) REFERENCES payments(payment_id) ON DELETE NO ACTION,
  FOREIGN KEY (tour_related_id) REFERENCES tours(tour_id) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE notifications_archive (
  notification_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  sender_id BIGINT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('system', 'booking', 'payment', 'tour', 'event', 'feedback') NOT NULL,
  is_read TINYINT DEFAULT 0,
  booking_related_id INT,
  event_related_id INT,
  feedback_related_id INT,
  payment_related_id INT,
  tour_related_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE NO ACTION,
  FOREIGN KEY (booking_related_id) REFERENCES bookings(booking_id) ON DELETE NO ACTION,
  FOREIGN KEY (event_related_id) REFERENCES events(event_id) ON DELETE NO ACTION,
  FOREIGN KEY (feedback_related_id) REFERENCES feedbacks(feedback_id) ON DELETE NO ACTION,
  FOREIGN KEY (payment_related_id) REFERENCES payments(payment_id) ON DELETE NO ACTION,
  FOREIGN KEY (tour_related_id) REFERENCES tours(tour_id) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tour_guides (
  guide_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  experience_years INT,
  specialization VARCHAR(255),
  languages VARCHAR(255),
  rating DECIMAL(3,1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CHECK (experience_years >= 0),
  CHECK (rating BETWEEN 0 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE guide_reviews (
  guide_review_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  guide_id INT,
  rating INT,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (guide_id) REFERENCES tour_guides(guide_id) ON DELETE NO ACTION,
  CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE itineraries (
  itinerary_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  tour_id INT,
  name VARCHAR(255) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE SET NULL,
  CHECK (start_date <= end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE itinerary_details (
  itinerary_detail_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  itinerary_id INT NOT NULL,
  destination_id INT,
  activity_type VARCHAR(100) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  notes TEXT,
  FOREIGN KEY (itinerary_id) REFERENCES itineraries(itinerary_id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE media (
  media_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  file_type ENUM('image', 'video'),
  file_url VARCHAR(255),
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE reviews (
  review_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  destination_id INT,
  rating INT,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE,
  CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE roles (
  role_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tour_guides_assignments (
  tour_id INT NOT NULL,
  guide_id INT NOT NULL,
  PRIMARY KEY (tour_id, guide_id),
  FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
  FOREIGN KEY (guide_id) REFERENCES tour_guides(guide_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE audit_logs (
  log_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE user_discounts (
  tour_id INT NOT NULL,
  user_id BIGINT NOT NULL,
  discount_id INT NOT NULL,
  used TINYINT DEFAULT 0,
  PRIMARY KEY (tour_id, discount_id, user_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
  FOREIGN KEY (discount_id) REFERENCES discounts(discount_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE user_tokens (
  token_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expiry DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE translations (
  translation_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  table_name VARCHAR(50) NOT NULL,
  column_name VARCHAR(50) NOT NULL,
  record_id INT NOT NULL,
  language VARCHAR(10) NOT NULL,
  translation TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_tour_guides_assignments_tour_id ON tour_guides_assignments(tour_id);
CREATE INDEX idx_translations_lookup ON translations (table_name, column_name, record_id, language);

DELIMITER //
CREATE TRIGGER log_booking_creation
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (user_id, action, description, created_at)
  VALUES (NEW.user_id, 'BOOKING_CREATED', CONCAT('Người dùng đã tạo đặt tour với ID ', NEW.booking_id), NOW());
END;
//

CREATE TRIGGER log_feedback_creation
AFTER INSERT ON feedbacks
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (user_id, action, description, created_at)
  VALUES (NEW.user_id, 'FEEDBACK_CREATED', CONCAT('Người dùng đã gửi phản hồi với ID ', NEW.feedback_id), NOW());
END;
//

CREATE TRIGGER log_payment_creation
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (user_id, action, description, created_at)
  VALUES (NEW.user_id, 'PAYMENT_CREATED', CONCAT('Người dùng đã thực hiện thanh toán với ID ', NEW.payment_id), NOW());
END;
//
DELIMITER ;