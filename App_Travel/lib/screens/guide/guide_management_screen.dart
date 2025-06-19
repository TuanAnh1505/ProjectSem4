import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../models/guide_models.dart';
import '../../services/guide_service.dart';
import 'dart:async';
import 'assignment_details_screen.dart';

class GuideManagementScreen extends StatefulWidget {
  const GuideManagementScreen({Key? key}) : super(key: key);

  @override
  State<GuideManagementScreen> createState() => _GuideManagementScreenState();
}

class _GuideManagementScreenState extends State<GuideManagementScreen> {
  final GuideService _guideService = GuideService();
  final ScrollController _scrollController = ScrollController();

  List<TourGuideAssignment> _assignments = [];
  bool _isLoading = true;
  String? _error;
  String _filterStatus = 'all'; // all, assigned, completed, cancelled

  @override
  void initState() {
    super.initState();
    _loadAssignments();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      // Could implement pagination here if needed
    }
  }

  Future<void> _loadAssignments({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _isLoading = true;
        _error = null;
      });
    }

    try {
      final assignments = await _guideService.fetchAllAssignments();
      
      // Filter by status only (bỏ search filter)
      List<TourGuideAssignment> filteredAssignments = assignments.where((assignment) {
        // Status filter
        if (_filterStatus != 'all' && assignment.status.toLowerCase() != _filterStatus) {
          return false;
        }
        return true;
      }).toList();

      // Sort by start date (newest first)
      filteredAssignments.sort((a, b) => b.startDate.compareTo(a.startDate));

      setState(() {
        _assignments = filteredAssignments;
        _isLoading = false;
        _error = null;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = e.toString();
      });
    }
  }

  void _onFilterChanged(String status) {
    setState(() {
      _filterStatus = status;
    });
    _loadAssignments(refresh: true);
  }

  Future<void> _deleteAssignment(TourGuideAssignment assignment) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận hủy phân công'),
        content: Text('Bạn có chắc chắn muốn hủy phân công tour "${assignment.tourName}" cho hướng dẫn viên "${assignment.guideName}" không?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Xác nhận'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await _guideService.deleteAssignment(assignment.assignmentId);
        _loadAssignments(refresh: true);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Đã hủy phân công thành công')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Lỗi khi hủy phân công: $e')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Quản lý phân công tour',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 20,
            color: Colors.black,
          ),
        ),
        backgroundColor: Colors.white,
        foregroundColor: Colors.white,
        elevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(20),
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: IconButton(
              onPressed: () => _loadAssignments(refresh: true),
              icon: const Icon(Icons.refresh),
              tooltip: 'Làm mới',
            ),
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          color: Colors.white,
        ),
        child: Column(
          children: [
            _buildSearchAndFilterBar(),
            Expanded(
              child: _isLoading
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: CircularProgressIndicator(
                              color: Theme.of(context).primaryColor,
                              strokeWidth: 3,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Đang tải dữ liệu...',
                            style: TextStyle(
                              color: Colors.grey[600] ?? Colors.grey.shade600,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                    )
                  : _error != null
                      ? Center(
                          child: Container(
                            padding: const EdgeInsets.all(24),
                            margin: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.error_outline,
                                  size: 64,
                                  color: Colors.red[400] ?? Colors.red.shade400,
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'Có lỗi xảy ra',
                                  style: TextStyle(
                                    color: Colors.grey[800] ?? Colors.grey.shade800,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  _error!,
                                  style: TextStyle(color: Colors.grey[600] ?? Colors.grey.shade600),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 20),
                                ElevatedButton.icon(
                                  onPressed: () => _loadAssignments(refresh: true),
                                  icon: const Icon(Icons.refresh),
                                  label: const Text('Thử lại'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Theme.of(context).primaryColor,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )
                      : _assignments.isEmpty
                          ? Center(
                              child: Container(
                                padding: const EdgeInsets.all(24),
                                margin: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.1),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.assignment_outlined,
                                      size: 64,
                                      color: Colors.grey[400] ?? Colors.grey.shade400,
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      'Chưa có tour nào được giao',
                                      style: TextStyle(
                                        color: Colors.grey[800] ?? Colors.grey.shade800,
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Các tour đã được giao cho hướng dẫn viên sẽ xuất hiện ở đây',
                                      style: TextStyle(
                                        color: Colors.grey[500] ?? Colors.grey.shade500, 
                                        fontSize: 14,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                              ),
                            )
                          : RefreshIndicator(
                              onRefresh: () => _loadAssignments(refresh: true),
                              child: ListView.builder(
                                controller: _scrollController,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                itemCount: _assignments.length,
                                itemBuilder: (context, index) => _buildTourAssignmentCard(_assignments[index]),
                              ),
                            ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchAndFilterBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('Tất cả', 'all', Icons.list_alt,),
                const SizedBox(width: 8),
                _buildFilterChip('Đã giao', 'assigned', Icons.assignment),
                const SizedBox(width: 8),
                _buildFilterChip('Hoàn thành', 'completed', Icons.check_circle),
                const SizedBox(width: 8),
                _buildFilterChip('Đã hủy', 'cancelled', Icons.cancel),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value, IconData icon) {
    final isSelected = _filterStatus == value;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => _onFilterChanged(value),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? Colors.orange : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? Colors.orange : Colors.grey[300]!,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? Colors.white : Colors.grey,
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.grey,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTourAssignmentCard(TourGuideAssignment assignment) {
    final isPast = assignment.endDate.isBefore(DateTime.now());
    final isOngoing = assignment.startDate.isBefore(DateTime.now()) && 
                     assignment.endDate.isAfter(DateTime.now());
    final Color cardShadow = Colors.black.withOpacity(0.07);
    final Color mainColor = Theme.of(context).primaryColor;
    final Color badgeColor = _getStatusColor(assignment.status, isPast, isOngoing);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: cardShadow,
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
        border: Border.all(
          color: badgeColor.withOpacity(0.18),
          width: 1.2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Badge trạng thái
            Align(
              alignment: Alignment.topLeft,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: badgeColor.withOpacity(0.13),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.flag,
                      color: badgeColor,
                      size: 18,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      _getStatusText(assignment.status, isPast, isOngoing),
                      style: TextStyle(
                        color: badgeColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),
            // Tên tour
            Text(
              assignment.tourName ?? 'Tour không xác định',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1F2937),
                height: 1.2,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            if (assignment.tourDescription?.isNotEmpty == true) ...[
              const SizedBox(height: 6),
              Text(
                assignment.tourDescription!,
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF6B7280),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            const SizedBox(height: 18),
            // Thông tin hướng dẫn viên
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: mainColor.withOpacity(0.13),
                  child: Icon(
                    Icons.person,
                    color: mainColor,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        assignment.guideName ?? 'Không xác định',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF1F2937),
                        ),
                      ),
                      if (assignment.guideSpecialization?.isNotEmpty == true) ...[
                        const SizedBox(height: 2),
                        Text(
                          assignment.guideSpecialization!,
                          style: const TextStyle(
                            fontSize: 13,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                      ],
                      if (assignment.guideRating != null) ...[
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            ...List.generate(
                              5,
                              (index) => Icon(
                                index < (assignment.guideRating ?? 0).floor()
                                    ? Icons.star
                                    : Icons.star_border,
                                size: 16,
                                color: const Color(0xFFFBBF24),
                              ),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              assignment.guideRating!.toStringAsFixed(1),
                              style: const TextStyle(
                                fontSize: 13,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            // Thời gian & Vai trò
            Row(
              children: [
                Icon(Icons.calendar_month, color: Colors.green, size: 20),
                const SizedBox(width: 6),
                Text(
                  _formatDate(assignment.startDate) + ' - ' + _formatDate(assignment.endDate),
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.green,
                  ),
                ),
                const Spacer(),
                Icon(Icons.badge, color: mainColor, size: 20),
                const SizedBox(width: 6),
                Text(
                  assignment.role,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1F2937),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            // Nút chi tiết
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => AssignmentDetailsScreen(assignment: assignment),
                      ),
                    );
                  },
                  icon: const Icon(Icons.info_outline, size: 18),
                  label: const Text('Chi tiết'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: mainColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status, bool isPast, bool isOngoing) {
    final color = _getStatusColor(status, isPast, isOngoing);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        _getStatusText(status, isPast, isOngoing),
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Color _getStatusColor(String status, bool isPast, bool isOngoing) {
    if (isOngoing) return const Color(0xFF059669);
    if (isPast) return const Color(0xFF6B7280);
    
    switch (status.toLowerCase()) {
      case 'assigned':
        return const Color(0xFF3B82F6);
      case 'completed':
        return const Color(0xFF059669);
      case 'cancelled':
        return const Color(0xFFEF4444);
      default:
        return const Color(0xFF6B7280);
    }
  }

  String _getStatusText(String status, bool isPast, bool isOngoing) {
    if (isOngoing) return 'Đang diễn ra';
    if (isPast) return 'Đã kết thúc';
    
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'Đã giao';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  void _showAssignmentDetails(TourGuideAssignment assignment) {
    // No longer used, navigation is now handled in the button.
  }
}


