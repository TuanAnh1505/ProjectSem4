-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 04, 2025 lúc 06:13 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `testdb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_id` int(11) NOT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `booking_date` datetime DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `total_price` decimal(38,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userid` bigint(20) NOT NULL,
  `booking_code` varchar(20) NOT NULL,
  `discount_code` varchar(50) DEFAULT NULL,
  `discount_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `booking_code` (`booking_code`),
  KEY `tour_id` (`tour_id`),
  KEY `status_id` (`status_id`),
  KEY `userid` (`userid`),
  KEY `discount_id` (`discount_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `booking_statuses` (`status_id`),
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  CONSTRAINT `bookings_ibfk_4` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`discount_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`booking_id`, `booking_code`, `tour_id`, `booking_date`, `status_id`, `total_price`, `created_at`, `updated_at`, `userid`, `schedule_id`) VALUES
(1, 'BK202506031608114851', 2, '2025-06-03 16:08:11', 2, 4780000.00, '2025-06-03 16:08:11', '2025-06-03 16:08:35', 1, 3),
(2, 'BK202506031621179173', 4, '2025-06-03 16:21:17', 1, 3800000.00, '2025-06-03 16:21:17', '2025-06-03 16:21:17', 2, 4),
(3, 'BK202506031622403491', 4, '2025-06-03 16:22:40', 1, 3800000.00, '2025-06-03 16:22:40', '2025-06-03 16:22:40', 2, 4),
(4, 'BK202506031636350724', 5, '2025-06-03 16:36:35', 2, 4200000.00, '2025-06-03 16:36:35', '2025-06-03 16:37:31', 2, 9),
(5, 'BK202506040834014981', 2, '2025-06-04 08:34:01', 1, 4780000.00, '2025-06-04 08:34:01', '2025-06-04 08:34:01', 4, 3),
(6, 'BK202506040836475615', 4, '2025-06-04 08:36:47', 1, 3800000.00, '2025-06-04 08:36:47', '2025-06-04 08:36:47', 2, 4),
(7, 'BKKCRWRC25088154', 5, '2025-06-04 08:39:23', 1, 4200000.00, '2025-06-04 08:39:23', '2025-06-04 08:39:23', 2, 5),
(8, 'BKHD1955M97DYWCC24M5', 2, '2025-06-04 08:40:19', 2, 4780000.00, '2025-06-04 08:40:19', '2025-06-04 08:41:31', 2, 3),
(9, 'BKJN68PWB230IOA7TG3G', 2, '2025-06-04 09:40:11', 2, 4780000.00, '2025-06-04 09:40:11', '2025-06-04 09:50:22', 2, 3),
(10, 'BK2869A6JH482C012IX1', 5, '2025-06-04 09:50:09', 2, 4200000.00, '2025-06-04 09:50:09', '2025-06-04 09:50:29', 1, 5),
(11, 'BK4IJ0P08VH96L8A1KJ0', 4, '2025-06-04 09:52:27', 2, 3800000.00, '2025-06-04 09:52:27', '2025-06-04 09:52:48', 1, 4),
(12, 'BKJUNMSX2HO35KD55725', 4, '2025-06-04 10:01:19', 2, 3800000.00, '2025-06-04 10:01:19', '2025-06-04 10:01:39', 1, 4),
(13, 'BK61IG3V97H23P54BF69', 4, '2025-06-04 10:50:04', 2, 3800000.00, '2025-06-04 10:50:04', '2025-06-04 10:50:28', 1, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_passengers`
--

CREATE TABLE `booking_passengers` (
  `passenger_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `passenger_type` enum('adult','child','infant') NOT NULL,
  `birth_date` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `booking_passengers`
--

INSERT INTO `booking_passengers` (`passenger_id`, `booking_id`, `userid`, `full_name`, `phone`, `email`, `address`, `passenger_type`, `birth_date`, `gender`) VALUES
(1, 1, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '2005-01-01', 'Nam'),
(2, 2, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '2025-06-03', 'Nam'),
(3, 4, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '2025-06-03', 'Nam'),
(4, 8, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '2005-01-01', 'Nam'),
(5, 9, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '2000-12-05', 'Nam'),
(6, 10, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '20005-12-05', 'Nam'),
(7, 11, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '2000-12-05', 'Nam'),
(8, 12, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '2000-12-05', 'Nam'),
(9, 13, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '2000-12-02', 'Nam');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_status`
--

CREATE TABLE `booking_status` (
  `booking_status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `booking_status`
--

INSERT INTO `booking_status` (`booking_status_id`, `status_name`) VALUES
(3, 'Cancelled'),
(4, 'Completed'),
(2, 'Confirmed'),
(1, 'Pending');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `destinations`
--

CREATE TABLE `destinations` (
  `destination_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `rating` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `destinations`
--

INSERT INTO `destinations` (`destination_id`, `name`, `category`, `description`, `location`, `rating`, `created_at`, `updated_at`) VALUES
(1, 'Đèo Mã Pí Lèng', 'Thiên nhiên', 'Một trong tứ đại đỉnh đèo nổi tiếng với cảnh sắc hùng vĩ.', 'Hà Giang', 5, '2025-05-17 11:10:38', '2025-05-17 11:10:38'),
(2, 'Dinh Thự Vua Mèo', 'Lịch sử', 'Di tích kiến trúc cổ nổi bật, từng là nơi ở của Vua Mèo Vương Chính Đức.', 'Sà Phìn, Đồng Văn, Hà Giang', 4, '2025-05-17 11:11:20', '2025-05-17 11:11:20'),
(3, 'Vịnh Hạ Long', 'Thiên nhiên', 'Kỳ quan thiên nhiên thế giới, nổi bật với hàng nghìn đảo đá vôi.', 'Quảng Ninh', 5, '2025-05-20 19:33:11', '2025-05-20 19:33:11'),
(4, 'Fansipan', 'Thiên nhiên', 'Nóc nhà Đông Dương với cáp treo hiện đại dẫn lên đỉnh.', 'Lào Cai', 5, '2025-05-20 19:36:11', '2025-05-20 19:36:11'),
(5, 'Thung lũng Mường Hoa', 'Thiên nhiên', 'Nơi có những thửa ruộng bậc thang kỳ vĩ và di tích cổ.', 'Sapa, Lào Cai', 5, '2025-05-20 19:37:38', '2025-05-20 19:37:38'),
(6, 'Chợ nổi Cái Răng', 'Văn hóa địa phương', 'Chợ nổi đặc trưng vùng sông nước miền Tây.', 'Cần Thơ', 4, '2025-05-20 19:39:30', '2025-05-20 19:39:30'),
(8, 'ds', 'd', 'sd', 'sd', 5, '2025-05-25 19:51:09', '2025-05-25 19:51:09');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `destination_file_paths`
--

CREATE TABLE `destination_file_paths` (
  `file_id` int(11) NOT NULL,
  `destination_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `destination_file_paths`
--

INSERT INTO `destination_file_paths` (`file_id`, `destination_id`, `file_path`, `file_type`, `uploaded_at`) VALUES
(1, 1, '/uploads/destinations/2097171b-a6da-4e78-b781-43bfb86f6353.jfif', 'image', '2025-05-17 11:10:38'),
(2, 1, '/uploads/destinations/9c5c1dc2-2550-4fc0-b051-740b141b0159.jfif', 'image', '2025-05-17 11:10:38'),
(3, 2, '/uploads/destinations/cd07ba0b-b89d-4b12-b246-cd0ff4f815a4.jpg', 'image', '2025-05-17 11:11:20'),
(4, 2, '/uploads/destinations/d7f8d40a-3556-433f-bcc5-1e5bc48ae2d0.jpg', 'image', '2025-05-17 11:11:20'),
(5, 3, '/uploads/destinations/449992a5-0028-42a8-a689-6d1a347ce54a.jpg', NULL, '2025-05-20 19:33:11'),
(6, 4, '/uploads/destinations/98572563-765e-47a1-a8e1-9128c0f66c53.png', NULL, '2025-05-20 19:36:11'),
(7, 5, '/uploads/destinations/2a1bd0c2-a05f-454d-b89a-b31957e2367b.jfif', NULL, '2025-05-20 19:37:38'),
(8, 6, '/uploads/destinations/b4bbf29a-f3d3-4ec8-8e28-642189cdbbc9.jpg', NULL, '2025-05-20 19:39:30'),
(10, 8, '/uploads/destinations/d7812872-2574-475a-ac07-14da34039842.png', NULL, '2025-05-25 19:51:09');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `discounts`
--

CREATE TABLE `discounts` (
  `discount_id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_percent` float DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `ticket_price` decimal(38,2) DEFAULT NULL,
  `status_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `events`
--

INSERT INTO `events` (`event_id`, `name`, `description`, `location`, `start_date`, `end_date`, `ticket_price`, `status_id`, `created_at`, `updated_at`) VALUES
(1, '	 Lễ hội Chợ tình Khâu Vai', 'Lễ hội truyền thống độc đáo nơi tình yêu được hẹn hò mỗi năm một lần.', 'Khâu Vai, Mèo Vạc, Hà Giang', '2025-05-28 08:00:00', '2025-05-28 17:00:00', 1.00, 1, '2025-05-17 11:26:52', '2025-05-17 11:26:52'),
(2, 'Lễ hội Hoa Hạ Long', 'Trưng bày hoa và các hoạt động văn hóa trên Vịnh Hạ Long.', 'Quảng Ninh', '2025-06-15 09:00:00', '2025-06-17 20:00:00', 100000.00, 2, '2025-05-20 19:42:32', '2025-05-20 19:42:32'),
(3, 'Festival Đà Lạt Mùa Hè', 'Lễ hội hoa, âm nhạc và trình diễn ánh sáng mùa hè tại Đà Lạt.', 'Đà Lạt', '2025-07-01 10:00:00', '2025-07-03 21:00:00', 120000.00, 1, '2025-05-20 19:44:46', '2025-05-20 19:44:46'),
(4, 'Đêm nhạc Hội An phố cổ', 'Chương trình nghệ thuật tái hiện văn hóa Hội An xưa.', 'Hội An', '2025-08-05 18:00:00', '2025-08-06 22:00:00', 80000.00, 1, '2025-05-20 19:46:59', '2025-05-20 19:46:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_file_paths`
--

CREATE TABLE `event_file_paths` (
  `event_id` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `event_file_paths`
--

INSERT INTO `event_file_paths` (`event_id`, `file_path`) VALUES
(1, '/uploads/events/1747456012005_Lễ hội Chợ tình Khâu Vai.jpeg'),
(2, '/uploads/events/1747744952008_Lễ hội Hoa Hạ Long.jpg'),
(3, '/uploads/events/1747745086434_Festival Đà Lạt Mùa Hè.jpg'),
(4, '/uploads/events/1747745219719_Đêm nhạc Hội An phố cổ.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_status`
--

CREATE TABLE `event_status` (
  `event_status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `event_status`
--

INSERT INTO `event_status` (`event_status_id`, `status_name`) VALUES
(2, 'Active'),
(3, 'Cancelled'),
(4, 'Completed'),
(1, 'Pending');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `tour_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `status_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedback_status`
--

CREATE TABLE `feedback_status` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `feedback_status`
--

INSERT INTO `feedback_status` (`status_id`, `status_name`, `description`) VALUES
(1, 'Pending', 'Feedback is pending review'),
(2, 'Approved', 'Feedback has been approved'),
(3, 'Rejected', 'Feedback has been rejected');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `media`
--

CREATE TABLE `media` (
  `media_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `file_type` enum('image','video') NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `notification_type` enum('system','booking','payment','tour','event','feedback') NOT NULL,
  `is_read` bit(1) DEFAULT b'0',
  `related_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `amount` decimal(38,2) DEFAULT NULL,
  `payment_method_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_date` datetime DEFAULT current_timestamp(),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`payment_id`, `booking_id`, `userid`, `amount`, `payment_method_id`, `status_id`, `transaction_id`, `payment_date`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 4780000.00, 2, 3, 'f6820539-c7b6-46b0-9aec-67a278743f3e', '2025-06-03 16:08:26', '2025-06-03 16:08:26', '2025-06-03 16:08:35'),
(2, 4, 2, 4200000.00, 2, 3, '891843b6-1df8-458e-995b-c87bd2067a0b', '2025-06-03 16:37:13', '2025-06-03 16:37:13', '2025-06-03 16:37:31'),
(3, 8, 2, 4780000.00, 2, 3, 'fe1e62da-9920-4a7d-b79a-684a849ccaee', '2025-06-04 08:41:24', '2025-06-04 08:41:24', '2025-06-04 08:41:31'),
(4, 9, 2, 4780000.00, 2, 3, '6111cef6-5dfd-4fbe-a58f-f301449a4eda', '2025-06-04 09:40:50', '2025-06-04 09:40:50', '2025-06-04 09:50:22'),
(5, 10, 1, 4200000.00, 2, 3, 'fd09f154-a746-4b22-83f5-4274018d04d3', '2025-06-04 09:50:19', '2025-06-04 09:50:19', '2025-06-04 09:50:29'),
(6, 11, 1, 3800000.00, 2, 3, '8e5f8532-3722-4723-a9b4-6d0ce5186bd4', '2025-06-04 09:52:40', '2025-06-04 09:52:40', '2025-06-04 09:52:48'),
(7, 12, 1, 3800000.00, 2, 3, 'f16126d1-9fd7-4b59-a0df-337985dd0394', '2025-06-04 10:01:27', '2025-06-04 10:01:27', '2025-06-04 10:01:39'),
(8, 13, 1, 3800000.00, 2, 3, '9e3b3407-2513-492e-bd29-d9a0326c3b5f', '2025-06-04 10:50:18', '2025-06-04 10:50:18', '2025-06-04 10:50:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_history`
--

CREATE TABLE `payment_history` (
  `history_id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_history`
--

INSERT INTO `payment_history` (`history_id`, `payment_id`, `status_id`, `notes`, `created_at`) VALUES
(1, 1, 1, 'Payment created', '2025-06-03 16:08:26'),
(2, 1, 3, 'Status updated to Completed', '2025-06-03 16:08:39'),
(3, 1, 3, 'Status updated to Completed', '2025-06-03 16:08:40'),
(4, 2, 1, 'Payment created', '2025-06-03 16:37:13'),
(5, 2, 3, 'Status updated to Completed', '2025-06-03 16:37:35'),
(6, 2, 3, 'Status updated to Completed', '2025-06-03 16:37:36'),
(7, 3, 1, 'Payment created', '2025-06-04 08:41:24'),
(8, 3, 3, 'Status updated to Completed', '2025-06-04 08:41:36'),
(9, 3, 3, 'Status updated to Completed', '2025-06-04 08:42:42'),
(10, 4, 1, 'Payment created', '2025-06-04 09:40:50'),
(11, 5, 1, 'Payment created', '2025-06-04 09:50:19'),
(12, 4, 3, 'Status updated to Completed', '2025-06-04 09:50:26'),
(13, 5, 3, 'Status updated to Completed', '2025-06-04 09:50:33'),
(14, 6, 1, 'Payment created', '2025-06-04 09:52:40'),
(15, 6, 3, 'Status updated to Completed', '2025-06-04 09:52:53'),
(16, 7, 1, 'Payment created', '2025-06-04 10:01:27'),
(17, 7, 3, 'Status updated to Completed', '2025-06-04 10:01:44'),
(18, 8, 1, 'Payment created', '2025-06-04 10:50:18'),
(19, 8, 3, 'Status updated to Completed', '2025-06-04 10:50:32');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_methods`
--

CREATE TABLE `payment_methods` (
  `method_id` int(11) NOT NULL,
  `method_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT b'1',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_methods`
--

INSERT INTO `payment_methods` (`method_id`, `method_name`, `description`, `is_active`, `created_at`) VALUES
(1, 'Credit Card', 'Payment via credit card', b'1', '2025-05-17 10:10:43'),
(2, 'Bank Transfer', 'Payment via bank transfer', b'1', '2025-05-17 10:10:43'),
(3, 'Cash', 'Payment in cash', b'1', '2025-05-17 10:10:43'),
(4, 'E-Wallet', 'Payment via e-wallet', b'1', '2025-05-17 10:10:43'),
(5, 'PayPal', 'Payment via PayPal', b'1', '2025-05-17 10:10:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_status`
--

CREATE TABLE `payment_status` (
  `payment_status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_status`
--

INSERT INTO `payment_status` (`payment_status_id`, `status_name`, `description`) VALUES
(1, 'Pending', 'Payment is pending'),
(2, 'Processing', 'Payment is being processed'),
(3, 'Completed', 'Payment has been completed'),
(4, 'Failed', 'Payment has failed'),
(5, 'Refunded', 'Payment has been refunded'),
(6, 'Cancelled', 'Payment has been cancelled'),
(7, 'Request Refund', 'Customer has requested a refund');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `roleid` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`roleid`, `role_name`, `description`) VALUES
(1, 'ADMIN', 'Administrator with full access'),
(2, 'USER', 'Regular user with limited access');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tours`
--

CREATE TABLE `tours` (
  `tour_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `max_participants` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tours`
--

INSERT INTO `tours` (`tour_id`, `name`, `description`, `price`, `duration`, `max_participants`, `status_id`, `image_url`, `created_at`, `updated_at`) VALUES
(2, 'Khám phá Hà Giang', 'Tour khám phá vùng núi đá Hà Giang, chiêm ngưỡng vẻ đẹp hùng vĩ và trải nghiệm văn hóa bản địa.', 4780000.00, 3, 20, 2, '/uploads/tours/42a359bb-df3b-4f1d-9db6-22cf24e24413_Tour khám phá vùng núi đá Hà Giang,.jfif', '2025-05-17 12:03:12', '2025-05-24 19:10:48'),
(4, 'Du lịch Hạ Long', 'Tham quan Vịnh Hạ Long, hang Sửng Sốt, tắm biển Bãi Cháy.', 3800000.00, 3, 40, 3, '/uploads/tours/adaede19-66c6-45ef-af17-b0cd223df540_Hạ Long.jfif', '2025-05-20 19:50:44', '2025-05-20 19:50:44'),
(5, 'Khám phá Sapa', 'Check-in đỉnh Fansipan, thung lũng Mường Hoa, bản Cát Cát.', 4200000.00, 3, 25, 3, '/uploads/tours/dd688e7e-9d55-4657-bf9b-fb00943c9b0b_Khám phá Sapa.jpg', '2025-05-20 19:52:00', '2025-05-20 19:52:00'),
(7, 'Khám phá miền Trung', 'Di sản Hội An, Cố đô Huế, động Phong Nha - Kẻ Bàng.', 5200000.00, 4, 2, 3, '/uploads/tours/e453f51b-1024-47d4-a825-664b834506db_Khám phá miền Trung.jfif', '2025-05-20 19:55:25', '2025-06-01 16:54:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_destinations`
--

CREATE TABLE `tour_destinations` (
  `tour_id` int(11) NOT NULL,
  `destination_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_destinations`
--

INSERT INTO `tour_destinations` (`tour_id`, `destination_id`) VALUES
(2, 1),
(2, 2),
(4, 3),
(5, 4),
(5, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_events`
--

CREATE TABLE `tour_events` (
  `tour_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_events`
--

INSERT INTO `tour_events` (`tour_id`, `event_id`) VALUES
(2, 1),
(4, 2),
(7, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_guides`
--

CREATE TABLE `tour_guides` (
  `guide_id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `experience_years` int(11) NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `languages` varchar(255) NOT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `userid` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_guide_assignments`
--

CREATE TABLE `tour_guide_assignments` (
  `assignment_id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `guide_id` int(11) NOT NULL,
  `role` enum('main_guide','assistant_guide','specialist') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('assigned','completed','cancelled') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_itinerary`
--

CREATE TABLE `tour_itinerary` (
  `itinerary_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_itinerary`
--

INSERT INTO `tour_itinerary` (`itinerary_id`, `schedule_id`, `title`, `description`, `start_time`, `end_time`, `type`) VALUES
(1, 1, 'Tham quan Đèo Mã Pí Lèng', 'Chiêm ngưỡng vẻ đẹp hùng vĩ của đèo Mã Pí Lèng – một trong \"tứ đại đỉnh đèo\" của Việt Nam.', '08:00:00', '10:00:00', 'destination'),
(2, 1, 'Khám phá Dinh Thự Vua Mèo', 'Tìm hiểu về lịch sử và kiến trúc độc đáo của dòng họ Vương tại dinh thự Vua Mèo.', '10:30:00', '12:00:00', 'DESTINATION'),
(3, 3, 'Tham gia Lễ hội Chợ tình Khâu Vai', 'Hòa mình vào không khí văn hóa dân tộc, nơi trai gái gặp gỡ nhau trong lễ hội truyền thống vùng cao.', '19:00:00', '21:00:00', 'EVENT'),
(4, 1, '1', '1', '10:30:00', '11:30:00', 'DESTINATION'),
(5, 4, 'Du ngoạn Vịnh Hạ Long', 'Tham quan các hòn đảo nổi bật', '09:00:00', '12:00:00', 'DESTINATION'),
(6, 4, 'Lễ hội Hoa Hạ Long', 'Chiêm ngưỡng không gian hoa và nghệ thuật', '13:00:00', '16:00:00', 'EVENT'),
(8, 5, 'Khám phá thung lũng Mường Hoa', 'Tham quan ruộng bậc thang và di tích đá cổ', '13:00:00', '15:30:00', 'DESTINATION'),
(9, 7, 'Đêm nhạc Hội An phố cổ', 'Chương trình nghệ thuật đặc sắc tái hiện văn hóa xưa', '19:00:00', '21:00:00', 'EVENT'),
(14, 9, 'g', 'f', '11:11:00', '23:11:00', 'MEAL');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_schedules`
--

CREATE TABLE `tour_schedules` (
  `schedule_id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_schedules`
--

INSERT INTO `tour_schedules` (`schedule_id`, `tour_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, '2025-05-27', '2025-05-29', 'available', '2025-05-17 15:02:57', '2025-05-20 12:26:17'),
(3, 2, '2025-06-11', '2025-06-13', 'available', '2025-05-17 15:43:53', '2025-05-20 12:39:50'),
(4, 4, '2025-06-15', '2025-06-17', 'available', '2025-05-20 19:59:02', '2025-05-20 19:59:02'),
(5, 5, '2025-06-20', '2025-06-26', 'available', '2025-05-20 19:59:22', '2025-05-20 19:59:22'),
(7, 7, '2025-08-05', '2025-08-06', 'full', '2025-05-20 20:02:25', '2025-05-20 20:02:25'),
(9, 5, '2025-06-06', '2025-06-08', 'available', '2025-05-24 20:02:11', '2025-05-24 20:58:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_status`
--

CREATE TABLE `tour_status` (
  `tour_status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_status`
--

INSERT INTO `tour_status` (`tour_status_id`, `status_name`, `description`) VALUES
(1, 'Draft', NULL),
(2, 'Published', NULL),
(3, 'Cancelled', NULL),
(4, 'Completed', NULL),
(5, 'Full', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userroles`
--

CREATE TABLE `userroles` (
  `userid` bigint(20) NOT NULL,
  `roleid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `userroles`
--

INSERT INTO `userroles` (`userid`, `roleid`) VALUES
(1, 1),
(2, 2),
(4, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `userid` bigint(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `is_active` bit(1) DEFAULT b'0',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `public_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`userid`, `full_name`, `email`, `password_hash`, `phone`, `address`, `is_active`, `created_at`, `updated_at`, `public_id`) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$10$XB14xcxuI1SlICBxZxLMAu8Gcx.UcJK0LWgFVtinCc/GL2Q3K7EZy', '1234567890', '12345', b'1', '2025-05-17 11:07:30', '2025-06-03 16:58:57', '9be3835e-6a67-41d4-bad1-8f423ac73397'),
(2, 'do viet hoang', 'hoang@gmail.com', '$2a$10$pQMo0TdhZB6PGXzmkSa10eoFxUK2zGy9/BbFv6w02OiQIaApcAdlS', '1234567890', 'hà nội1', b'1', '2025-05-17 17:39:03', '2025-06-03 09:43:38', '43b52f1b-3d24-438c-955f-adce2ea9ad1f'),
(4, 'tuan', 'tuan@gmail.com', '$2a$10$VxlgD7CyupQRNSpNGOYPi.e34YprcbmMznn6C0E0SjAxG37ixNu5e', '1234567890', '123456', b'1', '2025-06-03 08:50:47', '2025-06-03 10:19:17', 'ae913205-b742-41c3-9740-ce4550e45422');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `usertokens`
--

CREATE TABLE `usertokens` (
  `tokenid` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expiry` datetime NOT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `usertokens`
--

INSERT INTO `usertokens` (`tokenid`, `userid`, `token`, `expiry`, `createdat`) VALUES
(4, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDkwMDQzNjgsImV4cCI6MTc0OTA0MDM2OH0.8IGCy8-CcRG5bEXjMyVM_1mn9Q2NAaFQ8vFa6oLgwIB6G1BZhS9y2iFJIwi_DQ9UTvRsgpvDR9ecug1o_uCbUg', '2025-06-04 09:42:48', '2025-06-04 09:32:48'),
(5, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDkwMDUxODUsImV4cCI6MTc0OTA0MTE4NX0.QtCyBbcloHq9DusGNwswUhzMUAN5jgqOMUG0htbv1Dsippb4jC-HEVQ3EziRtQk1MbhcS2hAjIsTIMUmtoJrpA', '2025-06-04 09:56:25', '2025-06-04 09:46:25'),
(6, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDkwMDg5NTksImV4cCI6MTc0OTA0NDk1OX0.QG9i0fVqJ8MeJpZRvWEctF9ANGDvIRb3UXLXMM-vcQnVMejH7_p8Mm3HdMBuwlTPTKmFKGPm9Dl2ZCA9GQ5TGA', '2025-06-04 10:59:19', '2025-06-04 10:49:19'),
(7, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDkwMDg5NzQsImV4cCI6MTc0OTA0NDk3NH0.zvMjKfW8Do6YgZri9phELdTTSc9UpUESFyKgzlH-Ywb1IEkljUrC34x4ZhK1GNl1wd7LU0AMpW3l0a3calQRvQ', '2025-06-04 10:59:34', '2025-06-04 10:49:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_discounts`
--

CREATE TABLE `user_discounts` (
  `tour_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `discount_id` int(11) NOT NULL,
  `used` bit(1) DEFAULT b'0',
  `used_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_audit_user` (`userid`);

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD UNIQUE KEY `booking_code` (`booking_code`),
  ADD KEY `fk_booking_tour` (`tour_id`),
  ADD KEY `fk_booking_status` (`status_id`),
  ADD KEY `fk_booking_user` (`userid`);

--
-- Chỉ mục cho bảng `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD PRIMARY KEY (`passenger_id`),
  ADD KEY `fk_passenger_booking` (`booking_id`),
  ADD KEY `fk_passenger_user` (`userid`);

--
-- Chỉ mục cho bảng `booking_status`
--
ALTER TABLE `booking_status`
  ADD PRIMARY KEY (`booking_status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Chỉ mục cho bảng `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`destination_id`);

--
-- Chỉ mục cho bảng `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `fk_destination_file` (`destination_id`);

--
-- Chỉ mục cho bảng `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`discount_id`),
  ADD UNIQUE KEY `uk_discount_code` (`code`);

--
-- Chỉ mục cho bảng `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `fk_event_status` (`status_id`);

--
-- Chỉ mục cho bảng `event_file_paths`
--
ALTER TABLE `event_file_paths`
  ADD KEY `FK7lmjuds8bmtdclfwuqrj560qy` (`event_id`);

--
-- Chỉ mục cho bảng `event_status`
--
ALTER TABLE `event_status`
  ADD PRIMARY KEY (`event_status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Chỉ mục cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `fk_feedback_user` (`userid`),
  ADD KEY `fk_feedback_tour` (`tour_id`),
  ADD KEY `fk_feedback_status` (`status_id`);

--
-- Chỉ mục cho bảng `feedback_status`
--
ALTER TABLE `feedback_status`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Chỉ mục cho bảng `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`media_id`),
  ADD KEY `fk_media_user` (`userid`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `fk_notification_user` (`userid`),
  ADD KEY `fk_notification_sender` (`sender_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_booking` (`booking_id`),
  ADD KEY `fk_payment_user` (`userid`),
  ADD KEY `fk_payment_method` (`payment_method_id`),
  ADD KEY `fk_payment_status` (`status_id`);

--
-- Chỉ mục cho bảng `payment_history`
--
ALTER TABLE `payment_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `fk_history_payment` (`payment_id`),
  ADD KEY `fk_history_status` (`status_id`);

--
-- Chỉ mục cho bảng `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`method_id`),
  ADD UNIQUE KEY `uk_method_name` (`method_name`);

--
-- Chỉ mục cho bảng `payment_status`
--
ALTER TABLE `payment_status`
  ADD PRIMARY KEY (`payment_status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleid`),
  ADD UNIQUE KEY `uk_role_name` (`role_name`);

--
-- Chỉ mục cho bảng `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`tour_id`),
  ADD KEY `fk_tour_status` (`status_id`);

--
-- Chỉ mục cho bảng `tour_destinations`
--
ALTER TABLE `tour_destinations`
  ADD PRIMARY KEY (`tour_id`,`destination_id`),
  ADD KEY `fk_tour_destinations_destination` (`destination_id`);

--
-- Chỉ mục cho bảng `tour_events`
--
ALTER TABLE `tour_events`
  ADD PRIMARY KEY (`tour_id`,`event_id`),
  ADD KEY `fk_tour_events_event` (`event_id`);

--
-- Chỉ mục cho bảng `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD PRIMARY KEY (`guide_id`),
  ADD UNIQUE KEY `UK_heivp9fqmiwskkog40ikipns8` (`userid`),
  ADD KEY `fk_guide_user` (`user_id`);

--
-- Chỉ mục cho bảng `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `fk_assignment_tour` (`tour_id`),
  ADD KEY `fk_assignment_guide` (`guide_id`);

--
-- Chỉ mục cho bảng `tour_itinerary`
--
ALTER TABLE `tour_itinerary`
  ADD PRIMARY KEY (`itinerary_id`),
  ADD KEY `fk_itinerary_schedule` (`schedule_id`);

--
-- Chỉ mục cho bảng `tour_schedules`
--
ALTER TABLE `tour_schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `fk_schedule_tour` (`tour_id`);

--
-- Chỉ mục cho bảng `tour_status`
--
ALTER TABLE `tour_status`
  ADD PRIMARY KEY (`tour_status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Chỉ mục cho bảng `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`userid`,`roleid`),
  ADD KEY `fk_userroles_role` (`roleid`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `uk_email` (`email`),
  ADD UNIQUE KEY `public_id` (`public_id`);

--
-- Chỉ mục cho bảng `usertokens`
--
ALTER TABLE `usertokens`
  ADD PRIMARY KEY (`tokenid`),
  ADD KEY `fk_usertokens_user` (`userid`);

--
-- Chỉ mục cho bảng `user_discounts`
--
ALTER TABLE `user_discounts`
  ADD PRIMARY KEY (`tour_id`,`discount_id`,`userid`),
  ADD KEY `fk_user_discount_user` (`userid`),
  ADD KEY `fk_user_discount_discount` (`discount_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `booking_passengers`
--
ALTER TABLE `booking_passengers`
  MODIFY `passenger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `booking_status`
--
ALTER TABLE `booking_status`
  MODIFY `booking_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `destinations`
--
ALTER TABLE `destinations`
  MODIFY `destination_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `discounts`
--
ALTER TABLE `discounts`
  MODIFY `discount_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `event_status`
--
ALTER TABLE `event_status`
  MODIFY `event_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `feedback_status`
--
ALTER TABLE `feedback_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `media`
--
ALTER TABLE `media`
  MODIFY `media_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `payment_history`
--
ALTER TABLE `payment_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `payment_status`
--
ALTER TABLE `payment_status`
  MODIFY `payment_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `tours`
--
ALTER TABLE `tours`
  MODIFY `tour_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `tour_guides`
--
ALTER TABLE `tour_guides`
  MODIFY `guide_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tour_itinerary`
--
ALTER TABLE `tour_itinerary`
  MODIFY `itinerary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `tour_schedules`
--
ALTER TABLE `tour_schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `tour_status`
--
ALTER TABLE `tour_status`
  MODIFY `tour_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `userid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `usertokens`
--
ALTER TABLE `usertokens`
  MODIFY `tokenid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FKhpweps6it8n224l44tahx19y2` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `fk_booking_status` FOREIGN KEY (`status_id`) REFERENCES `booking_status` (`booking_status_id`),
  ADD CONSTRAINT `fk_booking_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD CONSTRAINT `fk_passenger_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_passenger_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  ADD CONSTRAINT `fk_destination_file` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_event_status` FOREIGN KEY (`status_id`) REFERENCES `event_status` (`event_status_id`);

--
-- Các ràng buộc cho bảng `event_file_paths`
--
ALTER TABLE `event_file_paths`
  ADD CONSTRAINT `FK7lmjuds8bmtdclfwuqrj560qy` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`);

--
-- Các ràng buộc cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `fk_feedback_status` FOREIGN KEY (`status_id`) REFERENCES `feedback_status` (`status_id`),
  ADD CONSTRAINT `fk_feedback_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `fk_media_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`userid`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`method_id`),
  ADD CONSTRAINT `fk_payment_status` FOREIGN KEY (`status_id`) REFERENCES `payment_status` (`payment_status_id`),
  ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payment_history`
--
ALTER TABLE `payment_history`
  ADD CONSTRAINT `fk_history_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_history_status` FOREIGN KEY (`status_id`) REFERENCES `payment_status` (`payment_status_id`);

--
-- Các ràng buộc cho bảng `tours`
--
ALTER TABLE `tours`
  ADD CONSTRAINT `fk_tour_status` FOREIGN KEY (`status_id`) REFERENCES `tour_status` (`tour_status_id`);

--
-- Các ràng buộc cho bảng `tour_destinations`
--
ALTER TABLE `tour_destinations`
  ADD CONSTRAINT `fk_tour_destinations_destination` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tour_destinations_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tour_events`
--
ALTER TABLE `tour_events`
  ADD CONSTRAINT `fk_tour_events_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tour_events_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD CONSTRAINT `FKe77mlqfo649eeehhwvrgmaxvy` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `fk_guide_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  ADD CONSTRAINT `fk_assignment_guide` FOREIGN KEY (`guide_id`) REFERENCES `tour_guides` (`guide_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assignment_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tour_itinerary`
--
ALTER TABLE `tour_itinerary`
  ADD CONSTRAINT `fk_itinerary_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `tour_schedules` (`schedule_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tour_schedules`
--
ALTER TABLE `tour_schedules`
  ADD CONSTRAINT `fk_schedule_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `fk_userroles_role` FOREIGN KEY (`roleid`) REFERENCES `roles` (`roleid`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_userroles_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `usertokens`
--
ALTER TABLE `usertokens`
  ADD CONSTRAINT `fk_usertokens_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_discounts`
--
ALTER TABLE `user_discounts`
  ADD CONSTRAINT `fk_user_discount_discount` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`discount_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_discount_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_discount_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
