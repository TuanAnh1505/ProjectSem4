import 'package:flutter/material.dart';
import 'app_drawer.dart';
import '../screens/home_screen.dart';
import '../screens/tour/tour_screen.dart';
import '../screens/search_screen.dart';


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
              title: _selectedIndex == 0
                  ? const Text('Tour Booking')
                  : _selectedIndex == 1
                      ? const Text('Tìm kiếm tour du lịch')
                      : null,
              centerTitle: true,
              actions: _selectedIndex == 0
                  ? [
                      IconButton(
                        icon: const Icon(Icons.search, color: Colors.orange),
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const SearchScreen()),
                          );
                        },
                      ),
                    ]
                  : null,
            ),
      drawer: _selectedIndex == 0
          ? AppDrawer(
              userName: widget.userName,
              userRole: widget.userRole,
            )
          : null,
      body: Column(
        children: [
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
        return SearchScreen(
          onBack: () {
            setState(() {
              _selectedIndex = 0;
            });
          },
          showAppBar: false,
        );
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

