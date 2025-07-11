import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/tour_models.dart';
import '../../services/booking_passenger_service.dart';
import 'booking_confirmation_screen.dart';

class BookingPassengerScreen extends StatefulWidget {
  final int bookingId;
  final String bookingCode;
  final Tour tour;
  final String selectedDate;
  final List<dynamic> itineraries;
  final double finalPrice;

  const BookingPassengerScreen({
    Key? key,
    required this.bookingId,
    required this.bookingCode,
    required this.tour,
    required this.selectedDate,
    required this.itineraries,
    required this.finalPrice,
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
  String _discountCode = '';
  String _discountError = '';
  Map<String, dynamic>? _discountInfo;
  double _discountedPrice = 0;

  bool showFullDescription = false;

  int _currentImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _checkAuth();
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

  double _calculateTotalPrice() {
    double basePrice = widget.tour.price ?? 0.0;
    int adultCount = _passengerCounts['adult'] ?? 0;
    int childCount = _passengerCounts['child'] ?? 0;
    int infantCount = _passengerCounts['infant'] ?? 0;

    double total = 0;
    total += adultCount * basePrice;
    total += childCount * (basePrice * 0.5);
    total += infantCount * (basePrice * 0.25);

    if (_discountInfo != null && _discountInfo!['discountPercent'] != null) {
      final percent = _discountInfo!['discountPercent'] as double;
      total = total - (total * percent / 100);
    }

    setState(() {
      _totalPrice = total;
      _discountedPrice = total;
    });

    return total;
  }

  void _handlePassengerCountChange(String type, String operation) {
    setState(() {
      final currentCount = _passengerCounts[type]!;
      final max = widget.tour.maxParticipants ?? 99;
      final totalCurrent = _passengerCounts['adult']! + _passengerCounts['child']! + _passengerCounts['infant']!;
      
      if (operation == 'add' && totalCurrent + 1 > max) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Số lượng khách không được vượt quá $max người!')),
        );
        return;
      }

      final newCount = operation == 'add'
          ? currentCount + 1
          : type == 'adult'
              ? (currentCount > 1 ? currentCount - 1 : 1)
              : (currentCount > 0 ? currentCount - 1 : 0);

      _passengerCounts[type] = newCount;

      // Update additional passengers list
      final currentList = List<Map<String, dynamic>>.from(_additionalPassengers[type]!);
      if (type == 'adult') {
        while (currentList.length < newCount - 1) {
          currentList.add({
            'fullName': '',
            'gender': 'Nam',
            'birthDate': '',
            'phone': '',
            'email': '',
            'birthDateController': TextEditingController(),
          });
        }
        while (currentList.length > newCount - 1) {
          currentList.last['birthDateController']?.dispose();
          currentList.removeLast();
        }
      } else {
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

  Future<void> _handleApplyDiscount() async {
    if (_discountCode.trim().isEmpty) {
      setState(() {
        _discountError = 'Vui lòng nhập mã giảm giá trước khi áp dụng!';
      });
      return;
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
        return;
      }

      final response = await _bookingPassengerService.checkDiscountCode(
        _discountCode,
        widget.tour.tourId,
      );

      setState(() {
        _discountInfo = response;
        _discountError = '';
      });
      _calculateTotalPrice();
    } catch (e) {
      if (e.toString().contains('Unauthorized')) {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
      } else {
        setState(() {
          _discountInfo = null;
          _discountError = 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
          _discountedPrice = widget.tour.price ?? 0.0;
        });
      }
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final publicId = prefs.getString('public_id');

      if (token == null || publicId == null) {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
        return;
      }

      // Tạo danh sách hành khách
      final List<Map<String, dynamic>> allPassengers = [];
      
      // Thêm thông tin người liên hệ
      allPassengers.add({
        'fullName': _fullNameController.text.trim(),
        'gender': _gender,
        'birthDate': _birthDate,
        'passengerType': 'adult',
        'phone': _phoneController.text.trim(),
        'email': _emailController.text.trim(),
        'address': _addressController.text.trim(),
      });

      // Thêm các hành khách bổ sung
      for (var type in ['adult', 'child', 'infant']) {
        for (var passenger in _additionalPassengers[type]!) {
          if (passenger['fullName']?.isNotEmpty == true) {
            Map<String, dynamic> passengerData = {
              'fullName': passenger['fullName'].trim(),
              'gender': passenger['gender'],
              'birthDate': passenger['birthDate'],
              'passengerType': type,
            };
            
            // Thêm thông tin điện thoại và email cho người lớn
            if (type == 'adult') {
              passengerData['phone'] = passenger['phone']?.trim();
              passengerData['email'] = passenger['email']?.trim();
            }
            
            // Thêm trường guardianIndex cho child/infant
            if (type == 'child' || type == 'infant') {
              passengerData['guardianIndex'] = passenger['guardianIndex'] ?? 0;
            }
            
            allPassengers.add(passengerData);
          }
        }
      }

      // Tạo thông tin liên lạc
      final contactInfo = {
        'fullName': _fullNameController.text.trim(),
        'phoneNumber': _phoneController.text.trim(),
        'email': _emailController.text.trim(),
        'address': _addressController.text.trim(),
        'gender': _gender,
        'birthDate': _birthDate,
      };

      // Tạo payload cho API
      final payload = {
        'bookingId': widget.bookingId,
        'publicId': publicId,
        'contactInfo': contactInfo,
        'passengers': _passengerCounts,
        'passengerDetails': allPassengers.skip(1).toList(),
        'discountCode': _discountCode.trim().isEmpty ? null : _discountCode.trim(),
        'discountedPrice': _discountedPrice,
      };

      final response = await _bookingPassengerService.submitPassengers(payload);

      if (!mounted) return;

      // Convert response to List<Map<String, dynamic>>
      final List<Map<String, dynamic>> convertedResponse = (response as List)
          .map((item) => item is Map<String, dynamic> 
              ? item 
              : Map<String, dynamic>.from(item as Map))
          .toList();

      // Convert itineraries to List<Map<String, dynamic>>
      final List<Map<String, dynamic>> convertedItineraries = widget.itineraries
          .map((itinerary) => itinerary is Map<String, dynamic>
              ? itinerary
              : Map<String, dynamic>.from(itinerary as Map))
          .toList();

      // Chuyển sang màn hình xác nhận
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => BookingConfirmationScreen(
            bookingId: widget.bookingId.toString(),
            bookingCode: widget.bookingCode,
            passengers: convertedResponse,
            tourInfo: {
              'tourId': widget.tour.tourId,
              'name': widget.tour.name,
              'description': widget.tour.description,
              'price': widget.tour.price,
              'originalPrice': widget.tour.price,
              'duration': widget.tour.duration,
              'maxParticipants': widget.tour.maxParticipants,
              'statusId': widget.tour.statusId,
              'imageUrl': widget.tour.imageUrls.isNotEmpty ? widget.tour.imageUrls[0] : null,
              'imageUrls': widget.tour.imageUrls,
              'createdAt': widget.tour.createdAt?.toIso8601String(),
              'updatedAt': widget.tour.updatedAt?.toIso8601String(),
            },
            contactInfo: contactInfo,
            itineraries: convertedItineraries,
            finalPrice: _discountedPrice,
          ),
        ),
      );
    } catch (e) {
      if (e.toString().contains('Unauthorized')) {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Có lỗi xảy ra: ${e.toString()}')),
          );
        }
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  Future<void> _checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) {
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    }
  }

