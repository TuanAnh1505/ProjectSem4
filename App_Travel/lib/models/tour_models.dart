class Tour {
  final int tourId;
  final String name;
  final String description;
  final double? price;
  final int duration;
  final int maxParticipants;
  final int statusId;
  final List<String> imageUrls;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Tour({
    required this.tourId,
    required this.name,
    required this.description,
    this.price,
    required this.duration,
    required this.maxParticipants,
    required this.statusId,
    List<String>? imageUrls,
    this.createdAt,
    this.updatedAt,
  }) : this.imageUrls = imageUrls ?? [];
  

  factory Tour.fromJson(Map<String, dynamic> json) {
    return Tour(
      tourId: json['tourId'] ?? json['id'] ?? json['tour_id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: json['price'] != null ? double.parse(json['price'].toString()) : null,
      duration: json['duration'] ?? 0,
      maxParticipants: json['maxParticipants'] ?? json['max_participants'] ?? 0,
      statusId: json['status_id'] ?? 0,
      imageUrls: (json['imageUrls'] as List<dynamic>?)?.map((url) => url.toString()).toList() ?? [],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
    );
  }
}