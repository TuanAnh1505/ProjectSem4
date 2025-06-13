import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../screens/auth/update_info_user_screen.dart';
import '../screens/auth/change_password_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'terms_policy_screen.dart';
import 'package:google_fonts/google_fonts.dart';

class SettingScreen extends StatefulWidget {
  const SettingScreen({Key? key}) : super(key: key);

  @override
  State<SettingScreen> createState() => _SettingScreenState();
}

class _SettingScreenState extends State<SettingScreen> {
  bool isDarkMode = false;
  bool isNotificationOn = true;
  bool isOfflineDownload = false;
  bool isLocationOn = true;
  String fullName = '';
  String email = '';

  @override
  void initState() {
    super.initState();
    _loadUserInfo();
  }

  Future<void> _loadUserInfo() async {
    final prefs = await SharedPreferences.getInstance();
    final publicId = prefs.getString('public_id');
    final token = prefs.getString('auth_token');
    if (publicId != null && token != null) {
      try {
        final response = await http.get(
          Uri.parse('http://10.0.2.2:8080/api/auth/user-info?publicId=$publicId'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        );
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          await prefs.setString('fullName', data['fullName'] ?? '');
          await prefs.setString('email', data['email'] ?? '');
          setState(() {
            fullName = data['fullName'] ?? '';
            email = data['email'] ?? '';
          });
          return;
        }
      } catch (e) {
        // Có thể log lỗi nếu cần
      }
    }
    // Nếu không lấy được từ API, lấy từ local (nếu có)
    setState(() {
      fullName = prefs.getString('fullName') ?? '';
      email = prefs.getString('email') ?? '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cài đặt'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Hồ sơ người dùng
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Container(
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFFFFF3E0),
                  ),
                  padding: const EdgeInsets.all(12),
                  child: const Icon(
                    Icons.person,
                    size: 40,
                    color: Colors.orange,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        fullName,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                      ),
                      Text(
                        email,
                        style: const TextStyle(color: Colors.grey),
                      ),
                      TextButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const UpdateInfoUserScreen()),
                          );
                        },
                        icon: const Icon(Icons.edit, color: Colors.orange),
                        label: const Text('Chỉnh sửa hồ sơ'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Cài đặt chung
          _buildSectionTitle('Cài đặt chung'),
          _buildSwitchTile(
            icon: Icons.dark_mode,
            title: 'Chế độ tối',
            value: isDarkMode,
            onChanged: (val) => setState(() => isDarkMode = val),
          ),

          // Tài khoản
          _buildSectionTitle('Tài khoản'),
          _buildListTile(
            icon: Icons.lock,
            title: 'Đổi mật khẩu',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ChangePasswordScreen(email: email)),
              );
            },
          ),
          _buildListTile(
            icon: Icons.language,
            title: 'Ngôn ngữ',
            trailing: const Text('Tiếng Việt', style: TextStyle(color: Colors.grey)),
            onTap: () {
              // TODO: Chọn ngôn ngữ
            },
          ),
        //   _buildSwitchTile(
        //     icon: Icons.notifications,
        //     title: 'Thông báo',
        //     value: isNotificationOn,
        //     onChanged: (val) => setState(() => isNotificationOn = val),
        //   ),

          // Ứng dụng
        //   _buildSectionTitle('Ứng dụng'),
        //   _buildSwitchTile(
        //     icon: Icons.download,
        //     title: 'Tải xuống nội dung offline',
        //     value: isOfflineDownload,
        //     onChanged: (val) => setState(() => isOfflineDownload = val),
        //   ),
        //   _buildSwitchTile(
        //     icon: Icons.location_on,
        //     title: 'Vị trí',
        //     value: isLocationOn,
        //     onChanged: (val) => setState(() => isLocationOn = val),
        //   ),
          _buildListTile(
            icon: Icons.info,
            title: 'Phiên bản ứng dụng',
            trailing: const Text('2.5.1', style: TextStyle(color: Colors.grey)),
          ),

          // Hỗ trợ
          _buildSectionTitle('Hỗ trợ'),
          _buildListTile(
            icon: Icons.help,
            title: 'Trung tâm trợ giúp',
            onTap: () {
              // TODO: Chuyển sang trang trợ giúp
            },
          ),
        //   _buildListTile(
        //     icon: Icons.feedback,
        //     title: 'Gửi phản hồi',
        //     onTap: () {
        //       // TODO: Chuyển sang trang gửi phản hồi
        //     },
        //   ),
          _buildListTile(
            icon: Icons.policy,
            title: 'Điều khoản & Chính sách',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const TermsPolicyScreen()),
              );
            },
          ),

          // Đăng xuất
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
              side: const BorderSide(color: Colors.orange),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            onPressed: () {
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/home',
                (route) => false,
              );
            },
            child: const Text('Đăng xuất'),
          ),

          // Logo và thông tin bản quyền
          const SizedBox(height: 24),
          Center(
            child: Column(
              children: [
                Text(
                  'Hi VietNam',
                  style: GoogleFonts.baloo2(
                    color: Colors.orange,
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2.5,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Tour Du Lịch App © 2025\nPhiên bản 2.5.1',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
      backgroundColor: const Color(0xFFF6F6F6),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(top: 16, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
      ),
    );
  }

  Widget _buildListTile({
    required IconData icon,
    required String title,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[700]),
      title: Text(title),
      trailing: trailing ?? const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: onTap,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      tileColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      minLeadingWidth: 0,
    );
  }

  Widget _buildSwitchTile({
    required IconData icon,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[700]),
      title: Text(title),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: Colors.green,
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      tileColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      minLeadingWidth: 0,
    );
  }
}




