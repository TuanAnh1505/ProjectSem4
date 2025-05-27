class LoginRequest {
  final String email;
  final String password;

  LoginRequest({required this.email, required this.password});

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }
}

class RegisterRequest {
  final String fullName;
  final String email;
  final String password;
  final String phone;
  final String address;

  RegisterRequest({
    required this.fullName,
    required this.email,
    required this.password,
    required this.phone,
    required this.address,
  });
  

  Map<String, dynamic> toJson() {
    return {
      'fullName': fullName,
      'email': email,
      'password': password,
      'phone': phone,
      'address': address,
    };
  }
}

class AuthResponse {
  final String token;
  final String role;
  final String publicId;

  AuthResponse({
    required this.token,
    required this.role,
    required this.publicId,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'],
      role: json['role'],
      publicId: json['publicId'],
    );
  }
} 