import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class BookingPassengerService {
  static const String baseUrl = 'http://10.0.2.2:8080/api';

  Future<Map<String, dynamic>> getUserInfo(String publicId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    if (token == null) {
      throw Exception('Authentication token not found');
    }

    try {
      print('Fetching user info for publicId: $publicId'); // Debug print
      print('Using token: $token'); // Debug print
      
      final response = await http.get(
        Uri.parse('$baseUrl/users/$publicId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );


      print('Response status: ${response.statusCode}'); // Debug print
      print('Response body: ${response.body}'); // Debug print

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Ensure we're returning the correct data structure
        return {
          'fullName': data['fullName'] ?? '',
          'phone': data['phone'] ?? '',
          'email': data['email'] ?? '',
          'address': data['address'] ?? '',
          'gender': data['gender'] ?? 'Nam',
          'birthDate': data['birthDate'] ?? DateTime.now().toString().split(' ')[0],
        };
      } else {
        throw Exception('Failed to load user info: ${response.body}');
      }
    } catch (e) {
      print('Error in getUserInfo: $e'); // Debug print
      rethrow;
    }
  }

  Future<List<dynamic>> submitPassengers(Map<String, dynamic> payload) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    if (token == null) {
      throw Exception('Authentication token not found');
    }

    final response = await http.post(
      Uri.parse('$baseUrl/booking-passengers/submit'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(payload),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Failed to submit passengers');
    }
  }


  Future<Map<String, dynamic>> checkDiscountCode(String code, int tourId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    if (token == null) {
      throw Exception('Authentication token not found');
    }

    final response = await http.post(
      Uri.parse('$baseUrl/discounts/check'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'code': code,
        'tourId': tourId,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized: Please login again');
    } else {
      throw Exception('Failed to check discount code: ${response.body}');
    }
  }

  Future<List<Map<String, dynamic>>> fetchPassengersBySchedule(int scheduleId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) throw Exception('Authentication token not found');

    // 1. Lấy tất cả booking
    final bookingsRes = await http.get(
      Uri.parse('http://10.0.2.2:8080/api/bookings/admin-bookings'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    if (bookingsRes.statusCode != 200) throw Exception('Failed to load bookings');
    final List<dynamic> bookings = json.decode(bookingsRes.body);

    // 2. Lọc booking theo scheduleId và statusName
    final confirmedBookings = bookings.where((b) =>
      b['scheduleId'] == scheduleId && b['statusName'] == 'Confirmed'
    ).toList();

    // 3. Lấy hành khách cho từng booking
    List<Map<String, dynamic>> allPassengers = [];
    for (var booking in confirmedBookings) {
      final passengersRes = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/booking-passengers/booking/${booking['bookingId']}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      if (passengersRes.statusCode == 200) {
        final List<dynamic> passengers = json.decode(passengersRes.body);
        allPassengers.addAll(passengers.cast<Map<String, dynamic>>());
      }
    }
    return allPassengers;
  }
} 