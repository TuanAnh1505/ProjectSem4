import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class GuideManagementScreen extends StatefulWidget {
  const GuideManagementScreen({super.key});

  @override
  State<GuideManagementScreen> createState() => _GuideManagementScreenState();
}

class _GuideManagementScreenState extends State<GuideManagementScreen> {
  // Dummy data for demonstration
  final List<Map<String, dynamic>> _upcomingTours = [
    {
      'tourName': 'Hà Nội - Hạ Long 2N1Đ',
      'date': '15/04/2024',
      'participants': 12,
      'status': 'Đã xác nhận',
    },
    {
      'tourName': 'Sapa - Fansipan 3N2Đ',
      'date': '20/04/2024',
      'participants': 8,
      'status': 'Chờ xác nhận',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Quản lý tour',
              style: GoogleFonts.baloo2(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.orange,
              ),
            ),
            const SizedBox(height: 20),
            _buildStatisticsCards(),
            const SizedBox(height: 20),
            Text(
              'Tour sắp tới',
              style: GoogleFonts.baloo2(
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: ListView.builder(
                itemCount: _upcomingTours.length,
                itemBuilder: (context, index) {
                  final tour = _upcomingTours[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      title: Text(
                        tour['tourName'],
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 8),
                          Text('Ngày: ${tour['date']}'),
                          Text('Số người tham gia: ${tour['participants']}'),
                          Text(
                            'Trạng thái: ${tour['status']}',
                            style: TextStyle(
                              color: tour['status'] == 'Đã xác nhận'
                                  ? Colors.green
                                  : Colors.orange,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.more_vert),
                        onPressed: () {
                          _showTourOptions(context, tour);
                        },
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Implement add new tour functionality
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Chức năng thêm tour mới đang được phát triển'),
            ),
          );
        },
        backgroundColor: Colors.orange,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildStatisticsCards() {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'Tổng tour',
            '12',
            Icons.calendar_today,
            Colors.blue,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildStatCard(
            'Tour sắp tới',
            '5',
            Icons.upcoming,
            Colors.green,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildStatCard(
            'Đánh giá',
            '4.8',
            Icons.star,
            Colors.orange,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showTourOptions(BuildContext context, Map<String, dynamic> tour) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              ListTile(
                leading: const Icon(Icons.edit),
                title: const Text('Chỉnh sửa tour'),
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Implement edit tour functionality
                },
              ),
              ListTile(
                leading: const Icon(Icons.people),
                title: const Text('Xem danh sách khách'),
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Implement view participants functionality
                },
              ),
              ListTile(
                leading: const Icon(Icons.cancel),
                title: const Text('Hủy tour'),
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Implement cancel tour functionality
                },
              ),
            ],
          ),
        );
      },
    );
  }
} 