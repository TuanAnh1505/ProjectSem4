import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:typed_data';

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
        error = 'Không thể tải thông tin đặt phòng';
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
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? Colors.orange : Colors.grey.shade300,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? Colors.orange : Colors.grey),
            const SizedBox(width: 12),
            Text(
              title,
              style: TextStyle(
                color: isSelected ? Colors.orange : Colors.black,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            const Spacer(),
            if (isSelected)
              const Icon(Icons.check_circle, color: Colors.orange),
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
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Tour: ${tour?['name'] ?? ''}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('Tổng tiền: ${total.toString()} đ', style: const TextStyle(color: Colors.red)),
          ],
        ),
      ),
    );
  }

  Widget _buildResultOverlay() {
    if (confirmResult == null) return const SizedBox();
    return Positioned.fill(
      child: Container(
        color: Colors.black.withOpacity(0.4),
        child: Center(
          child: Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
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
                  onPressed: () => setState(() => confirmResult = null),
                  child: const Text('Đóng'),
                ),
              ],
            ),
          ),
        ),
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
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildBookingInfo(),
                const SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Phương thức thanh toán', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 16),
                        _buildPaymentMethod(2, 'Chuyển khoản ngân hàng', Icons.account_balance),
                        _buildPaymentMethod(5, 'Ví MoMo', Icons.account_balance_wallet),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                if (isQrLoading)
                  const Center(child: CircularProgressIndicator())
                else if (bankQr != null)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          const Text('Quét mã QR để chuyển khoản', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 16),
                          (() {
                            String? qrDataUrl = bankQr?['qrDataURL'];
                            Uint8List? qrBytes;
                            if (qrDataUrl != null && qrDataUrl.startsWith('data:image')) {
                              final base64Str = qrDataUrl.split(',').last;
                              qrBytes = base64Decode(base64Str);
                            }
                            if (qrBytes != null) {
                              return Image.memory(
                                qrBytes,
                                width: 300,
                                height: 300,
                                errorBuilder: (context, error, stackTrace) {
                                  return const Icon(Icons.error, size: 50);
                                },
                              );
                            } else {
                              return const Icon(Icons.error, size: 50);
                            }
                          })(),
                          const SizedBox(height: 16),
                          Text('Ngân hàng: ${bankQr!['bankName']}'),
                          Text('Số tài khoản: ${bankQr!['accountNumber']}'),
                          Text('Tên tài khoản: ${bankQr!['accountName']}'),
                          Text('Số tiền: ${bankQr!['amount'].toString()} VND'),
                          Text('Nội dung: ${bankQr!['transferContent']}'),
                          const SizedBox(height: 8),
                          const Text('Vui lòng chuyển khoản đúng nội dung để được xác nhận tự động!', style: TextStyle(color: Colors.red)),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 16),
                if (bankQr != null)
                  ElevatedButton(
                    onPressed: isConfirmLoading ? null : _checkPaymentStatus,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text(isConfirmLoading ? 'Đang xác nhận...' : 'Xác nhận đã thanh toán'),
                  )
                else
                  ElevatedButton(
                    onPressed: selectedMethod == null ? null : _handlePayment,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text('Thanh toán ngay'),
                  ),
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Hủy'),
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
