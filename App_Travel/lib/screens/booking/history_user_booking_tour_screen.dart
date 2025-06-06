import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:app_travel/services/tour_service.dart';
import 'package:app_travel/models/tour_models.dart';
import 'package:intl/intl.dart';

class HistoryUserBookingTourScreen extends StatefulWidget {
  const HistoryUserBookingTourScreen({Key? key}) : super(key: key);

  @override
  State<HistoryUserBookingTourScreen> createState() => _HistoryUserBookingTourScreenState();
}

class _HistoryUserBookingTourScreenState extends State<HistoryUserBookingTourScreen> {
  List<dynamic> bookings = [];
  bool loading = true;
  String error = '';
  String filterStatus = 'ALL';
  final List<Map<String, dynamic>> statusFilters = [
    {'label': 'Tất cả', 'value': 'ALL'},
    {'label': 'Đã xác nhận', 'value': 'CONFIRMED'},
    {'label': 'Đã hủy', 'value': 'CANCELLED'},
    {'label': 'Đang chờ', 'value': 'PENDING'},
    {'label': 'Đã thanh toán', 'value': 'COMPLETED'},
    {'label': 'Thanh toán thất bại', 'value': 'FAILED'},
  ];

  @override
  void initState() {
    super.initState();
    fetchBookings();
  }

  Future<void> fetchBookings() async {
    setState(() { loading = true; error = ''; });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final publicId = prefs.getString('public_id');
      if (publicId == null || token == null) {
        setState(() {
          loading = false;
          error = 'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.';
        });
        return;
      }
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/bookings/user/$publicId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          bookings = data is List ? data : [];
        });
      } else {
        setState(() {
          error = 'Không thể tải lịch sử booking.';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Lỗi: $e';
      });
    } finally {
      setState(() { loading = false; });
    }
  }

  void goToBookingDetail(Map booking) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BookingDetailScreen(booking: booking),
      ),
    );
  }

  List<dynamic> get filteredBookings {
    if (filterStatus == 'ALL') return bookings;
    return bookings.where((b) => 
      b['status']?.toString().toUpperCase() == filterStatus ||
      b['bookingStatus']?.toString().toUpperCase() == filterStatus
    ).toList();
  }

  Color statusColor(String? status) {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return Colors.green;
      case 'CANCELLED': return Colors.red;
      case 'PENDING': return Colors.orange;
      case 'COMPLETED': return Colors.green;
      case 'FAILED': return Colors.red;
      case 'PROCESSING': return Colors.blue;
      default: return Colors.blueGrey;
    }
  }

  String getStatusText(String? status) {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'CANCELLED': return 'Đã hủy';
      case 'PENDING': return 'Đang chờ';
      case 'COMPLETED': return 'Đã thanh toán';
      case 'FAILED': return 'Thanh toán thất bại';
      case 'PROCESSING': return 'Đang xử lý';
      default: return status ?? 'Không xác định';
    }
  }

  IconData statusIcon(String? status) {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return Icons.check_circle;
      case 'CANCELLED': return Icons.cancel;
      case 'PENDING': return Icons.hourglass_top;
      case 'COMPLETED': return Icons.check_circle;
      case 'FAILED': return Icons.error;
      case 'PROCESSING': return Icons.sync;
      default: return Icons.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lịch sử đặt tour'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: fetchBookings,
          ),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error.isNotEmpty
              ? Center(child: Text(error))
              : Column(
                  children: [
                    // Thanh lọc trạng thái
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: statusFilters.map((f) => Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: ChoiceChip(
                              label: Text(
                                f['label'],
                                style: TextStyle(
                                  color: filterStatus == f['value'] ? Colors.white : Colors.black,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              selected: filterStatus == f['value'],
                              selectedColor: Colors.orange,
                              checkmarkColor: Colors.white,
                              onSelected: (_) {
                                setState(() { filterStatus = f['value']; });
                              },
                            ),
                          )).toList(),
                        ),
                      ),
                    ),
                    Expanded(
                      child: filteredBookings.isEmpty
                          ? const Center(child: Text('Bạn chưa có booking nào.'))
                          : ListView.separated(
                              padding: const EdgeInsets.all(16),
                              itemCount: filteredBookings.length,
                              separatorBuilder: (_, __) => SizedBox(height: 14),
                              itemBuilder: (context, idx) {
                                final b = filteredBookings[idx];
                                return Card(
                                  elevation: 1.5,
                                  margin: EdgeInsets.zero,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  color: Colors.white,
                                  child: InkWell(
                                    borderRadius: BorderRadius.circular(16),
                                    onTap: () => goToBookingDetail(b),
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Icon(Icons.flag, color: Colors.orange, size: 20),
                                              SizedBox(width: 8),
                                              Expanded(
                                                child: Text(
                                                  b['tourName'] ?? b['tour']?['name'] ?? 'Tour',
                                                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: Colors.black),
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ),
                                              if (b['bookingCode'] != null && b['bookingCode'].toString().isNotEmpty)
                                                Container(
                                                  margin: EdgeInsets.only(left: 8),
                                                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: Colors.orange.shade100,
                                                    borderRadius: BorderRadius.circular(8),
                                                    border: Border.all(color: Colors.orange, width: 1.2),
                                                  ),
                                                  child: Row(
                                                    children: [
                                                      Icon(Icons.qr_code, color: Colors.orange[800], size: 16),
                                                      SizedBox(width: 4),
                                                      Text(
                                                        b['bookingCode'],
                                                        style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange[800], fontSize: 14),
                                                      ),
                                                    ],
                                                  ),
                                                )
                                              else
                                                Container(
                                                  margin: EdgeInsets.only(left: 8),
                                                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: Colors.grey.shade100,
                                                    borderRadius: BorderRadius.circular(8),
                                                  ),
                                                  child: Text(
                                                    b['bookingId']?.toString() ?? '',
                                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey[700], fontSize: 13),
                                                  ),
                                                ),
                                              Icon(Icons.info_outline, color: Colors.grey[400], size: 18),
                                            ],
                                          ),
                                          SizedBox(height: 10),
                                          _bookingInfoRow(Icons.event, 'Lịch trình', b['scheduleInfo'] ?? (b['schedule'] != null ? (b['schedule']['startDate'] ?? '') + ' - ' + (b['schedule']['endDate'] ?? '') : '')),
                                          SizedBox(height: 4),
                                          _bookingInfoRow(Icons.people, 'Số người', '${b['passengerCount'] ?? b['numPassengers'] ?? b['totalPassengers'] ?? 1}'),
                                          SizedBox(height: 4),
                                          _bookingInfoRow(Icons.attach_money, 'Tổng tiền', '${(b['totalPrice'] ?? b['totalAmount'] ?? 0).toString()}đ'),
                                          SizedBox(height: 4),
                                          _bookingInfoRow(
                                            Icons.payment,
                                            'Thanh toán',
                                            getStatusText(b['paymentStatus']),
                                            valueColor: statusColor(b['paymentStatus']),
                                          ),
                                          SizedBox(height: 4),
                                          _bookingInfoRow(
                                            Icons.info,
                                            'Trạng thái',
                                            getStatusText(b['status']),
                                            valueColor: statusColor(b['status']),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
    );
  }

  Widget _bookingInfoRow(IconData icon, String label, String value, {Color? valueColor}) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.orange),
        SizedBox(width: 6),
        Text(label, style: TextStyle(fontSize: 13.5, color: Colors.black87)),
        SizedBox(width: 4),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              fontSize: 13.5,
              color: valueColor ?? Colors.black87,
              fontWeight: FontWeight.w500,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}

