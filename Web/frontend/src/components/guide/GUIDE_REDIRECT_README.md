# Hệ thống Redirect cho Guide và Admin

## Tổng quan
Hệ thống đã được cập nhật để:
- Guide có thể truy cập cả trang chính `/` và trang guide `/guide`
- Admin có thể truy cập cả trang chính `/` và trang admin `/admin/dashboard`
- User thường chỉ có thể truy cập trang chính `/`

## Các thay đổi chính

### 1. Redirect tự động khi đăng nhập
- **Guide**: Tự động chuyển đến trang chính `/` sau khi đăng nhập (có thể truy cập Guide Dashboard qua menu)
- **Admin**: Tự động chuyển đến trang chính `/` sau khi đăng nhập (có thể truy cập Admin Dashboard qua menu)
- **User thường**: Chuyển đến trang chính `/`

### 2. Redirect khi truy cập trang chính
- **Guide**: Hiển thị trang chính bình thường khi truy cập `/`
- **Admin**: Hiển thị trang chính bình thường khi truy cập `/`
- **User thường**: Hiển thị trang chính bình thường

### 3. Bảo vệ các trang du lịch
- **Guide**: Có thể truy cập tất cả các trang du lịch thông thường
- **Admin**: Có thể truy cập tất cả các trang du lịch thông thường
- **User thường**: Có thể truy cập bình thường

### 4. Trang Access Denied
- Hiển thị khi guide cố gắng truy cập trang admin không được phép
- Có nút để chuyển đến trang guide hoặc đăng xuất

## Luồng hoạt động

### Khi Guide đăng nhập:
1. Guide nhập email/password
2. Hệ thống kiểm tra role
3. Nếu role = "GUIDE" → Redirect đến `/` (trang chính)
4. Guide có thể truy cập Guide Dashboard qua menu "Guide Dashboard" trong header

### Khi Guide truy cập trang chính:
1. Guide truy cập `http://localhost:3000/`
2. `RoleBasedRedirect` component kiểm tra role
3. Nếu role = "GUIDE" → Hiển thị trang chính bình thường
4. Guide có thể điều hướng đến Guide Dashboard qua menu

### Khi Guide truy cập các trang du lịch:
1. Guide có thể truy cập `/live-fully`, `/places-to-go`, `/tour-dashboard`, etc.
2. `ProtectedRoute` cho phép guide truy cập tất cả các trang du lịch
3. Guide có thể sử dụng đầy đủ tính năng của website

### Khi Admin đăng nhập:
1. Admin nhập email/password
2. Hệ thống kiểm tra role
3. Nếu role = "ADMIN" → Redirect đến `/` (trang chính)
4. Admin có thể truy cập Admin Dashboard qua menu "Admin Dashboard" trong header

### Khi Admin truy cập trang chính:
1. Admin truy cập `http://localhost:3000/`
2. `RoleBasedRedirect` component kiểm tra role
3. Nếu role = "ADMIN" → Hiển thị trang chính bình thường
4. Admin có thể điều hướng đến Admin Dashboard qua menu

### Khi Admin truy cập các trang du lịch:
1. Admin có thể truy cập `/live-fully`, `/places-to-go`, `/tour-dashboard`, etc.
2. `ProtectedRoute` cho phép admin truy cập tất cả các trang
3. Admin có thể sử dụng đầy đủ tính năng của website

## Quyền truy cập

### Guide:
- ✅ `/` - Trang chính (có thể truy cập)
- ✅ `/guide` - Trang chính của guide (có thể truy cập)
- ✅ `/live-fully` - Trang du lịch (có thể truy cập)
- ✅ `/places-to-go` - Trang địa điểm (có thể truy cập)
- ✅ `/tour-dashboard` - Trang đặt tour (có thể truy cập)
- ✅ Tất cả các trang du lịch khác (có thể truy cập)
- ❌ `/admin/dashboard` - Trang admin (không thể truy cập)

### Admin:
- ✅ `/` - Trang chính (có thể truy cập)
- ✅ `/admin/dashboard` - Trang admin (có thể truy cập)
- ✅ `/live-fully` - Trang du lịch (có thể truy cập)
- ✅ `/places-to-go` - Trang địa điểm (có thể truy cập)
- ✅ `/tour-dashboard` - Trang đặt tour (có thể truy cập)
- ✅ Tất cả các trang du lịch khác (có thể truy cập)
- ❌ `/guide` - Trang guide (không thể truy cập)

### User thường:
- ✅ `/` - Trang chính (có thể truy cập)
- ✅ `/live-fully` - Trang du lịch (có thể truy cập)
- ✅ `/places-to-go` - Trang địa điểm (có thể truy cập)
- ✅ `/tour-dashboard` - Trang đặt tour (có thể truy cập)
- ✅ Tất cả các trang du lịch khác (có thể truy cập)
- ❌ `/admin/dashboard` - Trang admin (không thể truy cập)
- ❌ `/guide` - Trang guide (không thể truy cập)

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