-- ===============================
-- A4 Todos Table (FINAL VERSION)
-- ===============================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

CREATE TABLE IF NOT EXISTS `todos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `target_datetime` DATETIME NOT NULL,
  `status` ENUM('Todo','Doing','Done') NOT NULL DEFAULT 'Todo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- Sample data (optional but recommended)
INSERT INTO `todos` (`username`, `title`, `target_datetime`, `status`) VALUES
('cei', 'Finish A4 assignment', '2026-01-20 18:00:00', 'Todo'),
('cei', 'Prepare presentation slides', '2026-01-18 12:00:00', 'Doing'),
('cei', 'Submit project to GitHub', '2026-01-15 23:59:00', 'Done');

COMMIT;
