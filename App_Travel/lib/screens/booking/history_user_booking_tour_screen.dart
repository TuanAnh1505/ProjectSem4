import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:app_travel/services/tour_service.dart';
import 'package:app_travel/models/tour_models.dart';

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
    return bookings.where((b) => b['status'] == filterStatus).toList();
  }

  Color statusColor(String? status) {
    switch (status) {
      case 'CONFIRMED': return Colors.green;
      case 'CANCELLED': return Colors.red;
      case 'PENDING': return Colors.orange;
      default: return Colors.blueGrey;
    }
  }

  IconData statusIcon(String? status) {
    switch (status) {
      case 'CONFIRMED': return Icons.check_circle;
      case 'CANCELLED': return Icons.cancel;
      case 'PENDING': return Icons.hourglass_top;
      default: return Icons.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lịch sử đặt tour'),
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
                              label: Text(f['label']),
                              selected: filterStatus == f['value'],
                              selectedColor: Colors.orange,
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
                                            b['paymentStatus'] ?? '',
                                            valueColor: (b['paymentStatus'] == 'COMPLETED')
                                                ? Colors.green
                                                : (b['paymentStatus'] == 'FAILED')
                                                    ? Colors.red
                                                    : Colors.orange,
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
    switch (status) {
      case 'CONFIRMED': return Colors.green;
      case 'CANCELLED': return Colors.red;
      case 'PENDING': return Colors.orange;
      default: return Colors.blueGrey;
    }
  }

  IconData statusIcon(String? status) {
    switch (status) {
      case 'CONFIRMED': return Icons.check_circle;
      case 'CANCELLED': return Icons.cancel;
      case 'PENDING': return Icons.hourglass_top;
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
                      Divider(height: 32, thickness: 1.2),
                      Text('Thông tin lịch trình', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.orange[800])),
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
                      Text('Thông tin thanh toán', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.green[800])),
                      const SizedBox(height: 8),
                      _infoRow(Icons.attach_money, 'Tổng tiền', '${totalPrice.toString()}đ', valueColor: Colors.green[700]),
                      _infoRow(Icons.payment, 'Thanh toán', paymentStatus,
                        valueColor: paymentStatus.toString().toUpperCase() == 'COMPLETED'
                            ? Colors.green
                            : paymentStatus.toString().toUpperCase() == 'FAILED'
                                ? Colors.red
                                : Colors.blue),
                      Divider(height: 32, thickness: 1.2),
                      Text('Trạng thái', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.blueGrey[700])),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(statusIcon(bookingStatus), size: 22, color: statusColor(bookingStatus)),
                          const SizedBox(width: 8),
                          Text(
                            bookingStatus,
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

  Widget _infoRow(IconData icon, String label, String value, {Color? valueColor}) {
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
                fontSize: 15,
                color: valueColor ?? Colors.black87,
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}






