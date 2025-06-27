-- Thêm VNPAY payment method vào database
INSERT INTO `payment_methods` (`method_id`, `method_name`, `description`, `is_active`, `created_at`) VALUES
(6, 'VNPAY', 'Payment via VNPAY gateway', b'1', NOW());

-- Cập nhật AUTO_INCREMENT nếu cần
ALTER TABLE `payment_methods` AUTO_INCREMENT = 7; 