import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../payment/payment_screen.dart';

class BookingConfirmationScreen extends StatefulWidget {
  final String bookingId;
  final String bookingCode;
  final List<Map<String, dynamic>> passengers;
  final Map<String, dynamic> tourInfo;
  final Map<String, dynamic>? contactInfo;
  final List<Map<String, dynamic>> itineraries;
  final double? finalPrice;

  const BookingConfirmationScreen({
    Key? key,
    required this.bookingId,
    required this.bookingCode,
    required this.passengers,
    required this.tourInfo,
    this.contactInfo,
    this.itineraries = const [],
    this.finalPrice,
  }) : super(key: key);

  @override
  State<BookingConfirmationScreen> createState() => _BookingConfirmationScreenState();
}

class _BookingConfirmationScreenState extends State<BookingConfirmationScreen> {
  int? openedItineraryIndex;
  int _currentImageIndex = 0;

  // Hàm tính tuổi từ ngày sinh
  String getAge(String? birthDate) {
    if (birthDate == null) return '';
    final today = DateTime.now();
    final dob = DateTime.parse(birthDate);
    int age = today.year - dob.year;
    if (today.month < dob.month || (today.month == dob.month && today.day < dob.day)) {
      age--;
    }
    return age.toString();
  }

  // Hàm hiển thị loại khách + tuổi
  String getTypeAndAge(Map<String, dynamic> passenger) {
    final age = getAge(passenger['birthDate']);
    String type = '';
    if (passenger['passengerType'] == 'adult') {
      type = 'Người lớn';
    } else if (passenger['passengerType'] == 'child') {
      type = 'Trẻ em';
    } else {
      type = 'Em bé';
    }
    return '$type (${age.isNotEmpty ? '$age Tuổi' : ''})';
  }

  // Thay đổi hàm calculateTotal()
  double calculateTotal() {
    if (widget.finalPrice != null) return widget.finalPrice!;
    if (widget.tourInfo.isEmpty) return 0;
    final basePrice = widget.tourInfo['price'] as double;
    int adultCount = 0;
    int childCount = 0;
    int infantCount = 0;
    for (var passenger in widget.passengers) {
      switch (passenger['passengerType']) {
        case 'adult':
          adultCount++;
          break;
        case 'child':
          childCount++;
          break;
        case 'infant':
          infantCount++;
          break;
      }
    }
    final adultTotal = adultCount * basePrice;
    final childTotal = childCount * (basePrice * 0.5);
    final infantTotal = infantCount * (basePrice * 0.25);
    final total = adultTotal + childTotal + infantTotal;
    return total;
  }

