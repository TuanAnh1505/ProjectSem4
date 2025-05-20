import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../services/tour_service.dart';
import '../../services/booking_service.dart';
import '../../models/tour_models.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../booking/booking_passenger_screen.dart';

class TourDetailScreen extends StatefulWidget {
  final int tourId;
  const TourDetailScreen({Key? key, required this.tourId}) : super(key: key);

  @override
  State<TourDetailScreen> createState() => _TourDetailScreenState();
}

class _TourDetailScreenState extends State<TourDetailScreen> {
  final TourService _tourService = TourService();
  final BookingService _bookingService = BookingService();
  Tour? tour;
  List<dynamic> schedules = [];
  Map<int, List<dynamic>> itineraries = {};
  int? selectedScheduleId;
  bool loading = true;
  bool bookingLoading = false;
  String error = '';
  String discountCode = '';
  int? userId;

  String formatPrice(num? price) {
    if (price == null) return '';
    final formatter = NumberFormat('#,###', 'vi_VN');
    return formatter.format(price);
  }

  @override
  void initState() {
    super.initState();
    fetchAll();
    _loadUserId();
  }

  Future<void> _loadUserId() async {
    final prefs = await SharedPreferences.getInstance();
    // Print all keys to debug
    print('All SharedPreferences keys: ${prefs.getKeys()}');
    
    // Try different possible keys
    final userIdFromPrefs = prefs.getInt('user_id') ?? 
                          prefs.getInt('userId') ?? 
                          prefs.getInt('id');
    
    print('Found userId: $userIdFromPrefs');
    
    setState(() {
      userId = userIdFromPrefs;
    });
  }

  Future<void> fetchAll() async {
    setState(() { loading = true; error = ''; });
    try {
      tour = await _tourService.fetchTourDetail(widget.tourId);
      schedules = await _tourService.fetchSchedules(widget.tourId);
    } catch (e) {
      error = e.toString();
    } finally {
      setState(() { loading = false; });
    }
  }

  Future<void> fetchItineraries(int scheduleId) async {
    itineraries[scheduleId] = await _tourService.fetchItineraries(scheduleId);
    setState(() {});
  }

  void onSelectSchedule(int scheduleId) async {
    setState(() { selectedScheduleId = scheduleId; });
    await fetchItineraries(scheduleId);
  }

  Future<void> handleBooking() async {
    if (selectedScheduleId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chọn lịch trình')),
      );
      return;
    }

