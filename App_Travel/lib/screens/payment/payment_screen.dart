import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:typed_data';
import 'package:intl/intl.dart';

class PaymentScreen extends StatefulWidget {
  final String bookingId;
  final double amount;

  const PaymentScreen({
    Key? key,
    required this.bookingId,
    required this.amount,
  }) : super(key: key);

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  int? selectedMethod;
  bool loading = true;
  String? error;
  Map<String, dynamic>? booking;
  bool isQrLoading = false;
  Map<String, dynamic>? bankQr;
  bool isConfirmLoading = false;
  String? confirmResult;

  Color get primaryColor => Colors.orange;
  Color get secondaryColor => Colors.white;

  @override
  void initState() {
    super.initState();
    _fetchBookingDetails();
  }

  Future<void> _fetchBookingDetails() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token') ?? prefs.getString('token');
      if (token == null) {
        Navigator.pushReplacementNamed(context, '/login');
        return;
      }
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/bookings/${widget.bookingId}/detail'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        setState(() {
          booking = jsonDecode(response.body);
          loading = false;
        });
      } else {
        throw Exception('Failed to load booking details');
      }
    } catch (e) {
      setState(() {
        error = 'Không thể tải thông tin đặt chuyến đi. Vui lòng thử lại sau.';
        loading = false;
      });
    }
  }

  Future<void> _handlePayment() async {
    if (selectedMethod == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chọn phương thức thanh toán')),
      );
      return;
    }
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token') ?? prefs.getString('token');
      final userIdRaw = prefs.get('userId');
      final userId = userIdRaw is int ? userIdRaw : int.tryParse(userIdRaw?.toString() ?? '');
      if (token == null || userId == null) {
        Navigator.pushReplacementNamed(context, '/login');
        return;
      }
      final amount = (booking?['booking']?['totalPrice'] ?? booking?['totalAmount'] ?? widget.amount).toInt();
      final bookingIdInt = int.tryParse(widget.bookingId) ?? 0;
      // Bank Transfer
      if (selectedMethod == 2) {
        setState(() {
          isQrLoading = true;
          bankQr = null;
        });
        try {
          final response = await http.post(
            Uri.parse('http://10.0.2.2:8080/api/payments/bank-transfer-qr'),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
            body: jsonEncode({
              'amount': amount,
              'phone': booking?['booking']?['user']?['phone'] ?? '0123456789',
              'bookingId': bookingIdInt,
              'userId': userId,
            }),
          );
          if (response.statusCode == 200) {
            print('Bank QR response: ' + response.body);
            setState(() {
              bankQr = jsonDecode(response.body);
            });
          } else {
            print('Bank QR error: ' + response.body);
            throw Exception('Failed to generate QR code');
          }
        } catch (e) {
          setState(() {
            error = 'Không thể tạo mã QR. Vui lòng thử lại sau.';
          });
        } finally {
          setState(() {
            isQrLoading = false;
          });
        }
        return;
      }
      // MoMo
      if (selectedMethod == 5) {
        final response = await http.post(
          Uri.parse('http://10.0.2.2:8080/api/payments/momo'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'bookingId': bookingIdInt,
            'userId': userId,
            'paymentMethodId': selectedMethod,
            'amount': amount,
          }),
        );
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          // Nếu muốn mở URL, dùng url_launcher
          // await launchUrl(Uri.parse(data['payUrl']));
        } else {
          print('MoMo error: ' + response.body);
        }
        return;
      }
      // Other methods
      final response = await http.post(
        Uri.parse('http://10.0.2.2:8080/api/payments'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'bookingId': bookingIdInt,
          'userId': userId,
          'paymentMethodId': selectedMethod,
          'amount': amount,
        }),
      );
      if (response.statusCode == 200) {
        setState(() {
          confirmResult = 'success';
          bankQr = null;
          selectedMethod = null;
        });
      } else {
        print('Other payment error: ' + response.body);
      }
    } catch (e) {
      setState(() {
        error = 'Có lỗi xảy ra khi xử lý thanh toán';
        isQrLoading = false;
      });
      print('Payment error: $e');
    }
  }

  Future<void> _checkPaymentStatus() async {
    if (bankQr == null || bankQr!['paymentId'] == null) return;
    setState(() {
      isConfirmLoading = true;
      confirmResult = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token') ?? prefs.getString('token');
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/payments/${bankQr!['paymentId']}/status'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['statusName']?.toLowerCase() == 'completed') {
          setState(() {
            confirmResult = 'success';
          });
        } else {
          setState(() {
            confirmResult = 'failed';
          });
        }
      }
    } catch (e) {
      setState(() {
        confirmResult = 'failed';
      });
    } finally {
      setState(() {
        isConfirmLoading = false;
      });
    }
  }

  Widget _buildPaymentMethod(int methodId, String title, IconData icon) {
    final isSelected = selectedMethod == methodId;
    return InkWell(
      onTap: () {
        setState(() {
          selectedMethod = methodId;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 18),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(
            color: Colors.white,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(14),
          boxShadow: isSelected
              ? [BoxShadow(color: primaryColor.withOpacity(0.08), blurRadius: 8, offset: Offset(0, 2))]
              : [],
        ),
        child: Row(
          children: [
            Container(
              decoration: BoxDecoration(
                color: isSelected ? Colors.white : Colors.grey.shade200,
                borderRadius: BorderRadius.circular(8),
              ),
              padding: const EdgeInsets.all(8),
              child: Icon(icon, color: isSelected ? Colors.orange : Colors.orange, size: 28),
            ),
            const SizedBox(width: 18),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 17,
                ),
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: Colors.green, size: 28),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingInfo() {
    if (booking == null) return const SizedBox();
    final tour = booking!['tour'] ?? booking!['booking']?['tour'];
    final total = (booking!['booking']?['totalPrice'] ?? booking!['totalAmount'] ?? widget.amount).toInt();
    return Card(
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.only(bottom: 18),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.tour, color: primaryColor, size: 28),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    tour?['name'] ?? '',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(Icons.attach_money, color: primaryColor, size: 22),
                const SizedBox(width: 8),
                Text('Tổng tiền:', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                const SizedBox(width: 8),
                Text(
                  NumberFormat.currency(locale: 'vi_VN', symbol: '', decimalDigits: 0).format(total) + ' đ',
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 20),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQRSection() {
    String? qrDataUrl = bankQr?['qrDataURL'];
    Uint8List? qrBytes;
    if (qrDataUrl != null && qrDataUrl.startsWith('data:image')) {
      final base64Str = qrDataUrl.split(',').last;
      qrBytes = base64Decode(base64Str);
    }
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      margin: const EdgeInsets.only(bottom: 18),
      child: Padding(
        padding: const EdgeInsets.all(22),
        child: Column(
          children: [
            const Text('Quét mã QR để chuyển khoản', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.red)),
            const SizedBox(height: 18),
            qrBytes != null
                ? Container(
                    decoration: BoxDecoration(
                      // border: Border.all(color: Colors.orange, width: 2),
                      borderRadius: BorderRadius.circular(16),
                      color: Colors.white,
                    ),
                    padding: const EdgeInsets.all(8),
                    child: Image.memory(
                      qrBytes,
                      width: 220,
                      height: 220,
                      fit: BoxFit.contain,
                    ),
                  )
                : const Icon(Icons.error, size: 60, color: Colors.red),
            const SizedBox(height: 18),
            _buildInfoRow('Ngân hàng:', bankQr!['bankName']),
            _buildInfoRow('Số tài khoản:', bankQr!['accountNumber']),
            _buildInfoRow('Tên tài khoản:', bankQr!['accountName']),
            _buildInfoRow('Số tiền:', NumberFormat.currency(locale: 'vi_VN', symbol: '', decimalDigits: 0).format(bankQr!['amount']) + ' đ'),
            _buildInfoRow('Nội dung chuyển khoản:', bankQr!['transferContent']),
            const SizedBox(height: 10),
            const Text('Vui lòng chuyển khoản đúng nội dung để được xác nhận tự động!', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    final isAmount = label.trim().toLowerCase().contains('số tiền');
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Expanded(
            child: Text(label, style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w600, fontSize: 15)),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: isAmount ? Colors.red : Colors.black, fontSize: isAmount ? 18 : 15, fontWeight: isAmount ? FontWeight.bold : FontWeight.normal),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultOverlay() {
    if (confirmResult == null) return const SizedBox();
    return Center(
      child: Stack(
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 16)],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  confirmResult == 'success' ? Icons.check_circle : Icons.cancel,
                  color: confirmResult == 'success' ? Colors.green : Colors.red,
                  size: 64,
                ),
                const SizedBox(height: 16),
                Text(
                  confirmResult == 'success'
                      ? 'Thanh toán thành công!'
                      : 'Chưa nhận được thanh toán, vui lòng thử lại.',
                  style: TextStyle(
                    color: confirmResult == 'success' ? Colors.green : Colors.red,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () {
                    setState(() => confirmResult = null);
                    if (confirmResult == 'success') {
                      Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
                    }
                  },
                  child: const Text('Về trang chủ', style: TextStyle(fontSize: 16, color: Colors.white)),
                ),
              ],
            ),
          ),
          Positioned(
            top: 0,
            right: 0,
            child: IconButton(
              icon: const Icon(Icons.close, color: Colors.grey, size: 28),
              onPressed: () => setState(() => confirmResult = null),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    if (error != null) {
      return Scaffold(
        body: Center(child: Text(error!)),
      );
    }
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thanh toán'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.orange,
        elevation: 0,
      ),
      backgroundColor: const Color(0xFFF6F8FF),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildBookingInfo(),
                Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  margin: const EdgeInsets.only(bottom: 18),
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Phương thức thanh toán', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black)),
                        const SizedBox(height: 16),
                        _buildPaymentMethod(2, 'Chuyển khoản ngân hàng', Icons.account_balance),
                        // _buildPaymentMethod(5, 'Ví MoMo', Icons.account_balance_wallet),
                      ],
                    ),
                  ),
                ),
                if (isQrLoading)
                  const Center(child: CircularProgressIndicator())
                else if (bankQr != null)
                  _buildQRSection(),
                const SizedBox(height: 10),
                if (bankQr != null)
                  ElevatedButton(
                    onPressed: isConfirmLoading ? null : _checkPaymentStatus,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text(isConfirmLoading ? 'Đang xác nhận...' : 'Xác nhận đã thanh toán', style: const TextStyle(fontSize: 16, color: Colors.white)),
                  )
                else
                  ElevatedButton(
                    onPressed: selectedMethod == null ? null : _handlePayment,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text('Thanh toán ngay', style: TextStyle(fontSize: 16, color: Colors.white)),
                  ),
                TextButton(
                  onPressed: () => Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false),
                  child: const Text('Hủy', style: TextStyle(fontSize: 15)),
                ),
              ],
            ),
          ),
          _buildResultOverlay(),
        ],
      ),
    );
  }
}
