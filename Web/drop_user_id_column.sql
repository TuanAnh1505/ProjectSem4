-- Lệnh SQL để xóa cột user_id thừa trong bảng tour_guides
-- Chạy từng lệnh một theo thứ tự

-- 1. Xóa ràng buộc khóa ngoại fk_guide_user
ALTER TABLE `tour_guides` DROP FOREIGN KEY `fk_guide_user`;

-- 2. Xóa chỉ mục fk_guide_user
ALTER TABLE `tour_guides` DROP INDEX `fk_guide_user`;

-- 3. Xóa cột user_id
ALTER TABLE `tour_guides` DROP COLUMN `user_id`;

-- Kiểm tra kết quả
DESCRIBE `tour_guides`; 