-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 25, 2025 at 09:31 AM
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
(3, 'admin', '$2a$10$rsxB/ARY60HXLJIfkOhWAOjoKoGgOIZtJF5JD1obDAzz1oiVSTNLm', 'admin@gmail.com', 'admin', 1, 'ADMIN');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
CREATE TABLE IF NOT EXISTS `banners` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
CREATE TABLE IF NOT EXISTS `movies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `release_date` datetime(6) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `trailer_url` varchar(255) DEFAULT NULL,
  `status` enum('COMING_SOON','NOW_SHOWING','STOPPED') DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `actors` varchar(255) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `release_date`, `poster_url`, `trailer_url`, `status`, `director`, `duration`, `country`, `actors`, `rating`) VALUES
(1, 'Địa đạo: Mặt trời trong bóng tối', 'Năm 1967, giữa lúc Chiến tranh Việt Nam đang ở đỉnh điểm, đội du kích cách mạng 21 người trở thành mục tiêu “tìm và diệt” số 1 của quân đội Mỹ khi nhận nhiệm vụ bằng mọi giá phải bảo vệ một nhóm thông tin tình báo chiến lược mới đến ẩn náu tại căn cứ.', '2025-04-04 07:00:00.000000', 'https://image.tmdb.org/t/p/original/8rZ74dcigPg8XOm8lGx6qXQkzSY.jpg', 'https://youtu.be/-OGDDtsIBHA', 'NOW_SHOWING', 'Bùi Thạc Chuyên', 128, 'Việt Nam', 'Thái Hòa, Ngô Quang Tuấn, Hồ Thu Anh', 9.9),
(2, 'DORAEMON: NOBITA VÀ CUỘC PHIÊU LƯU VÀO THẾ GIỚI TRONG TRANH', 'Thông qua món bảo bối mới của Doraemon, cả nhóm bạn bước thế giới trong một bức tranh nổi tiếng và bắt gặp cô bạn bí ẩn tên Claire. Với lời mời của Claire, cả nhóm cùng đến thăm vương quốc Artoria, nơi ẩn giấu một viên ngọc quý mang tên Artoria Blue đang ngủ yên. Trên hành trình tìm kiếm viên ngọc, nhóm bạn Doraemon phát hiện một truyền thuyết về sự hủy diệt của thế giới, mà truyền thuyết đó dường như đang sống dậy! Liệu cả nhóm có thể phá hủy lời nguyền này và bảo vệ cả thế giới?', '2025-05-23 07:00:00.000000', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/c/o/copy_of_250220_dr25_main_b1_localized_embbed_1_.jpg', 'https://youtu.be/Bz0zCdNBj1Q', 'NOW_SHOWING', 'Yukiyo Teramoto', 105, 'Nhật Bản', 'Wasabi Mizuta, Megumi Ôhara, Yumi Kakazu, Subaru Kimura, Tomokazu Seki', 6.8),
(3, 'Lilo & Stitch', 'Bộ phim live-action Lilo và Stitch đưa câu chuyện kinh điển của Disney năm 2002 trở lại với một diện mạo mới, vừa hài hước vừa đầy cảm xúc. Phim theo chân Lilo, một cô bé người Hawaii cô đơn, và Stitch, sinh vật ngoài hành tinh tinh nghịch đang chạy trốn, khi cả hai vô tình tìm thấy nhau và cùng nhau hàn gắn những tan vỡ trong gia đình của Lilo.', '2025-05-23 07:00:00.000000', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/aOfmWQHIdunw4Xnc4ZL7DUDDgNl.jpg', 'https://youtu.be/VWqJifMMgZE', 'NOW_SHOWING', 'Dean Fleischer Camp', 107, 'Mỹ', 'Maia Kealoha, Sydney Elizabeth Agudong, Tia Carrere, Chris Sanders', 7),
(4, 'Nhiệm Vụ: Bất Khả Thi - Nghiệp Báo Cuối Cùng', 'Sau khi thoát khỏi vụ tai nạn tàu hỏa thảm khốc, Ethan nhận ra The Entity đang được giấu trên một chiếc tàu ngầm cũ của Nga, nhưng một kẻ thù trong quá khứ của anh tên là Gabriel cũng đang truy đuổi.', '2025-05-30 07:00:00.000000', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/hPM9KSq7Az8wz1MhT6ricpQn9j1.jpg', 'https://youtu.be/G1VBfMCZVkw', 'NOW_SHOWING', 'Christopher McQuarrie', 170, 'Mỹ', 'Tom Cruise', 7),
(5, 'Lật Mặt 8: Vòng Tay Nắng', 'Lật Mặt 8: Vòng Tay Nắng - Một bộ phim về sự khác biệt quan điểm giữa ba thế hệ ông bà cha mẹ con cháu. Ai cũng đúng ở góc nhìn của mình nhưng đứng trước hoài bão của tuổi trẻ, cuối cùng thì ai sẽ là người phải nghe theo người còn lại? Và nếu ước mơ của những đứa trẻ bị cho là viển vông, thì cơ hội nào và bao giờ tuổi trẻ mới được tự quyết định tương lai của mình?', '2025-05-29 07:00:00.000000', 'https://image.tmdb.org/t/p/original/5MRo3arvulO98v27OPO5DXA7UDy.jpg', 'https://youtu.be/9Rj2V8qvKoc', 'NOW_SHOWING', 'Lý Hải', 135, 'Việt Nam', 'Long Đẹp Trai, Kim Phương, Quách Ngọc Tuyên', 10),
(6, 'THÁM TỬ KIÊN: KỲ ÁN KHÔNG ĐẦU', 'Thám Tử Kiên là một nhân vật được yêu thích trong tác phẩm điện của ăn khách của NGƯỜI VỢ CUỐI CÙNG của Victor Vũ, Thám Tử Kiên: Kỳ Không Đầu sẽ là một phim Victor Vũ trở về với thể loại sở trường Kinh Dị - Trinh Thám sau những tác phẩm tình cảm lãng mạn trước đó.', '2025-05-28 07:00:00.000000', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/t/t/ttk_poster_official_fa_1638x2048px_1_.jpg', 'https://youtu.be/QiXNbEKF3U0', 'NOW_SHOWING', 'Victor Vũ', 131, 'Việt Nam', 'Quốc Huy, Đinh Ngọc Diệp, Quốc Anh, Minh Anh, Anh Phạm', 6.5),
(7, 'Shin Cậu Bé Bút Chì: Bí Ẩn! Học Viện Hoa Lệ Tenkasu', 'Câu chuyện của bộ phim bắt đầu với Shinnosuke và những người bạn của Shin thuộc Đội đặc nhiệm Kasukabe trải qua một tuần ở lại \"Học viện Tư nhân Tenkasu Kasukabe\" (Còn gọi là \"Học viện Tenkasu\"), một trường nội trú ưu tú được quản lý bởi một AI hiện đại, \"Otsmun\". Tất cả các học sinh ban đầu được trao một huy hiệu với 1000 điểm và điểm của các em sẽ được Otsmun tăng hoặc giảm dựa trên hành vi và kết quả học tập của các em. Trong đó ai đó tấn công Kazama. Kết quả là trí thông minh của anh ta bị suy giảm và những vết cắn kỳ lạ để lại trên mông anh ta. Đội đặc nhiệm Kasukabe hợp lực với chủ tịch hội học sinh bỏ học của trường, Chishio Atsuki, một cựu vận động viên, để thành lập một nhóm thám tử và giải quyết bí ẩn', '2025-05-10 07:00:00.000000', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/s/h/shin_pink_poster_social.jpg', 'https://youtu.be/u8lbxkM6RXk', 'NOW_SHOWING', 'Wataru Takahashi', 105, 'Nhật Bản', 'Nguyễn Văn Thưởng', 10),
(8, 'Khủng Long Xanh Du Hành Thế Giới Truyện Tranh', 'Khủng Nhong - một chú khủng long xanh với tính cách hiếu động, tò mò bị lạc mất cha mẹ và buộc phải lên đường tìm lại gia đình. Là một sinh vật sống trong cuốn truyện tranh do hoạ sĩ Tét vẽ - người đang muốn tẩy xóa những trang truyện tranh của mình sau lời phê bình từ nhà xuất bản, Khủng Nhong bắt đầu dịch chuyển từ cuốn truyện này sang cuốn truyện khác. Trên hành trình phiêu lưu qua những thế giới kỳ diệu, Khủng Nhong lần lượt gặp gỡ Phù Thuỷ Tinh Tú, Tiến Sĩ Tóc Búi và Giáo Sư Đầu Xù. Để cứu cha mẹ của Khủng Nhong, tất cả các nhân vật hoạt hình phải tin tưởng vào chính mình và thuyết phục hoạ sĩ Tét giữ lại “đứa con tinh thần” thay vì cố gắng sáng tác những gì ông không hề yêu thích.', '2025-04-30 07:00:00.000000', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/d/i/diplo-main_poster.jpg', 'https://youtu.be/LWOK4OP66BE', 'NOW_SHOWING', 'Wojtek Wawszczyk', 87, 'Mỹ', 'Nguyễn Văn Thưởng', 7),
(9, 'ĐÊM THÁNH: ĐỘI SĂN QUỶ', 'Tổ đội săn lùng và tiêu diệt các thế lực tôn thờ quỷ dữ với những sức mạnh siêu nhiên khác nhau gồm “tay đấm” Ma Dong-seok, Seohuyn (SNSD) và David Lee hứa hẹn mở ra cuộc chiến săn quỷ khốc liệt nhất dịp lễ 30/4 này!', '2025-05-09 07:00:00.000000', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-holy.jpg', 'https://youtu.be/Iwg6nQxN51I', 'NOW_SHOWING', 'Lim Dae-hee', 91, 'Hàn Quốc', 'Don Lee; Seo Hyun; David Lee', 5.7),
(10, 'DÍNH \"THÍNH\" LÀ YÊU', 'Dính “Thính” Là Yêu là bộ phim hài lãng mạn xoay quanh cô nàng Taek-seon (Bae Doo-na) - bộ trưởng bộ thờ ơ, chủ tịch hội vô cảm, trưởng nhóm anti tình yêu. Đang sống cuộc đời như một “tảng băng di động”, Taek-seon bất ngờ bị nhiễm “virus tình yêu” - cơn dịch bệnh kỳ lạ khiến con người không thể kiềm chế ham muốn yêu và được yêu. Nếu không tìm được tình yêu đích thực của đời mình trong vòng 5 ngày, người nhiễm virus sẽ chết… vì cô đơn, theo đúng nghĩa đen. Đứng trước những ngã rẽ là can đảm đi tìm tình yêu hay chấp nhận từ bỏ cuộc sống, Taek-seon đã gặp gỡ 3 người đàn ông với hi vọng họ có thể thay đổi số phận của cô. Đó là nhà nghiên cứu Nam Soo-pil (Son Suk-ku), bạn học cùng tiểu học Kim Yeon-woo (Chang Ki-ha) và chuyên gia y tế Lee Kyun (Kim Yoon-seok). Những phản ứng tình yêu “dở khóc dở cười” bắt đầu bùng nổ trên hành trình chữa bệnh của Taek-seon khiến cô phải tự hỏi: Liệu đây chỉ là triệu chứng mà virus mang lại hay đó chính là tình yêu thật sự?', '2025-05-30 07:00:00.000000', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/v/i/virus-teaser_poster_1.jpg', 'https://youtu.be/cjUJ6wsaOyA', 'COMING_SOON', 'Kang Yi-kwan', 0, 'Hàn Quốc', 'Bae Doo-na, Son Seok-ku, Chang Ki-ha, Kim Yoon-seok', 0),
(11, 'MƯỢN HỒN ĐOẠT XÁC', 'Sự trở lại của bộ óc sáng tạo đằng sau Talk to Me, Danny và Michael Philippou cùng A24 với một bộ phim kinh dị mới nhất Mượn Hồn Đoạt Xác. Nhiều người tin rằng linh hồn vẫn sẽ ở lại trong thân xác một thời gian trước khi rời đi, đây cũng là niềm tin đáng sợ cho nghi lễ ám ảnh nhất tháng 5.\n', '2025-05-30 07:00:00.000000', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/t/e/teaser_poster_bringherback_a24_sony_1_.jpg', 'https://youtu.be/KScdWmf2Chk', 'COMING_SOON', 'Danny Philippou, Michael Philippou', 103, 'Mỹ', 'Billy Barratt, Sally Hawkins, Mischa Heywood', 5.5);

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
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `showtime`
--

INSERT INTO `showtime` (`id`, `movie_id`, `theater_name`, `showtime`, `available_seats`, `seat_map`) VALUES
(43, 1, 'Rạp CGV Vincom', '2025-05-25 10:00:00', 79, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:booked,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(44, 1, 'Rạp Lotte Cinema', '2025-05-25 14:30:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(45, 1, 'Rạp Galaxy Nguyễn Trãi', '2025-05-26 19:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(46, 2, 'Rạp CGV Vincom', '2025-05-25 11:00:00', 72, 'A1:booked,A2:booked,A3:booked,A4:booked,A5:booked,A6:booked,A7:booked,A8:booked,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(47, 2, 'Rạp Lotte Cinema', '2025-05-26 15:00:00', 79, 'A1:available,A2:available,A3:booked,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(48, 3, 'Rạp BHD Star', '2025-05-25 13:00:00', 79, 'A1:booked,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(49, 3, 'Rạp CGV Vincom', '2025-05-27 18:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(50, 4, 'Rạp Lotte Cinema', '2025-05-30 20:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(51, 4, 'Rạp Galaxy Nguyễn Trãi', '2025-05-31 16:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(52, 5, 'Rạp CGV Vincom', '2025-05-29 17:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(53, 5, 'Rạp BHD Star', '2025-05-30 12:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(54, 6, 'Rạp Galaxy Nguyễn Trãi', '2025-05-28 19:30:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(55, 6, 'Rạp CGV Vincom', '2025-05-29 21:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(56, 7, 'Rạp Lotte Cinema', '2025-05-25 09:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(57, 7, 'Rạp BHD Star', '2025-05-26 11:30:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(58, 8, 'Rạp CGV Vincom', '2025-05-25 15:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(59, 8, 'Rạp Lotte Cinema', '2025-05-27 10:30:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(60, 9, 'Rạp BHD Star', '2025-05-25 20:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(61, 9, 'Rạp Galaxy Nguyễn Trãi', '2025-05-26 22:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(62, 10, 'Rạp CGV Vincom', '2025-05-30 14:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(63, 10, 'Rạp Lotte Cinema', '2025-05-31 19:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(64, 11, 'Rạp Galaxy Nguyễn Trãi', '2025-05-30 21:30:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available'),
(65, 11, 'Rạp BHD Star', '2025-05-31 20:00:00', 80, 'A1:available,A2:available,A3:available,A4:available,A5:available,A6:available,A7:available,A8:available,A9:available,A10:available,A11:available,A12:available,A13:available,A14:available,A15:available,A16:available,A17:available,A18:available,A19:available,A20:available,B1:available,B2:available,B3:available,B4:available,B5:available,B6:available,B7:available,B8:available,B9:available,B10:available,B11:available,B12:available,B13:available,B14:available,B15:available,B16:available,B17:available,B18:available,B19:available,B20:available,C1:available,C2:available,C3:available,C4:available,C5:available,C6:available,C7:available,C8:available,C9:available,C10:available,C11:available,C12:available,C13:available,C14:available,C15:available,C16:available,C17:available,C18:available,C19:available,C20:available,D1:available,D2:available,D3:available,D4:available,D5:available,D6:available,D7:available,D8:available,D9:available,D10:available,D11:available,D12:available,D13:available,D14:available,D15:available,D16:available,D17:available,D18:available,D19:available,D20:available');

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
