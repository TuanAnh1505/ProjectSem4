import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/auth_models.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String baseUrl = 'http://10.0.2.2:8080/api/auth'; // Use 10.0.2.2 for Android emulator to access localhost

  Future<AuthResponse> login(LoginRequest request) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(request.toJson()),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token'];
        final userId = data['userId'];
        
        // Lưu token và userId vào SharedPreferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        await prefs.setInt('userId', userId);
        
        
        return AuthResponse.fromJson(data);
      } else {
        // Xử lý các mã lỗi cụ thể
        String errorMessage = 'Đăng nhập thất bại';
        try {
          final errorData = jsonDecode(response.body);
          errorMessage = errorData['message'] ?? errorMessage;
        } catch (_) {
          // Nếu không phải JSON, dùng luôn body làm thông báo nếu có
          if (response.body.isNotEmpty) {
            errorMessage = response.body;
          }
        }
        
        // Phân tích thông báo lỗi để hiển thị thông báo phù hợp
        if (response.statusCode == 401) {
          if (errorMessage.toLowerCase().contains('password') || 
              errorMessage.toLowerCase().contains('mật khẩu')) {
            throw Exception('Mật khẩu không đúng. Vui lòng kiểm tra lại.');
          } else if (errorMessage.toLowerCase().contains('email') || 
                     errorMessage.toLowerCase().contains('tài khoản')) {
            throw Exception('Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại.');
          } else {
            throw Exception('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra email và mật khẩu.');
          }
        } else if (response.statusCode == 404) {
          throw Exception('Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại.');
        } else if (response.statusCode == 400) {
          throw Exception('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
        } else {
          throw Exception(errorMessage);
        }
      }
    } catch (e) {
      // Xử lý lỗi kết nối
      if (e.toString().contains('Failed to connect') || 
          e.toString().contains('Connection refused') ||
          e.toString().contains('SocketException')) {
        throw Exception('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại.');
      }
      // Nếu đã là Exception với thông báo tiếng Việt, trả về nguyên bản
      if (e.toString().contains('Mật khẩu') || 
          e.toString().contains('Email') ||
          e.toString().contains('Thông tin đăng nhập')) {
        throw e;
      }
      throw Exception('Đã xảy ra lỗi: $e');
    }
  }

  Future<String> register(RegisterRequest request) async {
    try {
      final body = request.toJson();
      body['isApp'] = true; // Đánh dấu đăng ký từ app
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        return response.body;
      } else {
        throw Exception(jsonDecode(response.body)['message'] ?? 'Registration failed');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<String> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/forgot-password?email=$email&isApp=true'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return response.body;
      } else {
        throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to send reset email');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<String> resetPassword(String publicId, String newPassword) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/reset-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'publicId': publicId,
          'newPassword': newPassword,
        }),
      );

      if (response.statusCode == 200) {
        return response.body;
      } else {
        throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to reset password');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<String> changePassword(String email, String currentPassword, String newPassword) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/change-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        }),
      );

      if (response.statusCode == 200) {
        return response.body;
      } else {
        throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to change password');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }
} 