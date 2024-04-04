-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2024 at 07:16 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web-app`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('pending','reserved','free') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `student_id`, `room_id`, `start_time`, `end_time`, `status`, `created_at`, `updated_at`) VALUES
(4, 2, 1, '2024-03-31 04:13:00', '2024-04-02 04:13:00', 'reserved', '2024-03-30 21:13:19', '2024-03-31 05:07:40'),
(5, 2, 2, '2024-03-31 10:35:00', '2024-04-01 10:35:00', 'free', '2024-03-31 03:35:16', '2024-03-31 05:07:46'),
(6, 3, 1, '2024-03-31 12:39:00', '2024-04-03 12:39:00', 'free', '2024-03-31 05:39:19', '2024-03-31 05:40:09'),
(7, 2, 1, '2024-03-31 16:17:00', '2024-04-04 16:18:00', 'pending', '2024-03-31 09:18:06', '2024-03-31 09:18:06');

-- --------------------------------------------------------

--
-- Table structure for table `bookings1`
--

CREATE TABLE `bookings1` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `slot_id` int(11) NOT NULL,
  `objective` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approved_by` int(11) DEFAULT NULL,
  `rejected_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings1`
--

INSERT INTO `bookings1` (`id`, `student_id`, `room_id`, `slot_id`, `objective`, `status`, `created_at`, `updated_at`, `approved_by`, `rejected_by`) VALUES
(1, 2, 1, 1, 'meeting', 'rejected', '2024-03-31 18:22:20', '2024-04-01 04:40:10', 1, NULL),
(2, 1, 1, 1, 'meeting', 'approved', '2024-03-31 19:00:28', '2024-04-01 04:21:11', 2, NULL),
(3, 2, 1, 2, 'meeting', 'rejected', '2024-03-31 19:06:43', '2024-04-01 05:05:39', NULL, 1),
(4, 2, 1, 1, 'meeting1', 'approved', '2024-04-01 04:40:26', '2024-04-01 04:52:25', 1, NULL),
(5, 4, 1, 3, 'Group project', 'rejected', '2024-04-01 15:47:31', '2024-04-01 15:49:50', NULL, 1),
(6, 5, 1, 4, 'Group project', 'approved', '2024-04-03 15:49:10', '2024-04-03 15:56:36', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lecturers`
--

CREATE TABLE `lecturers` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lecturers`
--

INSERT INTO `lecturers` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'L1', 'L1@gmail.com', '$2b$10$CzoV5JJyICXvrhAw4/nTLOVc8v.sHFdQrnSyn1TzBeiFJUi4Uc7AS', '2024-03-31 04:08:18', '2024-03-31 04:08:18'),
(2, 'L2', 'L2@gmail.com', '$2b$10$6NKMY8y5N3coTibZCWqGEuWBKC5tAlI7i6oxL33EjvpRtG6xAjGUi', '2024-04-01 04:18:23', '2024-04-01 04:18:23');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_name`, `capacity`) VALUES
(1, 'Room1', 10),
(2, 'Room2', 15),
(3, 'Room6', 0);

-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

CREATE TABLE `slots` (
  `slot_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `slot_time` varchar(255) NOT NULL,
  `status` enum('free','reserved') DEFAULT 'free'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `slots`
--

INSERT INTO `slots` (`slot_id`, `room_id`, `slot_time`, `status`) VALUES
(1, 1, '08:00-10:00', ''),
(2, 1, '10:00-12:00', ''),
(3, 1, '13:00-15:00', ''),
(4, 1, '15:00-17:00', ''),
(5, 2, '08:00-10:00', 'free'),
(6, 2, '10:00-12:00', 'free'),
(7, 2, '13:00-15:00', 'free'),
(8, 2, '15:00-17:00', 'free');

-- --------------------------------------------------------

--
-- Table structure for table `slots1`
--

CREATE TABLE `slots1` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('free','pending','reserved','disabled') NOT NULL DEFAULT 'free',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `slots1`
--

INSERT INTO `slots1` (`id`, `room_id`, `start_time`, `end_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '08:00:00', '10:00:00', 'reserved', '2024-03-31 15:36:34', '2024-04-01 04:52:25'),
(2, 1, '10:00:00', '12:00:00', 'free', '2024-03-31 15:36:34', '2024-04-01 05:05:39'),
(3, 1, '13:00:00', '15:00:00', 'free', '2024-03-31 15:37:50', '2024-04-01 15:49:50'),
(4, 1, '15:00:00', '17:00:00', 'reserved', '2024-03-31 15:37:50', '2024-04-03 15:56:36');

-- --------------------------------------------------------

--
-- Table structure for table `staffs`
--

CREATE TABLE `staffs` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `staffs`
--

INSERT INTO `staffs` (`id`, `username`, `password`, `email`, `created_at`, `updated_at`) VALUES
(1, 'admin', '12345', 'admin@gmail.com', '2024-04-03 19:34:26', '2024-04-03 19:34:26');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 's1', 's1@gmail.com', '12345', '2024-03-12 20:10:45', '2024-03-06 20:10:45'),
(2, 'San ', 'test@gmail.com', '$2b$10$nawCPaiCjdnk0bvDlyKaaureokpctgiPjanRSNUO/sOJXD8qopw0O', '2024-03-30 20:43:10', '2024-03-30 20:43:10'),
(3, 'thutazaw', 'thutazaw@gmail.com', '$2b$10$RWkJD7YmoqSVKFBKExTsqeZBt3wO9D5x0fkXLM7FSIzRbT0TJxwsm', '2024-03-31 05:37:51', '2024-03-31 05:37:51'),
(4, 'Po', 'Po@gmail.com', '$2b$10$5rWmBLDQKUJLt1dI51hiQekEOABqDzVteKw4yzvIzCmL7lGFEbIcq', '2024-04-01 15:46:49', '2024-04-01 15:46:49'),
(5, 'M', 'M@gmail.com', '$2b$10$8.X4byVP64erp2T5AQea2utV3aFP2SzuimBjekS/0mwbh5SEusa76', '2024-04-03 15:46:41', '2024-04-03 15:46:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `bookings1`
--
ALTER TABLE `bookings1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `slot_id` (`slot_id`),
  ADD KEY `fk_approved_by` (`approved_by`),
  ADD KEY `fk_rejected_by` (`rejected_by`);

--
-- Indexes for table `lecturers`
--
ALTER TABLE `lecturers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `slots`
--
ALTER TABLE `slots`
  ADD PRIMARY KEY (`slot_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `slots1`
--
ALTER TABLE `slots1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `staffs`
--
ALTER TABLE `staffs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `bookings1`
--
ALTER TABLE `bookings1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `lecturers`
--
ALTER TABLE `lecturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `slots`
--
ALTER TABLE `slots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `slots1`
--
ALTER TABLE `slots1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staffs`
--
ALTER TABLE `staffs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- Constraints for table `bookings1`
--
ALTER TABLE `bookings1`
  ADD CONSTRAINT `bookings1_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `bookings1_ibfk_2` FOREIGN KEY (`slot_id`) REFERENCES `slots1` (`id`),
  ADD CONSTRAINT `fk_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `lecturers` (`id`),
  ADD CONSTRAINT `fk_rejected_by` FOREIGN KEY (`rejected_by`) REFERENCES `lecturers` (`id`);

--
-- Constraints for table `slots`
--
ALTER TABLE `slots`
  ADD CONSTRAINT `slots_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- Constraints for table `slots1`
--
ALTER TABLE `slots1`
  ADD CONSTRAINT `slots1_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