class BookingDetailScreen extends StatefulWidget {
  final Map booking;
  const BookingDetailScreen({Key? key, required this.booking}) : super(key: key);

  @override
  State<BookingDetailScreen> createState() => _BookingDetailScreenState();
}

class _BookingDetailScreenState extends State<BookingDetailScreen> {
  bool loading = true;
  Tour? tour;
  String error = '';
  bool hasTourId = false;

  @override
  void initState() {
    super.initState();
    fetchTourDetail();
  }

  Future<void> fetchTourDetail() async {
    try {
      final tourService = TourService();
      print('Booking data: ${widget.booking}');
      final tourId = widget.booking['tourId'] ??
                     widget.booking['id'] ??
                     widget.booking['tour_id'] ??
                     widget.booking['tour']?['id'] ??
                     widget.booking['tour']?['tourId'] ??
                     widget.booking['tour']?['tour_id'];
      print('Extracted tourId: ${tourId}');
      if (tourId != null && tourId != 0) {
        hasTourId = true;
        final tourData = await tourService.fetchTourDetail(tourId);
        setState(() {
          tour = tourData;
          loading = false;
        });
      } else if (widget.booking['tourName'] != null) {
        // Không có tourId, thử tìm theo tên tour
        final allTours = await tourService.fetchTours();
        Tour? foundTour;
        try {
          foundTour = allTours.firstWhere((t) => t.name == widget.booking['tourName']);
        } catch (e) {
          foundTour = null;
        }
        setState(() {
          tour = foundTour;
          loading = false;
        });
      } else {
        setState(() {
          hasTourId = false;
          loading = false;
        });
      }
    } catch (e) {
      print('Error fetching tour detail: ${e}');
      setState(() {
        error = 'Lỗi: ${e}';
        loading = false;
      });
    }
  }

