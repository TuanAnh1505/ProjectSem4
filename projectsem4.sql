-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 21, 2025 lúc 04:12 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `projectsem4`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `bookingid` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `tourid` int(11) DEFAULT NULL,
  `bookingdate` datetime DEFAULT current_timestamp(),
  `statusid` int(11) DEFAULT NULL,
  `totalprice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_status`
--

CREATE TABLE `booking_status` (
  `bookingstatusid` int(11) NOT NULL,
  `statusname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `destinations`
--

CREATE TABLE `destinations` (
  `destinationid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `filetype` enum('image','video') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `rating` float DEFAULT 0 CHECK (`rating` between 0 and 5),
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `destinations`
--

INSERT INTO `destinations` (`destinationid`, `name`, `category`, `filetype`, `description`, `location`, `rating`, `createdat`) VALUES
(2, 'Ha Long Bay', 'Natural', 'image', 'A UNESCO World Heritage Site', 'Quang Ninh, Vietnam', 4.5, '2025-04-16 09:30:22'),
(3, 'Thanh Nha Ho', 'Natural', 'image', 'A UNESCO World Heritage Site', 'Thanh Hoa, Vietnam', 4, '2025-04-21 08:53:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `discounts`
--

CREATE TABLE `discounts` (
  `discountid` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discountpercent` float DEFAULT NULL CHECK (`discountpercent` between 0 and 100),
  `startdate` datetime NOT NULL,
  `enddate` datetime NOT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `events`
--

CREATE TABLE `events` (
  `eventid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `startdate` datetime NOT NULL,
  `enddate` datetime NOT NULL,
  `ticketprice` decimal(10,2) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_status`
--

CREATE TABLE `event_status` (
  `eventstatusid` int(11) NOT NULL,
  `statusname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedbackid` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `tourid` int(11) DEFAULT NULL,
  `destinationid` int(11) DEFAULT NULL,
  `eventid` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `statusid` int(11) NOT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedback_status`
--

CREATE TABLE `feedback_status` (
  `feedbackstatusid` int(11) NOT NULL,
  `statusname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `guide_reviews`
--

CREATE TABLE `guide_reviews` (
  `guidereviewid` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `guideid` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `itineraries`
--

CREATE TABLE `itineraries` (
  `itineraryid` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `tourid` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `startdate` datetime NOT NULL,
  `enddate` datetime NOT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `itinerary_details`
--

CREATE TABLE `itinerary_details` (
  `itinerarydetailid` int(11) NOT NULL,
  `itineraryid` int(11) NOT NULL,
  `destinationid` int(11) DEFAULT NULL,
  `activitytype` varchar(100) NOT NULL,
  `starttime` datetime NOT NULL,
  `endtime` datetime NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `media`
--

CREATE TABLE `media` (
  `mediaid` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `filetype` enum('image','video') DEFAULT NULL,
  `fileurl` varchar(500) DEFAULT NULL,
  `uploadedat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notificationid` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `senderid` bigint(20) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `notificationtype` enum('system','booking','payment','tour','event','feedback') NOT NULL,
  `isread` tinyint(1) DEFAULT 0,
  `relatedid` int(11) DEFAULT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `paymentid` int(11) NOT NULL,
  `bookingid` int(11) DEFAULT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paymentmethod` enum('credit_card','paypal','bank_transfer','cash') DEFAULT NULL,
  `paymentdate` datetime DEFAULT current_timestamp(),
  `statusid` int(11) DEFAULT NULL,
  `transactionid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_status`
--

CREATE TABLE `payment_status` (
  `paymentstatusid` int(11) NOT NULL,
  `statusname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `reviewid` int(11) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `destinationid` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `roleid` int(11) NOT NULL,
  `rolename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tours`
--

CREATE TABLE `tours` (
  `tourid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `maxparticipants` int(11) DEFAULT NULL,
  `destinationid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tours`
--

INSERT INTO `tours` (`tourid`, `name`, `description`, `price`, `duration`, `maxparticipants`, `destinationid`, `statusid`, `createdat`) VALUES
(1, 'Ha Long Bay Tour', 'A scenic tour of Ha Long Bay', 199.99, 3, 20, 2, 1, '2025-04-20 16:32:00'),
(2, 'Ha Long Bay Tour', 'A scenic tour of Ha Long Bay', 189.99, 3, 20, 2, 1, '2025-04-21 08:50:27'),
(3, 'Ha Long Night Tour', 'A night tour of Ha Long Bay', 249.99, 2, 15, 2, 1, '2025-04-21 08:50:43'),
(4, 'Thanh Nha Ho', 'Thanh Nha Ho', 149.99, 2, 5, 3, 1, '2025-04-21 08:54:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_guides`
--

CREATE TABLE `tour_guides` (
  `guideid` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `experienceyears` int(11) DEFAULT NULL CHECK (`experienceyears` >= 0),
  `specialization` varchar(255) DEFAULT NULL,
  `languages` varchar(255) DEFAULT NULL,
  `rating` float DEFAULT 0 CHECK (`rating` between 0 and 5),
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_guides_assignments`
--

CREATE TABLE `tour_guides_assignments` (
  `tourid` int(11) NOT NULL,
  `guideid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tour_status`
--

CREATE TABLE `tour_status` (
  `tourstatusid` int(11) NOT NULL,
  `statusname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tour_status`
--

INSERT INTO `tour_status` (`tourstatusid`, `statusname`) VALUES
(1, 'Available'),
(2, 'Cancelled');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `userid` bigint(20) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwordhash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `isactive` tinyint(1) DEFAULT 1,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_discounts`
--

CREATE TABLE `user_discounts` (
  `tourid` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `discountid` int(11) NOT NULL,
  `used` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_roles`
--

CREATE TABLE `user_roles` (
  `userid` bigint(20) NOT NULL,
  `roleid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_tokens`
--

CREATE TABLE `user_tokens` (
  `tokenid` int(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expiry` datetime NOT NULL,
  `createdat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`bookingid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `tourid` (`tourid`),
  ADD KEY `statusid` (`statusid`);

--
-- Chỉ mục cho bảng `booking_status`
--
ALTER TABLE `booking_status`
  ADD PRIMARY KEY (`bookingstatusid`),
  ADD UNIQUE KEY `statusname` (`statusname`);

--
-- Chỉ mục cho bảng `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`destinationid`);

--
-- Chỉ mục cho bảng `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`discountid`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`eventid`),
  ADD KEY `statusid` (`statusid`);

--
-- Chỉ mục cho bảng `event_status`
--
ALTER TABLE `event_status`
  ADD PRIMARY KEY (`eventstatusid`),
  ADD UNIQUE KEY `statusname` (`statusname`);

--
-- Chỉ mục cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedbackid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `tourid` (`tourid`),
  ADD KEY `destinationid` (`destinationid`),
  ADD KEY `eventid` (`eventid`),
  ADD KEY `statusid` (`statusid`);

--
-- Chỉ mục cho bảng `feedback_status`
--
ALTER TABLE `feedback_status`
  ADD PRIMARY KEY (`feedbackstatusid`),
  ADD UNIQUE KEY `statusname` (`statusname`);

--
-- Chỉ mục cho bảng `guide_reviews`
--
ALTER TABLE `guide_reviews`
  ADD PRIMARY KEY (`guidereviewid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `guideid` (`guideid`);

--
-- Chỉ mục cho bảng `itineraries`
--
ALTER TABLE `itineraries`
  ADD PRIMARY KEY (`itineraryid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `tourid` (`tourid`);

--
-- Chỉ mục cho bảng `itinerary_details`
--
ALTER TABLE `itinerary_details`
  ADD PRIMARY KEY (`itinerarydetailid`),
  ADD KEY `itineraryid` (`itineraryid`),
  ADD KEY `destinationid` (`destinationid`);

--
-- Chỉ mục cho bảng `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`mediaid`),
  ADD KEY `userid` (`userid`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notificationid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `senderid` (`senderid`),
  ADD KEY `fk_notifications_feedbacks` (`relatedid`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`paymentid`),
  ADD KEY `bookingid` (`bookingid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `statusid` (`statusid`);

--
-- Chỉ mục cho bảng `payment_status`
--
ALTER TABLE `payment_status`
  ADD PRIMARY KEY (`paymentstatusid`),
  ADD UNIQUE KEY `statusname` (`statusname`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`reviewid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `destinationid` (`destinationid`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleid`),
  ADD UNIQUE KEY `rolename` (`rolename`);

--
-- Chỉ mục cho bảng `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`tourid`),
  ADD KEY `destinationid` (`destinationid`),
  ADD KEY `statusid` (`statusid`);

--
-- Chỉ mục cho bảng `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD PRIMARY KEY (`guideid`),
  ADD UNIQUE KEY `userid` (`userid`);

--
-- Chỉ mục cho bảng `tour_guides_assignments`
--
ALTER TABLE `tour_guides_assignments`
  ADD PRIMARY KEY (`tourid`,`guideid`),
  ADD KEY `guideid` (`guideid`);

--
-- Chỉ mục cho bảng `tour_status`
--
ALTER TABLE `tour_status`
  ADD PRIMARY KEY (`tourstatusid`),
  ADD UNIQUE KEY `statusname` (`statusname`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `user_discounts`
--
ALTER TABLE `user_discounts`
  ADD PRIMARY KEY (`tourid`,`discountid`,`userid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `discountid` (`discountid`);

--
-- Chỉ mục cho bảng `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`userid`,`roleid`),
  ADD KEY `roleid` (`roleid`);

--
-- Chỉ mục cho bảng `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD PRIMARY KEY (`tokenid`),
  ADD KEY `userid` (`userid`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `bookingid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `booking_status`
--
ALTER TABLE `booking_status`
  MODIFY `bookingstatusid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `destinations`
--
ALTER TABLE `destinations`
  MODIFY `destinationid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `discounts`
--
ALTER TABLE `discounts`
  MODIFY `discountid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `events`
--
ALTER TABLE `events`
  MODIFY `eventid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `event_status`
--
ALTER TABLE `event_status`
  MODIFY `eventstatusid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedbackid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `feedback_status`
--
ALTER TABLE `feedback_status`
  MODIFY `feedbackstatusid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `guide_reviews`
--
ALTER TABLE `guide_reviews`
  MODIFY `guidereviewid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `itineraries`
--
ALTER TABLE `itineraries`
  MODIFY `itineraryid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `itinerary_details`
--
ALTER TABLE `itinerary_details`
  MODIFY `itinerarydetailid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `media`
--
ALTER TABLE `media`
  MODIFY `mediaid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notificationid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `paymentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payment_status`
--
ALTER TABLE `payment_status`
  MODIFY `paymentstatusid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `reviewid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tours`
--
ALTER TABLE `tours`
  MODIFY `tourid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tour_guides`
--
ALTER TABLE `tour_guides`
  MODIFY `guideid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tour_status`
--
ALTER TABLE `tour_status`
  MODIFY `tourstatusid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `userid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_tokens`
--
ALTER TABLE `user_tokens`
  MODIFY `tokenid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`tourid`) REFERENCES `tours` (`tourid`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`statusid`) REFERENCES `booking_status` (`bookingstatusid`) ON DELETE NO ACTION;

--
-- Các ràng buộc cho bảng `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`statusid`) REFERENCES `event_status` (`eventstatusid`) ON DELETE NO ACTION;

--
-- Các ràng buộc cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`tourid`) REFERENCES `tours` (`tourid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `feedbacks_ibfk_3` FOREIGN KEY (`destinationid`) REFERENCES `destinations` (`destinationid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `feedbacks_ibfk_4` FOREIGN KEY (`eventid`) REFERENCES `events` (`eventid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `feedbacks_ibfk_5` FOREIGN KEY (`statusid`) REFERENCES `feedback_status` (`feedbackstatusid`) ON DELETE NO ACTION;

--
-- Các ràng buộc cho bảng `guide_reviews`
--
ALTER TABLE `guide_reviews`
  ADD CONSTRAINT `guide_reviews_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `guide_reviews_ibfk_2` FOREIGN KEY (`guideid`) REFERENCES `tour_guides` (`guideid`) ON DELETE NO ACTION;

--
-- Các ràng buộc cho bảng `itineraries`
--
ALTER TABLE `itineraries`
  ADD CONSTRAINT `itineraries_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `itineraries_ibfk_2` FOREIGN KEY (`tourid`) REFERENCES `tours` (`tourid`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `itinerary_details`
--
ALTER TABLE `itinerary_details`
  ADD CONSTRAINT `itinerary_details_ibfk_1` FOREIGN KEY (`itineraryid`) REFERENCES `itineraries` (`itineraryid`) ON DELETE CASCADE,
  ADD CONSTRAINT `itinerary_details_ibfk_2` FOREIGN KEY (`destinationid`) REFERENCES `destinations` (`destinationid`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_bookings` FOREIGN KEY (`relatedid`) REFERENCES `bookings` (`bookingid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `fk_notifications_events` FOREIGN KEY (`relatedid`) REFERENCES `events` (`eventid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `fk_notifications_feedbacks` FOREIGN KEY (`relatedid`) REFERENCES `feedbacks` (`feedbackid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `fk_notifications_payments` FOREIGN KEY (`relatedid`) REFERENCES `payments` (`paymentid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `fk_notifications_tours` FOREIGN KEY (`relatedid`) REFERENCES `tours` (`tourid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`senderid`) REFERENCES `users` (`userid`) ON DELETE NO ACTION;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bookingid`) REFERENCES `bookings` (`bookingid`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE NO ACTION,
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`statusid`) REFERENCES `payment_status` (`paymentstatusid`) ON DELETE NO ACTION;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`destinationid`) REFERENCES `destinations` (`destinationid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tours`
--
ALTER TABLE `tours`
  ADD CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`destinationid`) REFERENCES `destinations` (`destinationid`) ON DELETE CASCADE,
  ADD CONSTRAINT `tours_ibfk_2` FOREIGN KEY (`statusid`) REFERENCES `tour_status` (`tourstatusid`) ON DELETE NO ACTION;

--
-- Các ràng buộc cho bảng `tour_guides`
--
ALTER TABLE `tour_guides`
  ADD CONSTRAINT `tour_guides_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tour_guides_assignments`
--
ALTER TABLE `tour_guides_assignments`
  ADD CONSTRAINT `tour_guides_assignments_ibfk_1` FOREIGN KEY (`tourid`) REFERENCES `tours` (`tourid`) ON DELETE CASCADE,
  ADD CONSTRAINT `tour_guides_assignments_ibfk_2` FOREIGN KEY (`guideid`) REFERENCES `tour_guides` (`guideid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_discounts`
--
ALTER TABLE `user_discounts`
  ADD CONSTRAINT `user_discounts_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_discounts_ibfk_2` FOREIGN KEY (`tourid`) REFERENCES `tours` (`tourid`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_discounts_ibfk_3` FOREIGN KEY (`discountid`) REFERENCES `discounts` (`discountid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleid`) REFERENCES `roles` (`roleid`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
