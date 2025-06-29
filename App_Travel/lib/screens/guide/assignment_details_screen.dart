import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/guide_models.dart';
import '../../services/guide_service.dart';
import '../../services/booking_passenger_service.dart';

class AssignmentDetailsScreen extends StatefulWidget {
  final TourGuideAssignment assignment;

  const AssignmentDetailsScreen({
    Key? key,
    required this.assignment,
  }) : super(key: key);


  @override
  State<AssignmentDetailsScreen> createState() => _AssignmentDetailsScreenState();
}

class _AssignmentDetailsScreenState extends State<AssignmentDetailsScreen> {
  final GuideService _guideService = GuideService();
  final BookingPassengerService _bookingPassengerService = BookingPassengerService();
  List<String> tourImages = [];
  bool isLoadingImages = true;
  int galleryIndex = 0;
  
  List<dynamic> schedules = [];
  Map<int, List<dynamic>> itineraries = {};
  Map<int, List<Map<String, dynamic>>> bookingPassengers = {};
  bool isLoadingSchedules = false;
  bool isLoadingPassengers = false;
  int? selectedScheduleId;
  int? expandedScheduleId;

  @override
  void initState() {
    super.initState();
    _loadTourImages();
    _loadSchedules();
  }

  Future<void> _loadTourImages() async {
    try {
      final images = await _guideService.fetchTourImages(widget.assignment.tourId);
      setState(() {
        tourImages = images;
        isLoadingImages = false;
      });
    } catch (e) {
      print('Error loading tour images: $e');
      setState(() {
        isLoadingImages = false;
      });
    }
  }

