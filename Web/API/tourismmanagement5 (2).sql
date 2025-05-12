-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2025 at 04:15 AM
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
-- Database: `tourismmanagement5`
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
(1, 4, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 1', '2025-05-07 09:39:51'),
(2, 4, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 2', '2025-05-07 10:03:03'),
(3, 4, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 3', '2025-05-07 21:26:44'),
(4, 3, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 4', '2025-05-07 21:32:14'),
(5, 1, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 5', '2025-05-08 19:00:00'),
(6, 4, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 6', '2025-05-09 20:07:46'),
(7, 2, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 7', '2025-05-09 20:19:54'),
(8, 2, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 8', '2025-05-09 20:44:17'),
(9, 3, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 9', '2025-05-10 19:40:09'),
(10, 3, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 10', '2025-05-10 19:59:20'),
(11, 3, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 11', '2025-05-10 20:01:36'),
(12, 3, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 12', '2025-05-11 13:02:40'),
(13, 3, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 13', '2025-05-11 13:07:51'),
(14, 1, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 14', '2025-05-11 15:37:19'),
(15, 1, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 15', '2025-05-12 08:02:49'),
(16, 5, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 16', '2025-05-12 08:50:10'),
(17, 5, 'BOOKING_CREATED', 'Người dùng đã tạo đặt tour với ID 17', '2025-05-12 08:55:38');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `tour_id` int(11) DEFAULT NULL,
  `booking_date` datetime DEFAULT current_timestamp(),
  `status_id` int(11) DEFAULT NULL,
  `total_price` decimal(38,2) DEFAULT NULL,
  `selected_date` date DEFAULT NULL
) ;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `userid`, `tour_id`, `booking_date`, `status_id`, `total_price`, `selected_date`) VALUES
(1, 4, 8, '2025-05-07 09:39:51', 1, 1.80, '2025-05-08'),
(2, 4, 7, '2025-05-07 10:03:03', 1, 110.70, '2025-05-14'),
(3, 4, 8, '2025-05-07 21:26:44', 1, 2.00, '2025-05-07'),
(4, 3, 8, '2025-05-07 21:32:14', 1, 2.00, '2025-05-14'),
(5, 1, 9, '2025-05-08 19:00:00', 1, 1.00, '2025-05-08'),
(6, 4, 3, '2025-05-09 20:07:46', 1, 123.00, '2025-05-10'),
(7, 2, 8, '2025-05-09 20:19:54', 1, 2.00, '2025-05-10'),
(8, 2, 3, '2025-05-09 20:44:17', 1, 123.00, '2025-05-16'),
(9, 3, 3, '2025-05-10 19:40:09', 1, 123.00, '2025-05-10'),
(10, 3, 8, '2025-05-10 19:59:20', 1, 2.00, '2025-05-10'),
(11, 3, 4, '2025-05-10 20:01:36', 1, 123.00, '2025-05-10'),
(12, 3, 9, '2025-05-11 13:02:40', 1, 2.75, '2025-05-11'),
(13, 3, 3, '2025-05-11 13:07:51', 1, 338.25, '2025-05-11'),
(14, 1, 3, '2025-05-11 15:37:19', 1, 123.00, '2025-05-11'),
(15, 1, 8, '2025-05-12 08:02:49', 1, 3.50, '2025-05-12'),
(16, 5, 3, '2025-05-12 08:50:10', 1, 215.25, '2025-05-16'),
(17, 5, 8, '2025-05-12 08:55:38', 1, 2.00, '2025-05-15');

--
-- Triggers `bookings`
--
DELIMITER $$
CREATE TRIGGER `log_booking_creation` AFTER INSERT ON `bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description, created_at)
  VALUES (NEW.userid, 'BOOKING_CREATED', CONCAT('Người dùng đã tạo đặt tour với ID ', NEW.booking_id), NOW());
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
  `gender` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_passengers`
--

INSERT INTO `booking_passengers` (`passenger_id`, `booking_id`, `userid`, `full_name`, `phone`, `email`, `address`, `passenger_type`, `birth_date`, `gender`) VALUES
(15, 8, 2, 'hoang', '1234567890', 'hoang@gmail.com', 'qew4r3', 'adult', NULL, NULL),
(16, 8, 2, 'hoang', NULL, NULL, NULL, 'adult', '2005-04-07', 'Nam'),
(17, 8, 2, 'abc', NULL, NULL, NULL, 'child', '2012-08-09', 'Nam'),
(18, 9, 3, 'user', '12345678980', 'user@gmail.com', '122', 'adult', NULL, NULL),
(19, 9, 3, 'user', '12345678980', 'user@gmail.com', '122', 'adult', NULL, NULL),
(20, 9, 3, 'user', NULL, NULL, NULL, 'adult', '', 'Nam'),
(21, 9, 3, 'user1', NULL, NULL, NULL, 'adult', '2002-02-01', 'Nữ'),
(22, 10, 3, 'user', '12345678980', 'user@gmail.com', '122', 'adult', NULL, NULL),
(23, 10, 3, 'user', NULL, NULL, NULL, 'adult', '', 'Nam'),
(24, 10, 3, 'abc', NULL, NULL, NULL, 'adult', '2000-02-02', 'Nam'),
(25, 11, 3, 'user', '12345678980', 'user@gmail.com', '122', 'adult', NULL, NULL),
(26, 11, 3, 'user', NULL, NULL, NULL, 'adult', '2000-07-04', 'Nam'),
(27, 11, 3, 'xx', NULL, NULL, NULL, 'child', '2014-02-02', 'Nam'),
(28, 12, 3, 'user', '12345678980', 'user@gmail.com', '122', 'adult', NULL, NULL),
(29, 12, 3, 'user', NULL, NULL, NULL, 'adult', '2000-02-02', 'Nam'),
(30, 12, 3, 'user1', NULL, NULL, NULL, 'adult', '2003-03-03', 'Nam'),
(31, 12, 3, 'user2', NULL, NULL, NULL, 'child', '2014-04-04', 'Nam'),
(32, 12, 3, 'user3', NULL, NULL, NULL, 'infant', '2024-05-05', 'Nam'),
(33, 13, 3, 'user', '12345678980', 'user@gmail.com', '122', 'adult', NULL, NULL),
(34, 13, 3, 'user', NULL, NULL, NULL, 'adult', '', 'Nam'),
(35, 13, 3, 'user', NULL, NULL, NULL, 'adult', '2005-07-04', 'Nam'),
(36, 13, 3, 'user2', NULL, NULL, NULL, 'adult', '2006-11-11', 'Nam'),
(37, 13, 3, 'user3', NULL, NULL, NULL, 'child', '2014-04-04', 'Nam'),
(38, 13, 3, 'user4', NULL, NULL, NULL, 'infant', '2024-04-12', 'Nam'),
(39, 15, 1, 'admin', '1234567890', 'admin@gmail.com', '1234', 'adult', NULL, NULL),
(40, 15, 1, 'admin', NULL, NULL, NULL, 'adult', '2005-04-07', 'Nam'),
(41, 15, 1, 'user', NULL, NULL, NULL, 'child', '2012-02-02', 'Nam'),
(42, 15, 1, 'user2', NULL, NULL, NULL, 'infant', '2024-12-12', 'Nam'),
(43, 16, 5, 'abc', '1234567890', 'abc@gmail.com', 'abc', 'adult', NULL, NULL),
(44, 16, 5, 'abc', NULL, NULL, NULL, 'adult', '2005-04-07', 'Nam'),
(45, 16, 5, 'abc1', NULL, NULL, NULL, 'child', '2014-04-04', 'Nam'),
(46, 16, 5, 'abc2', NULL, NULL, NULL, 'infant', '2024-03-04', 'Nam'),
(47, 17, 5, 'abc', '1234567890', 'abc@gmail.com', 'abc', 'adult', NULL, NULL),
(48, 17, 5, 'abc', NULL, NULL, NULL, 'adult', '2005-04-07', 'Nam'),
(49, 17, 5, 'abc', '1234567890', 'abc@gmail.com', 'abc', 'adult', NULL, NULL),
(50, 17, 5, 'abc', NULL, NULL, NULL, 'adult', '2006-04-07', NULL),
(51, 17, 5, 'abc', '1234567890', 'abc@gmail.com', 'abc', 'adult', NULL, NULL),
(52, 17, 5, 'abc', NULL, NULL, NULL, 'adult', '1999-04-04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_status`
--

CREATE TABLE `booking_status` (
  `booking_status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_status`
--

INSERT INTO `booking_status` (`booking_status_id`, `status_name`) VALUES
(1, 'PENDING');

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

CREATE TABLE `destinations` (
  `destination_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `file_path` enum('image','video') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `rating` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`destination_id`, `name`, `category`, `file_path`, `description`, `location`, `rating`, `created_at`) VALUES
(1, 'abc', 'abc', NULL, 'sgdsfd', 'dfsfd', 4, '2025-04-27 10:23:14'),
(2, 'abcd', 'abcd', NULL, 'âsdgfhjgghfgfdsd', 'dfsfd', 5, '2025-04-27 10:27:31'),
(5, 'abcde', 'abcd', NULL, 'sdfd', 'dfsfd', 2, '2025-04-27 10:33:53'),
(6, 'abc', 'abc', NULL, 'dfsf', 'dfsfd', 3, '2025-04-27 10:36:34'),
(7, 'abc', 'abc', NULL, 'gfdgf', 'dfsfd', 4, '2025-04-27 10:38:19'),
(8, 'abc', 'abcde', NULL, 'dfs', 'dfsfd', 5, '2025-04-27 10:40:37'),
(9, 'abc', 'abcde', NULL, 'cvcx', 'dfsfd', 5, '2025-04-27 11:01:56'),
(10, 'hỏa lò', 'hà nội', NULL, 'ASDFGHJKLJL;HGFGFDSas', 'sđsfdsf', 5, '2025-04-27 15:07:08'),
(11, 'hỏa lò', 'hà nội', NULL, 'fsadfgnhmjnbvc', 'sđsfdsf', 3, '2025-04-27 15:09:45'),
(12, 'bbn', 'vc', NULL, 'cvhbg', 'cv', 3, '2025-04-27 15:28:04'),
(13, 'bbn', 'vc', NULL, 'tyijgjh', 'cv', 5, '2025-04-28 09:15:36'),
(14, 'bbn', 'vc', NULL, 'fgdh', 'cv', 5, '2025-04-28 09:16:57'),
(15, '2', '1', NULL, '1', '1', 5, '2025-05-08 18:45:57');

-- --------------------------------------------------------

--
-- Table structure for table `destination_file_paths`
--

CREATE TABLE `destination_file_paths` (
  `destination_id` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `destination_file_paths`
--

INSERT INTO `destination_file_paths` (`destination_id`, `file_path`) VALUES
(8, '/uploads/destinations/425165ec-3c1b-421c-9776-e1e23796a0cd.png'),
(8, '/uploads/destinations/1cd09c37-9283-4f05-88e0-1045d2eaa1f2.png'),
(9, '/uploads/destinations/eee6d306-fd08-43dc-94cd-5fc4571028c9.jpg'),
(9, '/uploads/destinations/38e83d4f-ddc4-495e-baa9-5529c6b2031b.png'),
(10, '/uploads/destinations/31b7b19d-32ef-47c5-b15d-b4e13a55be63.jpg'),
(10, '/uploads/destinations/7044d7c7-5ddf-4cb4-9c94-3aa97d9a89a1.jpg'),
(10, '/uploads/destinations/e8c7667d-b288-43e4-aae0-213042ebfcca.jpg'),
(11, '/uploads/destinations/f45c5ff0-e559-4b0d-921a-19cc9ce3b008.jpg'),
(12, '/uploads/destinations/a1b38bcc-9b5c-45d9-8995-20a9627b7dd2.jpg'),
(12, '/uploads/destinations/cded28a2-2ad9-41cf-b780-ed8860281785.png'),
(12, '/uploads/destinations/b80ad3b0-52e7-407e-b3c2-a4782256f929.png'),
(13, '/uploads/destinations/67379b6c-b557-49be-8204-60166eab1081.jpg'),
(14, '/uploads/destinations/8d6ada11-c9d0-49ef-a083-5f31d86a0098.jpg'),
(14, '/uploads/destinations/75ed2f4a-dd6d-4034-aecf-1426ed57b08b.jpg'),
(14, '/uploads/destinations/a33fb93d-f821-4aa8-bae8-64a934bc5984.png'),
(14, '/uploads/destinations/eb4eb594-a1df-4422-9b5a-c9fa018ec38b.png'),
(14, '/uploads/destinations/4fffb05b-d631-4035-bb02-c0120e6973f5.png'),
(15, '/uploads/destinations/87e879a2-5856-4eb8-8cdc-f04e7440ad05.png');

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
  `created_at` datetime DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `discounts`
--

INSERT INTO `discounts` (`discount_id`, `code`, `description`, `discount_percent`, `start_date`, `end_date`, `created_at`) VALUES
(1, 'SUMMER25', 'Giảm 25% cho mùa hè', 25, '2025-06-01 00:00:00', '2025-08-31 00:00:00', '2025-05-07 09:00:00'),
(2, 'NEWUSER10', 'Giảm 10% cho người dùng mới', 10, '2025-05-05 00:00:00', '2025-12-31 00:00:00', '2025-05-07 10:30:00'),
(3, 'FLASH50', 'Giảm 50% trong 24h', 50, '2025-05-08 00:00:00', '2025-05-09 00:00:00', '2025-05-07 15:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `ticket_price` decimal(38,2) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `name`, `description`, `location`, `start_date`, `end_date`, `ticket_price`, `status_id`, `created_at`) VALUES
(1, 'abc', 'abcd', 'abc', '2025-04-29 11:17:00', '2025-04-30 11:17:00', 200.00, 1, '2025-04-29 11:17:50'),
(3, 'abc', 'ssfsd', 'abc', '2025-05-01 12:25:00', '2025-05-03 12:25:00', 100.00, 3, '2025-04-29 12:25:47'),
(4, 'abce', 'dfdsg', 'abce', '2025-06-01 12:25:00', '2025-06-03 12:26:00', 100.00, 2, '2025-04-29 12:26:46');

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
(1, '/uploads/events/1745900958169_Screenshot 2025-04-09 102328 - Copy.png'),
(1, '/uploads/events/1745900958170_Screenshot 2025-04-09 102328.png'),
(1, '/uploads/events/1745900958171_Screenshot 2025-04-10 143656 - Copy.png'),
(3, '/uploads/events/1745904347183_download.jpg'),
(4, '/uploads/events/1746185978782_Screenshot 2025-04-09 102328.png');

-- --------------------------------------------------------

--
-- Table structure for table `event_status`
--

CREATE TABLE `event_status` (
  `event_status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_status`
--

INSERT INTO `event_status` (`event_status_id`, `status_name`) VALUES
(5, 'Cancelled '),
(4, 'Completed'),
(1, 'Pending'),
(3, 'Processing'),
(2, 'Triggered');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `tour_id` int(11) DEFAULT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `status_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `feedbacks`
--
DELIMITER $$
CREATE TRIGGER `log_feedback_creation` AFTER INSERT ON `feedbacks` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description, created_at)
  VALUES (NEW.userid, 'FEEDBACK_CREATED', CONCAT('Người dùng đã gửi phản hồi với ID ', NEW.feedback_id), NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `feedback_status`
--

CREATE TABLE `feedback_status` (
  `feedback_status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guide_reviews`
--

CREATE TABLE `guide_reviews` (
  `guide_review_id` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `guide_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `media_id` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `file_type` enum('image','video') DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `notification_type` enum('system','booking','payment','tour','event','feedback') NOT NULL,
  `is_read` tinyint(4) DEFAULT 0,
  `booking_related_id` int(11) DEFAULT NULL,
  `event_related_id` int(11) DEFAULT NULL,
  `feedback_related_id` int(11) DEFAULT NULL,
  `payment_related_id` int(11) DEFAULT NULL,
  `tour_related_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications_archive`
--

CREATE TABLE `notifications_archive` (
  `notification_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `notification_type` enum('system','booking','payment','tour','event','feedback') NOT NULL,
  `is_read` tinyint(4) DEFAULT 0,
  `booking_related_id` int(11) DEFAULT NULL,
  `event_related_id` int(11) DEFAULT NULL,
  `feedback_related_id` int(11) DEFAULT NULL,
  `payment_related_id` int(11) DEFAULT NULL,
  `tour_related_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `amount` decimal(38,2) DEFAULT NULL,
  `payment_method` enum('credit_card','paypal','bank_transfer','cash') DEFAULT NULL,
  `payment_date` datetime DEFAULT current_timestamp(),
  `status_id` int(11) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `payments`
--
DELIMITER $$
CREATE TRIGGER `log_payment_creation` AFTER INSERT ON `payments` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (userid, action, description, created_at)
  VALUES (NEW.userid, 'PAYMENT_CREATED', CONCAT('Người dùng đã thực hiện thanh toán với ID ', NEW.payment_id), NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `payment_status`
--

CREATE TABLE `payment_status` (
  `payment_status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleid` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleid`, `role_name`) VALUES
(2, 'ADMIN'),
(1, 'USER');

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `tour_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`tour_id`, `name`, `description`, `price`, `duration`, `max_participants`, `status_id`, `created_at`, `image_url`) VALUES
(3, 'abcd', 'sd', 123.00, 3, 20, 1, '2025-05-06 13:03:44', '/uploads/tours/9398ed0e-df97-4dfc-8ddd-a47892b4671a_download.jpg'),
(4, 'abc', ' X', 123.00, 3, 20, 1, '2025-05-06 18:51:29', NULL),
(5, 'abc', 'dv', 123.00, 3, 20, 1, '2025-05-06 18:59:14', '/uploads/2e4a2ab9-0617-4564-95de-8ec2d6307871_Screenshot 2025-04-09 102328 - Copy.png'),
(6, 'abc', 'cs', 123.00, 3, 20, 1, '2025-05-06 19:00:24', '/uploads/tour553e3c7b-da7d-46ff-82ef-43b8160c66bb_Screenshot 2025-04-11 211750.png'),
(7, 'abc', 'cs', 123.00, 3, 20, 1, '2025-05-06 19:02:18', '/uploads/tour/bc7eb3ca-e7de-447e-b4f6-51480cb8b7fa_Screenshot 2025-04-10 143656 - Copy.png'),
(8, 'abc', 'fdsf', 2.00, 2, 2, 1, '2025-05-06 19:05:12', '/uploads/tours/de74339c-5df3-4227-b6a6-93b4261b6d16_Screenshot 2025-04-11 211750.png'),
(9, '12', '3', 1.00, 1, 1, 1, '2025-05-08 18:48:09', '/uploads/tours/4a01a70b-ca22-4aec-a02b-1d12e718ddf5_Screenshot 2025-04-14 112246.png');

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
(4, 1),
(4, 2),
(5, 2),
(5, 5),
(6, 1),
(7, 1),
(8, 1),
(3, 1),
(3, 2),
(3, 5),
(9, 1);

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
(4, 1),
(5, 4),
(6, 1),
(7, 1),
(8, 1),
(3, 3),
(3, 4),
(9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tour_guides`
--

CREATE TABLE `tour_guides` (
  `guide_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `languages` varchar(255) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `created_at` datetime DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `tour_guides_assignments`
--

CREATE TABLE `tour_guides_assignments` (
  `tour_id` int(11) NOT NULL,
  `guide_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tour_itineraries`
--

CREATE TABLE `tour_itineraries` (
  `itinerary_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `tour_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_itineraries`
--

INSERT INTO `tour_itineraries` (`itinerary_id`, `created_at`, `description`, `title`, `tour_id`) VALUES
(14, '2025-05-08 15:10:39.000000', '11', 'abc', 3),
(15, '2025-05-08 15:11:14.000000', 'sdss', 'sds', 8),
(19, '2025-05-08 18:57:06.000000', 'ssd', '2', 9),
(20, '2025-05-08 18:59:07.000000', 'fsdgsgfg', 'ưedgfgfdfs', 7);

-- --------------------------------------------------------

--
-- Table structure for table `tour_itinerary_destinations`
--

CREATE TABLE `tour_itinerary_destinations` (
  `id` int(11) NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `itinerary_id` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `visit_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_itinerary_destinations`
--

INSERT INTO `tour_itinerary_destinations` (`id`, `destination_id`, `itinerary_id`, `note`, `visit_order`) VALUES
(16, 1, 14, 'abc', 1),
(17, 2, 14, 'ds', 2),
(18, 5, 14, 'fds', 3),
(19, 1, 15, '23\nThế giớiQuân sựThứ năm, 8/5/2025, 09:06 (GMT+7)\nẤn Độ - Pakistan \'triển khai hơn 120 tiêm kích giao chiến\'\n125 chiến đấu cơ của Islamabad và New Delhi đã tham gia trận không chiến vào rạng sáng 7/5, theo quan chức an ninh Pakistan.', 1),
(25, 1, 19, 'dfdff', 1),
(27, 1, 20, 'fsd', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tour_itinerary_events`
--

CREATE TABLE `tour_itinerary_events` (
  `id` int(11) NOT NULL,
  `attend_time` datetime(6) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `itinerary_id` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_itinerary_events`
--

INSERT INTO `tour_itinerary_events` (`id`, `attend_time`, `event_id`, `itinerary_id`, `note`) VALUES
(10, '2025-05-10 15:08:00.000000', 3, 14, 'sds'),
(11, '2025-05-10 15:08:00.000000', 4, 14, 'đá'),
(12, '2025-05-22 15:11:00.000000', 1, 15, '23\nThế giớiQuân sựThứ năm, 8/5/2025, 09:06 (GMT+7)\nẤn Độ - Pakistan \'triển khai hơn 120 tiêm kích giao chiến\'\n125 chiến đấu cơ của Islamabad và New Delhi đã tham gia trận không chiến vào rạng sáng 7/5, theo quan chức an ninh Pakistan.'),
(17, '2025-05-09 18:57:00.000000', 1, 19, 'fdfd'),
(19, '2025-05-10 06:59:00.000000', 1, 20, 'sfsg');

-- --------------------------------------------------------

--
-- Table structure for table `tour_status`
--

CREATE TABLE `tour_status` (
  `tour_status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `sta` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_status`
--

INSERT INTO `tour_status` (`tour_status_id`, `status_name`, `sta`, `status`) VALUES
(1, 'Pending', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `translations`
--

CREATE TABLE `translations` (
  `translation_id` int(11) NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `column_name` varchar(50) NOT NULL,
  `record_id` int(11) NOT NULL,
  `language` varchar(10) NOT NULL,
  `translation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 2),
(2, 1),
(3, 1),
(4, 1),
(5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` bigint(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT b'0',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `full_name`, `email`, `password_hash`, `phone`, `address`, `is_active`, `created_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$10$WdqAhzCUR0tK0zGjS1a6wuGoBN/Ip76zvCP71GJHcmzvj7uZfEj0u', '1234567890', '1234', b'1', '2025-04-27 09:28:44'),
(2, 'hoang', 'hoang@gmail.com', '$2a$10$JstBitgZjR94A.PlGRkk8.5.48iW3X/iWatb/pb5IEju6YCLf6/F6', '1234567890', 'qew4r3', b'1', '2025-04-28 09:19:05'),
(3, 'user', 'user@gmail.com', '$2a$10$WQOV4rgvRmQK.29ttkXz7u8YVd93zqhacJwcqXxHDEZbgKNuOoC9i', '12345678980', '122', b'1', '2025-05-07 08:50:35'),
(4, 'user2', 'user2@gmail.com', '$2a$10$8ch6ArCamiIikVd7NpKfjuvjqqOLzIwB8OozVyCiuQG3fV5wCzvPW', '1234567890', '1232', b'1', '2025-05-07 09:02:41'),
(5, 'abc', 'abc@gmail.com', '$2a$10$rtmC9PbARg2q2fbPuDzyLOPg4g0lFJDVMq.WHQf7pwRyvit.lnQEi', '1234567890', 'abc', b'1', '2025-05-12 08:49:02');

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

--
-- Dumping data for table `usertokens`
--

INSERT INTO `usertokens` (`tokenid`, `userid`, `token`, `expiry`, `createdat`) VALUES
(1, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjA5NTAsImV4cCI6MTc0NTc1Njk1MH0.PVeyqojPuGBNDQUAWcwRvPBDDTPno6VWHDDZBGZuPJFIVxrTHaT6rNtjrvPT0Tm8XGUOpVeB6E9gA0nL58UD2g', '2025-04-27 19:29:10', '2025-04-27 09:29:10'),
(2, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjA5OTAsImV4cCI6MTc0NTc1Njk5MH0.ujMlpqaEeEQnGk-93Lzd_wwDIz2TiF0RyXYbF9mSopBzfNg8h0foRMW3UuX2rcF6IxENSGfVUUCz_i_ZvS5vsA', '2025-04-27 19:29:50', '2025-04-27 09:29:50'),
(3, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjEwMTYsImV4cCI6MTc0NTc1NzAxNn0.mi9nA9lOlUA-fz_bs4gfBn4zkvGBC2g2nZjuc1N7m1eihgQf1DHzprkK8Gc4PYkZUzgewe8-wSIbjXKn3FA8ow', '2025-04-27 19:30:16', '2025-04-27 09:30:16'),
(4, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjEwMTcsImV4cCI6MTc0NTc1NzAxN30.OiKRLwPEVSS6_QbBuQbKjDI5xpmQ0T3vsyGwhYkCQuDDERt_D5ChapSZzI1XwMVwU-bkIv09qhPPQAgg3Uk4tQ', '2025-04-27 19:30:17', '2025-04-27 09:30:17'),
(5, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjEwMjAsImV4cCI6MTc0NTc1NzAyMH0.DT8mBdWMce-I9rVgXYk2zn_kuEXKQsyCqEHkt0amcH_W4hqofi1ujJeDBStHBxLLm_pypIYQgSlVQyGE1wtzvQ', '2025-04-27 19:30:20', '2025-04-27 09:30:20'),
(6, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjMxOTEsImV4cCI6MTc0NTc1OTE5MX0.TF51hSDqxZ3BTuRBECjLQvmIsWCFh16AkOfw8-ixTE9hZzlPD64ml3a4dp98WxY1nq4z-Zi6UtvzhI6ap_PixQ', '2025-04-27 20:06:31', '2025-04-27 10:06:31'),
(7, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjMyNDUsImV4cCI6MTc0NTc1OTI0NX0.3nykf-JHV4cAyWWM137NfbT9q9L3_OH7YDhh1bc8ZvLd7YOv2i4azWPoA5ZnEgX0E_vYRA-_wHZm03oMw66oow', '2025-04-27 20:07:25', '2025-04-27 10:07:25'),
(8, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjMzNDksImV4cCI6MTc0NTc1OTM0OX0.13lNhRRLEc5b4XK8jEzHteFe6tQaFtsxf0xh6kYgYGWL38G4cPmwkIBCJiMhmjJLiWjovn0u040o0lPyMHXVVw', '2025-04-27 20:09:09', '2025-04-27 10:09:09'),
(9, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjM0OTUsImV4cCI6MTc0NTc1OTQ5NX0.RGtCt8d3aCob0SIuDd01qv0-K_vPATanHbxaEtQWraC8uchtQ_hcVkZlRbKW9rs791EF3KfTbsVSBfeJJofBaA', '2025-04-27 20:11:35', '2025-04-27 10:11:35'),
(10, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjM4NDIsImV4cCI6MTc0NTc1OTg0Mn0.mjdB3hpE0hWXS9WWGFXTi27VZjCM1ge80kWSyax8-5QxuAF7v-WvOb-paNpSFMQb5lL4CW977xRC9VJ1tqIM-g', '2025-04-27 20:17:22', '2025-04-27 10:17:22'),
(11, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjgyMTcsImV4cCI6MTc0NTc2NDIxN30.ft06wBDl_iAkC1wP4X2KbVGu7vUTZhcFGsbHG4ADU3NekeEwAPbR9BSqAQCcY_lH_3YpCMF2m5tcw99MVZjURw', '2025-04-27 21:30:17', '2025-04-27 11:30:17'),
(12, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MjgyNjUsImV4cCI6MTc0NTc2NDI2NX0.ihctRWFOgIsKM5imjcwULpwLKdJMmZ1ekcy46s8RD7T_hQU97hKZLsb2F89H3YeYc-clCZaI7tjI5l5FsXGMwA', '2025-04-27 21:31:05', '2025-04-27 11:31:05'),
(13, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MzAwMjQsImV4cCI6MTc0NTc2NjAyNH0.F7BMWfdPTko8giDSl2oa-REgn6OoeLZKHsHtoC-FYuxVir4F2AfMcyNrs5uAUz6BIQ-_GlDjk2PJSANBRhshvg', '2025-04-27 22:00:24', '2025-04-27 12:00:24'),
(14, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MzA0ODgsImV4cCI6MTc0NTc2NjQ4OH0.E8-ChGhUIXQ4MEDhBw3u6hx0SmGaavIgaSf8cA7jvvp1YTMHVT_BrNC2Aw3sbcwtkH0kz5yLSTpRSsKheKKoOw', '2025-04-27 22:08:08', '2025-04-27 12:08:08'),
(15, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3Mzc4MDUsImV4cCI6MTc0NTc3MzgwNX0.jbcbZQJMzoq_9ydl81YTL57hnpnr7I7FeoL7Sq9iPHQq3LSTc8k_4dQI8ZNmchmdwA7uQotouHxqtkEL4KI8VA', '2025-04-28 00:10:06', '2025-04-27 14:10:06'),
(16, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MzgwMDEsImV4cCI6MTc0NTc3NDAwMX0.hW9QAjNBvwtt7ldDLr4seshXVjzvo8cY-Px-sl0YgeS2naELKLjLdThxlctNrMZJ1FYX80_mku2dd0fzwnouDg', '2025-04-28 00:13:21', '2025-04-27 14:13:21'),
(17, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MzgwMDQsImV4cCI6MTc0NTc3NDAwNH0.Q6VzTk-BswkAzM3kAeKjzaVKBEeGgoM3MpVHnVOnEiSburuYtPEv4C5Uqld-OvMSIuBd7uSSlxgpCqtMP3ARdA', '2025-04-28 00:13:24', '2025-04-27 14:13:24'),
(18, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3MzgwMDYsImV4cCI6MTc0NTc3NDAwNn0.33p1Y3DfkouFyhaKGmcCsnm5uLZ-cJ2OSsp7hIGtz2QSUh1wUtCSwwqoOjBDpBZYPUu_4wrV8tCfjfXDVTE9Kw', '2025-04-28 00:13:26', '2025-04-27 14:13:26'),
(19, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3Mzk1NDYsImV4cCI6MTc0NTc3NTU0Nn0.eC2gZvqJlGcpAgBsA8isDPtc3CjPcahffg23Su1jd2tjxnchni_5Kzhtyb-YR4AeZeR7ZOpzeshrWpwe010WBQ', '2025-04-28 00:39:06', '2025-04-27 14:39:06'),
(20, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3Mzk1NDksImV4cCI6MTc0NTc3NTU0OX0.U82SQtlNSAh5-ZSRLri6NIFveCoT3cP6oha4p6MValBU18qqXvWxdtaLsgNRVndJCAnG46mQiXdD_BRxFZRGHQ', '2025-04-28 00:39:09', '2025-04-27 14:39:09'),
(21, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3Mzk4OTMsImV4cCI6MTc0NTc3NTg5M30.EFkPBpXfrKtcEj7iyH7SqnW5H0Lv38lP1tZJpkni9hqQp6ZpJSwS_Rn6Ior3kWBJeGC-XJ3W2pk-ZBvYvd3MKw', '2025-04-28 00:44:53', '2025-04-27 14:44:53'),
(22, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3Mzk4OTYsImV4cCI6MTc0NTc3NTg5Nn0.lZuu6l_CsslpoPs5yc9F3tEXHKARCp-mT99L14OsYgbGRM9oHve4j1goZckOfsQIbP0tDwlkTLEO42p_MBnXjA', '2025-04-28 00:44:56', '2025-04-27 14:44:56'),
(23, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDA2NTksImV4cCI6MTc0NTc3NjY1OX0.b3tlOCIG7SrVQj7hK8jbRkZ1ZtD4Apnv-sCzcYO--1mYZfMI7uhzb9PoFggRtxl4Lhxou-_yErIwlI6JPGUq3Q', '2025-04-28 00:57:39', '2025-04-27 14:57:39'),
(24, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDA4MjcsImV4cCI6MTc0NTc3NjgyN30.Ky2NbHmGWcP13zqDe11SNDaK0ZMOCsf3NulWg_CREnSUayG6CqkHrupY3lIeuyOMmK-bqeMOuHd2lDTPGGnXyQ', '2025-04-28 01:00:27', '2025-04-27 15:00:27'),
(25, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDA4MzAsImV4cCI6MTc0NTc3NjgzMH0.Bsq6VGILdEtRu_wC9f--3J6blBi2NAbWURMk5rQSbFypI8TlwIX1S5EOWEoWraxJLdTqgbFegIRB_y1xBEOYMQ', '2025-04-28 01:00:30', '2025-04-27 15:00:30'),
(26, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDExNTIsImV4cCI6MTc0NTc3NzE1Mn0.K6tqBEfb_iwAEW59dDRgZZAXykppiMo5P4zLGqDSFgdGsJLxq-XFuB7S1VbFJNsUDjClGp4tbQFvONonejMXkw', '2025-04-28 01:05:52', '2025-04-27 15:05:52'),
(27, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDExNTIsImV4cCI6MTc0NTc3NzE1Mn0.K6tqBEfb_iwAEW59dDRgZZAXykppiMo5P4zLGqDSFgdGsJLxq-XFuB7S1VbFJNsUDjClGp4tbQFvONonejMXkw', '2025-04-28 01:05:52', '2025-04-27 15:05:52'),
(28, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDExNTUsImV4cCI6MTc0NTc3NzE1NX0.sV2Bd0vlDSMC00OpfIJAvoPD8f_fDcq6_QxnuUAOIHp3R2fAGGIX7iMTCeCW1qTk31u3PZRipEDxboJIokU7xQ', '2025-04-28 01:05:55', '2025-04-27 15:05:55'),
(29, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDIwNTcsImV4cCI6MTc0NTc3ODA1N30.mh65yalu7UdIprWYAjuCNl7mFChWk6BJfD8uNahAsF15yZo9VFi_zA2de907KCNXnrur_WR9HzTT2b1H2d85HA', '2025-04-28 01:20:57', '2025-04-27 15:20:57'),
(30, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDIxNjEsImV4cCI6MTc0NTc3ODE2MX0.kO4rKv2C7wtJ-tka1uXWIPg4ECnr5jjSUxjDdN5X5oIR-RkAcSfMrhceFSDLak3doDMzIaxskgTzFI3KKCUJjg', '2025-04-28 01:22:41', '2025-04-27 15:22:41'),
(31, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NDIyOTIsImV4cCI6MTc0NTc3ODI5Mn0.MUJfwawh1znnWRolIUfLwc05diw6AvjHHQcrzIyE6Bj2K6UWz7GxD4AVovUnlNyNcSoP9ho9vLDWShhS1X1LxQ', '2025-04-28 01:24:52', '2025-04-27 15:24:52'),
(32, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU3NTg0MTYsImV4cCI6MTc0NTc5NDQxNn0.R_ad6Je7R-5h8vYXl9awZ_Y2LQtR8Lt8FMPV2xbt8jelcrcWOzx6ISjUyyWeSLyvU_k7waJao7Va-1v0FNQrxw', '2025-04-28 05:53:36', '2025-04-27 19:53:36'),
(33, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDYzNDUsImV4cCI6MTc0NTg0MjM0NX0.qNtOgV5K42boiWbGs7PYgVaisccTq99xHWGqkSDehbZpBAUo0AKQPkw29Zt4wNexIpDP86NO3QJHOk-lhF6kzQ', '2025-04-28 19:12:25', '2025-04-28 09:12:25'),
(34, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDYzNDgsImV4cCI6MTc0NTg0MjM0OH0.NfZQdZKj7nJ-DhP2q_ZuSGqXJDpbge-QysIDytR4XeVMoOleMfFT_FWCSLiL7C2c6PlFsc-6N7ZYaG3YDFTa2w', '2025-04-28 19:12:28', '2025-04-28 09:12:28'),
(35, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDY3NzUsImV4cCI6MTc0NTg0Mjc3NX0.KfOcvyZqR6F-nPkiFDIX3hsInOsB8XnWLjycMdU1wkW8TTWH5tI9evULsB6Rcq9DEi5Ex42Ww9z4ZQJUF9T6AA', '2025-04-28 19:19:35', '2025-04-28 09:19:35'),
(36, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDY3NzksImV4cCI6MTc0NTg0Mjc3OX0.lszPNr787tgGln5tl0Mt1f5QKQBb8jISjt8lTxEFrLqYKYnfMyhIOfjqV1LnMMxJAjLUes3JNHZOhoyQ2ImxqA', '2025-04-28 19:19:39', '2025-04-28 09:19:39'),
(37, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDY3OTgsImV4cCI6MTc0NTg0Mjc5OH0.i2z5py7zzFgHIBlPDVDVXkz87kf8bGbsphyXbi_mmTOeSAKECNQ5QlyiorG1_5POPb_7I4OjUeyRy-wBPT8sLg', '2025-04-28 19:19:58', '2025-04-28 09:19:58'),
(38, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDY4MzksImV4cCI6MTc0NTg0MjgzOX0.FI9ConizyDvS86zJQUdYo4SWPTNyShAf6hR3RmwDF2w4psHZtLbCflHF9kIi6Tmc71knMuj4CzIYnfTTDYqFrQ', '2025-04-28 19:20:39', '2025-04-28 09:20:39'),
(39, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDY4MzksImV4cCI6MTc0NTg0MjgzOX0.FI9ConizyDvS86zJQUdYo4SWPTNyShAf6hR3RmwDF2w4psHZtLbCflHF9kIi6Tmc71knMuj4CzIYnfTTDYqFrQ', '2025-04-28 19:20:39', '2025-04-28 09:20:39'),
(40, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDY4MzksImV4cCI6MTc0NTg0MjgzOX0.FI9ConizyDvS86zJQUdYo4SWPTNyShAf6hR3RmwDF2w4psHZtLbCflHF9kIi6Tmc71knMuj4CzIYnfTTDYqFrQ', '2025-04-28 19:20:39', '2025-04-28 09:20:39'),
(41, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDY4MzksImV4cCI6MTc0NTg0MjgzOX0.FI9ConizyDvS86zJQUdYo4SWPTNyShAf6hR3RmwDF2w4psHZtLbCflHF9kIi6Tmc71knMuj4CzIYnfTTDYqFrQ', '2025-04-28 19:20:39', '2025-04-28 09:20:39'),
(42, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4MDY4NDQsImV4cCI6MTc0NTg0Mjg0NH0.W2yQpa_5swFrs25DeJYturO7XKKUe4PFK0e-sYe6SFGQqKtq6Bar2czyJGQLjuC6sdZVX0JJKGE_FOHONqbmCw', '2025-04-28 19:20:44', '2025-04-28 09:20:44'),
(43, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU4OTk4MTEsImV4cCI6MTc0NTkzNTgxMX0.3JX52JadPwjjHGzAmSg3GSfht6qVxhhPqYasx4TA5ZTezqLqF5bq74QaK_EgjQb2yWT5Vjulgv4DQ4H15NX1iw', '2025-04-29 21:10:11', '2025-04-29 11:10:11'),
(44, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDU5MDAwNzIsImV4cCI6MTc0NTkzNjA3Mn0.8Y1mtwxciVl7q3_893B0EeGQZFbuWOFcbmhm4Lx1OD-_HbuRBTFCtUogotcTK2saWRiyHwJRqTE8qL0NBLwkOQ', '2025-04-29 21:14:32', '2025-04-29 11:14:32'),
(45, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDYxODQ1NDUsImV4cCI6MTc0NjIyMDU0NX0.B37kWOUxSBlZbTD9H2SpyU95OQLabftmt8IPjSMybqQIMuRGXn_SRD9SWQqMvjsOJDAw-ta1ia64zwDaGwaTzQ', '2025-05-03 04:15:45', '2025-05-02 18:15:45'),
(46, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDYyMzIwMjEsImV4cCI6MTc0NjI2ODAyMX0.s9SSH3IpO0cQYaPKDPNl-JofdmfJu86W_D4gAtELrpBNmnRcNg14fDvZUu3T5xDRk9BpOFuqtG5u3ioNEiYmmg', '2025-05-03 17:27:01', '2025-05-03 07:27:01'),
(47, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDYyMzIwODIsImV4cCI6MTc0NjI2ODA4Mn0.xf61fgcIsenpWflIE4VZ-vm5rbcCP3BDZIv5vkpEO1sQHoIZGtz1yKKwdmdqvY6APEgIZtVNTOaBoLq75za30g', '2025-05-03 17:28:02', '2025-05-03 07:28:02'),
(48, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY0MDg3MjksImV4cCI6MTc0NjQ0NDcyOX0.sflT098Bl8tKL3XzHUiL-kOhuqtj4qMwQMjjxuCjJ8GvbKM7m8woYYblrRGrvZVPPx-Q4B_wZNUf9OJPNoHAUg', '2025-05-05 18:32:09', '2025-05-05 08:32:09'),
(49, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY0MDg3ODMsImV4cCI6MTc0NjQ0NDc4M30.ycZBNuAnWZSe_J8Bfkn8NKLXeb3ovwmWXlXHwSLxnMjFh1B6hO3dG1yYtBCY4YeXeg5BQFOwtEOIVLk67JimQQ', '2025-05-05 18:33:03', '2025-05-05 08:33:03'),
(50, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY0MDkxMTIsImV4cCI6MTc0NjQ0NTExMn0.eSB9Rw6THkNtkiU6_LoGyyOznQzXWMnzZ-TbKqgleO3gbFiPw3j_m9jy1jFfoK9CaLk5rkrJRCFJFU1TgN6MeA', '2025-05-05 18:38:32', '2025-05-05 08:38:32'),
(51, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY0MTQwOTMsImV4cCI6MTc0NjQ1MDA5M30.R2GMeaDmwyaoeYJA3rC9N7df2FPYjALL4FJnri3Tmb192Y660tUU8ZMG_B2Yb3yOZ94ozn6r9IrZKeQyrDuIAg', '2025-05-05 20:01:33', '2025-05-05 10:01:33'),
(52, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY0MTY1MjcsImV4cCI6MTc0NjQ1MjUyN30.OerlF196ILWXEGkYGyctuku_9YNV2sntieG1tpu-oBCRbfHZtGZTYD9zScMyWZHogrn4WQTt-DiSHPUDQctolw', '2025-05-05 20:42:07', '2025-05-05 10:42:07'),
(53, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY0Mjc0OTIsImV4cCI6MTc0NjQ2MzQ5Mn0.GNf_X_FU5ENBOg3btimJo8V3zxEqPshV6b4eLc3Ip3KLZV80CY2ERbN_GTvqUjIeGQOc3hb9hR3iANsx_QFVxQ', '2025-05-05 23:44:52', '2025-05-05 13:44:52'),
(54, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY0MzA3ODQsImV4cCI6MTc0NjQ2Njc4NH0.kI6I0Fz-V-yfMlGQ7ZpL-JS453KPNNrl88MPoM691UjiO1r0KQZOUTBzFfj78zYtx4TkzqULRUk3hJ575smKkA', '2025-05-06 00:39:44', '2025-05-05 14:39:44'),
(55, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MDc4NTAsImV4cCI6MTc0NjU0Mzg1MH0.W7l5LqyyCQbAt5V7qxFwclHW0G5A62YtGDqEgog-bkLazdMLH5ZV6BwlDtNXZXBEN6niCoMUfnWENTE08QMhrA', '2025-05-06 22:04:10', '2025-05-06 12:04:10'),
(56, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MDg5MjAsImV4cCI6MTc0NjU0NDkyMH0.sOdHXGs2_o5zIFEeSHqUhZNwzVuSJyDBAqNAEpD73N93cj-FCowthuiId4RlbAmG75-nWBQU7OAK8NGY8tj_2g', '2025-05-06 22:22:00', '2025-05-06 12:22:00'),
(57, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTAzNzAsImV4cCI6MTc0NjU0NjM3MH0.6lhB1a-atgqQHfBj4C-8sAeWrs6YOgMHMXuNXRWt9dklOIGLExTqAc3SFdyz2O6yFCVKox0YQm2xL4iGJ6jOQQ', '2025-05-06 22:46:10', '2025-05-06 12:46:10'),
(58, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTA1MzAsImV4cCI6MTc0NjU0NjUzMH0.goV7kR-8IhHVEFq9g-I1HJNZOS3nWRyjdCo808_mJvta5zkh_lS_GQU9hikDLh5ZWHdAUu3yaGd8JAXC5mBcjw', '2025-05-06 22:48:50', '2025-05-06 12:48:50'),
(59, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTA2MjcsImV4cCI6MTc0NjU0NjYyN30.-aI5GGl5hP7CqMMEdlntBPPNLzYy0Cz1nCOtjuECrZuy071lRLgBFs49IUA3vUYTznU01tDA73fMhtQPBxRS6A', '2025-05-06 22:50:27', '2025-05-06 12:50:27'),
(60, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTA4ODcsImV4cCI6MTc0NjU0Njg4N30.GAGaD5K894Z76uAnzuo9Jk606rJuoE9YaAjwAURDt5Thd4LXK_Iid1sLG4_PTs59Mp1jqtTiZTYPVcz_9bgLrg', '2025-05-06 22:54:47', '2025-05-06 12:54:47'),
(61, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTA4OTUsImV4cCI6MTc0NjU0Njg5NX0.HqVE7sk24KaBufW5iq3tSUg_WYuQqGQ0mrR38mbI06s0mePER4cBlCpik0i4yd_8SqsVXeaqD6-6mLuTjdJ3ag', '2025-05-06 22:54:55', '2025-05-06 12:54:55'),
(62, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTA4OTgsImV4cCI6MTc0NjU0Njg5OH0.591GfKhszwj6RjtOoN1GKKhKkuVrJcOsefQ1b5ugTlsjIXVwEIJde67CcB9mTmDtK5D1sPujLludDfd72ONQGA', '2025-05-06 22:54:58', '2025-05-06 12:54:58'),
(63, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTA5MDIsImV4cCI6MTc0NjU0NjkwMn0.qCYge4Bifl5jf7-g6aVmUlw6KRZV4YAIsqQnPmjoV4CWELVN72JaSQ8_SpMoZQPcXHY_EGZfZERYABoO4Xb90Q', '2025-05-06 22:55:02', '2025-05-06 12:55:02'),
(64, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTA5MDcsImV4cCI6MTc0NjU0NjkwN30.2J07fZej92YXRzTvmDuU-1i-wAvmYBlu1Az1VAihTgCITqx7M4VmVM7ZLbVxPMiAZGo5wT-q3_QQz-NGJFWstA', '2025-05-06 22:55:07', '2025-05-06 12:55:07'),
(65, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTA5MTMsImV4cCI6MTc0NjU0NjkxM30.f70bslMMxIQmGtdgydLNKgy-FofdxlQ0ccaaE_kiqRFaOYCpQxQaVfZUy8_-qrD7pXUXKIF8npmz_XTSVYPong', '2025-05-06 22:55:13', '2025-05-06 12:55:13'),
(66, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MzE1OTcsImV4cCI6MTc0NjU2NzU5N30.IGNHiqBY8koeBl5pW1GyERHwVGlQ7kX_jGcaQonuQQFpLky2aP02KJk3w0-jgFiDPMEgT2wGXWl0ZR2gjHVDlw', '2025-05-07 04:39:57', '2025-05-06 18:39:57'),
(67, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MzQwODIsImV4cCI6MTc0NjU3MDA4Mn0.vEkAr0BmEKztsRiPlk6ojl5F-4rFkJnCKkEGhmWOIvfdEYKifxUcydO9VsHFHdC2aocQ3K3uSmX0W8FoYa4mNg', '2025-05-07 05:21:22', '2025-05-06 19:21:22'),
(68, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MzQwODUsImV4cCI6MTc0NjU3MDA4NX0.zuuwNw6_XT7-b_nxdfjXRd5boBUnu-P9PGqxZ6UVG8OY6E77GcMxSrtGPm6wJoV0B98YVWuI--97BdqUL-W1hg', '2025-05-07 05:21:25', '2025-05-06 19:21:25'),
(69, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MzQwODYsImV4cCI6MTc0NjU3MDA4Nn0.u1aO90aUCX8PwusCK8SlA4CIdFsQ3zPoeM53R29PkjWjpgGPwSMUGrnD51pkQWZa61_hVyMfk50LQbfaBxjBlA', '2025-05-07 05:21:26', '2025-05-06 19:21:26'),
(70, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1MzQwODgsImV4cCI6MTc0NjU3MDA4OH0._xU_9bbuFpDi219NSZv-molTzod24xdKscZrAEcQwcgCGhQApXSh_V8oqH6I0qC9zy7RX49BoBfPyPeShvy_KA', '2025-05-07 05:21:28', '2025-05-06 19:21:28'),
(71, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODAzNzgsImV4cCI6MTc0NjYxNjM3OH0.9KwrtjIOWUHryi-gzafzVmG6d5AKr0oUfaXfMypZJBhA-doK5GtLso8-wuUr4ciyXeXCiNcRfM6TNfOZjLH5-Q', '2025-05-07 18:12:58', '2025-05-07 08:12:58'),
(72, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODA0NjksImV4cCI6MTc0NjYxNjQ2OX0.um7LE7NbOsQkIZpnYJMmds6FnHq_xOCqPGPqiUAlK_orWqW2CuIShckgxOu6dRJORK6CvRHSkWjp-du5sygBlw', '2025-05-07 18:14:29', '2025-05-07 08:14:29'),
(73, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODA0NzQsImV4cCI6MTc0NjYxNjQ3NH0.6pXQKLgTBwaEN-L5MpP7s20Uokb37NLNhA-8yqSKX1Lo1Dtcjv81MmQ3AXr7CRfQ0m9V7zVyhYkD-uYfZu1e8Q', '2025-05-07 18:14:34', '2025-05-07 08:14:34'),
(74, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjU4MjY2MCwiZXhwIjoxNzQ2NjE4NjYwfQ.nWZ1iBNN38KWJKkfr9rh3hssz-Ltko-GzSJ6AOUSZS-WTqXlLuHKs4jTbBYiYMZ84A6zfip4ixqMp-y_jJtUyg', '2025-05-07 18:51:00', '2025-05-07 08:51:00'),
(75, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODM0MjEsImV4cCI6MTc0NjYxOTQyMX0.RwsFfJrhE9cTjulMsl98_j9cvCFePBLjWXhnj5gy5YiYOfgTpQ4HOFg5Na8y38WkJ4pNPJAkOPU5WIICkD4OKA', '2025-05-07 19:03:41', '2025-05-07 09:03:41'),
(76, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODM0MzAsImV4cCI6MTc0NjYxOTQzMH0.d5W3r2Y3gHOTOYA2a2M-ZCXBoj2XdmfR2Ea0jnM1N5W8yeBHmTbQBop1xSsxFIqMPrcRm3eY452wk-cAzJ2G5Q', '2025-05-07 19:03:50', '2025-05-07 09:03:50'),
(77, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODM3NzUsImV4cCI6MTc0NjYxOTc3NX0.XGLZWTfd_Pa9PltkW_NqLR4XyHkBVHq7AYzVZm9tkFZrIKfQZ2hO9uGV20U4MDuHrXhIg8M3upDSzrnu87X6Uw', '2025-05-07 19:09:35', '2025-05-07 09:09:35'),
(78, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODM4OTksImV4cCI6MTc0NjYxOTg5OX0._-O0U6FfD07YLQjK2NpkweU_V0W4YBQ2l2LFtjpCYN_C0HhBKFpwFFw002jpya3gxuG8y2wOtVHeotyTJcPuQw', '2025-05-07 19:11:39', '2025-05-07 09:11:39'),
(79, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODM5NTIsImV4cCI6MTc0NjYxOTk1Mn0.IvikhQ1hccNBLiReipNhHILP1mOvwvpvZrSKdJn6GgYYkK2kqdxT7IrmEz7ydTXjeVSskkHfIXvRJNSLDyJjsw', '2025-05-07 19:12:32', '2025-05-07 09:12:32'),
(80, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODQwMTIsImV4cCI6MTc0NjYyMDAxMn0.RVKZ-iY5PddWNZ_RnL_ob3AgjQ4NGWKL1jU0HTk8RidfyB8dSdsp-XEnnLairKBT2K2OFI1AjpBNF26TZe33jg', '2025-05-07 19:13:32', '2025-05-07 09:13:32'),
(81, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODQ4MDcsImV4cCI6MTc0NjYyMDgwN30.-tVov4RrLXcBImX7OOa6TvFYV9DTTk0yfm8m-_AWPC7eY1QFb1BqOoJkAKQrdLFcIvgf56xXNZh1BpxzTl3qkQ', '2025-05-07 19:26:47', '2025-05-07 09:26:47'),
(82, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY1ODUxOTEsImV4cCI6MTc0NjYyMTE5MX0.sGalYcz4U-eMjyOctawgWN8lLT-xfJgrs5ILZPIfUPaFNwzE9EK-2DmJI23JtStGvrHIuOdmL1QdWPPqDej-5w', '2025-05-07 19:33:11', '2025-05-07 09:33:11'),
(83, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2MjI1MjgsImV4cCI6MTc0NjY1ODUyOH0.h0K2TtKjg2J12cBFypJakDJq0V7jwzZnlkSEkE85Qa1d8xmmSeayQuw2L5DG76fy1qLiLi1yTOoAbDCKw9qQTQ', '2025-05-08 05:55:28', '2025-05-07 19:55:28'),
(84, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2MjI1NDIsImV4cCI6MTc0NjY1ODU0Mn0.BPuhVz7Bes2bOZJ05dRHoBDiTc8SajzRwMx72--XYop4DRSzXSJm31mMrq6r3rXQNzIiUZAEoouF-WC9IPKFOw', '2025-05-08 05:55:42', '2025-05-07 19:55:42'),
(85, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2MjI2NzksImV4cCI6MTc0NjY1ODY3OX0.rmZ0VhxmSKAdLTkjzMoexAshSROvdalwQbL7Ga2S2x6zy8ckTyg_bHfW5E0I05Vgdg_Kn6NMSOykZTjxf4qKCw', '2025-05-08 05:57:59', '2025-05-07 19:57:59'),
(86, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2MjI2ODMsImV4cCI6MTc0NjY1ODY4M30.XzL6u9dfgUTIKu2H5LEtvubu0UNPdGD1T1fh-0onyv-eBBHuLfqeWCyz0tmsS36MEvWbINepyC1Ygtq0y2qqIQ', '2025-05-08 05:58:03', '2025-05-07 19:58:03'),
(87, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2MjY2MTIsImV4cCI6MTc0NjY2MjYxMn0.pBzGsh4a3hUs1GDc89liydU5DMg1r8fyoav7bd9vP4fYO7aiEwkruGSbd6VO3JBe-Fk8s7MU1ePGcSJJynrbsQ', '2025-05-08 07:03:32', '2025-05-07 21:03:32'),
(88, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjYyNjcyOCwiZXhwIjoxNzQ2NjYyNzI4fQ.pDK7_oQBf5NOsUm_182RxXhavVbGNOzH3H9NBjY32tduswgbYvLMKFjxxWBw6J9E-Pp9u3TPqw7WtbKxz_dBkQ', '2025-05-08 07:05:28', '2025-05-07 21:05:28'),
(89, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjYyNzI2NywiZXhwIjoxNzQ2NjYzMjY3fQ.CWRl4PNHglkY1on3bpJaLdATTPNiWUosX9IidM5AeFzqSswhbHounFB78_sT-eQCwC-PcfYKF4SQcwDnZlNd9Q', '2025-05-08 07:14:27', '2025-05-07 21:14:27'),
(90, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjYyNzQ2MSwiZXhwIjoxNzQ2NjYzNDYxfQ.WshriMMZ6wEGVsqQq2AF4zXnMfqQbEZSMRVPNK1GeaYRQkrhVcEbo2zi4Qpt4i6n3lnReChi3Cmy2pnnZIdecA', '2025-05-08 07:17:41', '2025-05-07 21:17:41'),
(91, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Mjc2MTIsImV4cCI6MTc0NjY2MzYxMn0.byRiZopBoKan_3nzSrikJuPWua_ILX_8KX9kam8rb_PoCyUEWCjRZqEuhLuyc47yRTs_tX2BrIUmpB2wUp0kYg', '2025-05-08 07:20:12', '2025-05-07 21:20:12'),
(92, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Mjc2MzcsImV4cCI6MTc0NjY2MzYzN30.R_HbrYKoKIlebKadMYFP_HEqJXlCrelwSW-1vtb0WMsgcKJBsENYgSvcubJhAYVnu49CeS1DyoIKDWn7TWlhaw', '2025-05-08 07:20:37', '2025-05-07 21:20:37'),
(93, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Mjc2NDMsImV4cCI6MTc0NjY2MzY0M30.AXJo5gtdehIpo5HQshTjSjeqXdcCnTSB2QhuxNUrpHbtqw52G4WOtTodvYrqcGEhfQfRynkdstte11qcy6vIHg', '2025-05-08 07:20:43', '2025-05-07 21:20:43'),
(94, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjYyODMyMSwiZXhwIjoxNzQ2NjY0MzIxfQ.tx99G6HImgM99U2nx2NScx5Lq1trh7i1k8b1Ecw9nD68m6L1A9pllzhpEfafVu5otIvr9kk8ZzbhXc8i0eMpwQ', '2025-05-08 07:32:01', '2025-05-07 21:32:01'),
(95, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjYyOTQzNSwiZXhwIjoxNzQ2NjY1NDM1fQ.4y60ucc4sWXbbJZot_U3aPTeKnU5JNbjBVdYS-ZwBq9h1mcOATe0v56Oq-PsFkaC9ysMUfLQWkE4Gd2z4yg-FQ', '2025-05-08 07:50:35', '2025-05-07 21:50:35'),
(96, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjYyOTQzNywiZXhwIjoxNzQ2NjY1NDM3fQ.JnWmgaOeXBrkusMgV16_izrXKn3a7VzCs9n2yX2-JYM7O7swxLAqJw8jrmy2JspCQUcSByHV3BAarEITersMjw', '2025-05-08 07:50:37', '2025-05-07 21:50:37'),
(97, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjYyOTQzOSwiZXhwIjoxNzQ2NjY1NDM5fQ.CKZZj-HcDbzLXLCuwIIt3Guup7w9deMszCnbLlzyesj6ACqTCLpZhV5QDeQt0T-oX9fBtjVnC_JFD88FLstI2w', '2025-05-08 07:50:39', '2025-05-07 21:50:39'),
(98, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Mjk0ODMsImV4cCI6MTc0NjY2NTQ4M30.wZ-DTH4kF2z5b6AoVOvGIVsvfDCvF3zliXdUebcV9bKSUxILhpmzXjKHoC2MCARiduYAH1ghWiTz6BmUzV2PQA', '2025-05-08 07:51:23', '2025-05-07 21:51:23'),
(99, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Mjk0OTAsImV4cCI6MTc0NjY2NTQ5MH0.lA4hbYNzaFeyLWys8COood4aaX4UuXxrXI1gigkWKdL0bA2DCm-XU542aOe7GUWhDcOCkM67Q8p3o2eE1FlJjA', '2025-05-08 07:51:30', '2025-05-07 21:51:30'),
(100, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Mjk0OTUsImV4cCI6MTc0NjY2NTQ5NX0.432dnDocUx_Cx7PIEBR9PukuyieezBR6EbLl4qcXKnecNC4jb-S3vcAx1gBt977GliqkuscwQzu1kqOnDDmNpw', '2025-05-08 07:51:35', '2025-05-07 21:51:35'),
(101, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Mjk0OTYsImV4cCI6MTc0NjY2NTQ5Nn0.CVg9n2DvSh4ATWU-HaFQDdp1KL8Upp-ZKc1SyW4vLnY1K9yKbFBYi80vGe6shPSSyKEqayTFWW3oTlgc_AO1_w', '2025-05-08 07:51:36', '2025-05-07 21:51:36'),
(102, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Mjk0OTksImV4cCI6MTc0NjY2NTQ5OX0.xTyqm3Sul79AuPEn9LTRS3L1EVpyHX9qKK7FU05HHDL1CiowT8pFx4GCw5vzAMB6eLsnXuZYevFbVan39Pz2qw', '2025-05-08 07:51:39', '2025-05-07 21:51:39'),
(103, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2Nzk4NjksImV4cCI6MTc0NjcxNTg2OX0.bYrBshGrMCA7VEL2WHxCyWMAe_2K48InG3jKFBcfepLcpFYL_N7hCoagvWC3Y-niBbTfX8GN2HI0q4AZZHaohA', '2025-05-08 21:51:09', '2025-05-08 11:51:09'),
(104, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjY4ODE5MCwiZXhwIjoxNzQ2NzI0MTkwfQ.rDbE2Wm-bvhY5jh_sp5TENQvcdJvxOXTDJ6vihGLdFIni8Iy3CBaak9bt4hRe8kl4vLhJOwe_xS-LsLDfz9GGg', '2025-05-09 00:09:50', '2025-05-08 14:09:50'),
(105, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjY4ODE5NSwiZXhwIjoxNzQ2NzI0MTk1fQ.gmyMPd9Wvza7fWvvfGh9zLzUfOT-B5bOQ-Hn6fVOMOchE5bEV4ToelForuEpPUjohdjKJh3bhEQePNgnV8xJHA', '2025-05-09 00:09:55', '2025-05-08 14:09:55'),
(106, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY2OTAyNDEsImV4cCI6MTc0NjcyNjI0MX0.PJaN5WcR4Dn2RaOnZVHoiYHpCeS-JLLRGQkiwLbiXj3ZyP74Rd1pkEVGFZUkWMs85FQYHXBh5srIs-zniSHPzg', '2025-05-09 00:44:01', '2025-05-08 14:44:01'),
(107, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0NjY5MDI3MywiZXhwIjoxNzQ2NzI2MjczfQ.nVwgB2BzhGQ5OF-jTUY_FOGnZchJK1r-XjIdOd1xYZCvwOmEoGy45hZxXe6FWYcMDu5WOfy1WVSs5PQ_-F3V8g', '2025-05-09 00:44:33', '2025-05-08 14:44:33'),
(108, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY3MDQ3MzcsImV4cCI6MTc0Njc0MDczN30.wD4lHdeVkJwexOGUeGGGlNwtwAoEPTzznyc5mcOAQ9V2eRGGtZHdF2YQxp_PoWmsWmMVXr0vTH3kJxvei7dQAw', '2025-05-09 04:45:37', '2025-05-08 18:45:37'),
(109, 4, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDY3OTYwNDQsImV4cCI6MTc0NjgzMjA0NH0.liDbnpwId6HLen4jRJfgg_v1KwQcC6U8A42VUGYz8ZRpJBvBGx47jozGzEiIfJYLGSLDaASGpbIWKKk-rsFoKQ', '2025-05-10 06:07:24', '2025-05-09 20:07:24'),
(110, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDY3OTY3NzgsImV4cCI6MTc0NjgzMjc3OH0.zMJbgW34iRLZGnG8La0jNWqPs9SsyCR5zKu5vuJCdPeQZaNgcWobkcKOxmSfZc2MF57zBJi2BLD3mK0x6Ip5Sw', '2025-05-10 06:19:38', '2025-05-09 20:19:38'),
(111, 2, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob2FuZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDY3OTgyNDMsImV4cCI6MTc0NjgzNDI0M30.tdirlG0Du4nJ43wIxdlpWQ7YpbZ2d8Ntro-BNuluMlZRjuSnpMxvkfnNCbaXygV2AUn7Z35dLa02uWLm0j4Gpg', '2025-05-10 06:44:03', '2025-05-09 20:44:03'),
(112, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0Njg4MDc4NywiZXhwIjoxNzQ2OTE2Nzg3fQ.qjuclgXw0_gs6mkHQFo2nXJQ_YaN02_l6MphR1Ja7T6sV7dPlq4CSWiTz0QCLMJ3AZ3UJqFRHKeq4rDquzDGRQ', '2025-05-11 05:39:47', '2025-05-10 19:39:47'),
(113, 3, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc0Njk0MzM0NCwiZXhwIjoxNzQ2OTc5MzQ0fQ.rrmTSum8ZjYJszn6dk0-MMmMjxHhrqj74sCUG9qxAm6GPZR8BEVjWbSdaF2QhstlbZf-DmQgGCg83OpIZ_M0hw', '2025-05-11 23:02:24', '2025-05-11 13:02:24'),
(114, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDY5NTI2MTUsImV4cCI6MTc0Njk4ODYxNX0.LSG-72s6KY9YZac1M0pHG40ch3MVx3h_upcBZSiAFdBycmcl-T5VXWomAcTWoveneaDtxPjxhYnJNwen6Ea4EA', '2025-05-12 01:36:55', '2025-05-11 15:36:55'),
(115, 1, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDcwMTEzMDksImV4cCI6MTc0NzA0NzMwOX0.LkFtd5u9uc0ftEKuZjzytvjO08ywRvFD9muf5y0VWBKwye4jWB5M_cs4_CoGiOceRUpto_4yICqM-nGlNgktQA', '2025-05-12 17:55:09', '2025-05-12 07:55:09'),
(116, 5, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYmNAZ21haWwuY29tIiwiaWF0IjoxNzQ3MDE0NTczLCJleHAiOjE3NDcwNTA1NzN9.DDZI82lL1mluQaWyYQQDgtnn6_1InEdV6kNFKBr7Q-vMYDNUXAqwPABOwZGd8owcKoX_KtaElOwns3XgejAhDg', '2025-05-12 18:49:33', '2025-05-12 08:49:33'),
(117, 5, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYmNAZ21haWwuY29tIiwiaWF0IjoxNzQ3MDE0NTc5LCJleHAiOjE3NDcwNTA1Nzl9.qCVpq0fe3XApUHH9L35pwhtpHcduBbtebeUflcO_CD6NJnlBcg2e5cRXo_mbxs_woSjK4wUbYvokINQRZk0vGQ', '2025-05-12 18:49:39', '2025-05-12 08:49:39');

-- --------------------------------------------------------

--
-- Table structure for table `user_discounts`
--

CREATE TABLE `user_discounts` (
  `tour_id` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `discount_id` int(11) NOT NULL,
  `used` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_discounts`
--

INSERT INTO `user_discounts` (`tour_id`, `userid`, `discount_id`, `used`) VALUES
(7, 4, 2, b'1'),
(8, 4, 2, b'1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `tour_id` (`tour_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `idx_bookings_userid` (`userid`);

--
-- Indexes for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD PRIMARY KEY (`passenger_id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `booking_status`
--
ALTER TABLE `booking_status`
  ADD PRIMARY KEY (`booking_status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`destination_id`);

--
-- Indexes for table `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  ADD KEY `FKd68aet3gb8vkojujk0a1c2x73` (`destination_id`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`discount_id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `status_id` (`status_id`);

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
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `tour_id` (`tour_id`),
  ADD KEY `destination_id` (`destination_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `idx_feedbacks_userid` (`userid`);

--
-- Indexes for table `feedback_status`
--
ALTER TABLE `feedback_status`
  ADD PRIMARY KEY (`feedback_status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `guide_reviews`
--
ALTER TABLE `guide_reviews`
  ADD PRIMARY KEY (`guide_review_id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `guide_id` (`guide_id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`media_id`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `booking_related_id` (`booking_related_id`),
  ADD KEY `event_related_id` (`event_related_id`),
  ADD KEY `feedback_related_id` (`feedback_related_id`),
  ADD KEY `payment_related_id` (`payment_related_id`),
  ADD KEY `tour_related_id` (`tour_related_id`),
  ADD KEY `idx_notifications_userid` (`userid`);

--
-- Indexes for table `notifications_archive`
--
ALTER TABLE `notifications_archive`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `booking_related_id` (`booking_related_id`),
  ADD KEY `event_related_id` (`event_related_id`),
  ADD KEY `feedback_related_id` (`feedback_related_id`),
  ADD KEY `payment_related_id` (`payment_related_id`),
  ADD KEY `tour_related_id` (`tour_related_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `payment_status`
--
ALTER TABLE `payment_status`
  ADD PRIMARY KEY (`payment_status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `destination_id` (`destination_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleid`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`tour_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `tour_destinations`
--
ALTER TABLE `tour_destinations`
  ADD KEY `FKscmvxjyea2adr4ekvrlywcc99` (`destination_id`),
  ADD KEY `FKtj4lhkna2sli0bkel5r0j32cs` (`tour_id`);

--
-- Indexes for table `tour_events`
--
ALTER TABLE `tour_events`
  ADD KEY `FK9og3xhms2t79q6mrkx4q5nkxh` (`event_id`),
  ADD KEY `FKq280u7m2gx0ewsx33nqncqrsb` (`tour_id`);

--
-- Indexes for table `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD PRIMARY KEY (`guide_id`),
  ADD UNIQUE KEY `userid` (`userid`);

--
-- Indexes for table `tour_guides_assignments`
--
ALTER TABLE `tour_guides_assignments`
  ADD PRIMARY KEY (`tour_id`,`guide_id`),
  ADD KEY `guide_id` (`guide_id`),
  ADD KEY `idx_tour_guides_assignments_tour_id` (`tour_id`);

--
-- Indexes for table `tour_itineraries`
--
ALTER TABLE `tour_itineraries`
  ADD PRIMARY KEY (`itinerary_id`);

--
-- Indexes for table `tour_itinerary_destinations`
--
ALTER TABLE `tour_itinerary_destinations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tour_itinerary_events`
--
ALTER TABLE `tour_itinerary_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tour_status`
--
ALTER TABLE `tour_status`
  ADD PRIMARY KEY (`tour_status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`),
  ADD UNIQUE KEY `UK_kyvkvqaa1eo8fqi2rcad48tvs` (`sta`),
  ADD UNIQUE KEY `UK_m03btspy53sormu41b4wnb2je` (`status`);

--
-- Indexes for table `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`translation_id`),
  ADD KEY `idx_translations_lookup` (`table_name`,`column_name`,`record_id`,`language`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`userid`,`roleid`),
  ADD KEY `roleid` (`roleid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `usertokens`
--
ALTER TABLE `usertokens`
  ADD PRIMARY KEY (`tokenid`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `user_discounts`
--
ALTER TABLE `user_discounts`
  ADD PRIMARY KEY (`tour_id`,`discount_id`,`userid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `discount_id` (`discount_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  MODIFY `passenger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `booking_status`
--
ALTER TABLE `booking_status`
  MODIFY `booking_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `destination_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discounts`
--
ALTER TABLE `discounts`
  MODIFY `discount_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_status`
--
ALTER TABLE `event_status`
  MODIFY `event_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback_status`
--
ALTER TABLE `feedback_status`
  MODIFY `feedback_status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guide_reviews`
--
ALTER TABLE `guide_reviews`
  MODIFY `guide_review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `media_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications_archive`
--
ALTER TABLE `notifications_archive`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_status`
--
ALTER TABLE `payment_status`
  MODIFY `payment_status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `tour_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tour_guides`
--
ALTER TABLE `tour_guides`
  MODIFY `guide_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tour_itineraries`
--
ALTER TABLE `tour_itineraries`
  MODIFY `itinerary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tour_itinerary_destinations`
--
ALTER TABLE `tour_itinerary_destinations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `tour_itinerary_events`
--
ALTER TABLE `tour_itinerary_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tour_status`
--
ALTER TABLE `tour_status`
  MODIFY `tour_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `translations`
--
ALTER TABLE `translations`
  MODIFY `translation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `usertokens`
--
ALTER TABLE `usertokens`
  MODIFY `tokenid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE SET NULL;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `booking_status` (`booking_status_id`) ON DELETE NO ACTION;

--
-- Constraints for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD CONSTRAINT `booking_passengers_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_passengers_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Constraints for table `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  ADD CONSTRAINT `FKd68aet3gb8vkojujk0a1c2x73` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`);

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `event_status` (`event_status_id`) ON DELETE NO ACTION;

--
-- Constraints for table `event_file_paths`
--
ALTER TABLE `event_file_paths`
  ADD CONSTRAINT `FK7lmjuds8bmtdclfwuqrj560qy` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `feedbacks_ibfk_3` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `feedbacks_ibfk_4` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `feedbacks_ibfk_5` FOREIGN KEY (`status_id`) REFERENCES `feedback_status` (`feedback_status_id`) ON DELETE NO ACTION;

--
-- Constraints for table `guide_reviews`
--
ALTER TABLE `guide_reviews`
  ADD CONSTRAINT `guide_reviews_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `guide_reviews_ibfk_2` FOREIGN KEY (`guide_id`) REFERENCES `tour_guides` (`guide_id`) ON DELETE NO ACTION;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`userid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`booking_related_id`) REFERENCES `bookings` (`booking_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`event_related_id`) REFERENCES `events` (`event_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_ibfk_5` FOREIGN KEY (`feedback_related_id`) REFERENCES `feedbacks` (`feedback_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_ibfk_6` FOREIGN KEY (`payment_related_id`) REFERENCES `payments` (`payment_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_ibfk_7` FOREIGN KEY (`tour_related_id`) REFERENCES `tours` (`tour_id`) ON DELETE NO ACTION;

--
-- Constraints for table `notifications_archive`
--
ALTER TABLE `notifications_archive`
  ADD CONSTRAINT `notifications_archive_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_archive_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`userid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_archive_ibfk_3` FOREIGN KEY (`booking_related_id`) REFERENCES `bookings` (`booking_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_archive_ibfk_4` FOREIGN KEY (`event_related_id`) REFERENCES `events` (`event_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_archive_ibfk_5` FOREIGN KEY (`feedback_related_id`) REFERENCES `feedbacks` (`feedback_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_archive_ibfk_6` FOREIGN KEY (`payment_related_id`) REFERENCES `payments` (`payment_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_archive_ibfk_7` FOREIGN KEY (`tour_related_id`) REFERENCES `tours` (`tour_id`) ON DELETE NO ACTION;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `payment_status` (`payment_status_id`) ON DELETE NO ACTION;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`) ON DELETE CASCADE;

--
-- Constraints for table `tours`
--
ALTER TABLE `tours`
  ADD CONSTRAINT `tours_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `tour_status` (`tour_status_id`) ON DELETE NO ACTION;

--
-- Constraints for table `tour_destinations`
--
ALTER TABLE `tour_destinations`
  ADD CONSTRAINT `FKscmvxjyea2adr4ekvrlywcc99` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`destination_id`),
  ADD CONSTRAINT `FKtj4lhkna2sli0bkel5r0j32cs` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`);

--
-- Constraints for table `tour_events`
--
ALTER TABLE `tour_events`
  ADD CONSTRAINT `FK9og3xhms2t79q6mrkx4q5nkxh` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
  ADD CONSTRAINT `FKq280u7m2gx0ewsx33nqncqrsb` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`);

--
-- Constraints for table `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD CONSTRAINT `tour_guides_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `tour_guides_assignments`
--
ALTER TABLE `tour_guides_assignments`
  ADD CONSTRAINT `tour_guides_assignments_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tour_guides_assignments_ibfk_2` FOREIGN KEY (`guide_id`) REFERENCES `tour_guides` (`guide_id`) ON DELETE CASCADE;

--
-- Constraints for table `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`roleid`) REFERENCES `roles` (`roleid`) ON DELETE CASCADE;

--
-- Constraints for table `usertokens`
--
ALTER TABLE `usertokens`
  ADD CONSTRAINT `usertokens_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `user_discounts`
--
ALTER TABLE `user_discounts`
  ADD CONSTRAINT `user_discounts_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_discounts_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_discounts_ibfk_3` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`discount_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
