# Hệ thống Redirect cho Guide

## Tổng quan
Hệ thống đã được cập nhật để guide có thể truy cập trực tiếp vào trang guide mà không cần đi qua trang chính.

## Các thay đổi chính

### 1. Redirect tự động khi đăng nhập
- **Guide**: Tự động chuyển đến `/guide` sau khi đăng nhập
- **Admin**: Tự động chuyển đến `/admin/dashboard` sau khi đăng nhập
- **User thường**: Chuyển đến trang chính `/`

### 2. Redirect khi truy cập trang chính
- **Guide**: Tự động chuyển đến `/guide` khi truy cập `/`
- **Admin**: Tự động chuyển đến `/admin/dashboard` khi truy cập `/`
- **User thường**: Hiển thị trang chính bình thường

### 3. Bảo vệ các trang du lịch
- **Guide**: Không thể truy cập các trang du lịch thông thường
- **Admin**: Không thể truy cập các trang du lịch thông thường
- **User thường**: Có thể truy cập bình thường

### 4. Trang Access Denied
- Hiển thị khi guide cố gắng truy cập trang không được phép
- Có nút để chuyển đến trang guide hoặc đăng xuất

## Luồng hoạt động

### Khi Guide đăng nhập:
1. Guide nhập email/password
2. Hệ thống kiểm tra role
3. Nếu role = "GUIDE" → Redirect đến `/guide`
4. Nếu role = "ADMIN" → Redirect đến `/admin/dashboard`
5. Nếu role khác → Redirect đến `/`

### Khi Guide truy cập trang chính:
1. Guide truy cập `http://localhost:3000/`
2. `RoleBasedRedirect` component kiểm tra role
3. Nếu role = "GUIDE" → Redirect đến `/guide`
4. Nếu role = "ADMIN" → Redirect đến `/admin/dashboard`
5. Nếu role khác → Hiển thị trang chính

### Khi Guide cố truy cập trang không được phép:
1. Guide cố truy cập `/tour-dashboard` hoặc trang du lịch khác
2. `ProtectedRoute` kiểm tra role
3. Nếu role = "GUIDE" → Hiển thị `GuideAccessDenied`
4. Guide có thể click "Đi đến trang Hướng dẫn viên" hoặc "Đăng xuất"

## Các component đã tạo/cập nhật

### Backend
- ✅ `TourGuideAssignmentService.getCurrentGuideAssignmentsWithDetails()`
- ✅ `TourGuideAssignmentController.getCurrentGuideAssignmentsWithDetails()`

### Frontend
- ✅ `GuidePage.js` - Trang chính với navigation
- ✅ `GuideDashboard.js` - Bảng điều khiển
- ✅ `TourDetail.js` - Modal chi tiết tour
- ✅ `GuideAccessDenied.js` - Trang access denied
- ✅ `AutoRedirect.js` - Tự động redirect
- ✅ `App.js` - Cập nhật routing
- ✅ `Login.js` - Cập nhật logic đăng nhập
- ✅ `Header.jsx` - Cập nhật navigation

## Cách test

### 1. Test với tài khoản Guide
```bash
# Đăng nhập với tài khoản có role "GUIDE"
# Sẽ tự động chuyển đến /guide
```

### 2. Test redirect trang chính
```bash
# Đã đăng nhập với role "GUIDE"
# Truy cập http://localhost:3000/
# Sẽ tự động chuyển đến /guide
```

### 3. Test access denied
```bash
# Đã đăng nhập với role "GUIDE"
# Truy cập http://localhost:3000/tour-dashboard
# Sẽ hiển thị trang access denied
```

### 4. Test demo
```bash
# Truy cập http://localhost:3000/guide-demo
# Có thể xem demo mà không cần đăng nhập
```

## Lưu ý quan trọng

1. **Role phải chính xác**: Role phải là "GUIDE" (chữ hoa) để hệ thống hoạt động đúng
2. **Token phải hợp lệ**: User phải có token hợp lệ trong localStorage
3. **Backend API**: Phải chạy backend để các API hoạt động
4. **Database**: Phải có dữ liệu tour guide assignment trong database

## Troubleshooting

### Guide không thể truy cập trang guide
- Kiểm tra role trong localStorage có đúng là "GUIDE" không
- Kiểm tra token có hợp lệ không
- Kiểm tra backend API có hoạt động không

### Guide vẫn thấy trang chính
- Xóa localStorage và đăng nhập lại
- Kiểm tra `RoleBasedRedirect` component có hoạt động không

### Access denied không hiển thị
- Kiểm tra `GuideAccessDenied` component có được import đúng không
- Kiểm tra `ProtectedRoute` logic có đúng không 