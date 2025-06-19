class TourGuide {
  final int id;
  final int userId;
  final String userFullName;
  final String userEmail;
  final int experienceYears;
  final String specialization;
  final String languages;
  final double? rating;
  final bool isAvailable;
  final bool isAssigned;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  TourGuide({
    required this.id,
    required this.userId,
    required this.userFullName,
    required this.userEmail,
    required this.experienceYears,
    required this.specialization,
    required this.languages,
    this.rating,
    required this.isAvailable,
    required this.isAssigned,
    this.createdAt,
    this.updatedAt,
  });

  factory TourGuide.fromJson(Map<String, dynamic> json) {
    return TourGuide(
      id: json['id'] ?? 0,
      userId: json['userId'] ?? json['userid'] ?? 0,
      userFullName: json['userFullName'] ?? json['user_full_name'] ?? '',
      userEmail: json['userEmail'] ?? json['user_email'] ?? '',
      experienceYears: json['experienceYears'] ?? json['experience_years'] ?? 0,
      specialization: json['specialization'] ?? '',
      languages: json['languages'] ?? '',
      rating: json['rating'] != null ? double.parse(json['rating'].toString()) : null,
      isAvailable: json['isAvailable'] ?? json['is_available'] ?? false,
      isAssigned: json['isAssigned'] ?? json['is_assigned'] ?? false,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'userFullName': userFullName,
      'userEmail': userEmail,
      'experienceYears': experienceYears,
      'specialization': specialization,
      'languages': languages,
      'rating': rating,
      'isAvailable': isAvailable,
      'isAssigned': isAssigned,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  TourGuide copyWith({
    int? id,
    int? userId,
    String? userFullName,
    String? userEmail,
    int? experienceYears,
    String? specialization,
    String? languages,
    double? rating,
    bool? isAvailable,
    bool? isAssigned,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return TourGuide(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      userFullName: userFullName ?? this.userFullName,
      userEmail: userEmail ?? this.userEmail,
      experienceYears: experienceYears ?? this.experienceYears,
      specialization: specialization ?? this.specialization,
      languages: languages ?? this.languages,
      rating: rating ?? this.rating,
      isAvailable: isAvailable ?? this.isAvailable,
      isAssigned: isAssigned ?? this.isAssigned,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class TourGuideAssignment {
  final int assignmentId;
  final int tourId;
  final int guideId;
  final String role;
  final DateTime startDate;
  final DateTime endDate;
  final String status;
  final String? tourName;
  final String? tourDescription;
  final String? guideName;
  final String? guideSpecialization;
  final String? guideLanguages;
  final double? guideRating;
  final List<String> imageUrls;

  TourGuideAssignment({
    required this.assignmentId,
    required this.tourId,
    required this.guideId,
    required this.role,
    required this.startDate,
    required this.endDate,
    required this.status,
    this.tourName,
    this.tourDescription,
    this.guideName,
    this.guideSpecialization,
    this.guideLanguages,
    this.guideRating,
    this.imageUrls = const [],
  });

  factory TourGuideAssignment.fromJson(Map<String, dynamic> json) {
    return TourGuideAssignment(
      assignmentId: json['assignmentId'] ?? json['assignment_id'] ?? 0,
      tourId: json['tourId'] ?? json['tour_id'] ?? 0,
      guideId: json['guideId'] ?? json['guide_id'] ?? 0,
      role: json['role'] ?? '',
      startDate: DateTime.parse(json['startDate'] ?? json['start_date']),
      endDate: DateTime.parse(json['endDate'] ?? json['end_date']),
      status: json['status'] ?? '',
      tourName: json['tourName'] ?? json['tour_name'],
      tourDescription: json['tourDescription'] ?? json['tour_description'],
      guideName: json['guideName'] ?? json['guide_name'],
      guideSpecialization: json['guideSpecialization'] ?? json['guide_specialization'],
      guideLanguages: json['guideLanguages'] ?? json['guide_languages'],
      guideRating: json['guideRating'] != null ? double.parse(json['guideRating'].toString()) : null,
      imageUrls: (json['imageUrls'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? 
                 (json['tourImages'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? 
                 (json['images'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'assignmentId': assignmentId,
      'tourId': tourId,
      'guideId': guideId,
      'role': role,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'status': status,
      'tourName': tourName,
      'tourDescription': tourDescription,
      'guideName': guideName,
      'guideSpecialization': guideSpecialization,
      'guideLanguages': guideLanguages,
      'guideRating': guideRating,
      'imageUrls': imageUrls,
    };
  }

  String get statusText {
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'Đã giao';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  String get statusColor {
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'grey';
    }
  }
}

class TourGuideSearchResponse {
  final List<TourGuide> content;
  final int totalPages;
  final int totalElements;
  final int currentPage;
  final int size;

  TourGuideSearchResponse({
    required this.content,
    required this.totalPages,
    required this.totalElements,
    required this.currentPage,
    required this.size,
  });

  factory TourGuideSearchResponse.fromJson(Map<String, dynamic> json) {
    return TourGuideSearchResponse(
      content: (json['content'] as List<dynamic>?)
          ?.map((item) => TourGuide.fromJson(item))
          .toList() ?? [],
      totalPages: json['totalPages'] ?? 0,
      totalElements: json['totalElements'] ?? 0,
      currentPage: json['number'] ?? 0,
      size: json['size'] ?? 10,
    );
  }
}