  int calculateAge(String birthDate) {
    try {
      final date = DateTime.parse(birthDate);
      final now = DateTime.now();
      int age = now.year - date.year;
      if (now.month < date.month || (now.month == date.month && now.day < date.day)) {
        age--;
      }
      return age;
    } catch (_) {
      return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thông tin hành khách'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.orange),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Tour information card
                Card(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (widget.tour.imageUrls.isNotEmpty)
                        Container(
                          height: 220,
                          child: Stack(
                            children: [
                              PageView.builder(
                                itemCount: widget.tour.imageUrls.length,
                                onPageChanged: (index) {
                                  setState(() {
                                    _currentImageIndex = index;
                                  });
                                },
                                itemBuilder: (context, index) {
                                  return GestureDetector(
                                    onTap: () {
                                      // TODO: Implement full screen gallery view
                                    },
                                    child: Image.network(
                                      'http://10.0.2.2:8080${widget.tour.imageUrls[index]}',
                                      width: double.infinity,
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) {
                                        return Container(
                                          color: Colors.grey[300],
                                          child: const Icon(Icons.error),
                                        );
                                      },
                                    ),
                                  );
                                },
                              ),
                              if (widget.tour.imageUrls.length > 1)
                                Positioned(
                                  bottom: 10,
                                  left: 0,
                                  right: 0,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: List.generate(
                                      widget.tour.imageUrls.length,
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
                                    '${_currentImageIndex + 1}/${widget.tour.imageUrls.length}',
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
                              maxLines: showFullDescription ? null : 4,
                              overflow: showFullDescription ? TextOverflow.visible : TextOverflow.ellipsis,
                            ),
                            if ((widget.tour.description?.length ?? 0) > 120)
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    showFullDescription = !showFullDescription;
                                  });
                                },
                                child: Text(
                                  showFullDescription ? 'Thu gọn' : 'Xem thêm',
                                  style: TextStyle(
                                    color: Colors.blue,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(Icons.calendar_today, size: 16, color: Colors.orange),
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
                                Icon(Icons.timer, size: 16, color: Colors.orange),
                                const SizedBox(width: 8),
                                Text(
                                  (widget.tour.duration ?? 1) > 1
                                      ? '${widget.tour.duration} ngày ${widget.tour.duration - 1} đêm'
                                      : '${widget.tour.duration} ngày',
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                // Icon(Icons.attach_money, size: 16, color: Colors.orange ),
                                const SizedBox(width: 8),
                                Text(
                                  '${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(widget.tour.price)}',
                                  style: const TextStyle(fontSize: 19, color: Colors.red, fontWeight: FontWeight.bold),
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
                  // activeColor: Colors.blue,
                  // inactiveTrackColor: Colors.blue.shade100,
                  // inactiveThumbColor: Colors.blue.shade200,
                  onChanged: (bool value) {
                    setState(() {
                      _useLoggedInInfo = value;
                      if (value) {
                        _loadUserInfo();
                      } else {
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
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.1),
                        spreadRadius: 1,
                        blurRadius: 10,
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
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(Icons.person_outline, color: Colors.orange.shade800, size: 24),
                            ),
                            const SizedBox(width: 12),
                            const Text(
                              'Thông tin liên hệ',
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
                          children: [
                            TextFormField(
                              controller: _fullNameController,
                              style: const TextStyle(fontSize: 15),
                              decoration: InputDecoration(
                                labelText: 'Họ và tên',
                                labelStyle: TextStyle(color: Colors.grey.shade600),
                                prefixIcon: Icon(Icons.person, color: Colors.orange.shade400, size: 20),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                                ),
                                filled: true,
                                fillColor: Colors.grey.shade50,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
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
                              style: const TextStyle(fontSize: 15),
                              decoration: InputDecoration(
                                labelText: 'Số điện thoại',
                                labelStyle: TextStyle(color: Colors.grey.shade600),
                                prefixIcon: Icon(Icons.phone, color: Colors.orange.shade400, size: 20),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                                ),
                                filled: true,
                                fillColor: Colors.grey.shade50,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
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
                              style: const TextStyle(fontSize: 15),
                              decoration: InputDecoration(
                                labelText: 'Email',
                                labelStyle: TextStyle(color: Colors.grey.shade600),
                                prefixIcon: Icon(Icons.email, color: Colors.orange.shade400, size: 20),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                                ),
                                filled: true,
                                fillColor: Colors.grey.shade50,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
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
                              style: const TextStyle(fontSize: 15),
                              decoration: InputDecoration(
                                labelText: 'Địa chỉ',
                                labelStyle: TextStyle(color: Colors.grey.shade600),
                                prefixIcon: Icon(Icons.location_on, color: Colors.orange.shade400, size: 20),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                                ),
                                filled: true,
                                fillColor: Colors.grey.shade50,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(
                                  child: DropdownButtonFormField<String>(
                                    value: _gender,
                                    style: const TextStyle(fontSize: 15, color: Colors.black87),
                                    decoration: InputDecoration(
                                      labelText: 'Giới tính',
                                      labelStyle: TextStyle(color: Colors.grey.shade600),
                                      prefixIcon: Icon(Icons.people, color: Colors.orange.shade400, size: 20),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: BorderSide(color: Colors.grey.shade300),
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: BorderSide(color: Colors.grey.shade300),
                                      ),
                                      focusedBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                                      ),
                                      filled: true,
                                      fillColor: Colors.grey.shade50,
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
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
                                    style: const TextStyle(fontSize: 15),
                                    decoration: InputDecoration(
                                      labelText: 'Ngày sinh',
                                      labelStyle: TextStyle(color: Colors.grey.shade600),
                                      prefixIcon: Icon(Icons.calendar_today, color: Colors.orange.shade400, size: 20),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: BorderSide(color: Colors.grey.shade300),
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: BorderSide(color: Colors.grey.shade300),
                                      ),
                                      focusedBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                                      ),
                                      filled: true,
                                      fillColor: Colors.grey.shade50,
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                                    ),
                                    validator: (value) {
                                      if (value == null || value.trim().isEmpty) {
                                        return 'Vui lòng chọn ngày sinh';
                                      }
                                      final date = DateTime.tryParse(value);
                                      if (date == null) {
                                        return 'Ngày sinh không hợp lệ';
                                      }
                                      if (date.isAfter(DateTime.now())) {
                                        return 'Ngày sinh không được lớn hơn ngày hiện tại';
                                      }
                                      int age = calculateAge(value);
                                      if (age < 16) {
                                        return 'Người liên hệ phải từ 16 tuổi trở lên!';
                                      }
                                      return null;
                                    },
                                    onTap: () async {
                                      final date = await showDatePicker(
                                        context: context,
                                        initialDate: DateTime.tryParse(_birthDateController.text) ?? DateTime.now(),
                                        firstDate: DateTime(1900),
                                        lastDate: DateTime.now(),
                                        builder: (context, child) {
                                          return Theme(
                                            data: Theme.of(context).copyWith(
                                              colorScheme: ColorScheme.light(
                                                primary: Colors.orange.shade400,
                                                onPrimary: Colors.white,
                                                surface: Colors.white,
                                                onSurface: Colors.black87,
                                              ),
                                            ),
                                            child: child!,
                                          );
                                        },
                                      );
                                      if (date != null) {
                                        setState(() {
                                          _birthDate = date.toString().split(' ')[0];
                                          _birthDateController.text = _birthDate;
                                          int age = calculateAge(_birthDate);
                                          if (age < 16) {
                                            ScaffoldMessenger.of(context).showSnackBar(
                                              SnackBar(content: Text('Người liên hệ phải từ 16 tuổi trở lên!')),
                                            );
                                          }
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
                    ],
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
                        _buildPassengerCountRow('Người lớn (100%)', 'adult'),
                        const Divider(),
                        _buildPassengerCountRow('Trẻ em (50%)', 'child'),
                        const Divider(),
                        _buildPassengerCountRow('Em bé (25%)', 'infant'),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Additional passengers section
                if (_additionalPassengers.values.any((list) => list.isNotEmpty))
                  Container(
                    margin: const EdgeInsets.only(top: 20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          spreadRadius: 1,
                          blurRadius: 10,
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
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Icon(Icons.group, color: Colors.orange.shade800, size: 24),
                              ),
                              const SizedBox(width: 12),
                              const Text(
                                'Thông tin hành khách bổ sung',
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
                            children: _buildAdditionalPassengerFields(),
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 20),

                // Total price, discount code, and submit button in one Card
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Chi tiết giá:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 10),
                        ..._buildPriceDetails(),
                        const SizedBox(height: 16),
                        // Form nhập mã giảm giá
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                decoration: InputDecoration(
                                  hintText: 'Nhập mã giảm giá',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                onChanged: (value) {
                                  setState(() {
                                    _discountCode = value;
                                    _discountError = '';
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 16),
                            ElevatedButton(
                              onPressed: _handleApplyDiscount,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: Colors.black, 
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: const Text('Áp dụng'),
                            ),
                          ],
                        ),
                        if (_discountError.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              _discountError,
                              style: const TextStyle(color: Colors.red),
                            ),
                          ),
                        const SizedBox(height: 25),
                        const Divider(),
                        const SizedBox(height: 25),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Tổng cộng :',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            Row(
                              children: [
                                Text(
                                  NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(_totalPrice),
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red,
                                  ),
                                ),
                                if (_discountInfo != null && _discountInfo!['discountPercent'] != null)
                                  Padding(
                                    padding: const EdgeInsets.only(left: 8),
                                    child: Text(
                                      NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(
                                        (_passengerCounts['adult'] ?? 0) * (widget.tour.price ?? 0.0) +
                                        (_passengerCounts['child'] ?? 0) * ((widget.tour.price ?? 0.0) * 0.5)
                                      ),
                                      style: const TextStyle(
                                        color: Colors.grey,
                                        decoration: TextDecoration.lineThrough,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 25),
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
                const SizedBox(height: 20),
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
              // if (type == 'adult')
              //   const Text(
              //     // '(Từ 16 tuổi trở lên)',
              //     style: TextStyle(fontSize: 12, color: Colors.grey),
              //   ),
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
        Container(
          margin: const EdgeInsets.only(bottom: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.orange.shade800,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ...List.generate(passengers.length, (i) {
                final passenger = passengers[i];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 10),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          type == 'adult' ? 'Người lớn ${i + 2}' : '${type == 'child' ? 'Trẻ em' : 'Em bé'} ${i + 1}',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey.shade700,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        initialValue: passenger['fullName'],
                        style: const TextStyle(fontSize: 15),
                        decoration: InputDecoration(
                          labelText: 'Họ và tên',
                          labelStyle: TextStyle(color: Colors.grey.shade600),
                          prefixIcon: Icon(Icons.person, color: Colors.orange.shade400, size: 20),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey.shade300),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey.shade300),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade50,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Vui lòng nhập họ và tên';
                          }
                          return null;
                        },
                        onChanged: (value) => passenger['fullName'] = value,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              value: passenger['gender'],
                              style: const TextStyle(fontSize: 15, color: Colors.black87),
                              decoration: InputDecoration(
                                labelText: 'Giới tính',
                                labelStyle: TextStyle(color: Colors.grey.shade600),
                                prefixIcon: Icon(Icons.people, color: Colors.orange.shade400, size: 20),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                                ),
                                filled: true,
                                fillColor: Colors.grey.shade50,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
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
                              style: const TextStyle(fontSize: 15),
                              decoration: InputDecoration(
                                labelText: 'Ngày sinh',
                                labelStyle: TextStyle(color: Colors.grey.shade600),
                                prefixIcon: Icon(Icons.calendar_today, color: Colors.orange.shade400, size: 20),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                                ),
                                filled: true,
                                fillColor: Colors.grey.shade50,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                              ),
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Vui lòng chọn ngày sinh';
                                }
                                final date = DateTime.tryParse(value);
                                if (date == null) {
                                  return 'Ngày sinh không hợp lệ';
                                }
                                if (date.isAfter(DateTime.now())) {
                                  return 'Ngày sinh không được lớn hơn ngày hiện tại';
                                }
                                int age = calculateAge(value);
                                if (type == 'adult' && age < 16) {
                                  return 'Người lớn phải từ 16 tuổi trở lên!';
                                } else if (type == 'child' && (age < 2 || age >= 16)) {
                                  return 'Trẻ em phải từ 2 đến dưới 16 tuổi!';
                                } else if (type == 'infant' && age >= 2) {
                                  return 'Em bé phải dưới 2 tuổi!';
                                }
                                return null;
                              },
                              onTap: () async {
                                final date = await showDatePicker(
                                  context: context,
                                  initialDate: DateTime.tryParse(passenger['birthDateController'].text) ?? DateTime.now(),
                                  firstDate: DateTime(1900),
                                  lastDate: DateTime.now(),
                                  builder: (context, child) {
                                    return Theme(
                                      data: Theme.of(context).copyWith(
                                        colorScheme: ColorScheme.light(
                                          primary: Colors.orange.shade400,
                                          onPrimary: Colors.white,
                                          surface: Colors.white,
                                          onSurface: Colors.black87,
                                        ),
                                      ),
                                      child: child!,
                                    );
                                  },
                                );
                                if (date != null) {
                                  setState(() {
                                    passenger['birthDate'] = date.toString().split(' ')[0];
                                    passenger['birthDateController'].text = passenger['birthDate'];
                                    int age = calculateAge(passenger['birthDate']);
                                    String warning = '';
                                    if (type == 'adult' && age < 16) {
                                      warning = 'Người lớn phải từ 16 tuổi trở lên!';
                                    } else if (type == 'child' && (age < 2 || age >= 16)) {
                                      warning = 'Trẻ em phải từ 2 đến dưới 16 tuổi!';
                                    } else if (type == 'infant' && age >= 2) {
                                      warning = 'Em bé phải dưới 2 tuổi!';
                                    }
                                    if (warning.isNotEmpty) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text(warning)),
                                      );
                                    }
                                  });
                                }
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      
                      // Hiển thị số điện thoại và email cho người lớn
                      if (type == 'adult') ...[
                        TextFormField(
                          initialValue: passenger['phone'] ?? '',
                          style: const TextStyle(fontSize: 15),
                          decoration: InputDecoration(
                            labelText: 'Số điện thoại',
                            labelStyle: TextStyle(color: Colors.grey.shade600),
                            prefixIcon: Icon(Icons.phone, color: Colors.orange.shade400, size: 20),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.grey.shade300),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.grey.shade300),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                            ),
                            filled: true,
                            fillColor: Colors.grey.shade50,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Vui lòng nhập số điện thoại';
                            }
                            return null;
                          },
                          onChanged: (value) => passenger['phone'] = value,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          initialValue: passenger['email'] ?? '',
                          style: const TextStyle(fontSize: 15),
                          decoration: InputDecoration(
                            labelText: 'Email',
                            labelStyle: TextStyle(color: Colors.grey.shade600),
                            prefixIcon: Icon(Icons.email, color: Colors.orange.shade400, size: 20),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.grey.shade300),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.grey.shade300),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.orange.shade400, width: 1.5),
                            ),
                            filled: true,
                            fillColor: Colors.grey.shade50,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
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
                          onChanged: (value) => passenger['email'] = value,
                        ),
                        const SizedBox(height: 12),
                      ],
                      
                      // Hiển thị người giám hộ cho trẻ em và em bé
                      if (type == 'child' || type == 'infant') ...[
                        DropdownButtonFormField<int>(
                          value: passenger['guardianIndex'] ?? 0,
                          decoration: InputDecoration(
                            labelText: 'Người giám hộ',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          items: [
                            DropdownMenuItem(
                              value: 0,
                              child: Text(_fullNameController.text.isNotEmpty ? _fullNameController.text : 'Người liên hệ'),
                            ),
                            ..._additionalPassengers['adult']!.asMap().entries.map((entry) {
                              int idx = entry.key;
                              var p = entry.value;
                              return DropdownMenuItem(
                                value: idx + 1,
                                child: Text(p['fullName']?.isNotEmpty == true ? p['fullName'] : 'Người lớn ${idx + 2}'),
                              );
                            }).toList(),
                          ],
                          onChanged: (val) {
                            setState(() {
                              passenger['guardianIndex'] = val ?? 0;
                            });
                          },
                        ),
                        const SizedBox(height: 12),
                      ],
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
      );
    }

    addPassengerFields('adult', 'Người lớn bổ sung', _additionalPassengers['adult']!);
    addPassengerFields('child', 'Trẻ em', _additionalPassengers['child']!);
    addPassengerFields('infant', 'Em bé', _additionalPassengers['infant']!);

    return widgets;
  }

  List<Widget> _buildPriceDetails() {
    double basePrice = widget.tour.price ?? 0.0;
    int adultCount = _passengerCounts['adult'] ?? 0;
    int childCount = _passengerCounts['child'] ?? 0;
    int infantCount = _passengerCounts['infant'] ?? 0;

    double discountPercent = _discountInfo?['discountPercent']?.toDouble() ?? 0;
    double adultUnitPrice = basePrice * (1 - discountPercent / 100);
    double childUnitPrice = basePrice * 0.5 * (1 - discountPercent / 100);
    double infantUnitPrice = basePrice * 0.25 * (1 - discountPercent / 100);

    double adultTotal = adultCount * adultUnitPrice;
    double childTotal = childCount * childUnitPrice;
    double infantTotal = infantCount * infantUnitPrice;
    double totalBeforeDiscount = (adultCount * basePrice) + (childCount * (basePrice * 0.5)) + (infantCount * (basePrice * 0.25));
    double discountAmount = totalBeforeDiscount * (discountPercent / 100);
    double totalAfterDiscount = totalBeforeDiscount - discountAmount;

    List<Widget> details = [];

    // Giá tour (giá 1 người lớn, có thể hiển thị giá đã giảm nếu có)
    details.add(Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Icon(Icons.price_change, color: Colors.red, size: 20),
            const SizedBox(width: 6),
            Text('Giá tour :', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        Row(
          children: [
            if (discountPercent > 0) ...[
              Text(
                NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(adultUnitPrice),
                style: TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(basePrice),
                style: TextStyle(
                  color: Colors.grey,
                  decoration: TextDecoration.lineThrough,
                  fontSize: 16,
                ),
              ),
            ] else ...[
              Text(
                NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(basePrice),
                style: TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
            ]
          ],
        ),
      ],
    ));
    details.add(const SizedBox(height: 6));

    // Người lớn
    if (adultCount > 0) {
      details.add(Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.person, color: Colors.blue, size: 18),
              const SizedBox(width: 6),
              Text('Người lớn :'),
            ],
          ),
          Text(
            NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(adultTotal),
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ));
      details.add(const SizedBox(height: 6));
    }

    // Trẻ em
    if (childCount > 0) {
      details.add(Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.child_friendly, color: Colors.blue, size: 18),
              const SizedBox(width: 6),
              Text('Trẻ em :'),
            ],
          ),
          Text(
            NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(childTotal),
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ));
      details.add(const SizedBox(height: 6));
    }

    // Em bé
    if (infantCount > 0) {
      details.add(Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.child_care, color: Colors.blue, size: 18),
              const SizedBox(width: 6),
              Text('Em bé :'),
            ],
          ),
          Text(
            NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(infantTotal),
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ));
      details.add(const SizedBox(height: 6));
    }

    // Giảm giá
    if (discountPercent > 0) {
      details.add(Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.local_offer, color: Colors.green, size: 18),
              const SizedBox(width: 4),
              Text(
                'Giảm giá (${discountPercent.toStringAsFixed(0)}%)',
                style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          Text(
            '- ' + NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(discountAmount),
            style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
          ),
        ],
      ));
      details.add(const SizedBox(height: 6));
    }

    return details;
  }
}
