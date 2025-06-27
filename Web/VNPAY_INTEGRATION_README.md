# Hướng dẫn tích hợp VNPAY

## Tổng quan
Đã tích hợp thành công cổng thanh toán VNPAY vào hệ thống TravelTour với các tính năng:
- Tạo link thanh toán VNPAY
- Xử lý callback từ VNPAY
- Hiển thị kết quả thanh toán
- Cập nhật trạng thái payment tự động

## Cấu hình Backend

### 1. Thông tin cấu hình VNPAY
Đã cấu hình trong `application.properties`:
```properties
vnpay.tmnCode=RTT767UP
vnpay.hashSecret=OI1R5R0962X7DW2NGLVHAH3IM9RS0H59
vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### 2. Files đã tạo/cập nhật
- `VnpayConfig.java` - Cấu hình VNPAY
- `VnpayUtil.java` - Utility ký HMAC SHA512
- `PaymentService.java` - Thêm hàm `createVnpayPayment()` và `handleVnpayCallback()`
- `PaymentController.java` - Thêm endpoints:
  - `POST /api/payments/vnpay/create` - Tạo link thanh toán
  - `GET /api/payments/transaction/{transactionId}` - Lấy payment theo transaction ID
  - `POST /api/payments/vnpay/callback` - Xử lý callback từ VNPAY

### 3. Database
Chạy script SQL để thêm VNPAY vào bảng payment_methods:
```sql
INSERT INTO payment_methods (method_name, description, is_active, created_at) 
VALUES ('VNPAY', 'Thanh toán qua cổng VNPAY - Hỗ trợ thẻ ATM, thẻ tín dụng/ghi nợ nội địa và quốc tế', true, NOW())
ON DUPLICATE KEY UPDATE 
description = 'Thanh toán qua cổng VNPAY - Hỗ trợ thẻ ATM, thẻ tín dụng/ghi nợ nội địa và quốc tế',
is_active = true;
```

## Cấu hình Frontend

### 1. Files đã tạo/cập nhật
- `PaymentMethodSelector.js` - Thêm VNPAY vào danh sách phương thức thanh toán
- `Payment.js` - Thêm logic xử lý VNPAY (methodId = 6)
- `VnpayPaymentPage.js` - Trang thanh toán VNPAY
- `VnpayPaymentPage.css` - CSS cho trang thanh toán VNPAY
- `VnpayReturn.js` - Xử lý kết quả trả về từ VNPAY
- `VnpayReturn.css` - CSS cho trang kết quả
- `App.js` - Thêm routes cho VNPAY

### 2. Routes
- `/vnpay-payment` - Trang thanh toán VNPAY
- `/payment/vnpay-return` - Trang xử lý kết quả từ VNPAY

## Cách sử dụng

### 1. Chọn phương thức thanh toán VNPAY
- User chọn VNPAY trong danh sách phương thức thanh toán
- Hệ thống sẽ redirect đến trang thanh toán VNPAY

### 2. Thanh toán
- User nhập thông tin thẻ trên trang VNPAY
- VNPAY xử lý thanh toán và trả về kết quả

### 3. Kết quả
- Nếu thành công: User được chuyển về trang thành công
- Nếu thất bại: User được chuyển về trang thất bại với thông báo lỗi

## Testing

### 1. Test với thẻ sandbox
Sử dụng thông tin thẻ test của VNPAY:
- Thẻ ATM: 9704000000000018
- Thẻ Visa: 4111111111111111
- Thẻ Mastercard: 5200828282828210

### 2. Test các trường hợp
- Thanh toán thành công
- Thanh toán thất bại
- Hủy thanh toán
- Timeout

## Lưu ý quan trọng

### 1. Bảo mật
- Đã verify signature từ VNPAY để đảm bảo tính toàn vẹn dữ liệu
- Sử dụng HTTPS cho tất cả giao dịch
- Không lưu thông tin thẻ trong database

### 2. Production
- Thay đổi URL từ sandbox sang production
- Cập nhật TMN Code và Hash Secret cho production
- Cấu hình IPN URL cho server-to-server notification

### 3. Monitoring
- Log tất cả giao dịch VNPAY
- Monitor tỷ lệ thành công/thất bại
- Alert khi có lỗi xảy ra

## Troubleshooting

### 1. Lỗi thường gặp
- **Invalid signature**: Kiểm tra Hash Secret
- **Payment not found**: Kiểm tra transaction ID
- **Timeout**: Kiểm tra network connection

### 2. Debug
- Kiểm tra logs trong console
- Verify request/response với VNPAY
- Test với Postman/curl

## Support
Nếu có vấn đề, vui lòng liên hệ:
- Email: support@traveltour.com
- Phone: 1900-xxxx 