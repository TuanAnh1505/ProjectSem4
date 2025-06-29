import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: FutureBuilder<SharedPreferences>(
        future: SharedPreferences.getInstance(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final prefs = snapshot.data!;
          final token = prefs.getString('auth_token');
          final email = prefs.getString('email') ?? '';
          final userRole = prefs.getString('user_role') ?? '';

          return ListView(
            padding: EdgeInsets.zero,
            children: [
              if (token != null)
                Container(
                  color: Colors.orange,
                  padding: const EdgeInsets.only(top: 80, bottom: 50, left: 16, right: 16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const CircleAvatar(
                        radius: 32,
                        backgroundColor: Colors.white,
                        child: Icon(
                          Icons.person,
                          size: 40,
                          color: Colors.orange,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              email.isNotEmpty ? email : 'User',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Vai trò: ${userRole.isNotEmpty ? userRole : "USER"}',
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 14,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.orange,
                  child: Column(
                    children: [
                      const SizedBox(height: 48),
                      const CircleAvatar(
                        radius: 40,
                        backgroundColor: Colors.white,
                        child: Icon(Icons.person, size: 40, color: Colors.orange),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.pop(context); // Close drawer
                                Navigator.pushReplacementNamed(context, '/login');
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: Colors.orange,
                                minimumSize: const Size(double.infinity, 45),
                              ),
                              child: const Text('Đăng nhập'),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                Navigator.pop(context); // Close drawer
                                Navigator.pushNamed(context, '/register');
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                side: const BorderSide(color: Colors.white),
                                minimumSize: const Size(double.infinity, 45),
                              ),
                              child: const Text('Đăng ký'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ListTile(
                leading: const Icon(Icons.home),
                title: const Text('Trang chủ'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushReplacementNamed(
                    context,
                    '/home',
                    arguments: {
                      'userRole': userRole,
                      'fullName': email,
                    },
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.tour),
                title: const Text('Tours'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/tours');
                },
              ),
              if (token != null) ...[
                // ListTile(
                //   leading: const Icon(Icons.book_online),
                //   title: const Text('Tours đã đặt'),
                //   onTap: () {
                //     Navigator.pop(context);
                //     Navigator.pushReplacementNamed(context, '/history-user-booking-tour-screen');
                //   },
                // ),
                ListTile(
                  leading: const Icon(Icons.settings),
                  title: const Text('Cài đặt'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, '/setting-screen');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.logout),
                  title: const Text('Đăng xuất'),
                  onTap: () async {
                    final prefs = await SharedPreferences.getInstance();
                    await prefs.clear();
                    if (context.mounted) {
                      Navigator.pop(context);
                      Navigator.pushReplacementNamed(context, '/home');
                    }
                  },
                ),
              ],
            ],
          );
        },
      ),
    );
  }
}
