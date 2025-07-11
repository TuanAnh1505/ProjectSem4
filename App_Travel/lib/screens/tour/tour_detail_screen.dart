import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../services/tour_service.dart';
import '../../services/booking_service.dart';
import '../../models/tour_models.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../booking/booking_passenger_screen.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class TourDetailScreen extends StatefulWidget {
  final int tourId;
  const TourDetailScreen({Key? key, required this.tourId}) : super(key: key);

  @override
  State<TourDetailScreen> createState() => _TourDetailScreenState();
}

class _TourDetailScreenState extends State<TourDetailScreen> {
  final TourService _tourService = TourService();
  final BookingService _bookingService = BookingService();
  Tour? tour;
  List<dynamic> schedules = [];
  List<dynamic> relatedTours = [];
  Map<int, List<dynamic>> itineraries = {};
  List<dynamic> experiences = [];
  List<dynamic> feedbacks = [];
  bool feedbackLoading = true;
  int currentFeedbackPage = 1;
  int currentExperiencePage = 1;
  int itemsPerPage = 4;
  int? selectedScheduleId;
  bool loading = true;
  bool bookingLoading = false;
  bool experienceLoading = false;
  String error = '';
  int? userId;
  final TextEditingController _experienceController = TextEditingController();
  final TextEditingController _titleController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  List<XFile> _mediaFiles = [];
  bool _isPicking = false; // Prevent double pick
  double? averageRating;
  int? feedbackCount;
  bool ratingLoading = true;
  bool showFullDescription = false;
  bool showExperienceForm = false;
  int? openedItineraryId;
  List<String>? galleryImages;
  int galleryIndex = 0;

  String formatPrice(num? price) {
    if (price == null) return '';
    final formatter = NumberFormat('#,###', 'vi_VN');
    return formatter.format(price);
  }

  @override
  void initState() {
    super.initState();
    fetchAll();
    _loadUserId();
    fetchExperiences();
    fetchTourRating(widget.tourId);
    fetchFeedbacks();
  }

  @override
  void dispose() {
    _experienceController.dispose();
    _titleController.dispose();
    super.dispose();
  }

  Future<void> _loadUserId() async {
    final prefs = await SharedPreferences.getInstance();
    // Print all keys to debug
    print('All SharedPreferences keys: ${prefs.getKeys()}');
    
    // Try different possible keys
    final userIdFromPrefs = prefs.getInt('user_id') ?? 
                          prefs.getInt('userId') ?? 
                          prefs.getInt('id');
    
    print('Found userId: $userIdFromPrefs');
    
    setState(() {
      userId = userIdFromPrefs;
    });
  }

  Future<void> fetchAll() async {
    setState(() { loading = true; error = ''; });
    try {
      tour = await _tourService.fetchTourDetail(widget.tourId);
      schedules = await _tourService.fetchSchedules(widget.tourId);
      // Fetch related tours
      relatedTours = await _tourService.fetchRelatedTours(
        count: 3,
        excludeTourId: widget.tourId,
      );
      // Fetch itineraries for each schedule
      for (var schedule in schedules) {
        await fetchItineraries(schedule['scheduleId']);
      }
    } catch (e) {
      error = e.toString();
    } finally {
      setState(() { loading = false; });
    }
  }

  Future<void> fetchItineraries(int scheduleId) async {
    try {
      final itinerariesList = await _tourService.fetchItineraries(scheduleId);
      setState(() {
        itineraries[scheduleId] = itinerariesList;
      });
    } catch (e) {
      // ignore error for individual itinerary
    }
  }

