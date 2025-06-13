import 'package:app_links/app_links.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import '../screens/auth/reset_password_screen.dart';
import '../screens/feedback/feedback_screen.dart';

class DeepLinkHandler {
  AppLinks? _appLinks;
  StreamSubscription<Uri>? _sub;
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  void init(BuildContext context) {
    _appLinks = AppLinks();
    _handleIncomingLinks();
  }

  void dispose() {
    _sub?.cancel();
  }


  void _handleIncomingLinks() {
    // Listen for incoming links when app is running
    _sub = _appLinks?.uriLinkStream.listen((Uri? uri) {
      print('Received deep link: $uri');
      if (uri != null && uri.scheme == 'myapp') {
        if (uri.host == 'activate') {
          final publicId = uri.queryParameters['publicId'];
          print('publicId: $publicId');
          if (publicId != null) {
            _activateAccount(publicId);
          }
        } else if (uri.host == 'reset-password') {
          final publicId = uri.queryParameters['publicId'];
          print('publicId (reset): $publicId');
          if (publicId != null) {
            navigatorKey.currentState?.push(
              MaterialPageRoute(
                builder: (context) => ResetPasswordScreen(publicId: publicId),
              ),
            );
          }
        } else if (uri.host == 'feedback') {
          final bookingId = uri.queryParameters['bookingId'];
          if (bookingId != null) {
            navigatorKey.currentState?.push(
              MaterialPageRoute(
                builder: (context) => FeedbackScreen(
                  bookingId: int.parse(bookingId),
                  bookingCode: '',
                  tour: {},
                  selectedDate: '',
                  itineraries: [],
                  finalPrice: 0,
                ),
              ),
            );
          }
        }
      }
    }, onError: (err) {
      print('Deep link error: $err');
    });

    // Handle initial link when app is started by a link
    _appLinks?.getInitialAppLink().then((Uri? uri) {
      print('Initial deep link: $uri');
      if (uri != null && uri.scheme == 'myapp') {
        if (uri.host == 'activate') {
          final publicId = uri.queryParameters['publicId'];
          print('publicId: $publicId');
          if (publicId != null) {
            _activateAccount(publicId);
          }
        } else if (uri.host == 'reset-password') {
          final publicId = uri.queryParameters['publicId'];
          print('publicId (reset): $publicId');
          if (publicId != null) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              navigatorKey.currentState?.push(
                MaterialPageRoute(
                  builder: (context) => ResetPasswordScreen(publicId: publicId),
                ),
              );
            });
          }
        }
      }
    });
  }

  Future<void> _activateAccount(String publicId) async {
    try {
      print('publicId: $publicId');
      print('Gọi API kích hoạt với publicId: $publicId');
      print('URL: http://10.0.2.2:8080/api/auth/activate?publicId=$publicId');
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/auth/activate?publicId=$publicId'),
      );
      print('Response: ${response.statusCode} - ${response.body}');
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(navigatorKey.currentContext!).showSnackBar(
          const SnackBar(content: Text('Kích hoạt tài khoản thành công!')),
        );
      } else {
        ScaffoldMessenger.of(navigatorKey.currentContext!).showSnackBar(
          SnackBar(content: Text('Kích hoạt thất bại: ${response.body}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(navigatorKey.currentContext!).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: $e')),
      );
    }
  }
} 