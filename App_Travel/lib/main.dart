import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/forgot_password_screen.dart';
import 'screens/reset_password_screen.dart';
import 'screens/change_password_screen.dart';
import 'services/deep_link_handler.dart';
// import 'widgets/app_navigation.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final DeepLinkHandler _deepLinkHandler = DeepLinkHandler();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _deepLinkHandler.init(context);
    });
  }

  @override
  void dispose() {
    _deepLinkHandler.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: _deepLinkHandler.navigatorKey,
      title: 'Tour Booking',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
          primary: Colors.blue,
          secondary: Colors.blueAccent,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          iconTheme: IconThemeData(color: Colors.black),
        ),
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(
              userName: 'Guest',
              userRole: 'USER',
            ),
        '/hotels': (context) => const HomeScreen(
              userName: 'Guest',
              userRole: 'USER',
            ),
        '/flights': (context) => const HomeScreen(
              userName: 'Guest',
              userRole: 'USER',
            ),
        '/bookings': (context) => const HomeScreen(
              userName: 'Guest',
              userRole: 'USER',
            ),
        '/settings': (context) => const HomeScreen(
              userName: 'Guest',
              userRole: 'USER',
            ),
        '/forgot-password': (context) => const ForgotPasswordScreen(),
        '/reset-password': (context) => ResetPasswordScreen(
              publicId: ModalRoute.of(context)!.settings.arguments as String,
            ),
        '/change-password': (context) => ChangePasswordScreen(
              email: ModalRoute.of(context)!.settings.arguments as String,
            ),
      },
    );
  }
}
