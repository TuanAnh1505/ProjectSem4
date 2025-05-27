class Tour {
  final int tourId;
  final String name;
  final String description;
  final double? price;
  final int duration;
  final int maxParticipants;
  final int statusId;
  final String? imageUrl;
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
    this.imageUrl,
    this.createdAt,
    this.updatedAt,
  });
  

  factory Tour.fromJson(Map<String, dynamic> json) {
    return Tour(
      tourId: json['tourId'] ?? json['id'] ?? json['tour_id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: json['price'] != null ? double.parse(json['price'].toString()) : null,
      duration: json['duration'] ?? 0,
      maxParticipants: json['max_participants'] ?? 0,
      statusId: json['status_id'] ?? 0,
      imageUrl: json['image_url'] ?? json['imageUrl'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
    );
  }
}