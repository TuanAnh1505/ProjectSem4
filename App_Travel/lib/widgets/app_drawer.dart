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
              color: Colors.blue,
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Home'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/home');
            },
          ),
          ListTile(
            leading: const Icon(Icons.hotel),
            title: const Text('Hotels'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/hotels');
            },
          ),
          ListTile(
            leading: const Icon(Icons.flight),
            title: const Text('Flights'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/flights');
            },
          ),
          ListTile(
            leading: const Icon(Icons.book_online),
            title: const Text('Bookings'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/bookings');
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/settings');
            },
          ),
          ListTile(
            leading: const Icon(Icons.lock),
            title: const Text('Đổi mật khẩu'),
            onTap: () {
              Navigator.pushNamed(
                context,
                '/change-password',
                arguments: userName,
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),

        ],
      ),
    );
  }
}
