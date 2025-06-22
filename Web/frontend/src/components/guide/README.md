# Trang Hướng dẫn viên (Guide Dashboard)

## Tổng quan
Trang Guide Dashboard được thiết kế dành riêng cho các hướng dẫn viên để quản lý và theo dõi các tour đã được phân công.

## Tính năng chính

### 1. Bảng điều khiển (Dashboard)
- **Thống kê tổng quan**: Hiển thị số lượng tour đã hoàn thành, đang thực hiện, sắp tới và tổng số tour
- **Lọc theo trạng thái**: Có thể lọc tour theo các danh mục:
  - Tất cả
  - Sắp tới (upcoming)
  - Đang thực hiện (ongoing)
  - Đã hoàn thành (completed)

### 2. Danh sách tour được phân công
- **Thông tin tour**: Tên tour, mô tả, hình ảnh, giá, thời gian
- **Thông tin phân công**: Vai trò (hướng dẫn viên chính/phụ/chuyên gia), ngày bắt đầu/kết thúc
- **Trạng thái**: Đã phân công, đang thực hiện, hoàn thành, đã hủy
- **Phân loại tự động**: Hệ thống tự động phân loại tour dựa trên ngày tháng:
  - **Đã hoàn thành**: Tour có ngày kết thúc trong quá khứ
  - **Đang thực hiện**: Tour đang diễn ra (ngày hiện tại nằm trong khoảng thời gian tour)
  - **Sắp tới**: Tour có ngày bắt đầu trong tương lai

### 3. Quản lý trạng thái
- **Hướng dẫn viên chính** có thể:
  - Bắt đầu tour (chuyển từ "Đã phân công" sang "Đang thực hiện")
  - Hoàn thành tour (chuyển từ "Đang thực hiện" sang "Hoàn thành")
- **Hướng dẫn viên phụ** chỉ có thể xem thông tin

### 4. Xem chi tiết tour
- Modal hiển thị thông tin chi tiết về tour
- Bao gồm: hình ảnh, mô tả, điểm đến, sự kiện, thông tin cơ bản

## Cấu trúc file

```
frontend/src/components/guide/
├── GuidePage.js          # Trang chính với navigation
├── GuidePage.css         # CSS cho trang chính
├── GuideDashboard.js     # Component bảng điều khiển
├── GuideDashboard.css    # CSS cho bảng điều khiển
├── TourDetail.js         # Component modal chi tiết tour
├── TourDetail.css        # CSS cho modal
└── README.md            # File hướng dẫn này
```

## API Endpoints sử dụng

### Backend
- `GET /api/tour-guide-assignments/my-assignments-details` - Lấy danh sách assignment của guide hiện tại
- `PUT /api/tour-guide-assignments/{assignmentId}/status` - Cập nhật trạng thái assignment
- `GET /api/tours/{tourId}` - Lấy thông tin chi tiết tour

## Cách sử dụng

### 1. Truy cập trang
- Đăng nhập với tài khoản có role "GUIDE"
- Truy cập đường dẫn `/guide`

### 2. Xem thống kê
- Dashboard hiển thị 4 thẻ thống kê với màu sắc khác nhau
- Số liệu được cập nhật tự động

### 3. Lọc tour
- Sử dụng các nút lọc ở đầu danh sách
- Có thể chuyển đổi giữa các danh mục khác nhau

### 4. Quản lý trạng thái
- Chỉ hướng dẫn viên chính mới thấy nút "Bắt đầu" và "Hoàn thành"
- Click vào nút tương ứng để cập nhật trạng thái

### 5. Xem chi tiết
- Click vào nút "Xem chi tiết" để mở modal
- Modal hiển thị đầy đủ thông tin tour
- Click "×" hoặc click bên ngoài để đóng modal

## Responsive Design
- Trang được thiết kế responsive cho mobile và desktop
- Sidebar sẽ chuyển thành navigation ngang trên mobile
- Grid layout tự động điều chỉnh theo kích thước màn hình

## Bảo mật
- Chỉ user có role "GUIDE" mới có thể truy cập
- Mỗi guide chỉ thấy tour được phân công cho mình
- Chỉ hướng dẫn viên chính mới có quyền cập nhật trạng thái

## Tính năng tương lai
- [ ] Trang thông tin cá nhân guide
- [ ] Lịch trình chi tiết
- [ ] Báo cáo và thống kê
- [ ] Quản lý feedback từ khách hàng
- [ ] Thông báo real-time 