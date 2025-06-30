import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/guide_models.dart';

class GuideService {
  static const String baseUrl = 'http://10.0.2.2:8080/api';
  static const String assignmentUrl = 'http://10.0.2.2:8080/api/tour-guide-assignments';

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<TourGuideSearchResponse> fetchTourGuides({
    int page = 0,
    int size = 10,
    String search = '',
    String sortField = 'id',
    String sortDirection = 'asc',
    bool? isAssigned,
  }) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final queryParams = {
        'page': page.toString(),
        'size': size.toString(),
        'search': search,
        'sort': '$sortField,$sortDirection',
      };

      // Add assigned filter if specified
      if (isAssigned != null) {
        queryParams['isAssigned'] = isAssigned.toString();
      }

      final uri = Uri.parse('$baseUrl/tour-guides/search').replace(queryParameters: queryParams);

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return TourGuideSearchResponse.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to load tour guides: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching tour guides: $e');
    }
  }

  // Tour Guide Assignment methods
  Future<List<TourGuideAssignment>> fetchAllAssignments() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.get(
        Uri.parse(assignmentUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((json) => TourGuideAssignment.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load assignments: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching assignments: $e');
    }
  }

  Future<List<TourGuideAssignment>> fetchAssignmentsByTourId(int tourId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.get(
        Uri.parse('$assignmentUrl/tour/$tourId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((json) => TourGuideAssignment.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load assignments: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching assignments: $e');
    }
  }

  Future<List<TourGuideAssignment>> fetchAssignmentsByGuideId(int guideId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.get(
        Uri.parse('$assignmentUrl/guide/$guideId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((json) => TourGuideAssignment.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load assignments: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching assignments: $e');
    }
  }

  Future<TourGuideAssignment> createAssignment(Map<String, dynamic> assignmentData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.post(
        Uri.parse(assignmentUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode(assignmentData),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return TourGuideAssignment.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to create assignment: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error creating assignment: $e');
    }
  }

  Future<void> deleteAssignment(int assignmentId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.delete(
        Uri.parse('$assignmentUrl/$assignmentId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete assignment: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error deleting assignment: $e');
    }
  }

  Future<TourGuide> createTourGuide(Map<String, dynamic> tourGuideData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.post(
        Uri.parse(baseUrl + '/tour-guides'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode(tourGuideData),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        return TourGuide.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to create tour guide: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error creating tour guide: $e');
    }
  }

  Future<TourGuide> updateTourGuide(int id, Map<String, dynamic> tourGuideData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/tour-guides/$id'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode(tourGuideData),
      );

      if (response.statusCode == 200) {
        return TourGuide.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to update tour guide: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error updating tour guide: $e');
    }
  }

  Future<void> deleteTourGuide(int id) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.delete(
        Uri.parse('$baseUrl/tour-guides/$id'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete tour guide: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error deleting tour guide: $e');
    }
  }

  Future<TourGuide> getTourGuideById(int id) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/tour-guides/$id'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return TourGuide.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to load tour guide: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching tour guide: $e');
    }
  }

  Future<List<dynamic>> fetchAssignmentItineraries(int assignmentId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/assignments/$assignmentId/itineraries'),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load assignment itineraries');
    }
  }

  // Thêm các phương thức liên quan đến lịch trình
  Future<List<dynamic>> fetchSchedules(int tourId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      print('Fetching schedules for tourId: $tourId');
      final response = await http.get(
        Uri.parse('$baseUrl/schedules/tour/$tourId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('Fetch schedules status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('Decoded schedules data: $data');
        // In ra cấu trúc của một schedule để kiểm tra
        if (data.isNotEmpty) {
          print('First schedule structure: ${data[0].keys.toList()}');
        }
        return data;
      } else {
        throw Exception('Failed to load schedules: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching schedules: $e');
      throw Exception('Error fetching schedules: $e');
    }
  }

  Future<List<dynamic>> fetchItineraries(int scheduleId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      print('Fetching itineraries for scheduleId: $scheduleId');
      final response = await http.get(
        Uri.parse('$baseUrl/itineraries/schedule/$scheduleId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('Fetch itineraries status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('Decoded itineraries data: $data');
        // In ra cấu trúc của một itinerary để kiểm tra
        if (data.isNotEmpty) {
          print('First itinerary structure: ${data[0].keys.toList()}');
        }
        return data;
      } else {
        throw Exception('Failed to load itineraries: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching itineraries: $e');
      throw Exception('Error fetching itineraries: $e');
    }
  }

  Future<List<String>> fetchTourImages(int tourId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/tours/$tourId/images'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
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

  // New method: Fetch current guide's assignments
  Future<List<TourGuideAssignment>> fetchCurrentGuideAssignments() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.get(
        Uri.parse('$assignmentUrl/my-assignments'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((json) => TourGuideAssignment.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load current guide assignments: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching current guide assignments: $e');
    }
  }

  // New method: Update assignment status (only for main_guide)
  Future<TourGuideAssignment> updateAssignmentStatus(int assignmentId, String newStatus) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.put(
        Uri.parse('$assignmentUrl/$assignmentId/status'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({'status': newStatus}),
      );

      if (response.statusCode == 200) {
        return TourGuideAssignment.fromJson(json.decode(response.body));
      } else {
        final errorData = json.decode(response.body);
        final errorMessage = errorData['error'] ?? 'Failed to update assignment status';
        throw Exception(errorMessage);
      }
    } catch (e) {
      throw Exception('Error updating assignment status: $e');
    }
  }

  // New method: Auto update assignment status based on time
  Future<TourGuideAssignment> autoUpdateAssignmentStatus(int assignmentId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.put(
        Uri.parse('$assignmentUrl/$assignmentId/auto-status'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return TourGuideAssignment.fromJson(json.decode(response.body));
      } else {
        final errorData = json.decode(response.body);
        final errorMessage = errorData['error'] ?? 'Failed to auto update assignment status';
        throw Exception(errorMessage);
      }
    } catch (e) {
      throw Exception('Error auto updating assignment status: $e');
    }
  }

  // New method: Auto update all assignments
  Future<Map<String, dynamic>> autoUpdateAllAssignments() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('Token not found. Please login again.');
      }

      final response = await http.put(
        Uri.parse('$assignmentUrl/auto-update-all'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        final errorData = json.decode(response.body);
        final errorMessage = errorData['error'] ?? 'Failed to auto update all assignments';
        throw Exception(errorMessage);
      }
    } catch (e) {
      throw Exception('Error auto updating all assignments: $e');
    }
  }

  // Gửi yêu cầu thay đổi lịch trình
  Future<void> sendScheduleChangeRequest({
    required int scheduleId,
    required int guideId,
    required String requestType,
    int? currentItineraryId,
    required String proposedChanges,
    required String reason,
    required String urgencyLevel,
    required String effectiveDate,
  }) async {
    final token = await _getToken();
    if (token == null) throw Exception('Token not found. Please login again.');
    final body = {
      'scheduleId': scheduleId,
      'guideId': guideId,
      'requestType': requestType,
      'currentItineraryId': currentItineraryId,
      'proposedChanges': proposedChanges,
      'reason': reason,
      'urgencyLevel': urgencyLevel,
      'effectiveDate': effectiveDate,
    };
    final response = await http.post(
      Uri.parse('$baseUrl/schedule-change-requests'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: json.encode(body),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Gửi yêu cầu thất bại: ${response.body}');
    }
  }
}
