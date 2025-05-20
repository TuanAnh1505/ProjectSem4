class PassengerCounts {
  final int adult;
  final int child;
  final int infant;

  PassengerCounts({
    required this.adult,
    required this.child,
    required this.infant,
  });

  Map<String, dynamic> toJson() => {
    'adult': adult,
    'child': child,
    'infant': infant,
  };
}

class ContactInfo {
  final String fullName;
  final String phoneNumber;
  final String email;
  final String? address;
  final String gender;
  final String birthDate;

  ContactInfo({
    required this.fullName,
    required this.phoneNumber,
    required this.email,
    this.address,
    required this.gender,
    required this.birthDate,
  });

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'phoneNumber': phoneNumber,
    'email': email,
    'address': address,
    'gender': gender,
    'birthDate': birthDate,
  };
}

class PassengerDetail {
  final String fullName;
  final String gender;
  final String birthDate;
  final String passengerType;

  PassengerDetail({
    required this.fullName,
    required this.gender,
    required this.birthDate,
    required this.passengerType,
  });

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'gender': gender,
    'birthDate': birthDate,
    'passengerType': passengerType,
  };
}

class BookingPassengerRequest {
  final int bookingId;
  final String publicId;
  final ContactInfo contactInfo;
  final PassengerCounts passengers;
  final List<PassengerDetail> passengerDetails;

  BookingPassengerRequest({
    required this.bookingId,
    required this.publicId,
    required this.contactInfo,
    required this.passengers,
    required this.passengerDetails,
  });

  Map<String, dynamic> toJson() => {
    'bookingId': bookingId,
    'publicId': publicId,
    'contactInfo': contactInfo.toJson(),
    'passengers': passengers.toJson(),
    'passengerDetails': passengerDetails.map((p) => p.toJson()).toList(),
  };
} 