  @override
  Widget build(BuildContext context) {
    final contact = widget.contactInfo ?? widget.passengers[0] ?? {};
    final bookingStatus = 'Đã xác nhận';
    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: 'đ');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Xác nhận đặt chỗ'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.orange),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
      body: Container(
        color: Colors.white,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Thông tin liên lạc
              _buildInfoBox(
                'THÔNG TIN LIÊN LẠC',
                Icons.person,
                [
                  _buildInfoRow('Họ tên:', contact['fullName'] ?? '', Icons.badge),
                  _buildInfoRow('Email:', contact['email'] ?? '', Icons.email),
                  _buildInfoRow('Điện thoại:', contact['phone'] ?? contact['phoneNumber'] ?? '', Icons.phone),
                  _buildInfoRow('Địa chỉ:', contact['address'] ?? '', Icons.location_on),
                ],
              ),
              const SizedBox(height: 16),
              // Chi tiết booking
              _buildInfoBox(
                'CHI TIẾT BOOKING',
                Icons.confirmation_number,
                [
                  _buildInfoRow('Mã đặt chỗ:', widget.bookingCode.isNotEmpty ? widget.bookingCode : widget.bookingId, Icons.qr_code, valueColor: Colors.red),
                  _buildInfoRow('Ngày đặt:', DateFormat('dd/MM/yyyy').format(DateTime.now()), Icons.calendar_today),
                  _buildInfoRow('Số khách:', widget.passengers.length.toString(), Icons.people),
                  _buildInfoRow('Tổng cộng:', currencyFormat.format(calculateTotal()),
                      Icons.payments, valueColor: Colors.orange, isBold: true),
                  _buildInfoRow('Trạng thái:', bookingStatus,
                      Icons.check_circle, valueColor: const Color(0xFF388e3c), isBold: true),
                ],
              ),
              const SizedBox(height: 16),
              // Danh sách hành khách
              _buildPassengerList(),
              const SizedBox(height: 16),
              // Thông tin tour ở dưới cùng
              _buildTourInfo(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoBox(String title, IconData icon, List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: Colors.orange, size: 24),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  color: Color(0xFF1976d2),
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon,
      {Color? valueColor, bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey),
          const SizedBox(width: 8),
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                color: valueColor,
                fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
                fontSize: 15,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPassengerList() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.people, color: Colors.orange, size: 24),
              const SizedBox(width: 8),
              const Text(
                'DANH SÁCH HÀNH KHÁCH',
                style: TextStyle(
                  color: Color(0xFF1976d2),
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingRowColor: MaterialStateProperty.all(Colors.grey.shade50),
              columns: const [
                DataColumn(
                  label: Text(
                    'Họ tên',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Ngày sinh',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Giới tính',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Độ tuổi',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
              rows: widget.passengers.map((p) {
                return DataRow(
                  cells: [
                    DataCell(Text(p['fullName'] ?? '')),
                    DataCell(Text(p['birthDate'] ?? '')),
                    DataCell(Text(p['gender'] ?? '')),
                    DataCell(Text(getTypeAndAge(p))),
                  ],
                );
              }).toList(),
            ),
          ),
          const Divider(height: 32),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              'Tổng cộng: ${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(calculateTotal())}',
              style: const TextStyle(
                color: Colors.orange,
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTourInfo() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Gallery slider for tour images
          if (widget.tourInfo['imageUrls'] != null && (widget.tourInfo['imageUrls'] as List).isNotEmpty)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: 220,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      PageView.builder(
                        itemCount: (widget.tourInfo['imageUrls'] as List).length,
                        onPageChanged: (index) {
                          setState(() {
                            _currentImageIndex = index;
                          });
                        },
                        itemBuilder: (context, index) {
                          final imageUrl = widget.tourInfo['imageUrls'][index];
                          return GestureDetector(
                            onTap: () {
                              // TODO: Implement full screen gallery view
                            },
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.network(
                                'http://10.0.2.2:8080$imageUrl',
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return Container(
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [Colors.orange.shade100, Colors.orange.shade50],
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(Icons.error, size: 50, color: Colors.orange),
                                  );
                                },
                              ),
                            ),
                          );
                        },
                      ),
                      if ((widget.tourInfo['imageUrls'] as List).length > 1)
                        Positioned(
                          bottom: 10,
                          left: 0,
                          right: 0,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(
                              (widget.tourInfo['imageUrls'] as List).length,
                              (index) => Container(
                                width: 8,
                                height: 8,
                                margin: const EdgeInsets.symmetric(horizontal: 4),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: _currentImageIndex == index
                                      ? Colors.orange
                                      : Colors.white.withOpacity(0.5),
                                ),
                              ),
                            ),
                          ),
                        ),
                      Positioned(
                        top: 10,
                        right: 10,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${_currentImageIndex + 1}/${(widget.tourInfo['imageUrls'] as List).length}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 25),
                Text(
                  widget.tourInfo['name'] ?? '',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
          const SizedBox(height: 20),
          _buildInfoRow('Mã booking:', widget.bookingCode.isNotEmpty ? widget.bookingCode : widget.bookingId, Icons.qr_code, valueColor: Colors.red),
          _buildInfoRow('Trạng thái:', 'Đã xác nhận',
              Icons.check_circle, valueColor: const Color(0xFF388e3c), isBold: true),
          if (widget.itineraries.isNotEmpty) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFf8f9fa),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              // child: Column(
              //   crossAxisAlignment: CrossAxisAlignment.start,
              //   children: [
              //     Row(
              //       children: [
              //         const Icon(Icons.route, color: Colors.orange, size: 20),
              //         const SizedBox(width: 8),
              //         const Text(
              //           'Lịch trình đã chọn',
              //           style: TextStyle(
              //             fontWeight: FontWeight.bold,
              //             fontSize: 16,
              //           ),
              //         ),
              //       ],
              //     ),
              //     const SizedBox(height: 12),
              //     ...widget.itineraries.asMap().entries.map((entry) {
              //       final index = entry.key;
              //       final itinerary = entry.value;
              //       return Container(
              //         margin: const EdgeInsets.only(bottom: 14),
              //         padding: const EdgeInsets.all(14),
              //         decoration: BoxDecoration(
              //           color: Colors.white,
              //           borderRadius: BorderRadius.circular(10),
              //           border: Border.all(color: Colors.grey.shade200),
              //           boxShadow: [
              //             BoxShadow(
              //               color: Colors.grey.withOpacity(0.06),
              //               blurRadius: 6,
              //               offset: const Offset(0, 2),
              //             ),
              //           ],
              //         ),
              //         child: Column(
              //           crossAxisAlignment: CrossAxisAlignment.start,
              //           children: [
              //             GestureDetector(
              //               onTap: () {
              //                 setState(() {
              //                   if (openedItineraryIndex == index) {
              //                     openedItineraryIndex = null;
              //                   } else {
              //                     openedItineraryIndex = index;
              //                   }
              //                 });
              //               },
              //               child: Text(
              //                 'Ngày ${index + 1}: ${itinerary['title'] ?? 'Lịch trình'}',
              //                 style: const TextStyle(
              //                   fontWeight: FontWeight.bold,
              //                   color: Color(0xFF1976d2),
              //                   fontSize: 15,
              //                 ),
              //               ),
              //             ),
              //             if (openedItineraryIndex == index) ...[
              //               if (itinerary['startTime'] != null)
              //                 Text('Giờ bắt đầu: ${itinerary['startTime']}'),
              //               if (itinerary['endTime'] != null)
              //                 Text('Giờ kết thúc: ${itinerary['endTime']}'),
              //               if (itinerary['description'] != null)
              //                 Text('Mô tả: ${itinerary['description']}'),
              //               if (itinerary['type'] != null)
              //                 Text('Loại: ${itinerary['type']}'),
              //             ],
              //           ],
              //         ),
              //       );
              //     }).toList(),
              //   ],
              // ),
            ),
          ],
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PaymentScreen(
                      bookingId: widget.bookingId,
                      amount: calculateTotal(),
                    ),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text(
                'Thanh toán ngay',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}