  Future<void> _loadSchedules() async {
    setState(() {
      isLoadingSchedules = true;
    });
    
    try {
      print('Loading schedules for tourId: ${widget.assignment.tourId}');
      final schedulesList = await _guideService.fetchSchedules(widget.assignment.tourId);
      print('Loaded schedules: $schedulesList');
      
      if (schedulesList.isEmpty) {
        print('No schedules found');
        setState(() {
          schedules = [];
          isLoadingSchedules = false;
        });
        return;
      }

      setState(() {
        schedules = schedulesList;
        isLoadingSchedules = false;
      });
      
      // Load itineraries cho schedule đầu tiên nếu có
      if (schedulesList.isNotEmpty) {
        print('Loading itineraries for first schedule');
        await _loadItineraries(schedulesList[0]['scheduleId']);
      }
      // Load booking passengers for all schedules (after schedules is set)
      for (var schedule in schedulesList) {
        final scheduleId = schedule['scheduleId'] ?? schedule['id'];
        await _loadBookingPassengers(scheduleId);
      }
    } catch (e) {
      print('Error loading schedules: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Có lỗi khi tải lịch trình: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
      setState(() {
        schedules = [];
        isLoadingSchedules = false;
      });
    }
  }

  Future<void> _loadItineraries(int scheduleId) async {
    try {
      print('Loading itineraries for scheduleId: $scheduleId');
      final itinerariesList = await _guideService.fetchItineraries(scheduleId);
      print('Loaded itineraries: $itinerariesList');
      
      setState(() {
        itineraries[scheduleId] = itinerariesList;
        selectedScheduleId = scheduleId;
      });
    } catch (e) {
      print('Error loading itineraries: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Có lỗi khi tải chi tiết hành trình: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _loadBookingPassengers(int scheduleId) async {
    try {
      setState(() {
        isLoadingPassengers = true;
      });
      final passengers = await _bookingPassengerService.fetchPassengersBySchedule(scheduleId);
      setState(() {
        bookingPassengers[scheduleId] = passengers;
        isLoadingPassengers = false;
      });
    } catch (e) {
      setState(() {
        isLoadingPassengers = false;
      });
    }
  }

  String _getPassengerType(String? type) {
    switch (type?.toLowerCase()) {
      case 'adult':
        return 'Người lớn';
      case 'child':
        return 'Trẻ em';
      case 'infant':
        return 'Em bé';
      default:
        return type ?? 'Không xác định';
    }
  }

  void openGallery(List<String> images, int initialIndex) {
    Navigator.of(context).push(
      PageRouteBuilder(
        opaque: false,
        pageBuilder: (context, animation, secondaryAnimation) {
          return Scaffold(
            backgroundColor: Colors.black,
            body: Stack(
              children: [
                PageView.builder(
                  itemCount: images.length,
                  controller: PageController(initialPage: initialIndex),
                  onPageChanged: (index) {
                    setState(() {
                      galleryIndex = index;
                    });
                  },
                  itemBuilder: (context, index) {
                    return Center(
                      child: InteractiveViewer(
                        child: Image.network(
                          _getImageUrl(images[index]),
                          fit: BoxFit.contain,
                          loadingBuilder: (context, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return Center(
                              child: CircularProgressIndicator(
                                value: loadingProgress.expectedTotalBytes != null
                                    ? loadingProgress.cumulativeBytesLoaded /
                                        loadingProgress.expectedTotalBytes!
                                    : null,
                                color: Colors.white,
                              ),
                            );
                          },
                          errorBuilder: (context, error, stackTrace) {
                            return Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.error, color: Colors.white, size: 48),
                                  SizedBox(height: 16),
                                  Text(
                                    'Lỗi tải hình ảnh',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    );
                  },
                ),
                // Close button
                Positioned(
                  top: 40,
                  right: 20,
                  child: GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.close, color: Colors.white, size: 24),
                    ),
                  ),
                ),
                // Image counter
                Positioned(
                  top: 40,
                  left: 20,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      '${galleryIndex + 1}/${images.length}',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    );
  }

  String _getImageUrl(String imagePath) {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return 'http://10.0.2.2:8080$imagePath';
  }

  @override
  Widget build(BuildContext context) {
    final isPast = widget.assignment.endDate.isBefore(DateTime.now());
    final isOngoing = widget.assignment.startDate.isBefore(DateTime.now()) && 
                     widget.assignment.endDate.isAfter(DateTime.now());

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Chi tiết phân công',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 20,
            color: Colors.black,
          ),
        ),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(20),
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(12),
            ),
            // child: IconButton(
            //   onPressed: () => Navigator.of(context).pop(),
            //   icon: const Icon(Icons.close, color: Colors.orange),
            //   tooltip: 'Đóng',
            // ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildGuideInfoCard(context),
            const SizedBox(height: 20),
            _buildScheduleAndRoleCard(context),
            const SizedBox(height: 20),
            _buildStatusInfoCard(context, isPast, isOngoing),
            const SizedBox(height: 20),
            _buildTourInfo(context, isPast, isOngoing),
            const SizedBox(height: 20),
            // Booking Passengers Section
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    spreadRadius: 1,
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(16),
                        topRight: Radius.circular(16),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.people, color: Colors.blue, size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Danh sách khách hàng',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (isLoadingPassengers)
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.all(16.0),
                              child: CircularProgressIndicator(),
                            ),
                          )
                        else if (schedules.isEmpty)
                          Center(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                'Chưa có lịch trình nào',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ),
                          )
                        else
                          ...schedules
                              .where((s) {
                                final scheduleStart = DateTime.parse(s['startDate']);
                                final scheduleEnd = DateTime.parse(s['endDate']);
                                return scheduleStart.isAtSameMomentAs(widget.assignment.startDate) &&
                                       scheduleEnd.isAtSameMomentAs(widget.assignment.endDate);
                              })
                              .toList()
                              .asMap()
                              .entries
                              .map((entry) {
                                final index = entry.key;
                                final schedule = entry.value;
                                final scheduleId = schedule['scheduleId'] ?? schedule['id'];
                                final passengers = bookingPassengers[scheduleId] ?? [];
                                
                                print('Rendering schedule $scheduleId with ${passengers.length} passengers');
                                
                                // Tạo map id -> tên và id -> số điện thoại cho tất cả passengers
                                final Map<dynamic, String> idToName = {
                                  for (var p in passengers) p['passengerId']: p['fullName']
                                };
                                final Map<dynamic, String> idToPhone = {
                                  for (var p in passengers) p['passengerId']: (p['phone'] ?? p['phoneNumber'] ?? '')
                                };

                                return Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(vertical: 12),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'Lịch trình: ${_formatDate(DateTime.parse(schedule['startDate']))} - ${_formatDate(DateTime.parse(schedule['endDate']))}',
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.blue,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            'Số lượng khách: ${passengers.length}',
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (passengers.isEmpty)
                                      Padding(
                                        padding: const EdgeInsets.only(bottom: 16.0),
                                        child: Text(
                                          'Chưa có khách hàng đặt tour',
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: Colors.grey[600],
                                            fontStyle: FontStyle.italic,
                                          ),

                                        ),
                                      )
                                    else
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          // Danh sách người lớn
                                          if (passengers.where((p) => (p['passengerType']?.toLowerCase() ?? '') == 'adult').isNotEmpty) ...[
                                            Container(
                                              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                                              decoration: BoxDecoration(
                                                color: Colors.blue.shade50,
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: Text(
                                                'Người lớn (${passengers.where((p) => (p['passengerType']?.toLowerCase() ?? '') == 'adult').length} người)',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                  color: Colors.blue.shade700,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(height: 8),
                                            SingleChildScrollView(
                                              scrollDirection: Axis.horizontal,
                                              child: DataTable(
                                                headingRowColor: MaterialStateProperty.all(Colors.blue.shade50),
                                                columns: const [
                                                  DataColumn(label: Text('Họ tên')),
                                                  DataColumn(label: Text('Số điện thoại')),
                                                  DataColumn(label: Text('Email')),
                                                ],
                                                rows: passengers
                                                    .where((p) => (p['passengerType']?.toLowerCase() ?? '') == 'adult')
                                                    .map((passenger) {
                                                  return DataRow(
                                                    cells: [
                                                      DataCell(Text(passenger['fullName'] ?? '')),
                                                      DataCell(Text(passenger['phone'] ?? passenger['phoneNumber'] ?? '')),
                                                      DataCell(Text(passenger['email'] ?? '')),
                                                    ],
                                                  );
                                                }).toList(),
                                              ),
                                            ),
                                            const SizedBox(height: 16),
                                          ],
                                          
                                          // Danh sách trẻ em và em bé
                                          if (passengers.where((p) => (p['passengerType']?.toLowerCase() ?? '') == 'child' || (p['passengerType']?.toLowerCase() ?? '') == 'infant').isNotEmpty) ...[
                                            Container(
                                              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                                              decoration: BoxDecoration(
                                                color: Colors.blue.shade50,
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: Text(
                                                'Trẻ em & Em bé (${passengers.where((p) => (p['passengerType']?.toLowerCase() ?? '') == 'child' || (p['passengerType']?.toLowerCase() ?? '') == 'infant').length} người)',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                  color: Colors.blue.shade700,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(height: 8),
                                            SingleChildScrollView(
                                              scrollDirection: Axis.horizontal,
                                              child: DataTable(
                                                headingRowColor: MaterialStateProperty.all(Colors.blue.shade50),
                                                columns: const [
                                                  DataColumn(label: Text('Họ tên')),
                                                  DataColumn(label: Text('Loại khách')),
                                                  DataColumn(label: Text('Người giám hộ')),
                                                ],
                                                rows: passengers
                                                    .where((p) => (p['passengerType']?.toLowerCase() ?? '') == 'child' || (p['passengerType']?.toLowerCase() ?? '') == 'infant')
                                                    .map((passenger) {
                                                  return DataRow(
                                                    cells: [
                                                      DataCell(Text(passenger['fullName'] ?? '')),
                                                      DataCell(Text(_getPassengerType(passenger['passengerType']))),
                                                      DataCell(Text(
                                                        idToName[passenger['guardianPassengerId']] != null
                                                          ? '${idToName[passenger['guardianPassengerId']]}'
                                                            '${idToPhone[passenger['guardianPassengerId']] != null && idToPhone[passenger['guardianPassengerId']]!.isNotEmpty
                                                              ? ' (${idToPhone[passenger['guardianPassengerId']]})'
                                                              : ''}'
                                                          : 'Chưa xác định',
                                                      )),
                                                    ],
                                                  );
                                                }).toList(),
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                    if (index != schedules.length - 1)
                                      const Divider(height: 32),
                                  ],
                                );
                              })
                              .toList(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  // FORM 1: Widget hiển thị thông tin hướng dẫn viên
  Widget _buildGuideInfoCard(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Row(
            //   children: [
            //     // Container(
            //     //   padding: const EdgeInsets.all(12),
            //     //   decoration: BoxDecoration(
            //     //     color: Theme.of(context).primaryColor.withOpacity(0.1),
            //     //     borderRadius: BorderRadius.circular(12),
            //     //   ),
            //     // //   child: Icon(
            //     // //     Icons.person,
            //     // //     color: Theme.of(context).primaryColor,
            //     // //     size: 24,
            //     // //   ),
            //     // ),
            //     const SizedBox(width: 16),
            //     const Text(
            //       'Thông tin hướng dẫn viên',
            //       style: TextStyle(
            //         fontSize: 18,
            //         fontWeight: FontWeight.bold,
            //         color: Color(0xFF1F2937),
            //       ),
            //     ),
            //   ],
            // ),
            const SizedBox(height: 20),
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.person,
                    color: Theme.of(context).primaryColor,
                    size: 30,
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.assignment.guideName ?? 'Không xác định',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1F2937),
                        ),
                      ),
                      if (widget.assignment.guideSpecialization?.isNotEmpty == true) ...[
                        const SizedBox(height: 8),
                        Text(
                          'Chuyên môn: ${widget.assignment.guideSpecialization}',
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                      ],
                      if (widget.assignment.guideRating != null) ...[
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Text(
                              'Đánh giá: ',
                              style: TextStyle(
                                fontSize: 14,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                            ...List.generate(
                              5,
                              (index) => Icon(
                                index < (widget.assignment.guideRating ?? 0).floor()
                                    ? Icons.star
                                    : Icons.star_border,
                                size: 18,
                                color: const Color(0xFFFBBF24),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              widget.assignment.guideRating!.toStringAsFixed(1),
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // FORM 2: Widget hiển thị lịch trình và vai trò
  Widget _buildScheduleAndRoleCard(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.green.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.schedule,
                    color: Colors.green,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                const Text(
                  'Lịch trình & Vai trò',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: _showScheduleDetails,
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.green.withOpacity(0.2)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.calendar_today,
                                size: 20,
                                color: Colors.green[700],
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Lịch trình',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green[700],
                                ),
                              ),
                              const Spacer(),
                              Icon(
                                Icons.arrow_forward_ios,
                                size: 16,
                                color: Colors.green[700],
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Từ: ${_formatDate(widget.assignment.startDate)}',
                            style: const TextStyle(
                              fontSize: 14,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Đến: ${_formatDate(widget.assignment.endDate)}',
                            style: const TextStyle(
                              fontSize: 14,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Nhấn để xem chi tiết',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.green[600],
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.orange.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.orange.withOpacity(0.2)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.work,
                              size: 20,
                              color: Colors.orange[700],
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Vai trò',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Colors.orange[700],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          widget.assignment.role,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // FORM 3: Widget hiển thị thông tin trạng thái
  Widget _buildStatusInfoCard(BuildContext context, bool isPast, bool isOngoing) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: _getStatusColor(widget.assignment.status, isPast, isOngoing).withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _getStatusColor(widget.assignment.status, isPast, isOngoing).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.info_outline,
                    color: _getStatusColor(widget.assignment.status, isPast, isOngoing),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                const Text(
                  'Thông tin trạng thái',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _getStatusColor(widget.assignment.status, isPast, isOngoing).withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _getStatusColor(widget.assignment.status, isPast, isOngoing).withOpacity(0.2),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.circle,
                        size: 12,
                        color: _getStatusColor(widget.assignment.status, isPast, isOngoing),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Trạng thái hiện tại',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: _getStatusColor(widget.assignment.status, isPast, isOngoing),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getStatusText(widget.assignment.status, isPast, isOngoing),
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: _getStatusColor(widget.assignment.status, isPast, isOngoing),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _getStatusDescription(widget.assignment.status, isPast, isOngoing),
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF6B7280),
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // FORM 4: Widget hiển thị thông tin tour và mô tả chi tiết
  Widget _buildTourInfo(BuildContext context, bool isPast, bool isOngoing) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: _getStatusColor(widget.assignment.status, isPast, isOngoing).withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _getStatusColor(widget.assignment.status, isPast, isOngoing).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.tour,
                    color: _getStatusColor(widget.assignment.status, isPast, isOngoing),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                const Text(
                  'Thông tin tour',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            
            // Phần ảnh tour
            if (isLoadingImages)
              Container(
                height: 220,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: CircularProgressIndicator(),
                ),
              )
            else if (tourImages.isNotEmpty)
              _buildTourImages()
            else
              Container(
                height: 220,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.image_not_supported, size: 48, color: Colors.grey[400]),
                      SizedBox(height: 8),
                      Text(
                        'Không có hình ảnh',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ),
            
            const SizedBox(height: 16),
            
            // Tên tour hiển thị dưới ảnh
            Text(
              widget.assignment.tourName ?? 'Tour không xác định',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1F2937),
              ),
            ),
            
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFFE5E7EB),
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mô tả tour',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                  const SizedBox(height: 12),
                  _ExpandableText(
                    text: widget.assignment.tourDescription ?? 'Chưa có mô tả cho tour này',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTourImages() {
    return Container(
      height: 220,
      child: Stack(
        children: [
          PageView.builder(
            itemCount: tourImages.length,
            onPageChanged: (index) {
              setState(() {
                galleryIndex = index;
              });
            },
            itemBuilder: (context, index) {
              return GestureDetector(
                onTap: () => openGallery(tourImages, index),
                child: Container(
                  margin: EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 8,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      _getImageUrl(tourImages[index]),
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: 220,
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return Container(
                          color: Colors.grey[200],
                          child: Center(
                            child: CircularProgressIndicator(
                              value: loadingProgress.expectedTotalBytes != null
                                  ? loadingProgress.cumulativeBytesLoaded /
                                      loadingProgress.expectedTotalBytes!
                                  : null,
                            ),
                          ),
                        );
                      },
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          color: Colors.grey[200],
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.error, color: Colors.grey[400]),
                                SizedBox(height: 8),
                                Text(
                                  'Lỗi tải hình ảnh',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              );
            },
          ),
          // Image counter
          Positioned(
            top: 12,
            right: 12,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.7),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${galleryIndex + 1}/${tourImages.length}',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          // Indicator dots
          if (tourImages.length > 1)
            Positioned(
              bottom: 12,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: tourImages.asMap().entries.map((entry) {
                  return Container(
                    width: 8,
                    height: 8,
                    margin: EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: galleryIndex == entry.key
                          ? Colors.white
                          : Colors.white.withOpacity(0.5),
                    ),
                  );
                }).toList(),
              ),
            ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status, bool isPast, bool isOngoing) {
    if (isOngoing) return const Color(0xFF059669);
    if (isPast) return const Color(0xFF6B7280);
    
    switch (status.toLowerCase()) {
      case 'assigned':
        return const Color(0xFF3B82F6);
      case 'completed':
        return const Color(0xFF059669);
      case 'cancelled':
        return const Color(0xFFEF4444);
      default:
        return const Color(0xFF6B7280);
    }
  }

  String _getStatusText(String status, bool isPast, bool isOngoing) {
    if (isOngoing) return 'Đang diễn ra';
    if (isPast) return 'Đã kết thúc';
    
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'Đã giao';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  String _getStatusDescription(String status, bool isPast, bool isOngoing) {
    if (isOngoing) {
      return 'Tour đang được thực hiện bởi hướng dẫn viên. Mọi hoạt động đang diễn ra theo kế hoạch.';
    }
    if (isPast) {
      return 'Tour đã kết thúc. Thời gian thực hiện đã qua.';
    }
    
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'Tour đã được phân công cho hướng dẫn viên và đang chờ thực hiện.';
      case 'completed':
        return 'Tour đã hoàn thành thành công. Tất cả hoạt động đã được thực hiện đầy đủ.';
      case 'cancelled':
        return 'Tour đã bị hủy. Phân công này không còn hiệu lực.';
      default:
        return 'Trạng thái không xác định.';
    }
  }

  String _formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(date);
  }

  void _showScheduleDetails() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          // Nếu có nhiều ảnh, chuyển galleryIndex về 1 (ảnh thứ 2)
          if (tourImages.length > 1) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              setState(() {
                galleryIndex = 1;
              });
            });
          }
          return _buildScheduleDetailsSheet(setModalState);
        },
      ),
    );
  }

  Widget _buildScheduleDetailsSheet(StateSetter setModalState) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.schedule,
                  color: Colors.orange,
                  size: 24,
                ),
                const SizedBox(width: 12),
                const Text(
                  'Chi tiết lịch trình',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: Colors.orange),
                ),
              ],
            ),
          ),
          
          // Content
          Expanded(
            child: isLoadingSchedules
                ? const Center(child: CircularProgressIndicator())
                : schedules.isEmpty
                    ? const Center(
                        child: Text(
                          'Chưa có lịch trình cho tour này',
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                      )
                    : (() {
                        final assignmentStart = widget.assignment.startDate;
                        final assignmentEnd = widget.assignment.endDate;
                        final assignedSchedules = schedules.where((s) {
                          final scheduleStart = DateTime.parse(s['startDate']);
                          final scheduleEnd = DateTime.parse(s['endDate']);
                          return scheduleStart.isAtSameMomentAs(assignmentStart) &&
                                 scheduleEnd.isAtSameMomentAs(assignmentEnd);
                        }).toList();
                        return ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: assignedSchedules.length,
                          itemBuilder: (context, index) {
                            final schedule = assignedSchedules[index];
                            print('Schedule data: $schedule'); // Debug log
                            final scheduleId = schedule['scheduleId'] ?? schedule['id'];
                            final isExpanded = expandedScheduleId == scheduleId;
                            final scheduleItineraries = itineraries[scheduleId] ?? [];
                            
                            return Container(
                              margin: const EdgeInsets.only(bottom: 16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Schedule header
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                    decoration: BoxDecoration(
                                      color: Colors.blue[50]?.withOpacity(0.3),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                                children: [
                                                  Text(
                                                    'Lịch trình tour',
                                                  style: const TextStyle(
                                                      fontSize: 16,
                                                    fontWeight: FontWeight.w600,
                                                    color: Colors.blue,
                                                  ),
                                                ),
                                                const Spacer(),
                                                GestureDetector(
                                        onTap: () async {
                                                    print('Tapped schedule with id: $scheduleId');
                                          if (isExpanded) {
                                            setModalState(() {
                                              expandedScheduleId = null;
                                            });
                                          } else {
                                            if (itineraries[scheduleId] == null) {
                                              await _loadItineraries(scheduleId);
                                            }
                                            setModalState(() {
                                              expandedScheduleId = scheduleId;
                                            });
                                          }
                                        },
                                                  child: Icon(
                                                    isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                                                    color: Colors.grey[600],
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              '${_formatDate(DateTime.parse(schedule['startDate']))} - ${_formatDate(DateTime.parse(schedule['endDate']))}',
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: Colors.grey[600],
                                              ),
                                            ),
                                          ],
                                        ),
                                  ),
                                  
                                  // Itineraries
                                  if (isExpanded)
                                    Container(
                                      padding: const EdgeInsets.only(top: 12),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: scheduleItineraries.isEmpty
                                            ? [
                                                const Center(
                                                  child: Text(
                                                    'Chưa có chi tiết hành trình',
                                                    style: TextStyle(
                                                      fontSize: 14,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                ),
                                              ]
                                            : scheduleItineraries.asMap().entries.map((entry) {
                                                final itinerary = entry.value;
                                                print('Itinerary data: $itinerary');
                                                final dayNumber = entry.key + 1;
                                                
                                                return _ItineraryItem(
                                                  itinerary: itinerary,
                                                  dayNumber: dayNumber,
                                                );
                                              }).toList(),
                                      ),
                                    ),
                                ],
                              ),
                            );
                          },
                        );
                      })(),
          ),
        ],
      ),
    );
  }
}