    if (userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng đăng nhập để đặt tour')),
      );
      return;
    }

    setState(() {
      bookingLoading = true;
      error = '';
    });

    try {
      final booking = await _bookingService.createBooking(
        userId: userId!,
        tourId: widget.tourId,
        scheduleId: selectedScheduleId!,
      );

      if (!mounted) return;

      // Tìm lịch trình đã chọn
      final selectedSchedule = schedules.firstWhere(
        (schedule) => schedule['scheduleId'] == selectedScheduleId,
        orElse: () => {'startDate': 'Unknown date'},
      );

      // Lấy danh sách hành trình của lịch trình đã chọn
      final selectedItineraries = itineraries[selectedScheduleId] ?? [];

      // Navigate to BookingPassengerScreen
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => BookingPassengerScreen(
            bookingId: booking['bookingId'],
            tour: tour!,
            selectedDate: selectedSchedule['startDate'] ?? '',
            itineraries: selectedItineraries,
          ),
        ),
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          bookingLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const Center(child: CircularProgressIndicator());
    if (error.isNotEmpty) return Center(child: Text(error));
    if (tour == null) return const Center(child: Text('Không tìm thấy tour'));

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Custom AppBar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                child: Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.arrow_back, color: Colors.orange),
                      onPressed: () => Navigator.pop(context),
                    ),
                    Expanded(
                      child: Text(
                        tour?.name ?? '',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.share_outlined, color: Colors.grey[700]),
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: Icon(Icons.favorite_border, color: Colors.pink),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),
              // Ảnh tour
              if (tour?.imageUrl != null && tour!.imageUrl!.isNotEmpty)
                ClipRRect(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(0), bottom: Radius.circular(0)),
                  child: Image.network(
                    'http://10.0.2.2:8080${tour!.imageUrl}',
                    width: double.infinity,
                    height: 220,
                    fit: BoxFit.cover,
                  ),
                ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Badge
                    Row(
                      children: [
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.blue[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('Popular', style: TextStyle(color: Colors.blue[900], fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                        SizedBox(width: 6),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.green[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('Instant Booking', style: TextStyle(color: Colors.green[900], fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    // Tên tour
                    Text(tour?.name ?? '', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blue[900])),
                    SizedBox(height: 6),
                    // Đánh giá
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 20),
                        SizedBox(width: 4),
                        Text('4.8', style: TextStyle(fontWeight: FontWeight.bold)),
                        SizedBox(width: 4),
                        Text('(128 đánh giá)', style: TextStyle(color: Colors.grey[700], fontSize: 13)),
                      ],
                    ),
                    SizedBox(height: 8),
                    // Mô tả
                    Text(
                      tour?.description ?? '',
                      style: TextStyle(fontSize: 15, color: Colors.grey[800]),
                    ),
                    SizedBox(height: 12),
                    // Giá
                    Row(
                      children: [
                        // Text('5.990.000 đ', style: TextStyle(decoration: TextDecoration.lineThrough, color: Colors.grey, fontSize: 15)),
                        SizedBox(width: 8),
                        Text('${formatPrice(tour?.price)} đ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22, color: Colors.orange[800])),
                      ],
                    ),
                    // SizedBox(height: 2),
                    // Text('Tiết kiệm 1.200.000 đ', style: TextStyle(color: Colors.green, fontSize: 13)),
                    SizedBox(height: 10),
                    Row(
                      children: [
                        Icon(Icons.calendar_today, size: 18, color: Colors.blue[700]),
                        SizedBox(width: 4),
                        Text('${tour?.duration ?? ''} ngày', style: TextStyle(fontSize: 14)),
                        SizedBox(width: 18),
                        Icon(Icons.group, size: 18, color: Colors.blue[700]),
                        SizedBox(width: 4),
                        Text('Tối đa ${tour?.maxParticipants ?? ''} người', style: TextStyle(fontSize: 14)),
                      ],
                    ),
                  ],
                ),
              ),
              // Lịch trình có sẵn
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(top: 8),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.event_note, color: Colors.blue[700], size: 20),
                        SizedBox(width: 6),
                        Text('Lịch trình có sẵn', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue[900])),
                      ],
                    ),
                    SizedBox(height: 10),
                    if (schedules.isEmpty)
                      const Text('Chưa có lịch trình cho tour này')
                    else
                      Column(
                        children: schedules.map((sch) {
                          bool isSelected = selectedScheduleId == sch['scheduleId'];
                          return Card(
                            color: isSelected ? Colors.blue[50] : Colors.grey[100],
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            child: ListTile(
                              onTap: () {
                                onSelectSchedule(sch['scheduleId']);
                              },
                              leading: Radio<int>(
                                value: sch['scheduleId'],
                                groupValue: selectedScheduleId,
                                onChanged: (val) {
                                  if (val != null) onSelectSchedule(val);
                                },
                              ),
                              title: Text(
                                sch['startDate'] != null && sch['endDate'] != null
                                  ? '${DateFormat('dd/MM/yyyy').format(DateTime.parse(sch['startDate']))} - ${DateFormat('dd/MM/yyyy').format(DateTime.parse(sch['endDate']))}'
                                  : 'Schedule: ${sch['startDate']} - ${sch['endDate']}',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              subtitle: Row(
                                children: [
                                  if (sch['status'] == 'pending')
                                    Container(
                                      margin: EdgeInsets.only(right: 8),
                                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.orange[100],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text('Đang chờ', style: TextStyle(color: Colors.orange[900], fontSize: 12)),
                                    ),
                                  if (sch['status'] == 'available')
                                    Container(
                                      margin: EdgeInsets.only(right: 8),
                                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.green[100],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text('Còn chỗ', style: TextStyle(color: Colors.green[900], fontSize: 12)),
                                    ),
                                  if (sch['availableSlots'] != null)
                                    Text('Còn ${sch['availableSlots']} chỗ trống', style: TextStyle(fontSize: 12, color: Colors.grey[700])),
                                ],
                              ),
                              trailing: Icon(Icons.chevron_right),
                            ),
                          );
                        }).toList(),
                      ),
                  ],
                ),
              ),
              // Chi tiết hành trình
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(top: 12),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.map, color: Colors.blue[700], size: 20),
                        SizedBox(width: 6),
                        Text('Chi tiết hành trình', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue[900])),
                      ],
                    ),
                    SizedBox(height: 10),
                    if (selectedScheduleId == null)
                      Container(
                        width: double.infinity,
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue[50],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text('Vui lòng chọn lịch trình phía trên để xem chi tiết hành trình.', style: TextStyle(color: Colors.blue[900])),
                      )
                    else if (itineraries[selectedScheduleId!] != null)
                      ...itineraries[selectedScheduleId!]!.map<Widget>((it) => Card(
                        child: ListTile(
                          title: Text(it['title'] ?? ''),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (it['startTime'] != null) Text('Bắt đầu: ${it['startTime']}'),
                              if (it['endTime'] != null) Text('Kết thúc: ${it['endTime']}'),
                              if (it['description'] != null) Text(it['description']),
                              if (it['type'] != null) Text('Loại: ${it['type']}'),
                            ],
                          ),
                        ),
                      )).toList(),
                  ],
                ),
              ),
              // Mã giảm giá và nút đặt ngay
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(top: 12, bottom: 12),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      decoration: InputDecoration(
                        hintText: 'Nhập mã giảm giá',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.card_giftcard),
                      ),
                      onChanged: (val) => discountCode = val,
                    ),
                    SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.orange,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: bookingLoading ? null : handleBooking,
                        child: bookingLoading ? const CircularProgressIndicator() : const Text('Đặt ngay', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                    ),
                    SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.verified, color: Colors.grey, size: 18),
                        SizedBox(width: 6),
                        Text('Đảm bảo hoàn tiền trong 24h', style: TextStyle(color: Colors.grey[700], fontSize: 13)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
