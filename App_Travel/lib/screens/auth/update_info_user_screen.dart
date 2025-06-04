import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:developer' as developer;

class UpdateInfoUserScreen extends StatefulWidget {
  const UpdateInfoUserScreen({Key? key}) : super(key: key);

  @override
  _UpdateInfoUserScreenState createState() => _UpdateInfoUserScreenState();
}

class _UpdateInfoUserScreenState extends State<UpdateInfoUserScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = true;
  bool _isEditing = false;
  String? _error;
  String? _success;

  final Map<String, dynamic> _formData = {
    'fullName': '',
    'email': '',
    'phone': '',
    'address': '',
  };

  @override
  void initState() {
    super.initState();
    developer.log('UpdateInfoUserScreen initialized');
    _fetchUserInfo();
  }

  Future<void> _fetchUserInfo() async {
    try {
      developer.log('Fetching user info...');
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final publicId = prefs.getString('public_id');

      developer.log('Token: ${token != null ? 'exists' : 'null'}');
      developer.log('PublicId: ${publicId != null ? 'exists' : 'null'}');

      if (token == null || publicId == null) {
        developer.log('Token or PublicId is missing');
        setState(() {
          _error = 'Vui lòng đăng nhập để xem thông tin';
        });
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) {
          developer.log('Navigating back due to missing credentials');
          Navigator.pop(context);
        }
        return;
      }

      final url = 'http://10.0.2.2:8080/api/auth/user-info?publicId=$publicId';
      developer.log('Fetching from URL: $url');

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      developer.log('Response status code: ${response.statusCode}');
      developer.log('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        developer.log('Successfully fetched user data: $data');
        setState(() {
          _formData['fullName'] = data['fullName'] ?? '';
          _formData['email'] = data['email'] ?? '';
          _formData['phone'] = data['phone'] ?? '';
          _formData['address'] = data['address'] ?? '';
        });
      } else if (response.statusCode == 401) {
        developer.log('Unauthorized access - Token expired');
        setState(() {
          _error = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        });
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) {
          await prefs.remove('auth_token');
          await prefs.remove('public_id');
          developer.log('Cleared credentials and navigating back');
          Navigator.pop(context);
        }
      } else {
        developer.log('Error fetching user info: ${response.statusCode}');
        setState(() {
          _error = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.';
        });
      }
    } catch (e, stackTrace) {
      developer.log('Exception occurred while fetching user info', error: e, stackTrace: stackTrace);
      setState(() {
        _error = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _updateUserInfo() async {
    if (!_formKey.currentState!.validate()) {
      developer.log('Form validation failed');
      return;
    }

    try {
      developer.log('Updating user info...');
      setState(() {
        _isLoading = true;
        _error = null;
        _success = null;
      });

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final publicId = prefs.getString('public_id');

      developer.log('Token: ${token != null ? 'exists' : 'null'}');
      developer.log('PublicId: ${publicId != null ? 'exists' : 'null'}');

      if (token == null || publicId == null) {
        developer.log('Token or PublicId is missing during update');
        throw Exception('Không tìm thấy thông tin xác thực');
      }

      final url = 'http://10.0.2.2:8080/api/auth/update-info?publicId=$publicId';
      developer.log('Updating to URL: $url');
      developer.log('Update data: ${_formData}');

      final response = await http.put(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'fullName': _formData['fullName'],
          'phone': _formData['phone'],
          'address': _formData['address'],
        }),
      );

      developer.log('Update response status code: ${response.statusCode}');
      developer.log('Update response body: ${response.body}');

      if (response.statusCode == 200) {
        developer.log('Successfully updated user info');
        setState(() {
          _success = 'Cập nhật thông tin thành công!';
          _isEditing = false;
        });
        _fetchUserInfo();
      } else if (response.statusCode == 401) {
        developer.log('Unauthorized access during update - Token expired');
        setState(() {
          _error = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        });
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) {
          await prefs.remove('auth_token');
          await prefs.remove('public_id');
          developer.log('Cleared credentials and navigating back');
          Navigator.pop(context);
        }
      } else {
        developer.log('Error updating user info: ${response.statusCode}');
        setState(() {
          _error = 'Không thể cập nhật thông tin. Vui lòng thử lại sau.';
        });
      }
    } catch (e, stackTrace) {
      developer.log('Exception occurred while updating user info', error: e, stackTrace: stackTrace);
      setState(() {
        _error = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: const Center(child: CircularProgressIndicator()),
      );
    }
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: 16),
              // Back Button
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.orange),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              // User Icon
              Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFFFFF3E0),
                ),
                padding: const EdgeInsets.all(18),
                child: const Icon(
                  Icons.person,
                  size: 56,
                  color: Colors.orange,
                ),
              ),
              const SizedBox(height: 18),
              Text(
                _formData['fullName'],
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF222B45),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                _formData['email'],
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF7B8D9E),
                  fontWeight: FontWeight.w400,
                ),
              ),
              const SizedBox(height: 28),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: Stack(
                  children: [
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 18),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                      ),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildLabel('Email'),
                            _buildField(
                              icon: FontAwesomeIcons.envelope,
                              hint: _formData['email'],
                              enabled: false,
                            ),
                            const SizedBox(height: 18),
                            _buildLabel('Tên hiển thị'),
                            _buildField(
                              icon: FontAwesomeIcons.user,
                              hint: _formData['fullName'],
                              enabled: _isEditing,
                              onChanged: (val) => _formData['fullName'] = val,
                              validator: (val) => (val == null || val.isEmpty) ? 'Vui lòng nhập tên hiển thị' : null,
                            ),
                            const SizedBox(height: 18),
                            _buildLabel('Số điện thoại'),
                            _buildField(
                              icon: FontAwesomeIcons.phone,
                              hint: _formData['phone'],
                              enabled: _isEditing,
                              onChanged: (val) => _formData['phone'] = val,
                              validator: (val) => (val == null || val.isEmpty) ? 'Vui lòng nhập số điện thoại' : null,
                            ),
                            const SizedBox(height: 18),
                            _buildLabel('Địa chỉ'),
                            _buildField(
                              icon: FontAwesomeIcons.mapMarkerAlt,
                              hint: _formData['address'].isEmpty ? 'Nhập địa chỉ của bạn' : _formData['address'],
                              enabled: _isEditing,
                              onChanged: (val) => _formData['address'] = val,
                              validator: (val) => (val == null || val.isEmpty) ? 'Vui lòng nhập địa chỉ' : null,
                            ),
                            if (_isEditing)
                              Padding(
                                padding: const EdgeInsets.only(top: 28),
                                child: SizedBox(
                                  width: double.infinity,
                                  height: 48,
                                  child: ElevatedButton(
                                    onPressed: _updateUserInfo,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.orange,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                      elevation: 0,
                                    ),
                                    child: const Text(
                                      'Lưu thay đổi',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            if (_error != null)
                              Padding(
                                padding: const EdgeInsets.only(top: 18),
                                child: Text(
                                  _error!,
                                  style: const TextStyle(color: Colors.red),
                                ),
                              ),
                            if (_success != null)
                              Padding(
                                padding: const EdgeInsets.only(top: 18),
                                child: Text(
                                  _success!,
                                  style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      top: 12,
                      right: 12,
                      child: IconButton(
                        icon: Icon(_isEditing ? Icons.close : FontAwesomeIcons.edit, color: Colors.orange),
                        onPressed: () {
                          setState(() {
                            if (_isEditing) {
                              _isEditing = false;
                              _fetchUserInfo();
                            } else {
                              _isEditing = true;
                              _success = null;
                              _error = null;
                            }
                          });
                        },
                      ),
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

  Widget _buildLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 6),
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 14,
          color: Color(0xFF7B8D9E),
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildField({
    required IconData icon,
    required String hint,
    bool enabled = false,
    void Function(String)? onChanged,
    String? Function(String?)? validator,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.orange.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      height: 62,
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
            child: Icon(
              icon,
              color: Colors.orange,
              size: 26,
            ),
          ),
          Expanded(
            child: enabled
                ? TextFormField(
                    initialValue: hint,
                    onChanged: onChanged,
                    validator: validator,
                    style: const TextStyle(
                      fontSize: 18,
                      color: Color(0xFF222B45),
                      fontWeight: FontWeight.w600,
                    ),
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(vertical: 18, horizontal: 0),
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 0),
                    child: Text(
                      hint,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Color(0xFF222B45),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}





