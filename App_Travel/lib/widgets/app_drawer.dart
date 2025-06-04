import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  final String userName;
  final String userRole;

  const AppDrawer({
    super.key,
    required this.userName,
    required this.userRole,
  });
  

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
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
          ),
          
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Trang chủ'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/home',
                (route) => false,
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.search),
            title: const Text('Tìm kiếm'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/search_screen',
                ModalRoute.withName('/home'),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.flight_takeoff),
            title: const Text('Tour'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/tours',
                ModalRoute.withName('/home'),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.favorite),
            title: const Text('Yêu thích'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/favorite',
                ModalRoute.withName('/home'),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Tài khoản'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/personal_page_screen',
                ModalRoute.withName('/home'),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/setting-screen',
                ModalRoute.withName('/home'),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.lock),
            title: const Text('Đổi mật khẩu'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/change-password',
                ModalRoute.withName('/home'),
                arguments: userName,
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/login',
                (route) => false,
              );
            },
          ),
        ],
      ),
    );
  }
}
