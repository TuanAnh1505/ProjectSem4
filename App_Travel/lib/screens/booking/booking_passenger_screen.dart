import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/tour_models.dart';
import '../../services/booking_passenger_service.dart';

class BookingPassengerScreen extends StatefulWidget {
  final int bookingId;
  final Tour tour;
  final String selectedDate;
  final List<dynamic> itineraries;

  const BookingPassengerScreen({
    Key? key,
    required this.bookingId,
    required this.tour,
    required this.selectedDate,
    required this.itineraries,
  }) : super(key: key);

  @override
  State<BookingPassengerScreen> createState() => _BookingPassengerScreenState();
}

class _BookingPassengerScreenState extends State<BookingPassengerScreen> {
  final _formKey = GlobalKey<FormState>();
  final _bookingPassengerService = BookingPassengerService();
  bool _useLoggedInInfo = true;
  bool _isSubmitting = false;
  
  // Controllers cho các trường thông tin liên hệ
  final _fullNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();
  final _birthDateController = TextEditingController();

  String _gender = 'Nam';
  String _birthDate = DateTime.now().toString().split(' ')[0];

  // Passenger counts
  final _passengerCounts = {
    'adult': 1,
    'child': 0,
    'infant': 0,
  };

  // Additional passengers
  final _additionalPassengers = {
    'adult': <Map<String, dynamic>>[],
    'child': <Map<String, dynamic>>[],
    'infant': <Map<String, dynamic>>[],
  };

  double _totalPrice = 0;

