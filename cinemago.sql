-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 17, 2025 at 10:27 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cinemago`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role_id` bigint DEFAULT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `FKgdpd8e1vs356bjg287jr27pl7` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `username`, `password`, `email`, `full_name`, `role_id`, `role`) VALUES
(1, 'test5', '$2a$10$bNoVqefp4rbscqFahk2AUOzSEcJglhLJhXGxST2tV/FZEkxI2ZCmW', 'test5@gmail.com', 'test55', 1, NULL),
(2, 'thuongwr19', '$2a$10$DSD9iTkKyddW1gnDg8ZwpOiOVY3hv5SWicgTSj.fjTWckbei/8zp6', 'thuongwr19@gmail.com', 'Nguyễn Văn Thưởng', 2, NULL),
(3, 'admin', '$2a$10$rsxB/ARY60HXLJIfkOhWAOjoKoGgOIZtJF5JD1obDAzz1oiVSTNLm', 'admin@gmail.com', 'admin', 2, 'ADMIN');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `movie_id` bigint NOT NULL,
  `showtime_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `booking_code` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_id` bigint DEFAULT NULL,
  `selected_seats` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_code` (`booking_code`),
  KEY `fk_booking_movie` (`movie_id`),
  KEY `fk_booking_showtime` (`showtime_id`),
  KEY `FK7hunottedmjhtdcvhv4sx6x4a` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `movie_id`, `showtime_id`, `quantity`, `booking_code`, `created_at`, `updated_at`, `account_id`, `selected_seats`) VALUES
(1, 1, 3, 3, 'BK20250517162801', '2025-05-17 09:28:00', '2025-05-17 09:42:45', 2, '[\"A1\",\"A4\",\"D5\"]'),
(2, 2, 4, 1, 'BK20250517162802', '2025-05-17 09:28:00', '2025-05-17 09:28:00', 3, '[\"B1\"]'),
(3, 3, 7, 3, 'BK20250517162803', '2025-05-17 09:28:00', '2025-05-17 09:28:00', 1, '[\"C1\",\"C2\",\"C3\"]'),
(4, 9, 26, 2, 'BK1747474645437', '2025-05-17 09:37:25', '2025-05-17 09:37:25', 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
CREATE TABLE IF NOT EXISTS `movies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `release_date` datetime(6) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `trailer_url` varchar(255) DEFAULT NULL,
  `status` enum('COMING_SOON','NOW_SHOWING','STOPPED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `release_date`, `poster_url`, `trailer_url`, `status`) VALUES
(1, 'Bên Trong Vỏ Kén Vàng', 'Hành trình nội tâm đầy ám ảnh.', '2023-08-25 00:00:00.000000', 'https://image.tmdb.org/t/p/original/rl4SGW82gOeIjjVsg8644rQnkhx.jpg', 'https://youtu.be/IqdAUaqbhmk', 'NOW_SHOWING'),
(2, 'Người Vợ Cuối Cùng', 'Thân phận phụ nữ trong xã hội phong kiến.', '2023-11-03 00:00:00.000000', 'https://image.tmdb.org/t/p/original/dRgYeBp48TwCU84d6BR7A3VwfUi.jpg', 'https://youtu.be/MM3tlA9RXcM', 'STOPPED'),
(3, 'Lật Mặt 7: Một Điều Ước', 'Phần tiếp theo của series Lật Mặt.', '2024-04-26 00:00:00.000000', 'https://image.tmdb.org/t/p/original/2mg6ktvWxsOG9iMBP4P1pwOYltk.jpg', 'https://youtu.be/d1ZHdosjNX8', 'NOW_SHOWING'),
(4, 'Dune: Part Two', 'Chương tiếp theo của Dune.', '2024-03-01 00:00:00.000000', 'https://image.tmdb.org/t/p/original/f9FZAnooCgtfpwRlBRPKJVNMTaZ.jpg', 'https://youtu.be/_DS9QpvtAjE', 'NOW_SHOWING'),
(5, 'Avatar 2: Dòng chảy của nước', 'Jake Sully và gia đình đối mặt bi kịch khi loài người xâm lược Pandora.', '2025-12-19 00:00:00.000000', 'https://image.tmdb.org/t/p/original/1evaZLXsSMJhVFzncZbLzyxUyCx.jpg', 'https://youtu.be/q3dPNyAlCeY', 'COMING_SOON'),
(6, 'Thám Tử Kiên', 'Thám tử Kiên trở lại trong phim kinh dị của Victor Vũ.', '2025-04-30 00:00:00.000000', 'https://image.tmdb.org/t/p/original/8TtkHkUJGmxvGp2UU5PHcEwI3Jq.jpg', 'https://youtu.be/tG_Ito2MUWg', 'NOW_SHOWING'),
(7, 'Nhà Gia Tiên', 'Mỹ Tiên và hồn ma Gia Minh bảo vệ nhà gia tiên khỏi tranh chấp.', '2025-02-21 00:00:00.000000', 'https://image.tmdb.org/t/p/original/yHdDgzEnFslwfwz2Hzc498lIhFx.jpg', 'https://youtu.be/hXGozmNBwt4', 'NOW_SHOWING'),
(8, 'Địa đạo: Mặt trời trong bóng tối', 'Đội du kích bảo vệ nhóm tình báo trong Chiến tranh Việt Nam.', '2025-04-04 00:00:00.000000', 'https://image.tmdb.org/t/p/original/8rZ74dcigPg8XOm8lGx6qXQkzSY.jpg', 'https://youtu.be/-OGDDtsIBHA', 'NOW_SHOWING'),
(9, 'Nụ Hôn Bạc Tỷ', 'Vân chọn giữa hai chàng trai sau tai nạn tình cờ.', '2025-01-29 00:00:00.000000', 'https://image.tmdb.org/t/p/original/uohH02FsWAkqjGgxZMIQwITKyhv.jpg', 'https://youtu.be/tckWvsVSSvs', 'COMING_SOON'),
(10, 'Đèn Âm Hồn', 'Thương đối mặt sự kiện kỳ lạ từ đèn lồng bí ẩn.', '2025-07-02 00:00:00.000000', 'https://image.tmdb.org/t/p/original/w5hWX8BiXkANe4O0wsCKCH7u7Ix.jpg', 'https://youtu.be/_sW6n4t2GfI', 'COMING_SOON'),
(11, 'Cám', 'Cám bị ngược đãi vì lời nguyền, đối lập với Tấm.', '2025-09-20 00:00:00.000000', 'https://image.tmdb.org/t/p/original/8QsdQVvaNPngTv6ZtLhk1CTOJia.jpg', 'https://youtu.be/gW0b5Bsa34o', 'COMING_SOON'),
(12, 'Siêu Nhân Nhí Đại Náo Rừng Xanh', 'Mohsen là một cậu bé bị ám ảnh bởi các siêu anh hùng.', '2025-04-11 07:00:00.000000', 'https://image.tmdb.org/t/p/original/lmjhQ3z3rcguMGQ6ijNH4fJhWZ7.jpg', 'https://youtu.be/cHAqJDD_LXo', 'COMING_SOON'),
(13, 'The Devil\'s Bride', 'Bị mắc kẹt trong một cuộc hôn nhân căng thẳng, Echa tìm thấy niềm an ủi ở một người đàn ông đến thăm giấc mơ của cô. Nhưng sự an ủi biến thành nỗi kinh hoàng khi anh ta nổi lên như một linh hồn độc ác.', '2025-04-18 07:00:00.000000', 'https://image.tmdb.org/t/p/original/rRkM4hAoT9wMPsYeHj2SdgJ3lmz.jpg', 'https://youtu.be/dtrE8dp8Rvg', 'COMING_SOON');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER');

-- --------------------------------------------------------

--
-- Table structure for table `showtime`
--

DROP TABLE IF EXISTS `showtime`;
CREATE TABLE IF NOT EXISTS `showtime` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `movie_id` bigint DEFAULT NULL,
  `theater_name` varchar(255) NOT NULL,
  `showtime` datetime NOT NULL,
  `available_seats` int NOT NULL,
  `seat_map` text,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `showtime`
--

INSERT INTO `showtime` (`id`, `movie_id`, `theater_name`, `showtime`, `available_seats`, `seat_map`) VALUES
(1, 1, 'CGV Vincom', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(2, 1, 'BHD Star', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(3, 1, 'CGV Crescent Mall', '2025-05-19 21:00:00', 27, 'A1:booked,A2:available,A3:available,A4:booked,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:booked,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(4, 2, 'BHD Phạm Hùng', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(5, 2, 'CGV Vincom', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(6, 2, 'BHD Star', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(7, 3, 'CGV Crescent Mall', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(8, 3, 'BHD Phạm Hùng', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(9, 3, 'CGV Vincom', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(10, 4, 'BHD Star', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(11, 4, 'CGV Crescent Mall', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(12, 4, 'BHD Phạm Hùng', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(13, 5, 'CGV Vincom', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(14, 5, 'BHD Star', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(15, 5, 'CGV Crescent Mall', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(16, 6, 'BHD Phạm Hùng', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(17, 6, 'CGV Vincom', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(18, 6, 'BHD Star', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(19, 7, 'CGV Crescent Mall', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(20, 7, 'BHD Phạm Hùng', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(21, 7, 'CGV Vincom', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(22, 8, 'BHD Star', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(23, 8, 'CGV Crescent Mall', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(24, 8, 'BHD Phạm Hùng', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(25, 9, 'CGV Vincom', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(26, 9, 'BHD Star', '2025-05-18 19:00:00', 28, 'A1:booked,A2:booked,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(27, 9, 'CGV Crescent Mall', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(28, 10, 'BHD Phạm Hùng', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(29, 10, 'CGV Vincom', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(30, 10, 'BHD Star', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(31, 11, 'CGV Crescent Mall', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(32, 11, 'BHD Phạm Hùng', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(33, 11, 'CGV Vincom', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(34, 12, 'BHD Star', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(35, 12, 'CGV Crescent Mall', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(36, 12, 'BHD Phạm Hùng', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(37, 13, 'CGV Vincom', '2025-05-17 16:30:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(38, 13, 'BHD Star', '2025-05-18 19:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available'),
(39, 13, 'CGV Crescent Mall', '2025-05-19 21:00:00', 30, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,E1:available,E2:available,E3:available,E4:available,E5:available,E6:available');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `FKgdpd8e1vs356bjg287jr27pl7` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `FK7hunottedmjhtdcvhv4sx6x4a` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`),
  ADD CONSTRAINT `fk_booking_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_showtime` FOREIGN KEY (`showtime_id`) REFERENCES `showtime` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `showtime`
--
ALTER TABLE `showtime`
  ADD CONSTRAINT `showtime_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
