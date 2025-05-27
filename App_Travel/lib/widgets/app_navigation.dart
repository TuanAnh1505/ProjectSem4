import 'package:flutter/material.dart';
import 'app_drawer.dart';
import '../screens/home_screen.dart';
import '../screens/tour/tour_screen.dart';


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
  bool _showSearch = false;
  final TextEditingController _searchController = TextEditingController();


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

  void _toggleSearch() {
    setState(() {
      _showSearch = !_showSearch;
      if (!_showSearch) _searchController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _selectedIndex == 2
          ? null
          : AppBar(
              leading: null,
              title: _selectedIndex == 0 ? const Text('Tour Booking') : null,
              centerTitle: true,
            ),
      drawer: _selectedIndex == 0
          ? AppDrawer(
              userName: widget.userName,
              userRole: widget.userRole,
            )
          : null,
      body: Column(
        children: [
          if (_selectedIndex == 0) SearchBar(),
          Expanded(child: _buildBody()),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Trang chủ',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Tìm kiếm',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.flight_takeoff),
            label: 'Tour',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Yêu thích',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Tài khoản',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.orange,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
        showUnselectedLabels: true,
      ),
    );
  }

  Widget _buildBody() {
    switch (_selectedIndex) {
      case 0:
        return HomeScreen(userName: widget.userName, userRole: widget.userRole);
      case 1:
        return const Center(child: Text('Tìm kiếm'));
      case 2:
        return TourScreen(
          onBack: () {
            setState(() {
              _selectedIndex = 0;
            });
          },
        );
      case 3:
        return const Center(child: Text('Yêu thích'));
      case 4:
        return const Center(child: Text('Tài khoản'));
      default:
        return HomeScreen(userName: widget.userName, userRole: widget.userRole);
    }
  }
}

class SearchBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: TextField(
        
        style: TextStyle(fontSize: 16, color: Colors.black87),
        decoration: InputDecoration(
          hintText: 'Tìm kiếm tour du lịch...',
          hintStyle: TextStyle(color: Colors.grey[400], fontSize: 16),
          filled: true,
          fillColor: Color(0xFFF8F9FA),
          contentPadding: EdgeInsets.symmetric(vertical: 0, horizontal: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          suffixIcon: Icon(Icons.search, color: Colors.orange),
        ),
      ),
    );
  }
}
