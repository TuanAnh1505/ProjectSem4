import 'package:flutter/material.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/forgot_password_screen.dart';
import 'screens/auth/reset_password_screen.dart';
import 'screens/auth/change_password_screen.dart';
import 'services/deep_link_handler.dart';
import 'widgets/app_navigation.dart';
import 'screens/tour/tour_screen.dart';
import 'screens/search_screen.dart';
import 'screens/auth/personal_page_screen.dart';
import 'screens/auth/update_info_user_screen.dart';
import 'screens/setting_screen.dart';
import 'screens/booking/history_user_booking_tour_screen.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
      title: 'Hi Vietnam',
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
          iconTheme: IconThemeData(color: Colors.orange),
        ),
      ),
      initialRoute: '/home',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const AppNavigation(
              userName: 'Guest',
              userRole: 'USER',
              currentIndex: 0,
            ),
        '/settings': (context) => const AppNavigation(
              userName: 'Guest',
              userRole: 'USER',
              currentIndex: 0,
            ),
        '/forgot-password': (context) => const ForgotPasswordScreen(),
        '/reset-password': (context) => ResetPasswordScreen(
              publicId: ModalRoute.of(context)!.settings.arguments as String,
            ),
        '/change-password': (context) => ChangePasswordScreen(
              email: ModalRoute.of(context)!.settings.arguments as String,
            ),
        '/tours': (context) => TourScreen(),
        '/search_screen': (context) => SearchScreen(),
        '/personal_page_screen': (context) => PersonalPageScreen(),

        '/update-info-user-screen': (context) => UpdateInfoUserScreen(),
        '/setting-screen': (context) => SettingScreen(),
        '/history-user-booking-tour-screen': (context) => const HistoryUserBookingTourScreen(),
      },
    );
  }
}