class _ExpandableText extends StatefulWidget {
  final String text;

  const _ExpandableText({
    Key? key,
    required this.text,
  }) : super(key: key);

  @override
  State<_ExpandableText> createState() => _ExpandableTextState();
}

class _ExpandableTextState extends State<_ExpandableText> {
  bool isExpanded = false;
  static const maxLines = 6;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.text,
          style: const TextStyle(
            fontSize: 14,
            color: Color(0xFF6B7280),
            height: 1.6,
          ),
          maxLines: isExpanded ? null : maxLines,
          overflow: isExpanded ? TextOverflow.visible : TextOverflow.fade,
        ),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: () {
            setState(() {
              isExpanded = !isExpanded;
            });
          },
          child: Row(
            children: [
              Text(
                isExpanded ? 'Thu gọn' : 'Xem thêm',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Theme.of(context).primaryColor,
                ),
              ),
              const SizedBox(width: 4),
              Icon(
                isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                size: 18,
                color: Theme.of(context).primaryColor,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ItineraryItem extends StatefulWidget {
  final Map<String, dynamic> itinerary;
  final int dayNumber;

  const _ItineraryItem({
    Key? key,
    required this.itinerary,
    required this.dayNumber,
  }) : super(key: key);

  @override
  State<_ItineraryItem> createState() => _ItineraryItemState();
}

class _ItineraryItemState extends State<_ItineraryItem> {
  bool isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Column(
        children: [
          // Header - Always visible
          GestureDetector(
            onTap: () {
              setState(() {
                isExpanded = !isExpanded;
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.blue[100]?.withOpacity(0.3),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Text(
                    'Ngày ${widget.dayNumber}',
                    style: const TextStyle(
                      color: Colors.blue,
                      fontWeight: FontWeight.w500,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      widget.itinerary['title'] ?? 'Không có tiêu đề',
                      style: const TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                  Icon(
                    isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                    size: 20,
                    color: Colors.grey[600],
                  ),
                ],
              ),
            ),
          ),
          
          // Expandable content
          if (isExpanded)
            Container(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Time information
                  if (widget.itinerary['startTime'] != null || widget.itinerary['endTime'] != null) ...[
                    Row(
                      children: [
                        Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                        const SizedBox(width: 4),
                        Text(
                          '${widget.itinerary['startTime'] ?? '--'} - ${widget.itinerary['endTime'] ?? '--'}',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                  ],
                  
                  // Description
                  if (widget.itinerary['description'] != null)
                    RichText(
                      text: TextSpan(
                        style: const TextStyle(
                          fontSize: 13,
                          color: Colors.black87,
                          height: 1.4,
                        ),
                        children: _buildDescriptionSpans(widget.itinerary['description']),
                      ),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  List<TextSpan> _buildDescriptionSpans(String text) {
    final RegExp timeRegex = RegExp(r'(\(\d{2}:\d{2}\s*[–-]\s*\d{2}:\d{2}\)|\d{2}:\d{2}\s*[–-]\s*\d{2}:\d{2})');
    final List<TextSpan> spans = [];
    int lastIndex = 0;
    for (Match match in timeRegex.allMatches(text)) {
      if (match.start > lastIndex) {
        String beforeText = text.substring(lastIndex, match.start);
        _addTextWithCapsFormatting(beforeText, spans);
      }
      spans.add(TextSpan(
        text: match.group(0),
        style: const TextStyle(fontWeight: FontWeight.bold),
      ));
      lastIndex = match.end;
    }
    if (lastIndex < text.length) {
      String remainingText = text.substring(lastIndex);
      _addTextWithCapsFormatting(remainingText, spans);
    }
    return spans;
  }

  void _addTextWithCapsFormatting(String text, List<TextSpan> spans) {
    final RegExp lineRegex = RegExp(r'[^\n]+|\n');
    for (final Match lineMatch in lineRegex.allMatches(text)) {
      final String line = lineMatch.group(0) ?? '';
      if (line == '\n') {
        spans.add(const TextSpan(text: '\n'));
        continue;
      }
      final int upperCount = RegExp(r'[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]').allMatches(line).length;
      final bool hasLower = RegExp(r'[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]').hasMatch(line);
      if (!hasLower && upperCount >= 2) {
        spans.add(TextSpan(text: line, style: const TextStyle(fontWeight: FontWeight.bold)));
      } else {
        spans.add(TextSpan(text: line));
      }
    }
  }
}