  @override
  void initState() {
    super.initState();
    if (_useLoggedInInfo) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _loadUserInfo();
      });
    }
    _calculateTotalPrice();
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    _birthDateController.dispose();
    // Dispose all controllers in _additionalPassengers
    for (var type in ['adult', 'child', 'infant']) {
      for (var p in _additionalPassengers[type]!) {
        p['birthDateController']?.dispose();
      }
    }
    super.dispose();
  }

  Future<void> _loadUserInfo() async {
    if (!_useLoggedInInfo) return;
    final prefs = await SharedPreferences.getInstance();
    final publicId = prefs.getString('public_id');
    final token = prefs.getString('auth_token');
    if (publicId == null || token == null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Vui lòng đăng nhập để sử dụng thông tin tài khoản')),
        );
        setState(() {
          _useLoggedInInfo = false;
        });
      }
      return;
    }
    try {
      final userInfo = await _bookingPassengerService.getUserInfo(publicId);
      print('Loaded user info: $userInfo');
      if (mounted) {
        setState(() {
          _fullNameController.text = userInfo['fullName'] ?? '';
          _phoneController.text = userInfo['phone'] ?? '';
          _emailController.text = userInfo['email'] ?? '';
          _addressController.text = userInfo['address'] ?? '';
          _gender = userInfo['gender'] ?? 'Nam';
          _birthDate = userInfo['birthDate'] ?? DateTime.now().toString().split(' ')[0];
          _birthDateController.text = _birthDate;
        });
      }
    } catch (e) {
      print('Error loading user info: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Không thể tải thông tin người dùng: ${e.toString()}')),
        );
        setState(() {
          _useLoggedInInfo = false;
        });
      }
    }
  }

  void _calculateTotalPrice() {
    final adultPrice = widget.tour.price ?? 0;
    final childPrice = adultPrice * 0.5;
    final infantPrice = adultPrice * 0.25;

    setState(() {
      _totalPrice = (_passengerCounts['adult']! * adultPrice) +
          (_passengerCounts['child']! * childPrice) +
          (_passengerCounts['infant']! * infantPrice);
    });
  }

  void _handlePassengerCountChange(String type, String operation) {
    setState(() {
      final currentCount = _passengerCounts[type]!;
      final newCount = operation == 'add'
          ? currentCount + 1
          : type == 'adult'
              ? (currentCount > 1 ? currentCount - 1 : 1)
              : (currentCount > 0 ? currentCount - 1 : 0);

      _passengerCounts[type] = newCount;

      // Update additional passengers list
      final currentList = List<Map<String, dynamic>>.from(_additionalPassengers[type]!);
      if (type == 'adult') {
        // For adults, we need newCount - 1 additional passengers
        while (currentList.length < newCount - 1) {
          currentList.add({
            'fullName': '',
            'gender': 'Nam',
            'birthDate': '',
            'birthDateController': TextEditingController(),
          });
        }
        while (currentList.length > newCount - 1) {
          currentList.last['birthDateController']?.dispose();
          currentList.removeLast();
        }
      } else {
        // For children and infants, we need exactly newCount additional passengers
        while (currentList.length < newCount) {
          currentList.add({
            'fullName': '',
            'gender': 'Nam',
            'birthDate': '',
            'birthDateController': TextEditingController(),
          });
        }
        while (currentList.length > newCount) {
          currentList.last['birthDateController']?.dispose();
          currentList.removeLast();
        }
      }
      _additionalPassengers[type] = currentList;
    });
    _calculateTotalPrice();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final publicId = prefs.getString('public_id');
      if (publicId == null) {
        throw Exception('User not logged in');
      }

      // Prepare passenger details
      final passengerDetails = [
        ..._additionalPassengers['adult']!.map((p) => {
              'fullName': p['fullName']!.trim(),
              'gender': p['gender'],
              'birthDate': p['birthDate'],
              'passengerType': 'adult'
            }),
        ..._additionalPassengers['child']!.map((p) => {
              'fullName': p['fullName']!.trim(),
              'gender': p['gender'],
              'birthDate': p['birthDate'],
              'passengerType': 'child'
            }),
        ..._additionalPassengers['infant']!.map((p) => {
              'fullName': p['fullName']!.trim(),
              'gender': p['gender'],
              'birthDate': p['birthDate'],
              'passengerType': 'infant'
            }),
      ];

      final payload = {
        'bookingId': widget.bookingId,
        'publicId': publicId,
        'contactInfo': {
          'fullName': _fullNameController.text.trim(),
          'phoneNumber': _phoneController.text.trim(),
          'email': _emailController.text.trim(),
          'address': _addressController.text.trim(),
          'gender': _gender,
          'birthDate': _birthDate
        },
        'passengers': _passengerCounts,
        'passengerDetails': passengerDetails
      };

      final result = await _bookingPassengerService.submitPassengers(payload);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đăng ký thông tin hành khách thành công!')),
        );
        // Navigate to confirmation screen
        Navigator.pushReplacementNamed(context, '/booking-confirmation', arguments: {
          'bookingId': widget.bookingId,
          'passengers': result,
          'tourInfo': widget.tour,
          'itineraries': widget.itineraries,
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thông tin hành khách'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Tour information card with image
                Card(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Tour image
                      if (widget.tour.imageUrl != null && widget.tour.imageUrl!.isNotEmpty)
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(0), bottom: Radius.circular(0)),
                          child: Image.network(
                            'http://10.0.2.2:8080${widget.tour.imageUrl}',
                            width: double.infinity,
                            height: 220,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                height: 220,
                                color: Colors.grey[300],
                                child: const Icon(Icons.error),
                              );
                            },
                          ),
                        ),
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.tour.name,
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue[900],
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              widget.tour.description ?? 'Không có mô tả',
                              style: const TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(Icons.calendar_today, size: 16, color: Colors.blue[900]),
                                const SizedBox(width: 8),
                                Text(
                                  'Ngày khởi hành: ${widget.selectedDate}',
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(Icons.timer, size: 16, color: Colors.blue[900]),
                                const SizedBox(width: 8),
                                Text(
                                  'Thời gian: ${widget.tour.duration} ngày',
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(Icons.attach_money, size: 16, color: Colors.blue[900]),
                                const SizedBox(width: 8),
                                Text(
                                  'Giá: ${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(widget.tour.price)}',
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                
                // Use logged in info switch
                SwitchListTile(
                  title: const Text('Sử dụng thông tin tài khoản đang đăng nhập'),
                  value: _useLoggedInInfo,
                  onChanged: (bool value) {
                    setState(() {
                      _useLoggedInInfo = value;
                      if (value) {
                        _loadUserInfo();
                      } else {
                        // Clear contact info
                        _fullNameController.text = '';
                        _phoneController.text = '';
                        _emailController.text = '';
                        _addressController.text = '';
                        _gender = 'Nam';
                        _birthDate = DateTime.now().toString().split(' ')[0];
                      }
                    });
                  },
                ),
                const SizedBox(height: 10),
                
                // Contact information section
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Thông tin liên hệ',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _fullNameController,
                          decoration: const InputDecoration(
                            labelText: 'Họ và tên',
                            border: OutlineInputBorder(),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Vui lòng nhập họ và tên';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _phoneController,
                          decoration: const InputDecoration(
                            labelText: 'Số điện thoại',
                            border: OutlineInputBorder(),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Vui lòng nhập số điện thoại';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            labelText: 'Email',
                            border: OutlineInputBorder(),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Vui lòng nhập email';
                            }
                            if (!value.contains('@')) {
                              return 'Email không hợp lệ';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _addressController,
                          decoration: const InputDecoration(
                            labelText: 'Địa chỉ',
                            border: OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: _gender,
                                decoration: const InputDecoration(
                                  labelText: 'Giới tính',
                                  border: OutlineInputBorder(),
                                ),
                                items: const [
                                  DropdownMenuItem(value: 'Nam', child: Text('Nam')),
                                  DropdownMenuItem(value: 'Nữ', child: Text('Nữ')),
                                ],
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() => _gender = value);
                                  }
                                },
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: TextFormField(
                                controller: _birthDateController,
                                readOnly: true,
                                decoration: const InputDecoration(
                                  labelText: 'Ngày sinh',
                                  border: OutlineInputBorder(),
                                ),
                                onTap: () async {
                                  final date = await showDatePicker(
                                    context: context,
                                    initialDate: DateTime.tryParse(_birthDateController.text) ?? DateTime.now(),
                                    firstDate: DateTime(1900),
                                    lastDate: DateTime.now(),
                                  );
                                  if (date != null) {
                                    setState(() {
                                      _birthDate = date.toString().split(' ')[0];
                                      _birthDateController.text = _birthDate;
                                    });
                                  }
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Passenger count section
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Số lượng hành khách',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        _buildPassengerCountRow('Người lớn', 'adult'),
                        const Divider(),
                        _buildPassengerCountRow('Trẻ em (2-11 tuổi)', 'child'),
                        const Divider(),
                        _buildPassengerCountRow('Em bé (< 2 tuổi)', 'infant'),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Additional passengers section
                if (_additionalPassengers.values.any((list) => list.isNotEmpty))
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Thông tin hành khách bổ sung',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          ..._buildAdditionalPassengerFields(),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 20),

                // Total price and submit button
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Tổng tiền:',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(_totalPrice),
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.orange,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isSubmitting ? null : _handleSubmit,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.orange,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                            child: Text(
                              _isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt tour',
                              style: const TextStyle(fontSize: 16, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPassengerCountRow(String label, String type) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontSize: 16),
              ),
              if (type == 'adult')
                const Text(
                  '(Từ 12 tuổi trở lên)',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
            ],
          ),
        ),
        Row(
          children: [
            IconButton(
              onPressed: () => _handlePassengerCountChange(type, 'subtract'),
              icon: const Icon(Icons.remove_circle_outline),
              color: Colors.orange,
            ),
            Text(
              '${_passengerCounts[type]}',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            IconButton(
              onPressed: () => _handlePassengerCountChange(type, 'add'),
              icon: const Icon(Icons.add_circle_outline),
              color: Colors.orange,
            ),
          ],
        ),
      ],
    );
  }

  List<Widget> _buildAdditionalPassengerFields() {
    final widgets = <Widget>[];
    void addPassengerFields(String type, String label, List<Map<String, dynamic>> passengers) {
      if (passengers.isEmpty) return;
      
      widgets.add(
        Padding(
          padding: const EdgeInsets.only(top: 16),
          child: Text(
            label,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
      );

      for (var i = 0; i < passengers.length; i++) {
        final passenger = passengers[i];
        widgets.add(
          Padding(
            padding: const EdgeInsets.only(top: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  type == 'adult' ? 'Người lớn ${i + 2}' : '${type == 'child' ? 'Trẻ em' : 'Em bé'} ${i + 1}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  initialValue: passenger['fullName'],
                  decoration: const InputDecoration(
                    labelText: 'Họ và tên',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Vui lòng nhập họ và tên';
                    }
                    return null;
                  },
                  onChanged: (value) => passenger['fullName'] = value,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: passenger['gender'],
                        decoration: const InputDecoration(
                          labelText: 'Giới tính',
                          border: OutlineInputBorder(),
                        ),
                        items: const [
                          DropdownMenuItem(value: 'Nam', child: Text('Nam')),
                          DropdownMenuItem(value: 'Nữ', child: Text('Nữ')),
                        ],
                        onChanged: (value) {
                          if (value != null) {
                            setState(() => passenger['gender'] = value);
                          }
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: passenger['birthDateController'],
                        readOnly: true,
                        decoration: const InputDecoration(
                          labelText: 'Ngày sinh',
                          border: OutlineInputBorder(),
                        ),
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: DateTime.tryParse(passenger['birthDateController'].text) ?? DateTime.now(),
                            firstDate: DateTime(1900),
                            lastDate: DateTime.now(),
                          );
                          if (date != null) {
                            setState(() {
                              passenger['birthDate'] = date.toString().split(' ')[0];
                              passenger['birthDateController'].text = passenger['birthDate'];
                            });
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      }
    }

    addPassengerFields('adult', 'Người lớn bổ sung', _additionalPassengers['adult']!);
    addPassengerFields('child', 'Trẻ em', _additionalPassengers['child']!);
    addPassengerFields('infant', 'Em bé', _additionalPassengers['infant']!);

    return widgets;
  }
}
  