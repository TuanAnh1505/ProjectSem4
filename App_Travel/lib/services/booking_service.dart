import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class BookingService {
  static const String baseUrl = 'http://10.0.2.2:8080/api/bookings';

  Future<Map<String, dynamic>> createBooking({
    required int userId,
    required int tourId,
    required int scheduleId,
    String? discountCode,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    if (token == null) {
      throw Exception('Hãy đăng nhập để có thể đặt tour');
    }

    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'userId': userId,
          'tourId': tourId,
          'scheduleId': scheduleId,
          'discountCode': discountCode,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else if (response.statusCode == 401) {
        throw Exception('Hãy đăng nhập để có thể đặt tour');
      } else {
        final error = json.decode(response.body);
        throw Exception(error['message'] ?? 'Không thể tạo booking');
      }
    } catch (e) {
      if (e.toString().contains('JWT expired')) {
        throw Exception('Hãy đăng nhập để có thể đặt tour');
      }
      rethrow;
    }
  }
} 