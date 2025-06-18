import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/tour_models.dart';

class TourService {
  static const String baseUrl = 'http://10.0.2.2:8080/api/tours';

  Future<List<Tour>> fetchTours() async {
    final response = await http.get(
      Uri.parse(baseUrl),
    );

    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Tour.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load tours');
    }
  }

  Future<Tour> fetchTourDetail(int tourId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/$tourId'),
    );
    print('Fetch tour detail status: ${response.statusCode}');
    print('Response body: ${response.body}');
    if (response.statusCode == 200) {
      return Tour.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load tour detail');
    }
  }

  Future<List<dynamic>> fetchSchedules(int tourId) async {
    print('Fetching schedules for tourId: $tourId');
    final response = await http.get(
      Uri.parse('http://10.0.2.2:8080/api/schedules/tour/$tourId'),
    );
    print('Fetch schedules status: ${response.statusCode}');
    print('Response body: ${response.body}');
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Decoded schedules data: $data');
      return data;
    } else {
      throw Exception('Failed to load schedules');
    }
  }

  Future<List<dynamic>> fetchItineraries(int scheduleId) async {
    print('Fetching itineraries for scheduleId: $scheduleId');
    final response = await http.get(
      Uri.parse('http://10.0.2.2:8080/api/itineraries/schedule/$scheduleId'),
    );
    print('Fetch itineraries status: ${response.statusCode}');
    print('Response body: ${response.body}');
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('Decoded itineraries data: $data');
      return data;
    } else {
      throw Exception('Failed to load itineraries');
    }
  }

  Future<List<dynamic>> fetchRelatedTours({
    required int count,
    required int excludeTourId,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/random?count=$count&excludeTourId=$excludeTourId'),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load related tours');
      }
    } catch (e) {
      print('Error fetching related tours: $e');
      return [];
    }
  }

  Future<List<String>> fetchTourImages(int tourId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/$tourId/images'),
      );
      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((url) => url.toString()).toList();
      } else {
        print('Failed to load tour images: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching tour images: $e');
      return [];
    }
  }
}