  Color statusColor(String? status) {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return Colors.green;
      case 'CANCELLED': return Colors.red;
      case 'PENDING': return Colors.orange;
      case 'COMPLETED': return Colors.green;
      case 'FAILED': return Colors.red;
      case 'PROCESSING': return Colors.blue;
      default: return Colors.blueGrey;
    }
  }

  String getStatusText(String? status) {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'CANCELLED': return 'Đã hủy';
      case 'PENDING': return 'Đang chờ';
      case 'COMPLETED': return 'Đã thanh toán';
      case 'FAILED': return 'Thanh toán thất bại';
      case 'PROCESSING': return 'Đang xử lý';
      default: return status ?? 'Không xác định';
    }
  }

  IconData statusIcon(String? status) {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return Icons.check_circle;
      case 'CANCELLED': return Icons.cancel;
      case 'PENDING': return Icons.hourglass_top;
      case 'COMPLETED': return Icons.check_circle;
      case 'FAILED': return Icons.error;
      case 'PROCESSING': return Icons.sync;
      default: return Icons.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    final booking = widget.booking;
    final tourName = tour?.name ?? booking['tourName'] ?? booking['tour']?['name'] ?? '';
    final tourDesc = tour?.description ?? booking['tourDescription'] ?? booking['tour']?['description'] ?? '';
    final tourImg = tour?.imageUrl ?? booking['tourImage'] ?? booking['tour']?['imageUrl'] ?? booking['tour']?['image_url'];
    final destination = booking['destination'] ?? booking['tour']?['destination'] ?? '';
    final departure = booking['departure'] ?? booking['tour']?['departure'] ?? '';
    final hotel = booking['hotel'] ?? booking['tour']?['hotel'] ?? '';
    final startDate = booking['schedule']?['startDate'] ?? booking['startDate'] ?? '';
    final endDate = booking['schedule']?['endDate'] ?? booking['endDate'] ?? '';
    final scheduleInfo = booking['scheduleInfo'] ?? '';
    final passengerCount = booking['passengerCount'] ?? booking['numPassengers'] ?? booking['totalPassengers'] ?? 1;
    final totalPrice = booking['totalPrice'] ?? booking['totalAmount'] ?? 0;
    final paymentStatus = booking['paymentStatus'] ?? booking['payment_status'] ?? '';
    final bookingStatus = booking['status'] ?? '';

    // Sửa logic hiển thị mã đặt chỗ
    final code = (booking['bookingCode']?.toString() ?? '').trim();
    final displayCode = code.isNotEmpty ? code : (booking['bookingId']?.toString() ?? '');

    return Scaffold(
      appBar: AppBar(title: const Text('Chi tiết booking')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error.isNotEmpty
              ? Center(child: Text(error))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (tourImg != null && tourImg.toString().isNotEmpty)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            tourImg.toString().startsWith('http') ? tourImg : 'http://10.0.2.2:8080${tourImg}',
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        ),
                      const SizedBox(height: 16),
                      Text(
                        tourName,
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24, color: Colors.blue[900]),
                      ),
                      if (tourDesc.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
                          child: Text(
                            tourDesc,
                            style: TextStyle(fontSize: 15, color: Colors.grey[800]),
                          ),
                        ),

                       _infoRow(Icons.qr_code, 'Mã đặt chỗ', displayCode, valueColor: Colors.orange, fontWeight: FontWeight.bold, fontSize: 18),
                      Divider(height: 32, thickness: 1.2),
                      Text('Thông tin lịch trình', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.orange)),
                      const SizedBox(height: 8),
                      if (destination.isNotEmpty)
                        _infoRow(Icons.location_on, 'Điểm đến', destination),
                      if (departure.isNotEmpty)
                        _infoRow(Icons.departure_board, 'Khởi hành', departure),
                      if (hotel.isNotEmpty)
                        _infoRow(Icons.hotel, 'Khách sạn', hotel),
                      if (scheduleInfo.isNotEmpty)
                        _infoRow(Icons.event, 'Lịch trình', scheduleInfo),
                      if (startDate.isNotEmpty || endDate.isNotEmpty)
                        _infoRow(Icons.date_range, 'Ngày đi - Ngày về', '$startDate - $endDate'),
                      _infoRow(Icons.people, 'Số người', '$passengerCount'),
                      Divider(height: 32, thickness: 1.2),
                      Text('Thông tin thanh toán', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.orange)),
                      const SizedBox(height: 8),
                      _infoRow(Icons.attach_money, 'Tổng tiền', formatCurrency(totalPrice), valueColor: Colors.orange, fontSize: 18),
                      _infoRow(Icons.payment, 'Thanh toán', getStatusText(paymentStatus),
                        valueColor: statusColor(paymentStatus)),
                      Divider(height: 32, thickness: 1.2),
                      Text('Trạng thái', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.blueGrey[700])),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(statusIcon(bookingStatus), size: 22, color: statusColor(bookingStatus)),
                          const SizedBox(width: 8),
                          Text(
                            getStatusText(bookingStatus),
                            style: TextStyle(
                              color: statusColor(bookingStatus),
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                     
                    ],
                  ),
                ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value, {Color? valueColor, FontWeight? fontWeight, double? fontSize}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.blueGrey),
          const SizedBox(width: 8),
          Text('$label: ', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontSize: fontSize ?? 15,
                color: valueColor ?? Colors.black87,
                fontWeight: fontWeight ?? FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  String formatCurrency(dynamic amount) {
    if (amount == null) return '0 ₫';
    final number = amount is String ? double.tryParse(amount) ?? 0 : amount.toDouble();
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(number);
  }
}






