-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2025 at 04:06 AM
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
-- Database: `tourismmana`
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

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `booking_date` datetime DEFAULT current_timestamp(),
  `status_id` int(11) NOT NULL,
  `total_price` decimal(38,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userid` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `tour_id`, `booking_date`, `status_id`, `total_price`, `created_at`, `updated_at`, `userid`) VALUES
(1, 2, '2025-05-17 17:42:43', 1, 100.00, '2025-05-17 17:42:43', '2025-05-17 17:42:43', 2),
(2, 2, '2025-05-17 17:47:49', 1, 100.00, '2025-05-17 17:47:49', '2025-05-17 17:47:49', 2),
(3, 2, '2025-05-17 17:52:25', 1, 100.00, '2025-05-17 17:52:25', '2025-05-17 17:52:25', 2),
(4, 2, '2025-05-17 17:59:30', 1, 100.00, '2025-05-17 17:59:30', '2025-05-17 17:59:30', 2),
(5, 2, '2025-05-17 18:04:24', 1, 100.00, '2025-05-17 18:04:24', '2025-05-17 18:04:24', 2),
(6, 2, '2025-05-17 18:09:25', 1, 100.00, '2025-05-17 18:09:25', '2025-05-17 18:09:25', 2),
(7, 2, '2025-05-17 18:11:24', 1, 100.00, '2025-05-17 18:11:24', '2025-05-17 18:11:24', 2),
(8, 2, '2025-05-17 18:12:41', 1, 100.00, '2025-05-17 18:12:41', '2025-05-17 18:12:41', 2),
(9, 2, '2025-05-17 18:16:20', 1, 100.00, '2025-05-17 18:16:20', '2025-05-17 18:16:20', 2),
(10, 2, '2025-05-17 19:12:56', 1, 100.00, '2025-05-17 19:12:56', '2025-05-17 19:12:56', 2);

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
(1, 9, 2, 'hoang', '1234567890', 'hoang@gmail.com', 'dsfg', 'adult', '2005-04-07', 'Nam'),
(2, 10, 2, 'hoang', '1234567890', 'hoang@gmail.com', 'dsfg', 'adult', '1991-11-11', 'Nam');

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
(2, 'Dinh Thự Vua Mèo', 'Lịch sử', 'Di tích kiến trúc cổ nổi bật, từng là nơi ở của Vua Mèo Vương Chính Đức.', 'Sà Phìn, Đồng Văn, Hà Giang', 4, '2025-05-17 11:11:20', '2025-05-17 11:11:20');

-- --------------------------------------------------------

--
-- Table structure for table `destination_file_path`
--

CREATE TABLE `destination_file_path` (
  `id` int(11) NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(4, 2, '/uploads/destinations/d7f8d40a-3556-433f-bcc5-1e5bc48ae2d0.jpg', 'image', '2025-05-17 11:11:20');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, '	 Lễ hội Chợ tình Khâu Vai', 'Lễ hội truyền thống độc đáo nơi tình yêu được hẹn hò mỗi năm một lần.', 'Khâu Vai, Mèo Vạc, Hà Giang', '2025-05-28 08:00:00', '2025-05-28 17:00:00', 1.00, 1, '2025-05-17 11:26:52', '2025-05-17 11:26:52');

-- --------------------------------------------------------

--
-- Table structure for table `event_file_path`
--

CREATE TABLE `event_file_path` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, '/uploads/events/1747456012005_Lễ hội Chợ tình Khâu Vai.jpeg');

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
-- Table structure for table `feedbacks`
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
-- Table structure for table `media`
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
-- Table structure for table `notifications`
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
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_method` enum('credit_card','paypal','bank_transfer','cash','momo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(5, 'PayPal', 'Payment via PayPal', b'1', '2025-05-17 10:10:43');

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
(2, 'USER', 'Regular user with limited access');

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
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`tour_id`, `name`, `description`, `price`, `duration`, `max_participants`, `status_id`, `image_url`, `created_at`, `updated_at`) VALUES
(2, 'Khám phá Hà Giang', 'Tour khám phá vùng núi đá Hà Giang, chiêm ngưỡng vẻ đẹp hùng vĩ và trải nghiệm văn hóa bản địa.', 100.00, 3, 20, 2, '/uploads/tours/c8a49fd9-fed8-4418-aa6d-3d576ccddb1a_Tour khám phá vùng núi đá Hà Giang,.jfif', '2025-05-17 12:03:12', '2025-05-17 12:04:08'),
(3, 'abc', 'sd', 2.00, 2, 10, 3, '/uploads/tours/ff1df7e6-8e3f-49e7-b911-dcb0d2527619_snapedit_1746961093933.png', '2025-05-17 14:21:14', '2025-05-17 14:21:14');

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
(3, 1);

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
(3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tour_guides`
--

CREATE TABLE `tour_guides` (
  `guide_id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `experience_years` int(11) NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `languages` varchar(255) NOT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `status` enum('assigned','completed','cancelled') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tour_itineraries`
--

CREATE TABLE `tour_itineraries` (
  `itinerary_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `end_time` time(6) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `start_time` time(6) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(3, 3, 'Tham gia Lễ hội Chợ tình Khâu Vai', 'Hòa mình vào không khí văn hóa dân tộc, nơi trai gái gặp gỡ nhau trong lễ hội truyền thống vùng cao.', '19:00:00', '21:00:00', 'EVENT');

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
(1, 2, '2025-05-27', '2025-05-29', 'pending', '2025-05-17 15:02:57', '2025-05-17 15:49:24'),
(2, 3, '2025-05-20', '2025-05-21', 'available', '2025-05-17 15:07:08', '2025-05-17 15:07:08'),
(3, 2, '2025-06-11', '2025-06-13', 'pending', '2025-05-17 15:43:53', '2025-05-17 15:43:53');

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
(2, 2);

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
(1, 'admin', 'admin@gmail.com', '$2a$10$XB14xcxuI1SlICBxZxLMAu8Gcx.UcJK0LWgFVtinCc/GL2Q3K7EZy', '1234567890', '12345', b'1', '2025-05-17 11:07:30', '2025-05-17 11:07:44', '9be3835e-6a67-41d4-bad1-8f423ac73397'),
(2, 'hoang', 'hoang@gmail.com', '$2a$10$pQMo0TdhZB6PGXzmkSa10eoFxUK2zGy9/BbFv6w02OiQIaApcAdlS', '1234567890', 'dsfg', b'1', '2025-05-17 17:39:03', '2025-05-17 17:39:19', '43b52f1b-3d24-438c-955f-adce2ea9ad1f');

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
  ADD KEY `fk_booking_tour` (`tour_id`),
  ADD KEY `fk_booking_status` (`status_id`),
  ADD KEY `fk_booking_user` (`userid`);

--
-- Indexes for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  ADD PRIMARY KEY (`passenger_id`),
  ADD KEY `fk_passenger_booking` (`booking_id`),
  ADD KEY `fk_passenger_user` (`userid`);

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
-- Indexes for table `destination_file_path`
--
ALTER TABLE `destination_file_path`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `event_file_path`
--
ALTER TABLE `event_file_path`
  ADD PRIMARY KEY (`id`);

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
  ADD KEY `fk_notification_sender` (`sender_id`);

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
  ADD KEY `fk_guide_user` (`user_id`);

--
-- Indexes for table `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `fk_assignment_tour` (`tour_id`),
  ADD KEY `fk_assignment_guide` (`guide_id`);

--
-- Indexes for table `tour_itineraries`
--
ALTER TABLE `tour_itineraries`
  ADD PRIMARY KEY (`itinerary_id`);

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
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
  MODIFY `passenger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `booking_status`
--
ALTER TABLE `booking_status`
  MODIFY `booking_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `destination_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `destination_file_path`
--
ALTER TABLE `destination_file_path`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `destination_file_paths`
--
ALTER TABLE `destination_file_paths`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `discounts`
--
ALTER TABLE `discounts`
  MODIFY `discount_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `event_file_path`
--
ALTER TABLE `event_file_path`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_status`
--
ALTER TABLE `event_status`
  MODIFY `event_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback_status`
--
ALTER TABLE `feedback_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_history`
--
ALTER TABLE `payment_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment_status`
--
ALTER TABLE `payment_status`
  MODIFY `payment_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `tour_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tour_guides`
--
ALTER TABLE `tour_guides`
  MODIFY `guide_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tour_itineraries`
--
ALTER TABLE `tour_itineraries`
  MODIFY `itinerary_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tour_itinerary`
--
ALTER TABLE `tour_itinerary`
  MODIFY `itinerary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tour_schedules`
--
ALTER TABLE `tour_schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tour_status`
--
ALTER TABLE `tour_status`
  MODIFY `tour_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `fk_booking_status` FOREIGN KEY (`status_id`) REFERENCES `booking_status` (`booking_status_id`),
  ADD CONSTRAINT `fk_booking_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `booking_passengers`
--
ALTER TABLE `booking_passengers`
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
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `fk_feedback_status` FOREIGN KEY (`status_id`) REFERENCES `feedback_status` (`status_id`),
  ADD CONSTRAINT `fk_feedback_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `fk_media_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
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
  ADD CONSTRAINT `fk_guide_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `tour_guide_assignments`
--
ALTER TABLE `tour_guide_assignments`
  ADD CONSTRAINT `fk_assignment_guide` FOREIGN KEY (`guide_id`) REFERENCES `tour_guides` (`guide_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assignment_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`tour_id`) ON DELETE CASCADE;

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