  Future<void> fetchExperiences() async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/experiences/tour/${widget.tourId}'),
      );
      print('Response body: \\n' + response.body);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        // Try to get array from data or fallback
        if (data is List) {
          setState(() { experiences = data; });
        } else if (data is Map && data['experiences'] is List) {
          setState(() { experiences = data['experiences']; });
        } else {
          setState(() { experiences = []; });
        }
      }
    } catch (e) {
      print('Error fetching experiences: $e');
    }
  }

  Future<void> fetchTourRating(int tourId) async {
    setState(() {
      ratingLoading = true;
    });
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/tours/$tourId/feedback-stats'),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          averageRating = (data['averageRating'] as num?)?.toDouble();
          feedbackCount = data['feedbackCount'] as int?;
          ratingLoading = false;
        });
      } else {
        setState(() {
          ratingLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        ratingLoading = false;
      });
    }
  }

  Future<void> fetchFeedbacks() async {
    setState(() {
      feedbackLoading = true;
    });
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/feedbacks?tourId=${widget.tourId}'),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          feedbacks = data is List ? data : [];
          feedbackLoading = false;
        });
      } else {
        setState(() {
          feedbacks = [];
          feedbackLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        feedbacks = [];
        feedbackLoading = false;
      });
    }
  }

  void onSelectSchedule(int scheduleId) async {
    final selected = schedules.firstWhere(
      (sch) => sch['scheduleId'] == scheduleId,
      orElse: () => {'status': 'unknown'},
    );
    if (selected['status'] == 'full') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lịch trình này đã hết chỗ!')),
      );
      return;
    }
    setState(() { selectedScheduleId = scheduleId; });
    await fetchItineraries(scheduleId);
  }

  Future<void> handleBooking() async {
    if (userId == null) {
      // Show dialog to ask user to login
      if (!mounted) return;
      final shouldLogin = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Đăng nhập cần thiết'),
          content: Text('Hãy đăng nhập để có thể đặt tour. Bạn có muốn đăng nhập ngay bây giờ không?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text('Hủy'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text('Đăng nhập'),
            ),
          ],
        ),
      );

      if (shouldLogin == true) {
        if (!mounted) return;
        Navigator.pushNamed(context, '/login');
      }
      return;
    }

    if (selectedScheduleId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chọn lịch trình muốn đặt!')),
      );
      return;
    }
    setState(() {
      bookingLoading = true;
      error = '';
    });
    try {
      final booking = await _bookingService.createBooking(
        userId: userId!,
        tourId: widget.tourId,
        scheduleId: selectedScheduleId!,
      );
      if (!mounted) return;
      // Find selected schedule
      final selectedSchedule = schedules.firstWhere(
        (schedule) => schedule['scheduleId'] == selectedScheduleId,
        orElse: () => {'startDate': 'Unknown date'},
      );
      // Get itineraries for selected schedule
      final selectedItineraries = itineraries[selectedScheduleId] ?? [];
      // Navigate to BookingPassengerScreen
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => BookingPassengerScreen(
            bookingId: booking['bookingId'],
            bookingCode: booking['bookingCode'] ?? '',
            tour: tour!,
            selectedDate: selectedSchedule['startDate'] ?? '',
            itineraries: selectedItineraries,
            finalPrice: booking['finalPrice'] ?? tour!.price,
          ),
        ),
      );
      // Refresh data after booking
      await fetchAll();
    } catch (e) {
      if (mounted) {
        if (e.toString().contains('Hãy đăng nhập để có thể đặt tour')) {
          // Show dialog to ask user to login
          final shouldLogin = await showDialog<bool>(
            context: context,
            builder: (context) => AlertDialog(
              title: Text('Đăng nhập cần thiết'),
              content: Text('Hãy đăng nhập để có thể đặt tour. Bạn có muốn đăng nhập ngay bây giờ không?'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context, false),
                  child: Text('Hủy'),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(context, true),
                  child: Text('Đăng nhập'),
                ),
              ],
            ),
          );

          if (shouldLogin == true) {
            Navigator.pushReplacementNamed(context, '/login');
          }
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Có lỗi xảy ra khi đặt tour: ${e.toString()}')),
          );
        }
      }
    } finally {
      if (mounted) {
        setState(() {
          bookingLoading = false;
        });
      }
    }
  }

  Future<void> handleExperienceSubmit() async {
    if (userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng đăng nhập để chia sẻ trải nghiệm')),
      );
      return;
    }
    if (_titleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập tiêu đề trải nghiệm')),
      );
      return;
    }
    if (_experienceController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập nội dung trải nghiệm')),
      );
      return;
    }
    setState(() {
      experienceLoading = true;
    });
    try {
      // 1. Gửi trải nghiệm (nội dung + tiêu đề)
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      print('userId: $userId, tourId: ${widget.tourId}, content: ${_experienceController.text}, title: ${_titleController.text}');
      final body = {
        'userid': userId,
        'tourId': widget.tourId,
        'content': _experienceController.text.trim(),
        'title': _titleController.text.trim(),
      };
      print('Body: ${json.encode(body)}');
      final response = await http.post(
        Uri.parse('http://10.0.2.2:8080/api/experiences'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode(body),
      );

      print('Submit experience status: \\n${response.statusCode}');
      print('Submit experience body: \\n${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final expData = json.decode(response.body);
        final experienceId = expData['experienceId'];
        // 2. Nếu có file, upload từng file
        print('=== Starting media upload process ===');
        print('Number of files to upload: ${_mediaFiles.length}');
        print('Experience ID: $experienceId');
        print('User ID: $userId');
        print('Token: $token');
        
        if (_mediaFiles.isEmpty) {
          print('No files to upload!');
          return;
        }
        
        for (final file in _mediaFiles) {
          print('\n--- Uploading file ---');
          print('File path: \\${file.path}');
          print('File type: \\${file.mimeType}');
          print('File size: \\${await file.length()} bytes');
          print('Experience ID: \\${experienceId}');
          
          // Kiểm tra file có tồn tại không
          final fileExists = await File(file.path).exists();
          print('File exists: \\${fileExists}');
          
          if (!fileExists) {
            print('File does not exist, skipping...');
            continue;
          }
          
          final request = http.MultipartRequest('POST', Uri.parse('http://10.0.2.2:8080/api/media'));
          
          // Thêm token vào header
          request.headers.addAll({
            'Content-Type': 'multipart/form-data',
            if (token != null) 'Authorization': 'Bearer $token',
          });
          
          // Add fields
          request.fields['userid'] = userId.toString();
          request.fields['experienceId'] = experienceId.toString();
          request.fields['fileType'] =
            (file.mimeType?.startsWith('image') == true ||
             file.path.toLowerCase().endsWith('.jpg') ||
             file.path.toLowerCase().endsWith('.jpeg') ||
             file.path.toLowerCase().endsWith('.png'))
              ? 'image'
              : 'video';
          
          print('Request fields: \\${request.fields}');
          print('Request headers: \\${request.headers}');
          
          // Add file
          try {
            request.files.add(await http.MultipartFile.fromPath('file', file.path));
            print('File added to request successfully');
          } catch (e) {
            print('Error adding file to request: $e');
            continue;
          }
          
          print('Sending request...');
          try {
            final streamedResponse = await request.send();
            final response = await streamedResponse.stream.bytesToString();
            
            print('Upload status: \\${streamedResponse.statusCode}');
            print('Upload response: $response');
            
            if (streamedResponse.statusCode != 201) {
              print('Upload failed with status: \\${streamedResponse.statusCode}');
              print('Error response: $response');
            } else {
              print('Upload successful!');
            }
          } catch (e) {
            print('Error during upload: $e');
            print('Error details: \\${e.toString()}');
          }
        }
        _experienceController.clear();
        _titleController.clear();
        setState(() { _mediaFiles = []; });
        await fetchExperiences();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Chia sẻ trải nghiệm thành công')),
        );
      } else {
        throw Exception('Failed to submit experience: ${response.body}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Có lỗi xảy ra: ${e.toString()}')),
      );
    } finally {
      setState(() {
        experienceLoading = false;
      });
    }
  }

  Future<void> pickMedia() async {
    if (_isPicking) return;
    _isPicking = true;
    try {
      final picked = await _picker.pickMultiImage();
      if (picked != null && picked.isNotEmpty) {
        setState(() {
          _mediaFiles = [..._mediaFiles, ...picked].take(10).toList();
        });
      }
    } catch (e) {
      print('Error picking images: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể chọn ảnh: $e')),
      );
    } finally {
      _isPicking = false;
    }
  }

  Future<void> pickVideo() async {
    if (_isPicking) return;
    _isPicking = true;
    try {
      final video = await _picker.pickVideo(source: ImageSource.gallery);
      if (video != null) {
        setState(() {
          if (_mediaFiles.length < 10) _mediaFiles.add(video);
        });
      }
    } catch (e) {
      print('Error picking video: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể chọn video: $e')),
      );
    } finally {
      _isPicking = false;
    }
  }

  // Add pagination methods
  List<dynamic> getPaginatedFeedbacks() {
    final approvedFeedbacks = feedbacks
        .where((fb) => (fb['statusName'] ?? '').toLowerCase() == 'approved')
        .toList();
    final startIndex = (currentFeedbackPage - 1) * itemsPerPage;
    final endIndex = startIndex + itemsPerPage;
    return approvedFeedbacks.length > startIndex
        ? approvedFeedbacks.sublist(startIndex, endIndex > approvedFeedbacks.length ? approvedFeedbacks.length : endIndex)
        : [];
  }

  List<dynamic> getPaginatedExperiences() {
    final approvedExperiences = experiences
        .where((exp) => (exp['status'] ?? '').toLowerCase() == 'approved')
        .toList();
    final startIndex = (currentExperiencePage - 1) * itemsPerPage;
    final endIndex = startIndex + itemsPerPage;
    return approvedExperiences.length > startIndex
        ? approvedExperiences.sublist(startIndex, endIndex > approvedExperiences.length ? approvedExperiences.length : endIndex)
        : [];
  }

  int getTotalFeedbackPages() {
    final approvedFeedbacks = feedbacks
        .where((fb) => (fb['statusName'] ?? '').toLowerCase() == 'approved')
        .length;
    return (approvedFeedbacks / itemsPerPage).ceil();
  }

  int getTotalExperiencePages() {
    final approvedExperiences = experiences
        .where((exp) => (exp['status'] ?? '').toLowerCase() == 'approved')
        .length;
    return (approvedExperiences / itemsPerPage).ceil();
  }

  void openGallery(List<String> images, int index) {
    setState(() {
      galleryImages = images;
      galleryIndex = index;
    });
    showDialog(
      context: context,
      builder: (_) => Dialog(
        backgroundColor: Colors.transparent,
        child: SizedBox(
          width: double.infinity,
          height: 350,
          child: Stack(
            children: [
              PageView.builder(
                controller: PageController(initialPage: index),
                itemCount: images.length,
                onPageChanged: (i) => setState(() => galleryIndex = i),
                itemBuilder: (_, i) => ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    images[i].startsWith('http') ? images[i] : 'http://10.0.2.2:8080${images[i]}',
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              Positioned(
                top: 8, right: 8,
                child: IconButton(
                  icon: Icon(Icons.close, color: Colors.white, size: 32),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<TextSpan> _buildDescriptionSpans(String text) {
    final RegExp timeRegex = RegExp(r'(\(\d{2}:\d{2}\s*[–-]\s*\d{2}:\d{2}\)|\d{2}:\d{2}\s*[–-]\s*\d{2}:\d{2})');
    final RegExp allCapsRegex = RegExp(r'[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ\s]+');
    final List<TextSpan> spans = [];
    int lastIndex = 0;

    // First handle time matches
    for (Match match in timeRegex.allMatches(text)) {
      // Add text before the match
      if (match.start > lastIndex) {
        String beforeText = text.substring(lastIndex, match.start);
        _addTextWithCapsFormatting(beforeText, spans);
      }
      // Add the matched time in bold
      spans.add(TextSpan(
        text: match.group(0),
        style: TextStyle(fontWeight: FontWeight.bold),
      ));
      lastIndex = match.end;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      String remainingText = text.substring(lastIndex);
      _addTextWithCapsFormatting(remainingText, spans);
    }

    return spans;
  }

  void _addTextWithCapsFormatting(String text, List<TextSpan> spans) {
    int lastIndex = 0;
    // Tìm các đoạn liên tiếp không xuống dòng
    final RegExp lineRegex = RegExp(r'[^\n]+|\n');
    for (final Match lineMatch in lineRegex.allMatches(text)) {
      final String line = lineMatch.group(0) ?? '';
      // Kiểm tra nếu là dòng xuống dòng thì giữ nguyên
      if (line == '\n') {
        spans.add(const TextSpan(text: '\n'));
        continue;
      }
      // Nếu dòng không chứa ký tự thường và có ít nhất 2 ký tự in hoa thì in đậm
      final int upperCount = RegExp(r'[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]').allMatches(line).length;
      final bool hasLower = RegExp(r'[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]').hasMatch(line);
      if (!hasLower && upperCount >= 2) {
        spans.add(TextSpan(text: line, style: const TextStyle(fontWeight: FontWeight.bold)));
      } else {
        spans.add(TextSpan(text: line));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const Center(child: CircularProgressIndicator());
    if (error.isNotEmpty) return Center(child: Text(error));
    if (tour == null) return const Center(child: Text('Không tìm thấy tour'));

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Custom AppBar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                child: Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.arrow_back, color: Colors.orange),
                      onPressed: () => Navigator.pop(context),
                    ),
                    Expanded(
                      child: Text(
                        tour?.name ?? '',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.share_outlined, color: Colors.grey[700]),
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: Icon(Icons.favorite_border, color: Colors.pink),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),
              // Ảnh tour
              if (tour?.imageUrls.isNotEmpty == true)
                Stack(
                  children: [
                    Container(
                      height: 220,
                      child: PageView.builder(
                        itemCount: tour!.imageUrls.length,
                        onPageChanged: (index) {
                          setState(() {
                            galleryIndex = index;
                          });
                        },
                        itemBuilder: (context, index) {
                          return GestureDetector(
                            onTap: () {
                              openGallery(tour!.imageUrls, index);
                            },
                            child: Image.network(
                              'http://10.0.2.2:8080${tour!.imageUrls[index]}',
                              width: double.infinity,
                              height: 220,
                              fit: BoxFit.cover,
                            ),
                          );
                        },
                      ),
                    ),
                    // Indicator dots
                    if (tour!.imageUrls.length > 1)
                      Positioned(
                        bottom: 16,
                        left: 0,
                        right: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(
                            tour!.imageUrls.length,
                            (index) => Container(
                              width: 8,
                              height: 8,
                              margin: EdgeInsets.symmetric(horizontal: 4),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: galleryIndex == index 
                                    ? Colors.white 
                                    : Colors.white.withOpacity(0.5),
                              ),
                            ),
                          ),
                        ),
                      ),
                    // Counter
                    Positioned(
                      top: 16,
                      right: 16,
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.6),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          '${galleryIndex + 1}/${tour!.imageUrls.length}',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Badge
                    Row(
                      children: [
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.blue[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('Popular', style: TextStyle(color: Colors.blue[900], fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                        SizedBox(width: 6),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.green[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('Instant Booking', style: TextStyle(color: Colors.green[900], fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    // Tên tour
                    Text(tour?.name ?? '', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blue[900])),
                    SizedBox(height: 6),
                    // Đánh giá
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 20),
                        SizedBox(width: 4),
                        ratingLoading
                          ? SizedBox(width: 24, height: 16, child: LinearProgressIndicator())
                          : Text(
                              averageRating != null ? averageRating!.toStringAsFixed(1) : '0.0',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                        SizedBox(width: 4),
                        ratingLoading
                          ? SizedBox.shrink()
                          : Text(
                              '(${feedbackCount ?? 0} đánh giá)',
                              style: TextStyle(color: Colors.grey[700], fontSize: 13),
                            ),
                      ],
                    ),
                    SizedBox(height: 8),
                    // Mô tả
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          tour?.description ?? '',
                          maxLines: showFullDescription ? null : 6,
                          overflow: showFullDescription ? TextOverflow.visible : TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 15, color: Colors.grey[800]),
                        ),
                        if ((tour?.description?.length ?? 0) > 120)
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
                                fontSize: 15,
                              ),
                            ),
                          ),
                      ],
                    ),
                    SizedBox(height: 12),
                    // Giá
                    Row(
                      children: [
                        // Text('5.990.000 đ', style: TextStyle(decoration: TextDecoration.lineThrough, color: Colors.grey, fontSize: 15)),
                        SizedBox(width: 8),
                        Text('${formatPrice(tour?.price)} đ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22, color: Colors.orange[800])),
                      ],
                    ),
                    // SizedBox(height: 2),
                    // Text('Tiết kiệm 1.200.000 đ', style: TextStyle(color: Colors.green, fontSize: 13)),
                    SizedBox(height: 10),
                    Row(
                      children: [
                        Icon(Icons.calendar_today, size: 18, color: Colors.blue[700]),
                        SizedBox(width: 4),
                        Text(
                          (tour?.duration ?? 1) > 1
                              ? '${tour?.duration ?? 1} ngày ${(tour?.duration ?? 1) - 1} đêm'
                              : '${tour?.duration ?? 1} ngày',
                          style: TextStyle(fontSize: 13, color: Colors.black87),
                        ),
                        SizedBox(width: 18),
                        Icon(Icons.group, size: 18, color: Colors.blue[700]),
                        SizedBox(width: 4),
                        Text('Tối đa ${tour?.maxParticipants ?? 0} người', style: TextStyle(fontSize: 14)),
                      ],
                    ),
                  ],
                ),
              ),
              // Lịch trình có sẵn
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(top: 8),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.event_note, color: Colors.blue[700], size: 20),
                        SizedBox(width: 6),
                        Text('Lịch trình có sẵn', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue[900])),
                      ],
                    ),
                    SizedBox(height: 10),
                    if (schedules.isEmpty)
                      const Text('Chưa có lịch trình cho tour này')
                    else
                      Column(
                        children: schedules.map((sch) {
                          String status = sch['status'] ?? 'unknown';
                          int currentParticipants = sch['currentParticipants'] ?? 0;
                          int maxParticipants = tour?.maxParticipants ?? 0;
                          int slotsLeft = maxParticipants - currentParticipants;
                          String badgeText = '';
                          Color badgeColor = Colors.blue;
                          if (status == 'full' || slotsLeft <= 0) {
                            badgeText = 'Đã đủ người';
                            badgeColor = Colors.red;
                          } else if (status == 'closed') {
                            badgeText = 'Đã đóng';
                            badgeColor = Colors.grey;
                          } else {
                            badgeText = 'Còn $slotsLeft chỗ';
                            badgeColor = Colors.blue;
                          }
                          bool isSelected = selectedScheduleId == sch['scheduleId'];
                          return GestureDetector(
                            onTap: (status == 'full' || status == 'closed') ? null : () => onSelectSchedule(sch['scheduleId']),
                            child: Card(
                              color: isSelected ? Colors.blue[50] : (status == 'full' ? Colors.red[50] : status == 'closed' ? Colors.grey[200] : Colors.grey[100]),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              margin: EdgeInsets.only(bottom: 10),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      sch['startDate'] != null && sch['endDate'] != null
                                          ? '${DateFormat('dd/MM/yyyy').format(DateTime.parse(sch['startDate']))} - ${DateFormat('dd/MM/yyyy').format(DateTime.parse(sch['endDate']))}'
                                          : 'Schedule: ${sch['startDate']} - ${sch['endDate']}',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 15,
                                        color: status == 'full'
                                            ? Colors.red[900]
                                            : status == 'closed'
                                                ? Colors.grey[700]
                                                : Colors.black,
                                      ),
                                    ),
                                    Container(
                                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: badgeColor,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        badgeText,
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                  ],
                ),
              ),
              // Chi tiết hành trình
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(top: 12),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.map, color: Colors.blue[700], size: 20),
                        SizedBox(width: 6),
                        Text('Chi tiết hành trình', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue[900])),
                      ],
                    ),
                    SizedBox(height: 10),
                    if (selectedScheduleId == null)
                      Container(
                        width: double.infinity,
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue[50],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text('Vui lòng chọn lịch trình phía trên để xem chi tiết hành trình.', style: TextStyle(color: Colors.blue[900])),
                      )
                    else if (itineraries[selectedScheduleId!] != null)
                      ...itineraries[selectedScheduleId!]!.map<Widget>((it) => Card(
                        child: Column(
                          children: [
                            ListTile(
                              title: GestureDetector(
                                onTap: () {
                                  setState(() {
                                    if (openedItineraryId == it['itineraryId']) {
                                      openedItineraryId = null;
                                    } else {
                                      openedItineraryId = it['itineraryId'];
                                    }
                                  });
                                },
                                child: Text(
                                  'Ngày ${itineraries[selectedScheduleId!]!.indexOf(it) + 1}: ${it['title'] ?? ''}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.blue[800],
                                  ),
                                ),
                              ),
                            ),
                            if (openedItineraryId == it['itineraryId'])
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (it['startTime'] != null) Text('Bắt đầu:  ${it['startTime']}'),
                                    if (it['endTime'] != null) Text('Kết thúc:  ${it['endTime']}'),
                                    if (it['description'] != null) RichText(
                                      text: TextSpan(
                                        style: TextStyle(color: Colors.black),
                                        children: _buildDescriptionSpans(it['description']),
                                      ),
                                    ),
                                    // if (it['type'] != null) Text('Loại:  ${it['type']}'),
                                  ],
                                ),
                              ),
                          ],
                        ),
                      )).toList(),
                  ],
                ),
              ),
              // Mã giảm giá và nút đặt ngay
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(top: 12, bottom: 12),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.orange,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: bookingLoading ? null : handleBooking,
                        child: bookingLoading ? const CircularProgressIndicator() : const Text('Đặt ngay', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                    ),
                    SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.verified, color: Colors.grey, size: 18),
                        SizedBox(width: 6),
                        Text('Đảm bảo hoàn tiền trong 24h', style: TextStyle(color: Colors.grey[700], fontSize: 13)),
                      ],
                    ),
                  ],
                ),
              ),
              // Add Experience Sharing Section before the related tours section
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(top: 12),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.rate_review, color: Colors.blue[700], size: 20),
                        SizedBox(width: 6),
                        Text('Chia sẻ trải nghiệm', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue[900])),
                        SizedBox(width: 12),
                        Checkbox(
                          value: showExperienceForm,
                          onChanged: (val) {
                            setState(() {
                              showExperienceForm = val ?? false;
                            });
                          },
                        ),
                        Text('Tích để chia sẻ', style: TextStyle(color: Colors.blue[700], fontSize: 14)),
                      ],
                    ),
                    if (showExperienceForm) ...[
                      SizedBox(height: 16),
                      // Experience Title Input
                      TextField(
                        controller: _titleController,
                        decoration: InputDecoration(
                          hintText: 'Tiêu đề trải nghiệm',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          filled: true,
                          fillColor: Colors.grey[50],
                        ),
                      ),
                      SizedBox(height: 8),
                      // Experience Input Form
                      TextField(
                        controller: _experienceController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          hintText: 'Cảm nhận, kinh nghiệm, kỷ niệm đáng nhớ...',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          filled: true,
                          fillColor: Colors.grey[50],
                        ),
                      ),
                      SizedBox(height: 12),
                      // Media Picker
                      Row(
                        children: [
                          ElevatedButton.icon(
                            onPressed: (_mediaFiles.length < 10 && !_isPicking) ? pickMedia : null,
                            icon: Icon(Icons.photo),
                            label: Text('Chọn ảnh (tối đa 10)'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue[50],
                              foregroundColor: Colors.blue[900],
                            ),
                          ),
                          SizedBox(width: 8),
                          ElevatedButton.icon(
                            onPressed: (_mediaFiles.length < 10 && !_isPicking) ? pickVideo : null,
                            icon: Icon(Icons.videocam),
                            label: Text('Chọn video'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue[50],
                              foregroundColor: Colors.blue[900],
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      // Preview selected media
                      if (_mediaFiles.isNotEmpty)
                        SizedBox(
                          height: 90,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: _mediaFiles.length,
                            separatorBuilder: (_, __) => SizedBox(width: 8),
                            itemBuilder: (context, idx) {
                              final file = _mediaFiles[idx];
                              final isImage = (file.mimeType?.startsWith('image') == true) ||
                                              file.path.toLowerCase().endsWith('.jpg') ||
                                              file.path.toLowerCase().endsWith('.jpeg') ||
                                              file.path.toLowerCase().endsWith('.png');
                              return Stack(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: isImage
                                      ? Image.file(File(file.path), width: 80, height: 80, fit: BoxFit.cover)
                                      : Container(
                                          width: 80,
                                          height: 80,
                                          color: Colors.black12,
                                          child: Icon(Icons.videocam, size: 40, color: Colors.blue[700]),
                                        ),
                                  ),
                                  Positioned(
                                    top: 0,
                                    right: 0,
                                    child: GestureDetector(
                                      onTap: () {
                                        setState(() {
                                          _mediaFiles.removeAt(idx);
                                        });
                                      },
                                      child: Container(
                                        decoration: BoxDecoration(
                                          color: Colors.red,
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        padding: EdgeInsets.all(2),
                                        child: Icon(Icons.close, color: Colors.white, size: 18),
                                      ),
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                        ),
                      SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          onPressed: experienceLoading ? null : handleExperienceSubmit,
                          child: experienceLoading 
                            ? const CircularProgressIndicator(color: Colors.white)
                            : const Text('Gửi trải nghiệm', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                      SizedBox(height: 20),
                    ],
                    // Experiences List
                    if (experiences.isEmpty)
                      Center(
                        child: Text(
                          'Chưa có trải nghiệm nào được chia sẻ',
                          style: TextStyle(color: Colors.grey[600]),
                        ),
                      )
                    else
                      Column(
                        children: [
                          ...getPaginatedExperiences().map((exp) => Card(
                                margin: EdgeInsets.only(bottom: 12),
                                child: Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          CircleAvatar(
                                            backgroundColor: Colors.blue[100],
                                            child: Text(
                                              (exp['userFullName'] ?? exp['userName'] ?? 'A').substring(0, 1).toUpperCase(),
                                              style: TextStyle(color: Colors.blue[900]),
                                            ),
                                          ),
                                          SizedBox(width: 8),
                                          Text(
                                            exp['userFullName'] ?? exp['userName'] ?? 'Ẩn danh',
                                            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue[800]),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 8),
                                      if (exp['title'] != null && exp['title'].toString().isNotEmpty)
                                        Text(exp['title'], style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue[900])),
                                      SizedBox(height: 4),
                                      Text(exp['content'] ?? ''),
                                      if (exp['media'] != null && exp['media'] is List && exp['media'].isNotEmpty)
                                        Padding(
                                          padding: const EdgeInsets.only(top: 8.0),
                                          child: Wrap(
                                            spacing: 8,
                                            runSpacing: 8,
                                            children: () {
                                              final mediaList = exp['media'] as List;
                                              final images = mediaList.where((m) => m['fileType'] == 'image').toList();
                                              final maxShow = 4;
                                              final showList = mediaList.take(maxShow).toList();
                                              final extraCount = mediaList.length - maxShow;
                                              return List<Widget>.generate(showList.length, (idx) {
                                                final m = showList[idx];
                                                final url = m['fileUrl']?.toString() ?? '';
                                                final isImage = m['fileType'] == 'image';
                                                if (idx == maxShow - 1 && extraCount > 0) {
                                                  // Ảnh/video thứ 4 và còn dư
                                                  return GestureDetector(
                                                    onTap: isImage && images.isNotEmpty
                                                        ? () {
                                                            openGallery(
                                                              images.map((img) => img['fileUrl']?.toString() ?? '').toList(),
                                                              images.indexWhere((img) => img['fileUrl'] == m['fileUrl']),
                                                            );
                                                          }
                                                        : null,
                                                    child: Stack(
                                                      children: [
                                                        isImage
                                                          ? Image.network(
                                                              url.startsWith('http') ? url : 'http://10.0.2.2:8080$url',
                                                              width: 80,
                                                              height: 80,
                                                              fit: BoxFit.cover,
                                                            )
                                                          : Container(
                                                              width: 80,
                                                              height: 80,
                                                              color: Colors.black12,
                                                              child: Icon(Icons.videocam, color: Colors.blue, size: 40),
                                                            ),
                                                        Container(
                                                          width: 80,
                                                          height: 80,
                                                          color: Colors.black.withOpacity(0.5),
                                                          alignment: Alignment.center,
                                                          child: Text(
                                                            '+$extraCount',
                                                            style: TextStyle(
                                                              color: Colors.white,
                                                              fontWeight: FontWeight.bold,
                                                              fontSize: 28,
                                                              shadows: [
                                                                Shadow(
                                                                  blurRadius: 4,
                                                                  color: Colors.black,
                                                                  offset: Offset(1, 1),
                                                                ),
                                                              ],
                                                            ),
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                  );
                                                } else {
                                                  // Ảnh/video bình thường
                                                  return isImage
                                                      ? GestureDetector(
                                                          onTap: images.isNotEmpty
                                                              ? () {
                                                                  openGallery(
                                                                    images.map((img) => img['fileUrl']?.toString() ?? '').toList(),
                                                                    images.indexWhere((img) => img['fileUrl'] == m['fileUrl']),
                                                                  );
                                                                }
                                                              : null,
                                                          child: Image.network(
                                                            url.startsWith('http') ? url : 'http://10.0.2.2:8080$url',
                                                            width: 80,
                                                            height: 80,
                                                            fit: BoxFit.cover,
                                                          ),
                                                        )
                                                      : Container(
                                                          width: 80,
                                                          height: 80,
                                                          color: Colors.black12,
                                                          child: Icon(Icons.videocam, color: Colors.blue, size: 40),
                                                        );
                                                }
                                              });
                                            }(),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              )).toList(),
                          // Pagination
                          if (getTotalExperiencePages() > 1)
                            Padding(
                              padding: const EdgeInsets.only(top: 16),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  IconButton(
                                    icon: Icon(Icons.chevron_left),
                                    onPressed: currentExperiencePage > 1
                                        ? () => setState(() => currentExperiencePage--)
                                        : null,
                                  ),
                                  Text(
                                    'Trang $currentExperiencePage/${getTotalExperiencePages()}',
                                    style: TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  IconButton(
                                    icon: Icon(Icons.chevron_right),
                                    onPressed: currentExperiencePage < getTotalExperiencePages()
                                        ? () => setState(() => currentExperiencePage++)
                                        : null,
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                  ],
                ),
              ),
              // Add Feedback Section
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(top: 12),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 20),
                        SizedBox(width: 6),
                        Text('Đánh giá của khách hàng về tour này.', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue[900])),
                      ],
                    ),
                    SizedBox(height: 16),
                    if (feedbackLoading)
                      Center(child: CircularProgressIndicator())
                    else if (feedbacks.isEmpty)
                      Center(
                        child: Text(
                          'Chưa có đánh giá nào cho tour này',
                          style: TextStyle(color: Colors.grey[600]),
                        ),
                      )
                    else
                      Column(
                        children: [
                          ...getPaginatedFeedbacks().map((fb) => Card(
                                margin: EdgeInsets.only(bottom: 12),
                                child: Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      // Rating stars

                                      // User name
                                      Row(
                                        children: [
                                          CircleAvatar(
                                            backgroundColor: Colors.blue[100],
                                            child: Text(
                                              (fb['userFullName'] ?? 'A').substring(0, 1).toUpperCase(),
                                              style: TextStyle(color: Colors.blue[900]),
                                            ),
                                          ),
                                          SizedBox(width: 8),
                                          Text(
                                            fb['userFullName'] ?? 'Ẩn danh',
                                            style: TextStyle(fontWeight: FontWeight.bold),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 4),
                                      Row(
                                        children: [
                                          ...List.generate(
                                            (fb['rating'] ?? 0).toInt(),
                                                (index) => Icon(Icons.star, color: Colors.amber, size: 24),
                                          ),
                                          ...List.generate(
                                            (5 - (fb['rating'] ?? 0).toInt()).toInt(),
                                                (index) => Icon(Icons.star_border, color: Colors.grey[400], size: 24),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 8),
                                      // Date
                                      Text(
                                        fb['createdAt'] != null
                                            ? DateFormat('dd/MM/yyyy').format(DateTime.parse(fb['createdAt']))
                                            : '',
                                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                                      ),
                                      SizedBox(height: 8),
                                      // Message
                                      Text(
                                        fb['message'] ?? '',
                                        style: TextStyle(fontSize: 15, color: Colors.grey[800]),
                                      ),
                                    ],
                                  ),
                                ),
                              )).toList(),
                          // Pagination
                          if (getTotalFeedbackPages() > 1)
                            Padding(
                              padding: const EdgeInsets.only(top: 16),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  IconButton(
                                    icon: Icon(Icons.chevron_left),
                                    onPressed: currentFeedbackPage > 1
                                        ? () => setState(() => currentFeedbackPage--)
                                        : null,
                                  ),
                                  Text(
                                    'Trang $currentFeedbackPage/${getTotalFeedbackPages()}',
                                    style: TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  IconButton(
                                    icon: Icon(Icons.chevron_right),
                                    onPressed: currentFeedbackPage < getTotalFeedbackPages()
                                        ? () => setState(() => currentFeedbackPage++)
                                        : null,
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                  ],
                ),
              ),
              if (relatedTours.isNotEmpty)
                Container(
                  margin: EdgeInsets.symmetric(vertical: 8),
                  padding: EdgeInsets.all(16),
                  color: Colors.white,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Các tour liên quan',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue[900],
                        ),
                      ),
                      SizedBox(height: 16),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: relatedTours.map((tour) => Container(
                            width: 250,
                            margin: EdgeInsets.only(right: 18),
                            child: Card(
                              elevation: 4,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(18),
                              ),
                              child: Container(
                                height: 300,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (tour['imageUrls'] != null && (tour['imageUrls'] as List).isNotEmpty)
                                      ClipRRect(
                                        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
                                        child: Image.network(
                                          'http://10.0.2.2:8080${(tour['imageUrls'] as List).first}',
                                          height: 140,
                                          width: double.infinity,
                                          fit: BoxFit.cover,
                                          errorBuilder: (context, error, stackTrace) {
                                            print('Error loading image: $error');
                                            return Container(
                                              height: 140,
                                              width: double.infinity,
                                              color: Colors.grey[200],
                                              child: Icon(Icons.image_not_supported, size: 40, color: Colors.grey),
                                            );
                                          },
                                        ),
                                      ),
                                    Expanded(
                                      child: Padding(
                                        padding: EdgeInsets.all(12),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              tour['name'] ?? '',
                                              style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 15,
                                                color: Colors.black87,
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            SizedBox(height: 6),
                                            Text(
                                              'Giá từ ${formatPrice(tour['price'])}đ',
                                              style: TextStyle(
                                                color: Colors.green[700],
                                                fontSize: 14,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                      child: SizedBox(
                                        width: double.infinity,
                                        child: ElevatedButton(
                                          onPressed: () {
                                            Navigator.pushReplacement(
                                              context,
                                              MaterialPageRoute(
                                                builder: (context) => TourDetailScreen(
                                                  tourId: tour['tourId'],
                                                ),
                                              ),
                                            );
                                          },
                                          child: Text('Xem chi tiết'),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.orange,
                                            foregroundColor: Colors.white,
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(30),
                                            ),
                                            padding: EdgeInsets.symmetric(vertical: 10),
                                            textStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                            elevation: 0,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          )).toList(),
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
}
