import 'package:flutter/material.dart';
import 'app_drawer.dart';

class AppNavigation extends StatefulWidget {
  final String userName;
  final String userRole;
  final int currentIndex;

  const AppNavigation({
    super.key,
    required this.userName,
    required this.userRole,
    this.currentIndex = 0,
  });

  @override
  State<AppNavigation> createState() => _AppNavigationState();
}

class _AppNavigationState extends State<AppNavigation> {
  late int _selectedIndex;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.currentIndex;
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tour Booking'),
      ),
      drawer: AppDrawer(
        userName: widget.userName,
        userRole: widget.userRole,
      ),
      body: _buildBody(),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.hotel),
            label: 'Hotels',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.flight),
            label: 'Flights',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.book_online),
            label: 'Bookings',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
      ),
    );
  }

  Widget _buildBody() {
    switch (_selectedIndex) {
      case 0:
        return const Center(child: Text('Home Screen'));
      case 1:
        return const Center(child: Text('Hotels Screen'));
      case 2:
        return const Center(child: Text('Flights Screen'));
      case 3:
        return const Center(child: Text('Bookings Screen'));
      default:
        return const Center(child: Text('Home Screen'));
    }
  }
}
