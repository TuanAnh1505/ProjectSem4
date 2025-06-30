-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2025 at 06:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tourismmana2`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`log_id`, `userid`, `action`, `description`, `created_at`) VALUES
(1, 4, 'update_booking', 'Cập nhật booking_id=35', '2025-06-26 18:58:32'),
(2, 4, 'update_booking', 'Cập nhật booking: Mã: BKV4Z67ZSV27Y9D177N1, Tour: 14, Giá: 7790000.00, Trạng thái: 1, Ngày đặt: 2025-06-26 18:58:32. Thay đổi: [total_price: 7011000.00 → 7790000.00] ', '2025-06-26 18:58:32'),
(3, 4, 'update_booking', 'Cập nhật booking_id=35', '2025-06-26 18:59:05'),
(4, 4, 'update_booking', 'Cập nhật booking: Mã: BKV4Z67ZSV27Y9D177N1, Tour: 14, Giá: 7790000.00, Trạng thái: 2, Ngày đặt: 2025-06-26 18:58:32. Thay đổi: [status_id: 1 → 2] ', '2025-06-26 18:59:05'),
(5, 4, 'update_payment', 'Cập nhật payment: Mã: 23, Booking: 35, Số tiền: 7011000.00, Trạng thái: 3, Ngày thanh toán: 2025-06-25 21:42:56. Thay đổi: [status_id: 1 → 3] ', '2025-06-26 18:59:05'),
(6, 9, 'create_booking', 'Tạo booking mới với booking_id=36', '2025-06-27 10:10:29'),
(7, 9, 'insert_booking', 'Thêm booking: Mã: BKJWQDBB1E7ZEBW39L9F, Tour: 14, Giá: 7790000.00, Trạng thái: 1, Ngày đặt: 2025-06-27 10:10:29', '2025-06-27 10:10:29'),
(8, 9, 'insert_payment', 'Thêm payment: Mã: 24, Booking: 36, Số tiền: 7790000.00, Trạng thái: 1, Ngày thanh toán: 2025-06-27 10:10:50', '2025-06-27 10:10:50'),
(9, 4, 'create_booking', 'Tạo booking mới với booking_id=37', '2025-06-27 12:48:24'),
(10, 4, 'insert_booking', 'Thêm booking: Mã: BK8053CDY4F9QCB3G51S, Tour: 14, Giá: 7790000.00, Trạng thái: 1, Ngày đặt: 2025-06-27 12:48:24', '2025-06-27 12:48:24'),
(11, 4, 'insert_payment', 'Thêm payment: Mã: 25, Booking: 37, Số tiền: 7790000.00, Trạng thái: 1, Ngày thanh toán: 2025-06-27 12:48:58', '2025-06-27 12:48:58'),
(12, 4, 'update_booking', 'Cập nhật booking_id=37', '2025-06-27 12:49:57'),
(13, 4, 'update_booking', 'Cập nhật booking: Mã: BK8053CDY4F9QCB3G51S, Tour: 14, Giá: 7790000.00, Trạng thái: 2, Ngày đặt: 2025-06-27 12:48:24. Thay đổi: [status_id: 1 → 2] ', '2025-06-27 12:49:57'),
(14, 4, 'update_payment', 'Cập nhật payment: Mã: 25, Booking: 37, Số tiền: 7790000.00, Trạng thái: 3, Ngày thanh toán: 2025-06-27 12:48:58. Thay đổi: [status_id: 1 → 3] ', '2025-06-27 12:49:57');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `booking_code` varchar(20) DEFAULT NULL,
  `tour_id` int(11) NOT NULL,
  `booking_date` datetime DEFAULT current_timestamp(),
  `status_id` int(11) NOT NULL,
  `total_price` decimal(38,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userid` bigint(20) NOT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `discount_code` varchar(255) DEFAULT NULL,
  `discount_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `booking_code`, `tour_id`, `booking_date`, `status_id`, `total_price`, `created_at`, `updated_at`, `userid`, `schedule_id`, `discount_code`, `discount_id`) VALUES
(4, 'BKV4WX3IRQZ922IW7HBE', 5, '2025-06-13 11:07:48', 2, 3780000.00, '2025-06-13 11:07:48', '2025-06-13 11:11:16', 4, 5, 'DISCOUNT10', 1),
(5, 'BKVOK30LQ3O70D31L4K7', 4, '2025-06-13 11:15:35', 2, 2660000.00, '2025-06-13 11:15:35', '2025-06-13 11:16:00', 4, 4, 'HOTDEAL30', 3),
(6, 'BK1TJEGURSMDZMBF7UPN', 4, '2025-06-14 09:56:05', 2, 3990000.00, '2025-06-14 09:56:05', '2025-06-14 09:57:22', 1, 4, NULL, NULL),
(7, 'BK47U54JXPYW86ML069O', 5, '2025-06-15 17:18:39', 2, 2940000.00, '2025-06-15 17:18:39', '2025-06-15 17:19:38', 4, 5, 'HOTDEAL30', 3),
(8, 'BKO169AT91R2FYCA81C2', 5, '2025-06-15 17:20:14', 2, 2940000.00, '2025-06-15 17:20:14', '2025-06-15 17:20:42', 4, 5, 'HOTDEAL30', 3),
(9, 'BK9IYN9184F3F57330HL', 5, '2025-06-15 17:21:21', 2, 2940000.00, '2025-06-15 17:21:21', '2025-06-15 17:22:33', 4, 5, 'HOTDEAL30', 3),
(10, 'BKHVR25Y4Q4FWLU8LOY7', 14, '2025-06-15 20:19:11', 2, 5842500.00, '2025-06-15 20:19:11', '2025-06-15 20:19:57', 1, 14, 'FIRST100', 5),
(12, 'BKST61O7G84PGMR7IN0X', 14, '2025-06-16 10:38:05', 2, 7790000.00, '2025-06-16 10:38:05', '2025-06-16 11:03:38', 2, 14, NULL, NULL),
(13, 'BKG7HA1N39KHQ229SU49', 5, '2025-06-17 19:44:13', 2, 4200000.00, '2025-06-17 19:44:13', '2025-06-17 19:44:45', 1, 5, NULL, NULL),
(14, 'BKZKHCO26998C0M7X1E0', 5, '2025-06-17 19:47:44', 2, 4200000.00, '2025-06-17 19:47:44', '2025-06-17 19:48:00', 4, 5, NULL, NULL),
(16, 'BK8YTFB79R61USU4257B', 5, '2025-06-17 22:28:53', 2, 4200000.00, '2025-06-17 22:28:53', '2025-06-17 22:30:55', 2, 5, NULL, NULL),
(21, 'BKH5C2264X07053P1FUJ', 14, '2025-06-23 00:38:59', 2, 7790000.00, '2025-06-23 00:38:59', '2025-06-23 00:39:18', 2, 16, NULL, NULL),
(26, 'BKZ8NLZ8S37RUY4EB8W5', 14, '2025-06-23 01:02:20', 2, 7790000.00, '2025-06-23 01:02:20', '2025-06-23 01:02:56', 4, 16, NULL, NULL),
(28, 'BKWNN61IN60P8K5HI968', 14, '2025-06-23 08:18:41', 2, 15580000.00, '2025-06-23 08:18:41', '2025-06-23 08:19:04', 2, 16, NULL, NULL),
(29, 'BK5K56TEAP76ZIF06U5O', 14, '2025-06-23 08:39:11', 2, 15580000.00, '2025-06-23 08:39:11', '2025-06-23 08:40:12', 1, 16, NULL, NULL),
(30, 'BK74392749LTR1V4FQP7', 14, '2025-06-23 08:47:32', 2, 7790000.00, '2025-06-23 08:47:32', '2025-06-23 08:47:56', 2, 16, NULL, NULL),
(31, 'BKT464COFR135RW9Y8CR', 14, '2025-06-23 08:54:26', 2, 9932250.00, '2025-06-23 08:54:26', '2025-06-23 08:59:33', 1, 16, 'FAMILY15', 4),
(32, 'BK05G17AWGTQR5XXXW0K', 14, '2025-06-23 09:09:16', 2, 7790000.00, '2025-06-23 09:09:16', '2025-06-23 09:09:44', 1, 17, NULL, NULL),
(34, 'BK738YSMNB05OZEZLAEH', 14, '2025-06-25 20:40:41', 2, 10516500.00, '2025-06-25 20:31:35', '2025-06-25 21:39:49', 4, 16, 'DISCOUNT10', 1),
(35, 'BKV4Z67ZSV27Y9D177N1', 14, '2025-06-26 18:58:32', 2, 7790000.00, '2025-06-25 21:42:25', '2025-06-26 18:59:05', 4, 16, NULL, NULL),
(36, 'BKJWQDBB1E7ZEBW39L9F', 14, '2025-06-27 10:10:29', 1, 7790000.00, '2025-06-27 10:10:29', '2025-06-27 10:10:29', 9, 16, NULL, NULL),
(37, 'BK8053CDY4F9QCB3G51S', 14, '2025-06-27 12:48:24', 2, 7790000.00, '2025-06-27 12:48:24', '2025-06-27 12:49:57', 4, 16, NULL, NULL);

--
-- Triggers `bookings`
--
DELIMITER $$
CREATE TRIGGER `after_booking_delete` AFTER DELETE ON `bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (OLD.userid, 'delete_booking', CONCAT('Xóa booking_id=', OLD.booking_id));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_booking_delete_detail` AFTER DELETE ON `bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    OLD.userid,
    'delete_booking',
    CONCAT('Xóa booking: Mã: ', OLD.booking_code, ', Tour: ', OLD.tour_id, ', Giá: ', OLD.total_price, ', Trạng thái: ', OLD.status_id, ', Ngày đặt: ', OLD.booking_date)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_booking_insert` AFTER INSERT ON `bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (NEW.userid, 'create_booking', CONCAT('Tạo booking mới với booking_id=', NEW.booking_id));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_booking_insert_detail` AFTER INSERT ON `bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'insert_booking',
    CONCAT('Thêm booking: Mã: ', NEW.booking_code, ', Tour: ', NEW.tour_id, ', Giá: ', NEW.total_price, ', Trạng thái: ', NEW.status_id, ', Ngày đặt: ', NEW.booking_date)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_booking_update` AFTER UPDATE ON `bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (NEW.userid, 'update_booking', CONCAT('Cập nhật booking_id=', NEW.booking_id));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_booking_update_detail` AFTER UPDATE ON `bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'update_booking',
    CONCAT(
      'Cập nhật booking: Mã: ', NEW.booking_code, ', Tour: ', NEW.tour_id, ', Giá: ', NEW.total_price, ', Trạng thái: ', NEW.status_id, ', Ngày đặt: ', NEW.booking_date,
      '. Thay đổi: ',
      IF(OLD.status_id <> NEW.status_id, CONCAT('[status_id: ', OLD.status_id, ' → ', NEW.status_id, '] '), ''),
      IF(OLD.total_price <> NEW.total_price, CONCAT('[total_price: ', OLD.total_price, ' → ', NEW.total_price, '] '), '')
    )
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `booking_passengers`
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
  `gender` varchar(255) DEFAULT NULL,
  `guardian_passenger_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_passengers`
--

