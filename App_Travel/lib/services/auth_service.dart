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
        throw Exception(jsonDecode(response.body)['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
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