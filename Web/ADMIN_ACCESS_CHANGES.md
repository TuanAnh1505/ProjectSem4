# Thay đổi Quyền Truy cập Admin và Guide

## Tổng quan
Đã cập nhật hệ thống để:
- **Admin** có thể truy cập đồng thời: trang chính `/` và trang admin `/admin/dashboard`
- **Guide** có thể truy cập đồng thời: trang chính `/` và trang guide `/guide`
- **User thường** chỉ có thể truy cập: trang chính `/`

## Các thay đổi đã thực hiện

### 1. Frontend/src/App.js
**File:** `frontend/src/App.js`

**Thay đổi trong `RoleBasedRedirect`:**
```javascript
// Trước:
if (userRole === 'GUIDE') {
  return <Navigate to="/guide" />;
}
if (userRole === 'ADMIN') {
  return <Navigate to="/admin/dashboard" />;
}

// Sau:
// Guide và Admin đều có thể truy cập trang chính, không redirect ngay lập tức
// if (userRole === 'GUIDE') {
//   return <Navigate to="/guide" />;
// }
// if (userRole === 'ADMIN') {
//   return <Navigate to="/admin/dashboard" />;
// }
```

**Thay đổi trong `ProtectedRoute`:**
```javascript
// Trước:
if (userRole === 'GUIDE') {
  return <GuideAccessDenied />;
}

// Sau:
// Nếu user là GUIDE nhưng đang cố truy cập trang admin, hiển thị trang access denied
if (userRole === 'GUIDE' && requiredRole === 'ADMIN') {
  return <GuideAccessDenied />;
}
```

### 2. Frontend/src/components/auth/Login.js
**File:** `frontend/src/components/auth/Login.js`

**Thay đổi trong logic redirect sau đăng nhập:**
```javascript
// Trước:
if (role === 'GUIDE') {
  navigate('/guide');
} else if (role === 'ADMIN') {
  navigate('/admin/dashboard');
} else {
  navigate('/');
}

// Sau:
if (role === 'GUIDE') {
  // Guide có thể truy cập trang chính, không redirect ngay lập tức
  // navigate('/guide');
  navigate('/');
} else {
  // Admin và user thường đều có thể truy cập trang chính
  navigate('/');
}
```

### 3. Frontend/src/components/auth/AutoRedirect.js
**File:** `frontend/src/components/auth/AutoRedirect.js`

**Thay đổi trong logic redirect:**
```javascript
// Trước:
if (role === 'GUIDE') {
  navigate('/guide');
} else if (role === 'ADMIN') {
  navigate('/admin/dashboard');
} else {
  navigate('/');
}

// Sau:
if (role === 'GUIDE') {
  // Guide có thể truy cập trang chính, không redirect ngay lập tức
  // navigate('/guide');
  navigate('/');
} else {
  // Admin và user thường đều có thể truy cập trang chính
  navigate('/');
}
```

### 4. Frontend/src/components/Header/Header.jsx
**File:** `frontend/src/components/Header/Header.jsx`

**Thay đổi trong hiển thị role:**
```javascript
// Trước:
<span className={styles.userRole}>
  {userRole === 'ADMIN' ? 'Administrator' : 'User'}
</span>

// Sau:
<span className={styles.userRole}>
  {userRole === 'ADMIN' ? 'Administrator' : 
   userRole === 'GUIDE' ? 'Tour Guide' : 'User'}
</span>
```

### 5. Frontend/src/components/guide/GUIDE_REDIRECT_README.md
**File:** `frontend/src/components/guide/GUIDE_REDIRECT_README.md`

**Cập nhật tài liệu:**
- Thêm thông tin về quyền truy cập của guide
- Cập nhật luồng hoạt động cho guide
- Thêm bảng quyền truy cập chi tiết

## Kết quả

### Quyền truy cập sau khi thay đổi:

#### Guide:
- ✅ `/` - Trang chính (có thể truy cập)
- ✅ `/guide` - Trang guide (có thể truy cập)
- ✅ `/live-fully` - Trang du lịch (có thể truy cập)
- ✅ `/places-to-go` - Trang địa điểm (có thể truy cập)
- ✅ `/tour-dashboard` - Trang đặt tour (có thể truy cập)
- ✅ Tất cả các trang du lịch khác (có thể truy cập)
- ❌ `/admin/dashboard` - Trang admin (không thể truy cập)

#### Admin:
- ✅ `/` - Trang chính (có thể truy cập)
- ✅ `/admin/dashboard` - Trang admin (có thể truy cập)
- ✅ `/live-fully` - Trang du lịch (có thể truy cập)
- ✅ `/places-to-go` - Trang địa điểm (có thể truy cập)
- ✅ `/tour-dashboard` - Trang đặt tour (có thể truy cập)
- ✅ Tất cả các trang du lịch khác (có thể truy cập)
- ❌ `/guide` - Trang guide (không thể truy cập)

#### User thường:
- ✅ `/` - Trang chính (có thể truy cập)
- ✅ `/live-fully` - Trang du lịch (có thể truy cập)
- ✅ `/places-to-go` - Trang địa điểm (có thể truy cập)
- ✅ `/tour-dashboard` - Trang đặt tour (có thể truy cập)
- ✅ Tất cả các trang du lịch khác (có thể truy cập)
- ❌ `/admin/dashboard` - Trang admin (không thể truy cập)
- ❌ `/guide` - Trang guide (không thể truy cập)

## Luồng hoạt động mới

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

## Lưu ý
- API không cần thay đổi vì cấu hình bảo mật đã cho phép truy cập các endpoint công khai
- Header đã có sẵn logic hiển thị link "Guide Dashboard" và "Admin Dashboard" cho từng role
- Tất cả các chức năng admin và guide vẫn hoạt động bình thường
- Guide chỉ bị chặn khi cố truy cập trang admin, không bị chặn khi truy cập trang du lịch 