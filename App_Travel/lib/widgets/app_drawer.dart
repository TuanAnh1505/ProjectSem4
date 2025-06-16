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
          final userName = prefs.getString('user_name') ?? '';
          final userRole = prefs.getString('user_role') ?? '';

          return ListView(
            padding: EdgeInsets.zero,
            children: [
              if (token != null)
                UserAccountsDrawerHeader(
                  accountName: Text(userName),
                  accountEmail: Text(userRole),
                  currentAccountPicture: const CircleAvatar(
                    backgroundColor: Colors.white,
                    child: Icon(Icons.person, size: 40),
                  ),
                  decoration: const BoxDecoration(
                    color: Colors.orange,
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
                                Navigator.pushReplacementNamed(context, '/register');
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
                  Navigator.pushReplacementNamed(context, '/home');
                },
              ),
              ListTile(
                leading: const Icon(Icons.tour),
                title: const Text('Tours'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushReplacementNamed(context, '/tours');
                },
              ),
              if (token != null) ...[
                ListTile(
                  leading: const Icon(Icons.book_online),
                  title: const Text('Tours đã đặt'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushReplacementNamed(context, '/bookings');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.settings),
                  title: const Text('Cài đặt'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushReplacementNamed(context, '/setting-screen');
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
