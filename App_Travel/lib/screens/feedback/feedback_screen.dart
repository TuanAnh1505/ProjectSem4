import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../auth/login_screen.dart';
import 'package:intl/intl.dart';

class FeedbackScreen extends StatefulWidget {
  final int bookingId;
  final String bookingCode;
  final Map<String, dynamic> tour;
  final String selectedDate;
  final List<dynamic> itineraries;
  final double finalPrice;

  const FeedbackScreen({
    Key? key,
    required this.bookingId,
    required this.bookingCode,
    required this.tour,
    required this.selectedDate,
    required this.itineraries,
    required this.finalPrice,
  }) : super(key: key);

  @override
  State<FeedbackScreen> createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  bool loading = true;
  bool submitted = false;
  Map<String, dynamic>? booking;
  List<dynamic> passengers = [];
  Map<String, dynamic>? scheduleDetail;
  String? error;
  int rating = 5;
  final TextEditingController messageController = TextEditingController();
  bool showFullDescription = false;

  @override
  void initState() {
    super.initState();
    fetchBooking();
  }

  Future<void> fetchBooking() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        setState(() {
          error = 'Bạn cần đăng nhập để xem thông tin booking';
          loading = false;
        });
        return;
      }

      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/bookings/${widget.bookingId}/detail'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          booking = data['booking'];
          passengers = data['passengers'];
          loading = false;
        });

        if (booking?['scheduleId'] != null) {
          fetchScheduleDetail(booking!['scheduleId'], token);
        }
      } else {
        setState(() {
          error = 'Không thể tải thông tin booking';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Có lỗi xảy ra: $e';
        loading = false;
      });
    }
  }

  Future<void> fetchScheduleDetail(int scheduleId, String token) async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/schedules/$scheduleId'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        setState(() {
          scheduleDetail = json.decode(response.body);
        });
      }
    } catch (e) {
      print('Error fetching schedule detail: $e');
    }
  }

  Future<void> submitFeedback() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        setState(() {
          error = 'Bạn cần đăng nhập để gửi feedback';
          loading = false;
        });
        return;
      }

      final response = await http.post(
        Uri.parse('http://10.0.2.2:8080/api/feedbacks'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'tourId': booking?['tour']?['tourId'],
          'message': messageController.text,
          'rating': rating,
          'bookingId': widget.bookingId,
        }),
      );

      if (response.statusCode == 200) {
        setState(() {
          submitted = true;
          loading = false;
        });
      } else if (response.statusCode == 401) {
        setState(() {
          error = 'Bạn cần đăng nhập tài khoản ${booking?['user']?['email']} để gửi feedback';
          loading = false;
        });
      } else if (response.statusCode == 403) {
        setState(() {
          error = 'Bạn chỉ có thể gửi feedback cho tour mà bạn đã đặt';
          loading = false;
        });
      } else {
        setState(() {
          error = 'Không thể gửi feedback';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Có lỗi xảy ra: $e';
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Gửi đánh giá')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              Text(
                'Đang tải thông tin booking...',
                style: TextStyle(fontSize: 16, color: Colors.grey[600]),
              ),
            ],
          ),
        ),
      );
    }

    if (error != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Gửi đánh giá')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error_outline, size: 48, color: Colors.red[300]),
                const SizedBox(height: 16),
                Text(
                  error!,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Colors.grey[800]),
                ),
                if (error!.contains('đăng nhập')) ...[
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pushReplacement(
                        MaterialPageRoute(builder: (context) => LoginScreen()),
                      );
                    },
                    child: const Text('Đăng nhập'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                      backgroundColor: Colors.orange,
                      foregroundColor: Colors.white,
                      textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      );
    }

    if (submitted) {
      return Scaffold(
        appBar: AppBar(title: const Text('Gửi đánh giá')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.check_circle_outline, size: 64, color: Colors.green[600]),
                const SizedBox(height: 16),
                Text(
                  'Cảm ơn bạn đã gửi feedback!',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.green[700],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Đánh giá của bạn sẽ giúp chúng tôi cải thiện dịch vụ tốt hơn.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Gửi đánh giá')),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            (() {
              String? imageUrl = booking?['tour']?['imageUrl'] as String?;
              if (imageUrl != null && !(imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
                imageUrl = 'http://10.0.2.2:8080' + imageUrl;
              }
              bool isValidImageUrl = imageUrl != null &&
                  (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
              if (isValidImageUrl) {
                return Image.network(
                  imageUrl!,
                  height: 200,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const SizedBox(height: 200, child: Center(child: Icon(Icons.broken_image))),
                );
              } else {
                return const SizedBox.shrink();
              }
            })(),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Center(
                      child: (() {
                        String code = '...';
                        final bookingCode = booking?['bookingCode'];
                        if (bookingCode != null && bookingCode.toString().isNotEmpty) {
                          code = bookingCode.toString();
                        } else if (widget.bookingCode.isNotEmpty) {
                          code = widget.bookingCode;
                        }
                        return Text(
                          'Gửi đánh giá cho booking #$code',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).primaryColor,
                            letterSpacing: 0.5,
                          ),
                          textAlign: TextAlign.center,
                        );
                      })(),
                    ),
                  ),
                  _buildInfoCard(),
                  const SizedBox(height: 20),
                  _buildFeedbackForm(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String formatCurrency(num? value) {
    if (value == null) return '';
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: 'VND');
    return formatter.format(value);
  }

  Widget _buildInfoCard() {
    String? description = booking?['tour']?['description'] as String?;
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoRow('Tour:', booking?['tour']?['name'] as String?),
            _buildInfoRow(
              'Mô tả:',
              null,
              child: description == null
                  ? const Text('')
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          description,
                          maxLines: showFullDescription ? null : 3,
                          overflow: showFullDescription ? TextOverflow.visible : TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 14),
                        ),
                        if (description.length > 100)
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                showFullDescription = !showFullDescription;
                              });
                            },
                            child: Text(
                              showFullDescription ? 'Thu gọn' : 'Xem thêm',
                              style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                            ),
                          ),
                      ],
                    ),
            ),
            _buildInfoRow('Ngày đặt:', booking?['bookingDate'] as String?),
            _buildInfoRow('Giá:', formatCurrency(booking?['totalPrice'])),
            _buildInfoRow('Trạng thái:', booking?['status']?['statusName'] as String?),
            _buildInfoRow('Lịch trình:', ((booking?['schedule']?['startDate'] ?? '').toString()) + ' - ' + ((booking?['schedule']?['endDate'] ?? '').toString())),
            _buildInfoRow('Khách đặt:', ((booking?['user']?['fullName'] ?? '').toString()) + ' (' + ((booking?['user']?['email'] ?? '').toString()) + ')'),
            _buildInfoRow('Hành khách:', passengers.map((p) => (p['fullName'] ?? '').toString() + ' (' + (p['passengerType'] ?? '').toString() + ')').join(', ')),
            if (scheduleDetail != null)
              _buildInfoRow(
                'Chi tiết lịch trình:',
                'Bắt đầu: ' + (scheduleDetail!['startDate'] ?? '').toString() +
                ' - Kết thúc: ' + (scheduleDetail!['endDate'] ?? '').toString() +
                ' | Trạng thái: ' + (scheduleDetail!['status'] ?? '').toString() +
                ' | Số người hiện tại: ' + (scheduleDetail!['currentParticipants'] ?? '').toString(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String? value, {Widget? child}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: child ?? Text(value ?? ''),
          ),
        ],
      ),
    );
  }

  Widget _buildFeedbackForm() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Chấm điểm tour:',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: List.generate(5, (index) {
                return IconButton(
                  icon: Icon(
                    Icons.star,
                    color: index < rating ? Colors.amber : Colors.grey[300],
                    size: 32,
                  ),
                  onPressed: () {
                    setState(() {
                      rating = index + 1;
                    });
                  },
                );
              }),
            ),
            const SizedBox(height: 16),
            const Text(
              'Đánh giá chi tiết của bạn:',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: messageController,
              maxLines: 5,
              decoration: InputDecoration(
                hintText: 'Nhập đánh giá chi tiết của bạn về tour này...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                filled: true,
                fillColor: Colors.grey[50],
              ),
            ),
            if (error != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red[200]!),
                ),
                child: Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, color: Colors.red[300]),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        error!,
                        style: TextStyle(color: Colors.red[700]),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: loading || booking?['tour']?['tourId'] == null ? null : submitFeedback,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Theme.of(context).primaryColor,
                  foregroundColor: Colors.white,
                ),
                child: Text(
                  loading ? 'Đang gửi...' : 'Gửi feedback',
                  style: const TextStyle(fontSize: 18),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}




