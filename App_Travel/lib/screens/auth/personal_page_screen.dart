import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'update_info_user_screen.dart';
import 'dart:developer' as developer;
import '/screens/setting_screen.dart';

class PersonalPageScreen extends StatelessWidget {
  final bool showAppBar;
  const PersonalPageScreen({Key? key, this.showAppBar = true}) : super(key: key);

  Future<void> _handleLogout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('public_id');
    if (context.mounted) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  Future<void> _navigateToUpdateInfo(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final publicId = prefs.getString('public_id');

    developer.log('Checking credentials before navigation:');
    developer.log('Token: \u001b[32m[0m${token != null ? 'exists' : 'null'}');
    developer.log('PublicId: \u001b[32m[0m${publicId != null ? 'exists' : 'null'}');

    if (token == null || publicId == null) {
      developer.log('Missing credentials, redirecting to login');
      if (context.mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
      return;
    }

    developer.log('Navigating to UpdateInfoUserScreen');
    if (context.mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const UpdateInfoUserScreen(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: showAppBar
          ? AppBar(
              backgroundColor: Colors.white,
              elevation: 0,
              leading: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.orange),
                onPressed: () {
                  Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
                },
              ),
            )
          : null,
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 16),
            // User Icon
            Container(
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0xFFFFF3E0),
              ),
              padding: const EdgeInsets.all(18),
              child: const Icon(
                Icons.person,
                size: 56,
                color: Colors.orange,
              ),
            ),
            const SizedBox(height: 18),
            const Text(
              'Tài khoản của bạn',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF222B45),
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Đã xác thực tài khoản',
              style: TextStyle(
                fontSize: 14,
                color: Colors.green,
                fontWeight: FontWeight.w400,
              ),
            ),
            const SizedBox(height: 28),
            // Menu
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                children: [
                  _buildMenuCard(
                    context,
                    title: 'Cập nhật thông tin',
                    subtitle: 'Thay đổi thông tin cá nhân',
                    icon: FontAwesomeIcons.userEdit,
                    iconColor:  Colors.orange,
                    onTap: () => _navigateToUpdateInfo(context),
                  ),
                  const SizedBox(height: 16),
                  _buildMenuCard(
                    context,
                    title: 'Lịch sử đặt tour',
                    subtitle: 'Xem các tour đã đặt',
                    icon: FontAwesomeIcons.history,
                    iconColor: Colors.orange,
                    onTap: () {},
                  ),
                  const SizedBox(height: 16),
                  _buildMenuCard(
                    context,
                    title: 'Tour yêu thích',
                    subtitle: 'Danh sách tour đã lưu',
                    icon: FontAwesomeIcons.heart,
                    iconColor: Colors.orange,
                    onTap: () {},
                  ),
                  const SizedBox(height: 16),
                  _buildMenuCard(
                    context,
                    title: 'Cài đặt',
                    subtitle: 'Tùy chỉnh ứng dụng',
                    icon: FontAwesomeIcons.cog,
                    iconColor: Colors.orange,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SettingScreen()),
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  // Logout Button
                  // SizedBox(
                  //   width: double.infinity,
                  //   child: ElevatedButton.icon(
                  //     onPressed: () => _handleLogout(context),
                  //     icon: const Icon(FontAwesomeIcons.signOutAlt, color: Colors.orange, size: 18),
                  //     label: const Text(
                  //       'Đăng xuất',
                  //       style: TextStyle(
                  //         fontSize: 16,
                  //         fontWeight: FontWeight.bold,
                  //         color: Colors.orange,
                  //       ),
                  //     ),
                  //     style: ElevatedButton.styleFrom(
                  //       backgroundColor: const Color(0xFFFFF3E0),
                  //       elevation: 0,
                  //       padding: const EdgeInsets.symmetric(vertical: 16),
                  //       shape: RoundedRectangleBorder(
                  //         borderRadius: BorderRadius.circular(18),
                  //       ),
                  //     ),
                  //   ),
                  // ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Color(0xFFFFF3E0),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: iconColor,
                  size: 22,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF222B45),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF7B8D9E),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: Colors.orange,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