INSERT INTO `booking_passengers` (`passenger_id`, `booking_id`, `userid`, `full_name`, `phone`, `email`, `address`, `passenger_type`, `birth_date`, `gender`, `guardian_passenger_id`) VALUES
(4, 4, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1992-02-02', 'Nam', NULL),
(5, 5, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '2000-01-02', 'Nam', NULL),
(6, 6, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '2000-02-02', 'Nam', NULL),
(7, 6, 1, 'abc', NULL, NULL, NULL, 'child', '2014-02-02', 'Nam', NULL),
(8, 7, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1991-01-01', 'Nam', NULL),
(9, 8, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1992-02-02', 'Nam', NULL),
(10, 9, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1993-03-03', 'Nam', NULL),
(11, 10, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '2003-03-03', 'Nam', NULL),
(12, 12, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '2005-04-07', 'Nam', NULL),
(13, 13, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '2001-01-01', 'Nam', NULL),
(14, 14, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '2002-02-02', 'Nam', NULL),
(17, 16, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '2025-06-17', 'Nam', NULL),
(18, 21, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '2025-06-23', 'Nam', NULL),
(19, 26, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '2005-01-01', 'Nam', NULL),
(27, 28, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '1991-07-05', 'Nam', NULL),
(28, 28, 2, 'tran tuan', NULL, NULL, NULL, 'adult', '1995-08-15', 'Nam', NULL),
(33, 29, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '1980-02-09', 'Nam', NULL),
(34, 29, 1, 'tran tuan', NULL, NULL, NULL, 'adult', '2012-08-15', 'Nam', NULL),
(35, 30, 2, 'do viet hoang', '1234567890', 'hoang@gmail.com', 'hà nội1', 'adult', '2025-06-23', 'Nam', NULL),
(36, 31, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '1980-02-09', 'Nam', NULL),
(37, 31, 1, 'tran tuan', NULL, NULL, NULL, 'child', '2012-08-15', 'Nam', NULL),
(38, 31, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '2004-03-12', 'Nam', NULL),
(39, 31, 1, 'tran tuan', NULL, NULL, NULL, 'child', '2012-03-15', 'Nam', NULL),
(40, 32, 1, 'admin', '1234567890', 'admin@gmail.com', '12345', 'adult', '1981-04-06', 'Nam', NULL),
(45, 34, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1993-02-16', 'Nam', NULL),
(46, 34, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1981-02-13', 'Nam', NULL),
(47, 34, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1990-03-16', 'Nam', NULL),
(48, 34, 4, 'abc', NULL, NULL, NULL, 'child', '2010-09-17', 'Nam', NULL),
(49, 35, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1993-03-02', 'Nam', NULL),
(50, 35, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '1990-04-03', 'Nam', NULL),
(51, 36, 9, 'do hoang', '1234567890', 'dohoang@gmail.com', '12345678', 'adult', '1997-03-17', 'Nam', NULL),
(52, 37, 4, 'tuan', '1234567890', 'tuan@gmail.com', '123456', 'adult', '2000-09-16', 'Nam', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_status`
--

CREATE TABLE `booking_status` (
  `booking_status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_status`
--

INSERT INTO `booking_status` (`booking_status_id`, `status_name`) VALUES
(3, 'Cancelled'),
(4, 'Completed'),
(2, 'Confirmed'),
(1, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
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
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`destination_id`, `name`, `category`, `description`, `location`, `rating`, `created_at`, `updated_at`) VALUES
(1, 'Đèo Mã Pí Lèng', 'Thiên nhiên', 'Một trong tứ đại đỉnh đèo nổi tiếng với cảnh sắc hùng vĩ.', 'Hà Giang', 5, '2025-05-17 11:10:38', '2025-05-17 11:10:38'),
(2, 'Dinh Thự Vua Mèo', 'Lịch sử', 'Di tích kiến trúc cổ nổi bật, từng là nơi ở của Vua Mèo Vương Chính Đức.', 'Sà Phìn, Đồng Văn, Hà Giang', 4, '2025-05-17 11:11:20', '2025-05-17 11:11:20'),
(3, 'Vịnh Hạ Long', 'Thiên nhiên', 'Kỳ quan thiên nhiên thế giới, nổi bật với hàng nghìn đảo đá vôi.', 'Quảng Ninh', 5, '2025-05-20 19:33:11', '2025-05-20 19:33:11'),
(4, 'Fansipan', 'Thiên nhiên', 'Nóc nhà Đông Dương với cáp treo hiện đại dẫn lên đỉnh.', 'Lào Cai', 5, '2025-05-20 19:36:11', '2025-05-20 19:36:11'),
(5, 'Thung lũng Mường Hoa', 'Thiên nhiên', 'Nơi có những thửa ruộng bậc thang kỳ vĩ và di tích cổ.', 'Sapa, Lào Cai', 5, '2025-05-20 19:37:38', '2025-05-20 19:37:38'),
(6, 'Chợ nổi Cái Răng', 'Văn hóa địa phương', 'Chợ nổi đặc trưng vùng sông nước miền Tây.', 'Cần Thơ', 4, '2025-05-20 19:39:30', '2025-05-20 19:39:30'),
(8, 'ds', 'd', 'sd', 'sd', 5, '2025-05-25 19:51:09', '2025-05-25 19:51:09');

--
-- Triggers `destinations`
--
DELIMITER $$
CREATE TRIGGER `after_destination_delete` AFTER DELETE ON `destinations` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NULL,
    'delete_destination',
    CONCAT('Xóa điểm đến: Tên: ', OLD.name, ', Địa điểm: ', OLD.location, ', Loại: ', OLD.category, ', Đánh giá: ', OLD.rating)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_destination_insert` AFTER INSERT ON `destinations` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NULL,
    'insert_destination',
    CONCAT('Thêm điểm đến: Tên: ', NEW.name, ', Địa điểm: ', NEW.location, ', Loại: ', NEW.category, ', Đánh giá: ', NEW.rating)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_destination_update` AFTER UPDATE ON `destinations` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NULL,
    'update_destination',
    CONCAT(
      'Cập nhật điểm đến: Tên: ', NEW.name, ', Địa điểm: ', NEW.location, ', Loại: ', NEW.category, ', Đánh giá: ', NEW.rating,
      '. Thay đổi: ',
      IF(OLD.rating <> NEW.rating, CONCAT('[rating: ', OLD.rating, ' → ', NEW.rating, '] '), '')
    )
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `destination_file_paths`
--

CREATE TABLE `destination_file_paths` (
  `file_id` int(11) NOT NULL,
  `destination_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `destination_file_paths`
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
-- Table structure for table `discounts`
--

CREATE TABLE `discounts` (
  `discount_id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_percent` float DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `quantity` int(11) DEFAULT NULL,
  `used_quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `discounts`
--

INSERT INTO `discounts` (`discount_id`, `code`, `description`, `discount_percent`, `start_date`, `end_date`, `created_at`, `quantity`, `used_quantity`) VALUES
(1, 'DISCOUNT10', 'Giảm 10% cho tất cả tour hè', 10, '2025-06-01 00:00:00', '2025-06-30 23:59:59', '2025-06-04 09:17:03', 10, 0),
(2, 'SUMMER20', 'Ưu đãi 20% dịp hè cho tour miền Trung', 20, '2025-06-10 00:00:00', '2025-07-15 23:59:59', '2025-06-04 09:17:03', 10, 0),
(3, 'HOTDEAL30', 'Giảm 30% cho tour đặt sớm trước 30 ngày', 30, '2025-06-01 00:00:00', '2025-08-31 23:59:59', '2025-06-04 09:17:03', 10, 4),
(4, 'FAMILY15', 'Ưu đãi 15% cho nhóm gia đình từ 4 người trở lên', 15, '2025-06-01 00:00:00', '2025-09-01 23:59:59', '2025-06-04 09:17:03', 10, 1),
(5, 'FIRST100', 'Tặng 25% cho 100 khách đầu tiên', 25, '2025-06-01 00:00:00', '2025-06-15 23:59:59', '2025-06-04 09:17:03', 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `events`
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
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `name`, `description`, `location`, `start_date`, `end_date`, `ticket_price`, `status_id`, `created_at`, `updated_at`) VALUES
(1, '	 Lễ hội Chợ tình Khâu Vai', 'Lễ hội truyền thống độc đáo nơi tình yêu được hẹn hò mỗi năm một lần.', 'Khâu Vai, Mèo Vạc, Hà Giang', '2025-05-28 08:00:00', '2025-05-28 17:00:00', 1.00, 1, '2025-05-17 11:26:52', '2025-05-17 11:26:52'),
(2, 'Lễ hội Hoa Hạ Long', 'Trưng bày hoa và các hoạt động văn hóa trên Vịnh Hạ Long.', 'Quảng Ninh', '2025-06-15 09:00:00', '2025-06-17 20:00:00', 100000.00, 2, '2025-05-20 19:42:32', '2025-05-20 19:42:32'),
(3, 'Festival Đà Lạt Mùa Hè', 'Lễ hội hoa, âm nhạc và trình diễn ánh sáng mùa hè tại Đà Lạt.', 'Đà Lạt', '2025-07-01 10:00:00', '2025-07-03 21:00:00', 120000.00, 1, '2025-05-20 19:44:46', '2025-05-20 19:44:46'),
(4, 'Đêm nhạc Hội An phố cổ', 'Chương trình nghệ thuật tái hiện văn hóa Hội An xưa.', 'Hội An', '2025-08-05 18:00:00', '2025-08-06 22:00:00', 80000.00, 1, '2025-05-20 19:46:59', '2025-05-20 19:46:59');

-- --------------------------------------------------------

--
-- Table structure for table `event_file_paths`
--

CREATE TABLE `event_file_paths` (
  `event_id` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_file_paths`
--

INSERT INTO `event_file_paths` (`event_id`, `file_path`) VALUES
(1, '/uploads/events/1747456012005_Lễ hội Chợ tình Khâu Vai.jpeg'),
(2, '/uploads/events/1747744952008_Lễ hội Hoa Hạ Long.jpg'),
(3, '/uploads/events/1747745086434_Festival Đà Lạt Mùa Hè.jpg'),
(4, '/uploads/events/1747745219719_Đêm nhạc Hội An phố cổ.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `event_status`
--

CREATE TABLE `event_status` (
  `event_status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_status`
--

INSERT INTO `event_status` (`event_status_id`, `status_name`) VALUES
(2, 'Active'),
(3, 'Cancelled'),
(4, 'Completed'),
(1, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `experiences`
--

CREATE TABLE `experiences` (
  `experience_id` bigint(20) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `experiences`
--

INSERT INTO `experiences` (`experience_id`, `userid`, `tour_id`, `title`, `content`, `created_at`, `status`) VALUES
(1, 1, 2, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', '2025-06-08 21:02:46', 'approved'),
(2, 1, 4, 'cccccccc', 'dddddddđ', '2025-06-08 21:16:56', 'approved'),
(3, 1, 14, 'dfjkdsflkjfds', 'hfdskskdfskjfds', '2025-06-15 21:34:35', 'approved'),
(4, 4, 14, 'sds', 'ssa', '2025-06-23 01:39:11', 'approved');

--
-- Triggers `experiences`
--
DELIMITER $$
CREATE TRIGGER `after_experience_delete` AFTER DELETE ON `experiences` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    OLD.userid,
    'delete_experience',
    CONCAT('Xóa trải nghiệm: Tour: ', OLD.tour_id, ', Tiêu đề: ', OLD.title, ', Trạng thái: ', OLD.status)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_experience_insert` AFTER INSERT ON `experiences` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'insert_experience',
    CONCAT('Thêm trải nghiệm: Tour: ', NEW.tour_id, ', Tiêu đề: ', NEW.title, ', Trạng thái: ', NEW.status)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_experience_update` AFTER UPDATE ON `experiences` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'update_experience',
    CONCAT(
      'Cập nhật trải nghiệm: Tour: ', NEW.tour_id, ', Tiêu đề: ', NEW.title, ', Trạng thái: ', NEW.status,
      '. Thay đổi: ',
      IF(OLD.status <> NEW.status, CONCAT('[status: ', OLD.status, ' → ', NEW.status, '] '), '')
    )
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `tour_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `status_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`feedback_id`, `userid`, `tour_id`, `message`, `status_id`, `created_at`, `updated_at`, `rating`) VALUES
(1, 1, 14, 'ádfghjkl', 2, '2025-06-15 21:37:34', '2025-06-15 21:37:47', 5),
(2, 2, 14, 'sdffgdfgd', 1, '2025-06-20 19:46:53', '2025-06-20 19:46:53', 5);

--
-- Triggers `feedbacks`
--
DELIMITER $$
CREATE TRIGGER `after_feedback_delete` AFTER DELETE ON `feedbacks` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    OLD.userid,
    'delete_feedback',
    CONCAT('Xóa feedback: Tour: ', OLD.tour_id, ', Điểm: ', OLD.rating, ', Trạng thái: ', OLD.status_id, ', Nội dung: ', OLD.message)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_feedback_insert` AFTER INSERT ON `feedbacks` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'insert_feedback',
    CONCAT('Thêm feedback: Tour: ', NEW.tour_id, ', Điểm: ', NEW.rating, ', Trạng thái: ', NEW.status_id, ', Nội dung: ', NEW.message)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_feedback_update` AFTER UPDATE ON `feedbacks` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'update_feedback',
    CONCAT(
      'Cập nhật feedback: Tour: ', NEW.tour_id, ', Điểm: ', NEW.rating, ', Trạng thái: ', NEW.status_id, ', Nội dung: ', NEW.message,
      '. Thay đổi: ',
      IF(OLD.status_id <> NEW.status_id, CONCAT('[status_id: ', OLD.status_id, ' → ', NEW.status_id, '] '), ''),
      IF(OLD.rating <> NEW.rating, CONCAT('[rating: ', OLD.rating, ' → ', NEW.rating, '] '), '')
    )
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `feedback_status`
--

CREATE TABLE `feedback_status` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback_status`
--

INSERT INTO `feedback_status` (`status_id`, `status_name`, `description`) VALUES
(1, 'Pending', 'Feedback is pending review'),
(2, 'Approved', 'Feedback has been approved'),
(3, 'Rejected', 'Feedback has been rejected');

-- --------------------------------------------------------

--
-- Table structure for table `itinerary`
--

CREATE TABLE `itinerary` (
  `id` bigint(20) NOT NULL,
  `date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `time` time(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `tour_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `media_id` bigint(20) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) NOT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp(),
  `experience_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`media_id`, `userid`, `file_type`, `file_url`, `uploaded_at`, `experience_id`) VALUES
(1, 1, 'image', '/uploads/media/12c6d46d-5e87-4167-87c8-92623c22baa9_sapa.jpg', '2025-06-08 21:02:46', 1),
(2, 1, 'image', '/uploads/media/7e6ce9f8-5cf6-425d-9c7d-c593096c5892_hoi an.jpg', '2025-06-08 21:02:46', 1),
(3, 1, 'image', '/uploads/media/3e12fb89-3322-43dd-a6bf-2ac39fff8252_ha long base.jpg', '2025-06-08 21:02:46', 1),
(4, 1, 'image', '/uploads/media/f31599cd-b633-416a-a188-98114b83d9d7_Khám phá miền Trung.jfif', '2025-06-08 21:02:46', 1),
(5, 1, 'image', '/uploads/media/f2764078-dee4-4046-9f12-bab81d465c39_Về miền Tây sông nước.jfif', '2025-06-08 21:02:46', 1),
(6, 1, 'image', '/uploads/media/63c1506c-70ae-49db-bb32-4334dbd73257_Festival Đà Lạt Mùa Hè.jpg', '2025-06-08 21:02:46', 1),
(7, 1, 'image', '/uploads/media/1cda9ed3-34aa-4c5e-a847-4f7e456e918a_Lễ hội Hoa Hạ Long.jpg', '2025-06-08 21:02:46', 1),
(8, 1, 'image', '/uploads/media/c0651e38-14dc-4808-98d2-6e42908e8d1f_Chợ nổi Cái Răng.jpg', '2025-06-08 21:02:46', 1),
(9, 1, 'image', '/uploads/media/3c3597e1-3e85-473c-8deb-73b857d5d4df_Thung lũng Mường Hoa.jfif', '2025-06-08 21:02:46', 1),
(10, 1, 'image', '/uploads/media/324b5ff7-6952-4491-bfad-5388c299dbbb_leo-dinh-fansipan.png', '2025-06-08 21:02:46', 1),
(11, 1, 'image', '/uploads/media/6cff4fcd-f8e4-4dc3-a996-fcb921497526_logo.png', '2025-06-08 21:16:56', 2),
(12, 1, 'image', '/uploads/media/88d78c03-0703-4b9c-b1a0-5a7d11118b05_mien nui.png', '2025-06-08 21:16:56', 2),
(13, 1, 'image', '/uploads/media/cd619023-0fcc-4e45-9498-67b9637f8c90_thanh pho.png', '2025-06-08 21:16:56', 2),
(14, 1, 'image', '/uploads/media/51b43042-f1e2-4772-89e3-917ed7f6bd0b_di san.png', '2025-06-08 21:16:56', 2),
(15, 1, 'image', '/uploads/media/d975675c-03d0-46b9-816c-489a73933275_bien dao.png', '2025-06-08 21:16:56', 2),
(16, 1, 'image', '/uploads/media/df1390b6-e396-4e31-96b8-1581034512ed_thanh pho.jpg', '2025-06-08 21:16:56', 2),
(17, 1, 'image', '/uploads/media/1d7662e4-53f2-4c43-999d-d67114c140f5_Dinh Thự Vua Mèo1 - Copy.webp', '2025-06-15 21:34:35', 3),
(18, 1, 'image', '/uploads/media/d0ee1b8d-965c-49cb-bd1b-cae580c2737d_Dinh Thự Vua Mèo1.webp', '2025-06-15 21:34:35', 3),
(19, 1, 'image', '/uploads/media/2b15e8ab-0795-47b4-a3a7-a245b2d723f1_Dinh Thự Vua Mèo2.webp', '2025-06-15 21:34:35', 3),
(20, 1, 'image', '/uploads/media/a2b05873-42fd-426d-8e41-3a7a60d2cd9c_download.jpg', '2025-06-15 21:34:35', 3),
(21, 1, 'image', '/uploads/media/bf1a15da-060a-4f1e-ba56-6a404d74ff4e_Screenshot 2025-03-07 110119.png', '2025-06-15 21:34:35', 3),
(22, 4, 'image', '/uploads/media/89cee21c-2663-4a6c-a574-1cd27b370088_Dinh Thự Vua Mèo1 - Copy.webp', '2025-06-23 01:39:11', 4),
(23, 4, 'image', '/uploads/media/4034d1f8-15bc-4aa6-bfca-b99588bc143b_Dinh Thự Vua Mèo1.webp', '2025-06-23 01:39:11', 4),
(24, 4, 'image', '/uploads/media/d6dfd651-8d78-4d6d-a643-53015d8545c0_Dinh Thự Vua Mèo2.webp', '2025-06-23 01:39:11', 4),
(25, 4, 'image', '/uploads/media/3e684bc8-4f3d-4a0f-9dae-6aca7d047de9_download.jpg', '2025-06-23 01:39:11', 4),
(26, 4, 'image', '/uploads/media/74de5091-9ac2-4b46-a555-058f441bd6aa_Screenshot 2025-03-07 110119.png', '2025-06-23 01:39:11', 4);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `notification_type` varchar(255) NOT NULL,
  `is_read` bit(1) DEFAULT b'0',
  `related_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `schedule_change_request_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `userid`, `sender_id`, `title`, `message`, `notification_type`, `is_read`, `related_id`, `created_at`, `schedule_change_request_id`) VALUES
(1, 1, NULL, 'Yêu cầu thay đổi lịch trình mới', 'Guide cuong đã yêu cầu thay đổi lịch trình cho tour (Schedule ID: 16). Mức độ khẩn cấp: low', 'schedule_change', b'0', 1, '2025-06-30 10:51:06', 1),
(2, 10, 1, 'Yêu cầu thay đổi lịch trình đã được phê duyệt', 'Yêu cầu thay đổi lịch trình của bạn (Request ID: 1) đã được phê duyệt. Phản hồi: fgughfhgfkghdfkjghfjkds', 'schedule_change', b'0', 1, '2025-06-30 11:01:02', 1),
(4, 1, NULL, 'Yêu cầu thay đổi lịch trình mới', 'Guide cuong đã yêu cầu thay đổi lịch trình cho tour (Schedule ID: 16). Mức độ khẩn cấp: medium', 'schedule_change', b'0', 2, '2025-06-30 11:07:29', 2),
(5, 10, 1, 'Yêu cầu thay đổi lịch trình đã được phê duyệt', 'Yêu cầu thay đổi lịch trình của bạn (Request ID: 2) đã được phê duyệt. Phản hồi: ggfghjdjhgjhgdghkdhgjdkhgjdghjjgh', 'schedule_change', b'0', 2, '2025-06-30 11:08:24', 2);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
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
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `booking_id`, `userid`, `amount`, `payment_method_id`, `status_id`, `transaction_id`, `payment_date`, `created_at`, `updated_at`) VALUES
(4, 5, 4, 2660000.00, 2, 3, 'ee5b8f51-4d7f-41df-8ebf-8c46c4812eeb', '2025-06-13 11:15:54', '2025-06-13 11:15:54', '2025-06-13 11:16:00'),
(5, 6, 1, 3990000.00, 2, 3, 'aedf6ba9-1103-48e8-8398-0bef6c723ed1', '2025-06-14 09:57:06', '2025-06-14 09:57:06', '2025-06-14 09:57:22'),
(6, 7, 4, 2940000.00, 2, 3, 'adc1359b-069e-435f-8b53-a79dac2ee1fe', '2025-06-15 17:19:29', '2025-06-15 17:19:29', '2025-06-15 17:19:38'),
(7, 8, 4, 2940000.00, 2, 3, '3197fed1-c7c1-4676-9a6a-afea3c7a3466', '2025-06-15 17:20:30', '2025-06-15 17:20:30', '2025-06-15 17:20:42'),
(8, 9, 4, 2940000.00, 2, 3, '7b9cf2da-381a-411e-a4da-710f0bfcf74f', '2025-06-15 17:22:24', '2025-06-15 17:22:24', '2025-06-15 17:22:33'),
(9, 10, 1, 5842500.00, 2, 3, 'd080748c-407a-4e8f-b03b-466dbf64196d', '2025-06-15 20:19:35', '2025-06-15 20:19:35', '2025-06-15 20:19:57'),
(10, 12, 2, 7790000.00, 2, 3, '203cb304-4ac5-4649-8649-35f9eefb5815', '2025-06-16 11:02:51', '2025-06-16 11:02:51', '2025-06-16 11:03:38'),
(11, 13, 1, 4200000.00, 2, 3, 'afdac5be-2361-4f89-94d0-aab745413a7d', '2025-06-17 19:44:29', '2025-06-17 19:44:29', '2025-06-17 19:44:45'),
(12, 14, 4, 4200000.00, 2, 3, 'c78bfb3b-8539-40c8-a1e1-b9934f11d85f', '2025-06-17 19:47:52', '2025-06-17 19:47:52', '2025-06-17 19:48:00'),
(13, 16, 2, 4200000.00, 2, 3, '571ae572-df10-4cdc-891c-3454702d0c88', '2025-06-17 22:29:40', '2025-06-17 22:29:40', '2025-06-17 22:30:14'),
(14, 21, 2, 7790000.00, 2, 3, 'ecaf8540-bca4-418f-871c-4291cab5c440', '2025-06-23 00:39:08', '2025-06-23 00:39:08', '2025-06-23 00:39:18'),
(15, 26, 4, 7790000.00, 2, 3, '51a07221-e274-4627-9245-7d509c666ce7', '2025-06-23 01:02:47', '2025-06-23 01:02:47', '2025-06-23 01:02:56'),
(17, 28, 2, 15580000.00, 2, 3, '8b5c8574-70a3-437d-9da9-aed28c40ba4a', '2025-06-23 08:18:56', '2025-06-23 08:18:56', '2025-06-23 08:19:04'),
(18, 29, 1, 15580000.00, 2, 3, 'fa99abea-addd-4165-a382-6d0fc00d030e', '2025-06-23 08:39:38', '2025-06-23 08:39:38', '2025-06-23 08:40:12'),
(19, 30, 2, 7790000.00, 2, 3, 'ed52cd93-bd67-4a6c-872b-42df89a00a39', '2025-06-23 08:47:44', '2025-06-23 08:47:44', '2025-06-23 08:47:56'),
(20, 31, 1, 9932250.00, 2, 3, 'ebde6cff-312c-4cbf-9ea0-20c997511ee0', '2025-06-23 08:59:20', '2025-06-23 08:59:20', '2025-06-23 08:59:33'),
(21, 32, 1, 7790000.00, 2, 3, '1f81046c-c12f-423f-b097-9aa7ba206395', '2025-06-23 09:09:30', '2025-06-23 09:09:30', '2025-06-23 09:09:44'),
(22, 34, 4, 7790000.00, 2, 3, '254e5d55-d359-41db-a7a6-750a89f20815', '2025-06-25 20:32:17', '2025-06-25 20:32:17', '2025-06-25 20:42:18'),
(23, 35, 4, 7011000.00, 2, 3, '29e31cf9-a822-4375-8afa-e5c71749287a', '2025-06-25 21:42:56', '2025-06-25 21:42:56', '2025-06-26 18:59:05'),
(24, 36, 9, 7790000.00, 2, 1, 'd320813f-717f-4dff-990f-b16812cd0c9b', '2025-06-27 10:10:50', '2025-06-27 10:10:50', '2025-06-27 10:10:50'),
(25, 37, 4, 7790000.00, 2, 3, 'cfd404cf-cbcc-4d5f-80c3-095b24fa56e0', '2025-06-27 12:48:58', '2025-06-27 12:48:58', '2025-06-27 12:49:57');

--
-- Triggers `payments`
--
DELIMITER $$
CREATE TRIGGER `after_payment_delete` AFTER DELETE ON `payments` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    OLD.userid,
    'delete_payment',
    CONCAT('Xóa payment: Mã: ', OLD.payment_id, ', Booking: ', OLD.booking_id, ', Số tiền: ', OLD.amount, ', Trạng thái: ', OLD.status_id, ', Ngày thanh toán: ', OLD.payment_date)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_payment_insert` AFTER INSERT ON `payments` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'insert_payment',
    CONCAT('Thêm payment: Mã: ', NEW.payment_id, ', Booking: ', NEW.booking_id, ', Số tiền: ', NEW.amount, ', Trạng thái: ', NEW.status_id, ', Ngày thanh toán: ', NEW.payment_date)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_payment_update` AFTER UPDATE ON `payments` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'update_payment',
    CONCAT(
      'Cập nhật payment: Mã: ', NEW.payment_id, ', Booking: ', NEW.booking_id, ', Số tiền: ', NEW.amount, ', Trạng thái: ', NEW.status_id, ', Ngày thanh toán: ', NEW.payment_date,
      '. Thay đổi: ',
      IF(OLD.status_id <> NEW.status_id, CONCAT('[status_id: ', OLD.status_id, ' → ', NEW.status_id, '] '), ''),
      IF(OLD.amount <> NEW.amount, CONCAT('[amount: ', OLD.amount, ' → ', NEW.amount, '] '), '')
    )
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `payment_history`
--

CREATE TABLE `payment_history` (
  `history_id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_history`
--

INSERT INTO `payment_history` (`history_id`, `payment_id`, `status_id`, `notes`, `created_at`) VALUES
(7, 4, 1, 'Payment created', '2025-06-13 11:15:54'),
(8, 4, 3, 'Status updated to Completed', '2025-06-13 11:16:05'),
(9, 5, 1, 'Payment created', '2025-06-14 09:57:06'),
(10, 5, 3, 'Status updated to Completed', '2025-06-14 09:57:27'),
(11, 6, 1, 'Payment created', '2025-06-15 17:19:29'),
(12, 6, 3, 'Status updated to Completed', '2025-06-15 17:19:43'),
(13, 7, 1, 'Payment created', '2025-06-15 17:20:30'),
(14, 7, 3, 'Status updated to Completed', '2025-06-15 17:20:47'),
(15, 7, 3, 'Status updated to Completed', '2025-06-15 17:20:50'),
(16, 8, 1, 'Payment created', '2025-06-15 17:22:24'),
(17, 8, 3, 'Status updated to Completed', '2025-06-15 17:22:38'),
(18, 9, 1, 'Payment created', '2025-06-15 20:19:35'),
(19, 9, 3, 'Status updated to Completed', '2025-06-15 20:20:03'),
(20, 10, 1, 'Payment created', '2025-06-16 11:02:51'),
(21, 10, 3, 'Status updated to Completed', '2025-06-16 11:03:42'),
(22, 11, 1, 'Payment created', '2025-06-17 19:44:29'),
(23, 11, 3, 'Status updated to Completed', '2025-06-17 19:44:49'),
(24, 12, 1, 'Payment created', '2025-06-17 19:47:52'),
(25, 12, 3, 'Status updated to Completed', '2025-06-17 19:48:05'),
(26, 12, 3, 'Status updated to Completed', '2025-06-17 19:48:07'),
(27, 13, 1, 'Payment created', '2025-06-17 22:29:40'),
(28, 14, 1, 'Payment created', '2025-06-23 00:39:08'),
(29, 14, 3, 'Status updated to Completed', '2025-06-23 00:39:27'),
(30, 15, 1, 'Payment created', '2025-06-23 01:02:47'),
(31, 15, 3, 'Status updated to Completed', '2025-06-23 01:03:05'),
(33, 17, 1, 'Payment created', '2025-06-23 08:18:56'),
(34, 17, 3, 'Status updated to Completed', '2025-06-23 08:19:13'),
(35, 18, 1, 'Payment created', '2025-06-23 08:39:38'),
(36, 18, 3, 'Status updated to Completed', '2025-06-23 08:40:20'),
(37, 18, 3, 'Status updated to Completed', '2025-06-23 08:40:22'),
(38, 19, 1, 'Payment created', '2025-06-23 08:47:44'),
(39, 19, 3, 'Status updated to Completed', '2025-06-23 08:48:04'),
(40, 20, 1, 'Payment created', '2025-06-23 08:59:20'),
(41, 20, 3, 'Status updated to Completed', '2025-06-23 08:59:41'),
(42, 21, 1, 'Payment created', '2025-06-23 09:09:30'),
(43, 21, 3, 'Status updated to Completed', '2025-06-23 09:09:53'),
(44, 22, 1, 'Payment created', '2025-06-25 20:32:17'),
(45, 22, 3, 'Status updated to Completed', '2025-06-25 20:42:33'),
(46, 23, 1, 'Payment created', '2025-06-25 21:42:56'),
(47, 23, 3, 'Status updated to Completed', '2025-06-26 18:59:13'),
(48, 24, 1, 'Payment created', '2025-06-27 10:10:50'),
(49, 25, 1, 'Payment created', '2025-06-27 12:48:58'),
(50, 25, 3, 'Status updated to Completed', '2025-06-27 12:50:06');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `method_id` int(11) NOT NULL,
  `method_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT b'1',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`method_id`, `method_name`, `description`, `is_active`, `created_at`) VALUES
(1, 'Credit Card', 'Payment via credit card', b'1', '2025-05-17 10:10:43'),
(2, 'Bank Transfer', 'Payment via bank transfer', b'1', '2025-05-17 10:10:43'),
(3, 'Cash', 'Payment in cash', b'1', '2025-05-17 10:10:43'),
(4, 'E-Wallet', 'Payment via e-wallet', b'1', '2025-05-17 10:10:43'),
(5, 'PayPal', 'Payment via PayPal', b'1', '2025-05-17 10:10:43'),
(6, 'VNPAY', 'Thanh toán qua cổng VNPAY', b'1', '2025-06-27 12:47:12');

-- --------------------------------------------------------

--
-- Table structure for table `payment_status`
--

CREATE TABLE `payment_status` (
  `payment_status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_status`
--

INSERT INTO `payment_status` (`payment_status_id`, `status_name`, `description`) VALUES
(1, 'Pending', 'Payment is pending'),
(2, 'Processing', 'Payment is being processed'),
(3, 'Completed', 'Payment has been completed'),
(4, 'Failed', 'Payment has failed'),
(5, 'Refunded', 'Payment has been refunded'),
(6, 'Cancelled', 'Payment has been cancelled');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleid` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleid`, `role_name`, `description`) VALUES
(1, 'ADMIN', 'Administrator with full access'),
(2, 'USER', 'Regular user with limited access'),
(3, 'GUIDE', 'Tour guide account');

-- --------------------------------------------------------

--
-- Table structure for table `schedule_change_details`
--

CREATE TABLE `schedule_change_details` (
  `detail_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `change_type` enum('time_change','location_change','activity_change','duration_change','other') NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedule_change_history`
--

CREATE TABLE `schedule_change_history` (
  `history_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `performed_by` bigint(20) NOT NULL,
  `performed_at` datetime DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedule_change_requests`
--

CREATE TABLE `schedule_change_requests` (
  `request_id` int(11) NOT NULL,
  `admin_id` bigint(20) DEFAULT NULL,
  `admin_response` text DEFAULT NULL,
  `current_itinerary_id` int(11) DEFAULT NULL,
  `effective_date` date DEFAULT NULL,
  `guide_id` int(11) NOT NULL,
  `proposed_changes` text NOT NULL,
  `reason` text NOT NULL,
  `request_type` enum('itinerary_change','schedule_change','emergency_change') NOT NULL,
  `requested_at` datetime(6) DEFAULT NULL,
  `responded_at` datetime(6) DEFAULT NULL,
  `schedule_id` int(11) NOT NULL,
  `status` enum('pending','approved','rejected','cancelled') NOT NULL,
  `urgency_level` enum('low','medium','high','critical') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedule_change_requests`
--

INSERT INTO `schedule_change_requests` (`request_id`, `admin_id`, `admin_response`, `current_itinerary_id`, `effective_date`, `guide_id`, `proposed_changes`, `reason`, `request_type`, `requested_at`, `responded_at`, `schedule_id`, `status`, `urgency_level`) VALUES
(1, 1, 'fgughfhgfkghdfkjghfjkds', 22, '2025-07-01', 3, 'sffsfsd', 'fdfdsfđsf', 'itinerary_change', '2025-06-30 10:51:06.000000', '2025-06-30 11:01:02.000000', 16, 'approved', 'low'),
(2, 1, 'ggfghjdjhgjhgdghkdhgjdkhgjdghjjgh', 22, '2025-07-01', 3, 'earwsrdtgfhgyjuhlkjl;;\'', 'rayestudygifghjlkbn;m\'.\'\n?', 'itinerary_change', '2025-06-30 11:07:29.000000', '2025-06-30 11:08:24.000000', 16, 'approved', 'medium');

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `tour_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `max_participants` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`tour_id`, `name`, `description`, `price`, `duration`, `max_participants`, `status_id`, `created_at`, `updated_at`) VALUES
(2, 'Khám phá Hà Giang', 'Tour khám phá vùng núi đá Hà Giang, chiêm ngưỡng vẻ đẹp hùng vĩ và trải nghiệm văn hóa bản địa.', 4780000.00, 3, 20, 2, '2025-05-17 12:03:12', '2025-06-17 20:58:30'),
(4, 'Du lịch Hạ Long', 'Tham quan Vịnh Hạ Long, hang Sửng Sốt, tắm biển Bãi Cháy.', 3800000.00, 3, 40, 3, '2025-05-20 19:50:44', '2025-06-17 20:58:50'),
(5, 'Khám phá Sapa', 'Check-in đỉnh Fansipan, thung lũng Mường Hoa, bản Cát Cát.', 4200000.00, 3, 25, 3, '2025-05-20 19:52:00', '2025-06-17 20:59:03'),
(7, 'Khám phá miền Trung', 'Di sản Hội An, Cố đô Huế, động Phong Nha - Kẻ Bàng.', 5200000.00, 4, 2, 3, '2025-05-20 19:55:25', '2025-06-17 20:59:16'),
(12, 'Du lịch Phú Quốc Hè - Grand World - Vinwonders - Safari từ Sài Gòn 2025', 'Du lịch Phú Quốc Hè - Grand World - Vinwonders - Safari từ Sài Gòn 2025. Phú Quốc luôn là điểm đến lý tưởng, được nhiều khách du lịch trong và ngoài nước lựa chọn nhất. Đảo ngọc Phú Quốc - Thiên đường nhiệt đới - Phú Quốc là hòn đảo nằm trong vịnh Thái Lan, thuộc vùng nhiệt đới gió mùa cận xích đạo. Đảo được biển bao bọc cả bốn phía nên đặc điểm khí hậu khác biệt so với các hòn đảo khác của nước ta. Không những vậy thiên nhiên còn đặc biệt ưu đãi cảnh sắc tuyệt đẹp với biển xanh, cát trắng quanh năm. Đi du lịch Phú Quốc mùa Hè của tháng 6, chắc chắn bạn sẽ ngỡ ngàng trước vẻ đẹp thiên nhiên tràn đầy sức sống ở nơi đây.', 5899000.00, 3, 40, 2, '2025-06-09 09:29:14', '2025-06-17 20:59:41'),
(13, 'abc', 'dsdsđ', 12345.00, 2, 5, 2, '2025-06-09 21:23:38', '2025-06-17 20:59:52'),
(14, 'Hà Nội - Yên Tử - Vịnh Hạ Long - Ninh Bình - Chùa Bái Đính - KDL Tràng An', 'Khám phá Quảng Ninh - vùng đất hội tụ biển cả, núi non và văn hóa tâm linh. Đặt chân đến Quảng Ninh - tỉnh duy nhất sở hữu bốn thành phố trực thuộc gồm Hạ Long, Móng Cái, Uông Bí và Cẩm Phả, du khách sẽ được hòa mình vào một không gian du lịch đa sắc màu. Không thể không kể đến, đó là Vịnh Hạ Long, kỳ quan thiên nhiên thế giới với hàng nghìn đảo đá vươn mình trên mặt nước xanh ngọc bích, những hang động huyền bí và những bãi biển hoang sơ tuyệt đẹp như Động Thiên Đường, Hang Sửng Sốt, Đảo Ti Tốp… nơi làn nước trong vắt và mát lạnh mang đến cảm giác thư thái tuyệt đối.Không chỉ sở hữu vẻ đẹp biển đảo, Quảng Ninh còn cuốn hút du khách bởi không khí trong lành, thanh tịnh tại núi thiêng Yên Tử - trung tâm Phật giáo linh thiêng của Việt Nam, nơi hội tụ văn hóa, tâm linh và không gian nghỉ dưỡng đẳng cấp. Và, với những ai yêu thích thiên nhiên hoang sơ, cao nguyên Bình Liêu, nơi \"Sống lưng khủng long\" kỳ vĩ và những đồi cỏ lau bạt ngàn trong nắng gió như đường biên giới tự nhiên giữa Việt Nam và nước bạn. Quảng Ninh chắc chắn là điểm đến không thể bỏ lỡ của du khách.\nNinh Bình - vùng đất \"Nơi mơ đến, chốn mong về\" là điểm đến lý tưởng để cảm nhận sự giao hòa giữa thiên nhiên hùng vĩ và di sản văn hóa lâu đời. Nơi đây, du khách dễ dàng đắm chìm trong không gian yên bình của núi non, sông nước, những hang động kỳ vĩ cùng những di tích lịch sử và giá trị tâm linh được bảo tồn qua thời gian. Mỗi bước chân khám phá Ninh Bình như mở ra một khung cảnh mới với trải nghiệm thuyền chèo trên dòng sông Ngô Đồng, nghiêng mình trước quần thể kiến trúc Bái Đính, đạp xe quanh hồ Tuyệt Tịnh Cốc,..', 7790000.00, 4, 49, 2, '2025-06-15 20:06:01', '2025-06-17 21:00:15');

--
-- Triggers `tours`
--
DELIMITER $$
CREATE TRIGGER `after_tour_delete` AFTER DELETE ON `tours` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NULL,
    'delete_tour',
    CONCAT('Xóa tour: Tên: ', OLD.name, ', Giá: ', OLD.price, ', Thời lượng: ', OLD.duration, ', Trạng thái: ', OLD.status_id)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_tour_insert` AFTER INSERT ON `tours` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NULL,
    'insert_tour',
    CONCAT('Thêm tour: Tên: ', NEW.name, ', Giá: ', NEW.price, ', Thời lượng: ', NEW.duration, ', Trạng thái: ', NEW.status_id)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_tour_update` AFTER UPDATE ON `tours` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NULL,
    'update_tour',
    CONCAT(
      'Cập nhật tour: Tên: ', NEW.name, ', Giá: ', NEW.price, ', Thời lượng: ', NEW.duration, ', Trạng thái: ', NEW.status_id,
      '. Thay đổi: ',
      IF(OLD.status_id <> NEW.status_id, CONCAT('[status_id: ', OLD.status_id, ' → ', NEW.status_id, '] '), ''),
      IF(OLD.price <> NEW.price, CONCAT('[price: ', OLD.price, ' → ', NEW.price, '] '), '')
    )
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tour_destinations`
--

CREATE TABLE `tour_destinations` (
  `tour_id` int(11) NOT NULL,
  `destination_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_destinations`
--

INSERT INTO `tour_destinations` (`tour_id`, `destination_id`) VALUES
(2, 1),
(2, 2),
(4, 3),
(5, 4),
(5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `tour_events`
--

CREATE TABLE `tour_events` (
  `tour_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_events`
--

INSERT INTO `tour_events` (`tour_id`, `event_id`) VALUES
(2, 1),
(4, 2),
(7, 3);

-- --------------------------------------------------------

--
-- Table structure for table `tour_guides`
--

CREATE TABLE `tour_guides` (
  `guide_id` int(11) NOT NULL,
  `experience_years` int(11) NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `languages` varchar(255) NOT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `userid` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_guides`
--

INSERT INTO `tour_guides` (`guide_id`, `experience_years`, `specialization`, `languages`, `rating`, `is_available`, `created_at`, `userid`, `user_id`) VALUES
(1, 6, 'vlhxjsv', 'tiếng việt', 0.0, 1, '2025-06-16 08:41:23', 8, 0),
(2, 4, 'sdfbf', 'tiếng  việt', 0.0, 1, '2025-06-20 22:45:58', 9, 0),
(3, 4, 'sdfbf', 'tiếng  việt', 0.0, 1, '2025-06-21 11:55:34', 10, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tour_guide_assignments`
--

CREATE TABLE `tour_guide_assignments` (
  `assignment_id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `guide_id` int(11) NOT NULL,
  `role` enum('main_guide','assistant_guide','specialist') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('assigned','inprogress','completed','cancelled') NOT NULL,
  `schedule_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_guide_assignments`
--

INSERT INTO `tour_guide_assignments` (`assignment_id`, `tour_id`, `guide_id`, `role`, `start_date`, `end_date`, `status`, `schedule_id`) VALUES
(1, 14, 1, 'main_guide', '2025-06-17', '2025-06-20', 'completed', NULL),
(2, 14, 2, 'assistant_guide', '2025-06-17', '2025-06-20', 'completed', NULL),
(3, 14, 2, 'main_guide', '2025-06-21', '2025-06-24', 'inprogress', NULL),
(4, 14, 1, 'assistant_guide', '2025-07-01', '2025-07-04', 'assigned', 16),
(5, 14, 3, 'main_guide', '2025-07-01', '2025-07-04', 'assigned', 16);

-- --------------------------------------------------------

--
-- Table structure for table `tour_image_urls`
--

CREATE TABLE `tour_image_urls` (
  `tour_id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_image_urls`
--

INSERT INTO `tour_image_urls` (`tour_id`, `image_url`) VALUES
(2, '/uploads/tours/80cbb8b0-0e23-4767-a172-623c7c9f33cc_Tour khám phá vùng núi đá Hà Giang,.jfif'),
(4, '/uploads/tours/b0077844-b0d4-4e62-ab99-25415baa4a42_Hạ Long.jfif'),
(5, '/uploads/tours/3500d748-7731-4ca7-8f54-ffd666a6fa8e_Khám phá Sapa.jpg'),
(7, '/uploads/tours/972862e0-4296-4d58-937d-d0f2f46c079d_Khám phá miền Trung.jfif'),
(12, '/uploads/tours/1374a5a4-7266-450c-b744-8a1d247fa902_Lễ hội Hoa Hạ Long.jpg'),
(13, '/uploads/tours/a374735a-19c6-4453-a948-be5da997c3d6_Đèo Mã Pí Lèng2.jfif'),
(14, '/uploads/tours/549e9847-fdf7-4972-8eba-bed38c3b712a_images.jfif'),
(14, '/uploads/tours/f2cadfba-7b1b-4b6a-9ac6-4e4e41e6fec2_sapa.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `tour_itinerary`
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
-- Dumping data for table `tour_itinerary`
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
(14, 9, 'g', 'f', '11:11:00', '23:11:00', 'MEAL'),
(15, 12, ' Quý khách có mặt tại ga quốc nội, sân bay Tân Sơn Nhất trước giờ bay ít nhất hai tiếng.', 'Đại diện công ty Du Lịch Việt đón và hỗ trợ Quý khách làm thủ tục đón chuyến bay đi Phú Quốc. \nTrưa:  Đến sân bay Phú Quốc, Hướng dẫn viên đón Quý khách dùng cơm trưa.\nChiều: Đoàn Tham quan Dinh Cậu.\nTham quan các làng nghề truyền thống nổi tiếng trên đảo:\nHồ tiêu Phú Quốc: tìm hiểu về cách trồng tiêu tại vườn. Tiêu Phú Quốc nổi tiếng với hạt to, đen và cay thơm. Du khách có thể mua tiêu về làm quà tại nhà vườn.', '09:00:00', '10:00:00', 'DESTINATION'),
(16, 13, 'dffđsfds', 'dsfdsffdsfds', '08:00:00', '20:00:00', 'DESTINATION'),
(17, 14, 'Sb Nội Bài (Hà Nội) - Yên Tử - Hạ Long', '\n\n04:30 – 05:30  : Quý khách tập trung tại sân bay Tân Sơn Nhất (Ga nội địa), hướng dẫn viên hỗ trợ khách làm thủ tục đáp chuyến bay đi Hà Nội.\n\n(06:00 – 08:00) Đến sân bay Nội Bài, xe và HDV Vietravel đón Quý khách di chuyển đến vùng đất thiêng Yên Tử, nơi được mệnh danh là \"Vùng đất tạo nên Di Sản\".\n\n11:30 – 12:30 : Check-in tại Làng Nương, hòa mình vào không gian thanh tịnh, yên bình giữa núi rừng. Quý khách thưởng thức những món ăn đậm đà hương vị địa phương tại nhà hàng Cơm Quê, mang đến trải nghiệm ẩm thực mộc mạc nhưng đầy tinh tế.\n\n13:00 – 16:00 : Trải nghiệm cáp treo (chi phí tự túc), đưa Quý khách băng qua những rặng núi trùng điệp, thu trọn vào tầm mắt khung cảnh thiên nhiên hùng vĩ. Vào mùa xuân, Đại Lão Mai Vàng nở rộ, khoe sắc rực rỡ trên đỉnh núi, tạo nên khung cảnh ngoạn mục. Chiêm bái chùa Một Mái và chùa Hoa Yên, hòa mình vào không gian linh thiêng, lắng đọng trong sự tĩnh tại và an nhiên. Nơi đây từng là chốn tu hành của Phật Hoàng Trần Nhân Tông, vị tổ khai sáng Thiền phái Trúc Lâm. Theo dấu chân Phật Hoàng viếng Chùa Đồng có tên Thiên Trúc Tự (chùa Cõi Phật), tọa lạc ở đỉnh cao nhất dãy Yên Tử (1.068m) - ngôi chùa bằng đồng lớn nhất Việt Nam.\n\n16:00 – 18:00 : Tiếp tục hành trình đến TP Hạ Long, Quý khách nhận phòng khách sạn và dùng cơm chiều.\n\n19:00 – 22:00 : Buổi tối, Quý khách tự do khám phá \"phố cổ\" Bãi Cháy sôi động, nơi hội tụ những hoạt động giải trí hấp dẫn, từ ẩm thực đường phố đặc sắc đến những quán bar sôi động Valley Beach Club. Hoặc, Quý khách có thể hòa mình vào không gian các quán cà phê độc đáo như Thông Zeo, 1900, Luna.', '08:00:00', '22:00:00', 'DESTINATION'),
(18, 14, 'Vịnh Hạ Long - Ninh Bình', '\n06:30 – 07:30 : Quý khách dùng bữa sáng và trả phòng khách sạn.\n07:30 – 08:00 : Xe khởi hành đưa Quý khách đến cảng tàu, làm thủ tục lên thuyền.\n08:00 – 11:00 : Bắt đầu hành trình du ngoạn Vịnh Hạ Long – di sản thiên nhiên thế giới được UNESCO công nhận năm 1994.\n\nTham quan Động Thiên Cung – một trong những động đẹp nhất ở Hạ Long với vẻ đẹp nguy nga, lộng lẫy bởi những lớp thạch nhũ và ánh sáng lung linh.\nTừ trên tàu, Quý khách ngắm nhìn các hòn đảo lớn nhỏ trong Vịnh Hạ Long: Hòn Gà Chọi, Hòn Lư Hương…\n\n11:00 – 12:00 : Tham quan và mua sắm đặc sản tại Hải Sản Hương Đà Hạ Long với nhiều mặt hàng nổi tiếng: chả mực giã tay, thịt chưng mắm tép, ruốc tôm, sá sùng khô, cá cơm, cá chỉ vàng…\n\n12:00 – 15:30 : Xe đón Quý khách tại bến thuyền, khởi hành đi Ninh Bình – vùng đất được mệnh danh là \"Nơi mơ đến, chốn mong về\", nổi tiếng với thiên nhiên hùng vĩ và các di tích văn hóa đặc sắc.\n\n15:30 – 16:30 : Đến nơi, Quý khách dùng cơm chiều và nhận phòng khách sạn nghỉ ngơi.\n\nTối: 19:00 – 21:30 Quý khách tự do ngắm Phố cổ Hoa Lư về đêm – mang vẻ đẹp lung linh, huyền ảo.\nTại đây, du khách có thể hòa mình vào không gian văn hóa truyền thống rực rỡ màu sắc, trải nghiệm:\n\nTrò chơi dân gian\nNghệ thuật truyền thống: múa rối nước, nhảy Tắc Xình, hát Xẩm\nDạo thuyền hồ Kỳ Lân, thưởng trà, thả đèn hoa đăng, ngắm phố cổ lung linh trong ánh đèn (chi phí tự túc).', '08:00:00', '21:30:00', 'DESTINATION'),
(19, 14, ' Ninh Bình - Hà Nội', '\n07:00 – 08:00 : Quý khách dùng bữa sáng và trả phòng khách sạn. Xe đưa Quý khách đi tham quan.\n\n08:30 – 11:30 : Tại khu du lịch Tràng An, Quý khách sẽ có trải nghiệm tuyệt vời lên thuyền, thả mình trên dòng sông Ngô Đồng xanh biếc, lướt qua những hang động kỳ bí, ngắm nhìn thiên nhiên hùng vĩ của những ngọn núi đá vôi cao vút và những thung lũng nước mênh mang hiện ra trước mắt.\nGiữa không gian tĩnh mịch, những mái đình, đền, phủ cổ kính phủ đầy rêu phong, ẩn mình dưới chân núi, tạo nên một bức tranh thiên nhiên tuyệt mỹ.\n\n12:00 – 13:30 : Nghiêng mình trước Chùa Bái Đính – quần thể kiến trúc Phật giáo tráng lệ, mang đến cảm giác trang nghiêm và thanh tịnh.\nTham quan:\n\n +, Pho tượng Phật Di Lặc bằng đồng nặng 80 tấn\n +, Hành lang La Hán với 500 pho tượng sống động\n +, Ngắm tòa Bảo Tháp cao 99m sừng sững giữa trời xanh\n\n13:30 – 16:30 : Xe khởi hành đưa Quý khách về Hà Nội.\n\n16:30 – 17:30 : Dạo quanh Hồ Hoàn Kiếm, ngắm bên ngoài Tháp Rùa, Đền Ngọc Sơn, Cầu Thê Húc.\n\n18:00 – 19:00 : Quý khách nhận phòng khách sạn nghỉ ngơi.\n\nTối: 19:00 – 21:30 Quý khách tự do dạo khu phố Tây Tạ Hiện, thưởng thức đặc sản Hà Nội như:\n\n +, Ngan cháy tỏi\n +, Bún ốc nguội\n +, Chả rươi\n\nKem Tràng Tiền\n(Chi phí tự túc)', '08:00:00', '21:30:00', 'DESTINATION'),
(20, 14, 'Hà Nội - Sân Bay Nội Bài - Tp.Hồ Chí Minh', '06:30 – 07:30 : Quý khách dùng bữa sáng và trả phòng khách sạn.\n\n07:30 – 09:30 : Xe khởi hành đưa Quý khách ra sân bay Nội Bài.\n\n09:30 – 10:30 : Hướng dẫn viên hỗ trợ Quý khách làm thủ tục đón chuyến bay về TP.HCM.\n\n(Dự kiến) Đến sân bay Tân Sơn Nhất, chia tay Quý khách và kết thúc chương trình du lịch.\n\nKẾT THÚC CHƯƠNG TRÌNH – TẠM BIỆT VÀ HẸN GẶP LẠI QUÝ KHÁCH!\n\nLưu ý:\nHành trình có thể thay đổi thứ tự điểm đến tùy theo điều kiện thực tế.\n\nLịch trình tham quan (tắm biển, ngắm hoa, trải nghiệm,...) có thể bị ảnh hưởng bởi thời tiết. Đây là trường hợp bất khả kháng, mong Quý khách thông cảm.\n\nVào mùa cao điểm, khách sạn có thể nằm xa trung tâm thành phố.\n\nDo các yếu tố khách quan, một số điểm tham quan có thể đóng cửa và sẽ được thay thế bằng địa điểm phù hợp khác.', '07:30:00', '16:00:00', 'DESTINATION'),
(21, 15, 'Sb Nội Bài (Hà Nội) - Yên Tử - Hạ Long', '\n04:30 – 05:30 : Quý khách tập trung tại sân bay Tân Sơn Nhất (Ga nội địa), hướng dẫn viên hỗ trợ khách làm thủ tục đáp chuyến bay đi Hà Nội.\n\n(06:00 – 08:00) Đến sân bay Nội Bài, xe và HDV Vietravel đón Quý khách di chuyển đến vùng đất thiêng Yên Tử, nơi được mệnh danh là \"Vùng đất tạo nên Di Sản\".\n\n11:30 – 12:30 : Check-in tại Làng Nương, hòa mình vào không gian thanh tịnh, yên bình giữa núi rừng. Quý khách thưởng thức những món ăn đậm đà hương vị địa phương tại nhà hàng Cơm Quê, mang đến trải nghiệm ẩm thực mộc mạc nhưng đầy tinh tế.\n\n13:00 – 16:00 : Trải nghiệm cáp treo (chi phí tự túc), đưa Quý khách băng qua những rặng núi trùng điệp, thu trọn vào tầm mắt khung cảnh thiên nhiên hùng vĩ. Vào mùa xuân, Đại Lão Mai Vàng nở rộ, khoe sắc rực rỡ trên đỉnh núi, tạo nên khung cảnh ngoạn mục. Chiêm bái chùa Một Mái và chùa Hoa Yên, hòa mình vào không gian linh thiêng, lắng đọng trong sự tĩnh tại và an nhiên. Nơi đây từng là chốn tu hành của Phật Hoàng Trần Nhân Tông, vị tổ khai sáng Thiền phái Trúc Lâm. Theo dấu chân Phật Hoàng viếng Chùa Đồng có tên Thiên Trúc Tự (chùa Cõi Phật), tọa lạc ở đỉnh cao nhất dãy Yên Tử (1.068m) - ngôi chùa bằng đồng lớn nhất Việt Nam.\n\n16:00 – 18:00 : Tiếp tục hành trình đến TP Hạ Long, Quý khách nhận phòng khách sạn và dùng cơm chiều.\n\n19:00 – 22:00 : Buổi tối, Quý khách tự do khám phá \"phố cổ\" Bãi Cháy sôi động, nơi hội tụ những hoạt động giải trí hấp dẫn, từ ẩm thực đường phố đặc sắc đến những quán bar sôi động Valley Beach Club. Hoặc, Quý khách có thể hòa mình vào không gian các quán cà phê độc đáo như Thông Zeo, 1900, Luna.', '08:00:00', '22:00:00', 'DESTINATION'),
(22, 16, 'Ninh Bình - Hà Nội', 'earwsrdtgfhgyjuhlkjl;;\'', '07:00:00', '21:30:00', 'DESTINATION'),
(23, 17, 'đfgfghcvgxfzd', '07:00 – 08:00 : Quý khách dùng bữa sáng và trả phòng khách sạn. Xe đưa Quý khách đi tham quan.\n\n08:30 – 11:30 : Tại khu du lịch Tràng An, Quý khách sẽ có trải nghiệm tuyệt vời lên thuyền, thả mình trên dòng sông Ngô Đồng xanh biếc, lướt qua những hang động kỳ bí, ngắm nhìn thiên nhiên hùng vĩ của những ngọn núi đá vôi cao vút và những thung lũng nước mênh mang hiện ra trước mắt.\nGiữa không gian tĩnh mịch, những mái đình, đền, phủ cổ kính phủ đầy rêu phong, ẩn mình dưới chân núi, tạo nên một bức tranh thiên nhiên tuyệt mỹ.\n\n12:00 – 13:30 : Nghiêng mình trước Chùa Bái Đính – quần thể kiến trúc Phật giáo tráng lệ, mang đến cảm giác trang nghiêm và thanh tịnh.\nTham quan:\n\n +, Pho tượng Phật Di Lặc bằng đồng nặng 80 tấn\n +, Hành lang La Hán với 500 pho tượng sống động\n +, Ngắm tòa Bảo Tháp cao 99m sừng sững giữa trời xanh\n\n13:30 – 16:30 : Xe khởi hành đưa Quý khách về Hà Nội.\n\n16:30 – 17:30 : Dạo quanh Hồ Hoàn Kiếm, ngắm bên ngoài Tháp Rùa, Đền Ngọc Sơn, Cầu Thê Húc.\n\n18:00 – 19:00 : Quý khách nhận phòng khách sạn nghỉ ngơi.\n\nTối: 19:00 – 21:30 Quý khách tự do dạo khu phố Tây Tạ Hiện, thưởng thức đặc sản Hà Nội như:\n\n +, Ngan cháy tỏi\n +, Bún ốc nguội\n +, Chả rươi\n\nKem Tràng Tiền\n(Chi phí tự túc)', '07:00:00', '22:00:00', 'DESTINATION');

-- --------------------------------------------------------

--
-- Table structure for table `tour_schedules`
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
-- Dumping data for table `tour_schedules`
--

INSERT INTO `tour_schedules` (`schedule_id`, `tour_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, '2025-05-27', '2025-05-29', 'closed', '2025-05-17 15:02:57', '2025-05-20 12:26:17'),
(3, 2, '2025-06-11', '2025-06-13', 'closed', '2025-05-17 15:43:53', '2025-05-20 12:39:50'),
(4, 4, '2025-06-15', '2025-06-17', 'closed', '2025-05-20 19:59:02', '2025-05-20 19:59:02'),
(5, 5, '2025-06-20', '2025-06-26', 'closed', '2025-05-20 19:59:22', '2025-05-20 19:59:22'),
(7, 7, '2025-08-05', '2025-08-06', 'full', '2025-05-20 20:02:25', '2025-05-20 20:02:25'),
(9, 5, '2025-06-06', '2025-06-08', 'closed', '2025-05-24 20:02:11', '2025-05-24 20:58:05'),
(12, 12, '2025-06-10', '2025-06-12', 'closed', '2025-06-09 09:30:17', '2025-06-09 21:28:23'),
(13, 13, '2025-06-10', '2025-06-11', 'closed', '2025-06-09 21:24:44', '2025-06-09 21:27:04'),
(14, 14, '2025-06-17', '2025-06-20', 'closed', '2025-06-15 20:06:58', '2025-06-17 19:15:15'),
(15, 14, '2025-06-21', '2025-06-24', 'closed', '2025-06-19 18:07:19', '2025-06-19 18:07:19'),
(16, 14, '2025-07-01', '2025-07-04', 'available', '2025-06-23 00:03:18', '2025-06-23 00:03:18'),
(17, 14, '2025-06-24', '2025-06-28', 'available', '2025-06-23 09:08:08', '2025-06-23 09:08:08');

-- --------------------------------------------------------

--
-- Table structure for table `tour_status`
--

CREATE TABLE `tour_status` (
  `tour_status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_status`
--

INSERT INTO `tour_status` (`tour_status_id`, `status_name`, `description`) VALUES
(1, 'Draft', NULL),
(2, 'Published', NULL),
(3, 'Cancelled', NULL),
(4, 'Completed', NULL),
(5, 'Full', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE `userroles` (
  `userid` bigint(20) NOT NULL,
  `roleid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`userid`, `roleid`) VALUES
(1, 1),
(2, 2),
(4, 2),
(8, 3),
(9, 3),
(10, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `full_name`, `email`, `password_hash`, `phone`, `address`, `is_active`, `created_at`, `updated_at`, `public_id`) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$10$XB14xcxuI1SlICBxZxLMAu8Gcx.UcJK0LWgFVtinCc/GL2Q3K7EZy', '1234567890', '12345', b'1', '2025-05-17 11:07:30', '2025-06-03 16:58:57', '9be3835e-6a67-41d4-bad1-8f423ac73397'),
(2, 'do viet hoang', 'hoang@gmail.com', '$2a$10$pQMo0TdhZB6PGXzmkSa10eoFxUK2zGy9/BbFv6w02OiQIaApcAdlS', '1234567890', 'hà nội1', b'1', '2025-05-17 17:39:03', '2025-06-03 09:43:38', '43b52f1b-3d24-438c-955f-adce2ea9ad1f'),
(4, 'tuan', 'tuan@gmail.com', '$2a$10$VxlgD7CyupQRNSpNGOYPi.e34YprcbmMznn6C0E0SjAxG37ixNu5e', '1234567890', '123456', b'1', '2025-06-03 08:50:47', '2025-06-03 10:19:17', 'ae913205-b742-41c3-9740-ce4550e45422'),
(8, 'guide', 'guide@gmail.com', '$2a$10$XJG3Rkn.k/LTEjM5rnGVCOZwdBbyUmlt3T8ymgU3X/rX2B.JWXpN6', '1234567890', '12345', b'1', '2025-06-16 08:41:19', '2025-06-16 08:41:19', '3630bd25-793c-4365-ba3f-9b65eca0d6a6'),
(9, 'do hoang', 'dohoang@gmail.com', '$2a$10$omXQv2tG30sXT7Awd1./4eU1tUB9fumWm5MVW5YHFUX9xKLxAfaEy', '1234567890', '12345678', b'1', '2025-06-20 22:45:54', '2025-06-20 22:45:54', 'f42cdbc0-7fbf-4e71-bf98-0dfc8903e09c'),
(10, 'cuong', 'cuong@gmail.com', '$2a$10$OBN9jNUjlJg/qKryBU/oWOIigYAMd8AkpddoivrQtf3B8E3kB0o4K', '1234567890', '12345678', b'1', '2025-06-21 11:55:29', '2025-06-21 11:55:29', 'ff4cb764-8b47-4ade-b98d-6243b7a14403');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `after_user_delete` AFTER DELETE ON `users` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    OLD.userid,
    'delete_user',
    CONCAT('Xóa user: Họ tên: ', OLD.full_name, ', Email: ', OLD.email, ', SĐT: ', OLD.phone, ', Địa chỉ: ', OLD.address, ', public_id: ', OLD.public_id)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_user_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'insert_user',
    CONCAT('Thêm user mới: Họ tên: ', NEW.full_name, ', Email: ', NEW.email, ', SĐT: ', NEW.phone, ', Địa chỉ: ', NEW.address, ', public_id: ', NEW.public_id)
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_user_update` AFTER UPDATE ON `users` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description)
  VALUES (
    NEW.userid,
    'update_user',
    CONCAT(
      'Cập nhật user: Họ tên: ', NEW.full_name, ', Email: ', NEW.email, ', SĐT: ', NEW.phone, ', Địa chỉ: ', NEW.address, ', public_id: ', NEW.public_id,
      '. Thay đổi: ',
      IF(OLD.full_name <> NEW.full_name, CONCAT('[full_name: ', OLD.full_name, ' → ', NEW.full_name, '] '), ''),
      IF(OLD.email <> NEW.email, CONCAT('[email: ', OLD.email, ' → ', NEW.email, '] '), ''),
      IF(OLD.phone <> NEW.phone, CONCAT('[phone: ', OLD.phone, ' → ', NEW.phone, '] '), ''),
      IF(OLD.address <> NEW.address, CONCAT('[address: ', OLD.address, ' → ', NEW.address, '] '), '')
    )
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `usertokens`
--

CREATE TABLE `usertokens` (
  `tokenid` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expiry` datetime NOT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_discounts`
--

CREATE TABLE `user_discounts` (
  `tour_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `discount_id` int(11) NOT NULL,
  `used` bit(1) DEFAULT b'0',
  `used_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_discounts`
--

INSERT INTO `user_discounts` (`tour_id`, `userid`, `discount_id`, `used`, `used_at`) VALUES
(2, 1, 1, b'1', NULL),
(2, 1, 4, b'1', NULL),
(2, 1, 5, b'1', NULL),
(2, 4, 5, b'1', NULL),
(4, 2, 1, b'1', NULL),
(4, 4, 1, b'1', NULL),
(4, 1, 3, b'1', NULL),
(4, 4, 3, b'1', NULL),
(4, 2, 5, b'1', NULL),
(5, 2, 1, b'1', NULL),
(5, 4, 1, b'1', NULL),
(5, 2, 3, b'1', NULL),
(5, 4, 3, b'1', NULL),
(12, 1, 4, b'1', NULL),
(14, 1, 4, b'1', NULL),
(14, 1, 5, b'1', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_audit_user` (`userid`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD UNIQUE KEY `booking_code` (`booking_code`),
  ADD KEY `fk_booking_tour` (`tour_id`),
  ADD KEY `fk_booking_status` (`status_id`),
  ADD KEY `fk_booking_user` (`userid`),
  ADD KEY `FKt98nddbacnbmpjk7l51h7cevq` (`schedule_id`);

--
-- Indexes for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD PRIMARY KEY (`passenger_id`),
  ADD KEY `fk_passenger_booking` (`booking_id`),
  ADD KEY `fk_passenger_user` (`userid`),
  ADD KEY `FK7axoqetwaccw789au7ehme82a` (`guardian_passenger_id`);

--
-- Indexes for table `booking_status`
--
ALTER TABLE `booking_status`
  ADD PRIMARY KEY (`booking_status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`destination_id`);

--
-- Indexes for table `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `fk_destination_file` (`destination_id`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`discount_id`),
  ADD UNIQUE KEY `uk_discount_code` (`code`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `fk_event_status` (`status_id`);

--
-- Indexes for table `event_file_paths`
--
ALTER TABLE `event_file_paths`
  ADD KEY `FK7lmjuds8bmtdclfwuqrj560qy` (`event_id`);

--
-- Indexes for table `event_status`
--
ALTER TABLE `event_status`
  ADD PRIMARY KEY (`event_status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Indexes for table `experiences`
--
ALTER TABLE `experiences`
  ADD PRIMARY KEY (`experience_id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `fk_feedback_user` (`userid`),
  ADD KEY `fk_feedback_tour` (`tour_id`),
  ADD KEY `fk_feedback_status` (`status_id`);

--
-- Indexes for table `feedback_status`
--
ALTER TABLE `feedback_status`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Indexes for table `itinerary`
--
ALTER TABLE `itinerary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKtdeni0ghsbtavoej405fuv65l` (`tour_id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`media_id`),
  ADD KEY `fk_media_user` (`userid`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `fk_notification_user` (`userid`),
  ADD KEY `fk_notification_sender` (`sender_id`),
  ADD KEY `fk_notification_schedule_change` (`schedule_change_request_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_booking` (`booking_id`),
  ADD KEY `fk_payment_user` (`userid`),
  ADD KEY `fk_payment_method` (`payment_method_id`),
  ADD KEY `fk_payment_status` (`status_id`);

--
-- Indexes for table `payment_history`
--
ALTER TABLE `payment_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `fk_history_payment` (`payment_id`),
  ADD KEY `fk_history_status` (`status_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`method_id`),
  ADD UNIQUE KEY `uk_method_name` (`method_name`);

--
-- Indexes for table `payment_status`
--
ALTER TABLE `payment_status`
  ADD PRIMARY KEY (`payment_status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleid`),
  ADD UNIQUE KEY `uk_role_name` (`role_name`);

--
-- Indexes for table `schedule_change_details`
--
ALTER TABLE `schedule_change_details`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `fk_change_detail_request` (`request_id`);

--
-- Indexes for table `schedule_change_history`
--
ALTER TABLE `schedule_change_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `fk_change_history_request` (`request_id`),
  ADD KEY `fk_change_history_user` (`performed_by`);

--
-- Indexes for table `schedule_change_requests`
--
ALTER TABLE `schedule_change_requests`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`tour_id`),
  ADD KEY `fk_tour_status` (`status_id`);

--
-- Indexes for table `tour_destinations`
--
ALTER TABLE `tour_destinations`
  ADD PRIMARY KEY (`tour_id`,`destination_id`),
  ADD KEY `fk_tour_destinations_destination` (`destination_id`);

--
-- Indexes for table `tour_events`
--
ALTER TABLE `tour_events`
  ADD PRIMARY KEY (`tour_id`,`event_id`),
  ADD KEY `fk_tour_events_event` (`event_id`);

--
-- Indexes for table `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD PRIMARY KEY (`guide_id`),
  ADD UNIQUE KEY `UK_heivp9fqmiwskkog40ikipns8` (`userid`);

--
-- Indexes for table `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `fk_assignment_tour` (`tour_id`),
  ADD KEY `fk_assignment_guide` (`guide_id`),
  ADD KEY `FK92r33l8cuf2sklqyw6jed44m1` (`schedule_id`);

--
-- Indexes for table `tour_image_urls`
--
ALTER TABLE `tour_image_urls`
  ADD KEY `FKp2r3lj1xxli3qkardbewc2lyj` (`tour_id`);

--
-- Indexes for table `tour_itinerary`
--
ALTER TABLE `tour_itinerary`
  ADD PRIMARY KEY (`itinerary_id`),
  ADD KEY `fk_itinerary_schedule` (`schedule_id`);

--
-- Indexes for table `tour_schedules`
--
ALTER TABLE `tour_schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `fk_schedule_tour` (`tour_id`);

--
-- Indexes for table `tour_status`
--
ALTER TABLE `tour_status`
  ADD PRIMARY KEY (`tour_status_id`),
  ADD UNIQUE KEY `uk_status_name` (`status_name`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`userid`,`roleid`),
  ADD KEY `fk_userroles_role` (`roleid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `uk_email` (`email`),
  ADD UNIQUE KEY `public_id` (`public_id`);

--
-- Indexes for table `usertokens`
--
ALTER TABLE `usertokens`
  ADD PRIMARY KEY (`tokenid`),
  ADD KEY `fk_usertokens_user` (`userid`);

--
-- Indexes for table `user_discounts`
--
ALTER TABLE `user_discounts`
  ADD PRIMARY KEY (`tour_id`,`discount_id`,`userid`),
  ADD KEY `fk_user_discount_user` (`userid`),
  ADD KEY `fk_user_discount_discount` (`discount_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  MODIFY `passenger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `booking_status`
--
ALTER TABLE `booking_status`
  MODIFY `booking_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `destination_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `discounts`
--
ALTER TABLE `discounts`
  MODIFY `discount_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `event_status`
--
ALTER TABLE `event_status`
  MODIFY `event_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `experiences`
--
ALTER TABLE `experiences`
  MODIFY `experience_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `feedback_status`
--
ALTER TABLE `feedback_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `itinerary`
--
ALTER TABLE `itinerary`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `media_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `payment_history`
--
ALTER TABLE `payment_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `payment_status`
--
ALTER TABLE `payment_status`
  MODIFY `payment_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `schedule_change_details`
--
ALTER TABLE `schedule_change_details`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedule_change_history`
--
ALTER TABLE `schedule_change_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedule_change_requests`
--
ALTER TABLE `schedule_change_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `tour_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tour_guides`
--
ALTER TABLE `tour_guides`
  MODIFY `guide_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tour_itinerary`
--
ALTER TABLE `tour_itinerary`
  MODIFY `itinerary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tour_schedules`
--
ALTER TABLE `tour_schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tour_status`
--
ALTER TABLE `tour_status`
  MODIFY `tour_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `usertokens`
--
ALTER TABLE `usertokens`
  MODIFY `tokenid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE SET NULL;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FKhpweps6it8n224l44tahx19y2` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `FKt98nddbacnbmpjk7l51h7cevq` FOREIGN KEY (`schedule_id`) REFERENCES `tour_schedules` (`schedule_id`),
  ADD CONSTRAINT `fk_booking_status` FOREIGN KEY (`status_id`) REFERENCES `booking_status` (`booking_status_id`),
  ADD CONSTRAINT `fk_booking_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD CONSTRAINT `FK7axoqetwaccw789au7ehme82a` FOREIGN KEY (`guardian_passenger_id`) REFERENCES `booking_passengers` (`passenger_id`),
  ADD CONSTRAINT `fk_passenger_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_passenger_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  ADD CONSTRAINT `fk_destination_file` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_event_status` FOREIGN KEY (`status_id`) REFERENCES `event_status` (`event_status_id`);

--
-- Constraints for table `event_file_paths`
--
ALTER TABLE `event_file_paths`
  ADD CONSTRAINT `FK7lmjuds8bmtdclfwuqrj560qy` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`);

--
-- Constraints for table `experiences`
--
ALTER TABLE `experiences`
  ADD CONSTRAINT `experiences_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `experiences_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `fk_feedback_status` FOREIGN KEY (`status_id`) REFERENCES `feedback_status` (`status_id`),
  ADD CONSTRAINT `fk_feedback_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `itinerary`
--
ALTER TABLE `itinerary`
  ADD CONSTRAINT `FKtdeni0ghsbtavoej405fuv65l` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`);

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `fk_media_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_schedule_change` FOREIGN KEY (`schedule_change_request_id`) REFERENCES `schedule_change_requests` (`request_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_notification_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`userid`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`method_id`),
  ADD CONSTRAINT `fk_payment_status` FOREIGN KEY (`status_id`) REFERENCES `payment_status` (`payment_status_id`),
  ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `payment_history`
--
ALTER TABLE `payment_history`
  ADD CONSTRAINT `fk_history_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_history_status` FOREIGN KEY (`status_id`) REFERENCES `payment_status` (`payment_status_id`);

--
-- Constraints for table `schedule_change_details`
--
ALTER TABLE `schedule_change_details`
  ADD CONSTRAINT `fk_change_detail_request` FOREIGN KEY (`request_id`) REFERENCES `schedule_change_requests` (`request_id`) ON DELETE CASCADE;

--
-- Constraints for table `schedule_change_history`
--
ALTER TABLE `schedule_change_history`
  ADD CONSTRAINT `fk_change_history_request` FOREIGN KEY (`request_id`) REFERENCES `schedule_change_requests` (`request_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_change_history_user` FOREIGN KEY (`performed_by`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `tours`
--
ALTER TABLE `tours`
  ADD CONSTRAINT `fk_tour_status` FOREIGN KEY (`status_id`) REFERENCES `tour_status` (`tour_status_id`);

--
-- Constraints for table `tour_destinations`
--
ALTER TABLE `tour_destinations`
  ADD CONSTRAINT `fk_tour_destinations_destination` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tour_destinations_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_events`
--
ALTER TABLE `tour_events`
  ADD CONSTRAINT `fk_tour_events_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tour_events_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD CONSTRAINT `FKe77mlqfo649eeehhwvrgmaxvy` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);

--
-- Constraints for table `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  ADD CONSTRAINT `FK92r33l8cuf2sklqyw6jed44m1` FOREIGN KEY (`schedule_id`) REFERENCES `tour_schedules` (`schedule_id`),
  ADD CONSTRAINT `fk_assignment_guide` FOREIGN KEY (`guide_id`) REFERENCES `tour_guides` (`guide_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assignment_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_image_urls`
--
ALTER TABLE `tour_image_urls`
  ADD CONSTRAINT `FKp2r3lj1xxli3qkardbewc2lyj` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`);

--
-- Constraints for table `tour_itinerary`
--
ALTER TABLE `tour_itinerary`
  ADD CONSTRAINT `fk_itinerary_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `tour_schedules` (`schedule_id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_schedules`
--
ALTER TABLE `tour_schedules`
  ADD CONSTRAINT `fk_schedule_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

--
-- Constraints for table `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `fk_userroles_role` FOREIGN KEY (`roleid`) REFERENCES `roles` (`roleid`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_userroles_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `usertokens`
--
ALTER TABLE `usertokens`
  ADD CONSTRAINT `fk_usertokens_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `user_discounts`
--
ALTER TABLE `user_discounts`
  ADD CONSTRAINT `fk_user_discount_discount` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`discount_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_discount_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_discount_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
