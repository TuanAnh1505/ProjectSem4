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
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<TourGuideAssignment> _assignments = [];
  List<TourGuideAssignment> _allAssignments = []; // Store all assignments
  bool _isLoading = true;
  String? _error;
  String _searchTerm = '';
  String _filterStatus = 'all'; // all, assigned, completed, cancelled
  Timer? _debounceTimer;

  @override
  void initState() {
    super.initState();
    _loadAssignments();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    _debounceTimer?.cancel();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      // Could implement pagination here if needed
    }
  }

  String _normalizeStatus(String status) {
    return status.toLowerCase().trim();
  }

  String _getEffectiveStatus(TourGuideAssignment assignment) {
    final isPast = assignment.endDate.isBefore(DateUtils.dateOnly(DateTime.now()));
    final normalizedStatus = _normalizeStatus(assignment.status);

    if (isPast && (normalizedStatus == 'assigned' || normalizedStatus == 'inprogress')) {
      return 'completed'; // Coi các tour đã qua là "Hoàn thành"
    }
    return normalizedStatus;
  }

  Map<String, int> _getStatusCounts(List<TourGuideAssignment> assignments) {
    final counts = <String, int>{'all': 0, 'inprogress': 0, 'assigned': 0, 'completed': 0, 'cancelled': 0};
    counts['all'] = assignments.length;
    
    for (var assignment in assignments) {
      final effectiveStatus = _getEffectiveStatus(assignment);
      // Đảm bảo key tồn tại trước khi tăng
      if (counts.containsKey(effectiveStatus)) {
        counts[effectiveStatus] = counts[effectiveStatus]! + 1;
      }
    }
    return counts;
  }

  Future<void> _loadAssignments({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _isLoading = true;
        _error = null;
      });
    }

    try {
      final assignments = await _guideService.fetchCurrentGuideAssignments();
      setState(() {
        _allAssignments = assignments;
        _isLoading = false; // Tải xong, ẩn loading
        _applyFilters(); // Áp dụng bộ lọc
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = e.toString();
      });
    }
  }

  void _applyFilters() {
    List<TourGuideAssignment> filtered;

    // Lọc theo trạng thái
    if (_filterStatus == 'all') {
      filtered = _allAssignments;
    } else {
      filtered = _allAssignments.where((assignment) {
        return _getEffectiveStatus(assignment) == _filterStatus;
      }).toList();
    }

    // Lọc theo từ khóa tìm kiếm
    if (_searchTerm.isNotEmpty) {
      final searchLower = _searchTerm.toLowerCase();
      filtered = filtered.where((assignment) {
        return (assignment.tourName?.toLowerCase().contains(searchLower) ?? false) ||
               (assignment.guideName?.toLowerCase().contains(searchLower) ?? false) ||
               (assignment.role.toLowerCase().contains(searchLower)) ||
               (assignment.tourDescription?.toLowerCase().contains(searchLower) ?? false);
      }).toList();
    }

    // Sắp xếp
    filtered.sort((a, b) => b.startDate.compareTo(a.startDate));

    setState(() {
      _assignments = filtered;
    });
  }

  void _onSearchChanged(String value) {
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 500), () {
      setState(() {
        _searchTerm = value;
      });
      _applyFilters();
    });
  }

  void _onFilterChanged(String status) {
    setState(() {
      _filterStatus = status;
    });
    _applyFilters();
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

  Future<void> _updateAssignmentStatus(TourGuideAssignment assignment, String newStatus) async {
    if (_normalizeStatus(assignment.status) == _normalizeStatus(newStatus)) return;
    
    try {
      await _guideService.updateAssignmentStatus(assignment.assignmentId, newStatus);
      _loadAssignments(refresh: true);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Đã cập nhật trạng thái thành công')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi cập nhật trạng thái: $e')),
        );
      }
    }
  }

  Future<void> _showStatusUpdateDialog(TourGuideAssignment assignment) async {
    final currentStatus = _normalizeStatus(assignment.status);

    final newStatus = await showDialog<String>(
      context: context,
      builder: (context) {
        final List<Widget> options = [];

        switch (currentStatus) {
          case 'assigned':
            options.add(_buildStatusOption(context, 'Bắt đầu (Đang diễn ra)', 'inprogress', Icons.play_circle_outline, color: const Color(0xFF059669)));
            options.add(_buildStatusOption(context, 'Hoàn thành', 'completed', Icons.check_circle_outline, color: const Color(0xFF10B981)));
            break;
          case 'inprogress':
            options.add(_buildStatusOption(context, 'Hoàn thành', 'completed', Icons.check_circle_outline, color: const Color(0xFF10B981)));
            break;
          case 'completed':
            options.add(_buildStatusOption(context, 'Mở lại (Đã giao)', 'assigned', Icons.replay_circle_filled_outlined, color: Colors.orange));
            break;
        }

        if (currentStatus != 'cancelled') {
           options.add(const Divider(height: 1));
           options.add(_buildStatusOption(context, 'Hủy', 'cancelled', Icons.cancel_outlined, isDestructive: true));
        }

        return AlertDialog(
          title: const Text('Cập nhật trạng thái'),
          contentPadding: const EdgeInsets.only(top: 16.0),
          content: SingleChildScrollView(
            child: ListBody(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: RichText(
                    text: TextSpan(
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontSize: 15),
                      children: <TextSpan>[
                        const TextSpan(text: 'Trạng thái hiện tại: '),
                        TextSpan(
                          text: _getStatusText(assignment.status, false),
                          style: TextStyle(
                            fontWeight: FontWeight.bold, 
                            color: _getStatusColor(assignment.status, false)
                          )
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                ...options,
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Đóng'),
            ),
          ],
        );
      },
    );

    if (newStatus != null) {
      await _updateAssignmentStatus(assignment, newStatus);
    }
  }

  Widget _buildStatusOption(BuildContext context, String title, String? statusValue, IconData icon, {Color? color, bool isDestructive = false}) {
    final textColor = isDestructive ? Colors.red : Theme.of(context).textTheme.bodyLarge?.color;
    final iconColor = isDestructive ? Colors.red : color ?? Theme.of(context).colorScheme.primary;

    return ListTile(
      leading: Icon(icon, color: iconColor),
      title: Text(title, style: TextStyle(color: textColor, fontWeight: FontWeight.w500, fontSize: 15)),
      onTap: () {
        Navigator.of(context).pop(statusValue);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Quản lý tour của tôi',
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
                                      'Các tour đã được giao cho bạn sẽ xuất hiện ở đây',
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
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6),
              borderRadius: BorderRadius.circular(12),
            ),
            child: TextField(
              controller: _searchController,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Tìm kiếm tour, vai trò...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFF6B7280)),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, color: Color(0xFF6B7280)),
                        onPressed: () {
                          _searchController.clear();
                          _onSearchChanged('');
                        },
                      )
                    : null,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('Tất cả', 'all', Icons.list_alt, _getStatusCounts(_allAssignments)['all'] ?? 0),
                const SizedBox(width: 8),
                _buildFilterChip('Đang diễn ra', 'inprogress', Icons.play_circle, _getStatusCounts(_allAssignments)['inprogress'] ?? 0),
                const SizedBox(width: 8),
                _buildFilterChip('Đã giao', 'assigned', Icons.assignment, _getStatusCounts(_allAssignments)['assigned'] ?? 0),
                const SizedBox(width: 8),
                _buildFilterChip('Hoàn thành', 'completed', Icons.check_circle, _getStatusCounts(_allAssignments)['completed'] ?? 0),
                const SizedBox(width: 8),
                _buildFilterChip('Đã hủy', 'cancelled', Icons.cancel, _getStatusCounts(_allAssignments)['cancelled'] ?? 0),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value, IconData icon, int count) {
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
                '$label ($count)',
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
    final isPast = assignment.endDate.isBefore(DateUtils.dateOnly(DateTime.now()));

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: _getStatusColor(assignment.status, isPast).withOpacity(0.2),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _getStatusColor(assignment.status, isPast).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.tour,
                    color: _getStatusColor(assignment.status, isPast),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildStatusBadge(assignment.status, isPast),
                      const SizedBox(height: 6),
                      Text(
                        assignment.tourName ?? 'Tour không xác định',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1F2937),
                        ),
                      ),
                      if (assignment.tourDescription?.isNotEmpty == true) ...[
                        const SizedBox(height: 4),
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
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE5E7EB)),
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.person,
                    color: Theme.of(context).primaryColor,
                    size: 24,
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
                        const SizedBox(height: 4),
                        Text(
                          assignment.guideSpecialization!,
                          style: const TextStyle(
                            fontSize: 14,
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
                                fontSize: 14,
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
          ),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(color: Color(0xFFE5E7EB)),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Thời gian',
                        style: TextStyle(
                          fontSize: 14,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${_formatDate(assignment.startDate)} - ${_formatDate(assignment.endDate)}',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.green,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 1,
                  height: 24,
                  color: const Color(0xFFE5E7EB),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(left: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Vai trò',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          assignment.role,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Show action buttons for all assignments (not just assigned status)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(color: Color(0xFFE5E7EB)),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                // Show status update button only for main_guide and appropriate statuses
                if (assignment.role.toLowerCase() == 'main_guide' &&
                    ['assigned', 'completed', 'inprogress'].contains(_normalizeStatus(assignment.status)) &&
                    !isPast) ...[
                  OutlinedButton.icon(
                    onPressed: () => _showStatusUpdateDialog(assignment),
                    icon: const Icon(Icons.update, size: 18),
                    label: const Text('Cập nhật trạng thái'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.blue,
                      side: const BorderSide(color: Colors.blue),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
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
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status, bool isPast) {
    final color = _getStatusColor(status, isPast);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        _getStatusText(status, isPast),
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Color _getStatusColor(String status, bool isPast) {
    final normalizedStatus = _normalizeStatus(status);
    if (isPast && (normalizedStatus == 'assigned' || normalizedStatus == 'inprogress')) {
      return const Color(0xFF6B7280); // Grey for finished
    }

    switch (normalizedStatus) {
      case 'inprogress':
        return const Color(0xFF059669); // Green
      case 'assigned':
        return const Color(0xFF3B82F6); // Blue
      case 'completed':
        return const Color(0xFF10B981); // Light Green for completed
      case 'cancelled':
        return const Color(0xFFEF4444); // Red
      default:
        return const Color(0xFF6B7280); // Grey
    }
  }

  String _getStatusText(String status, bool isPast) {
    final normalizedStatus = _normalizeStatus(status);
    if (isPast && (normalizedStatus == 'assigned' || normalizedStatus == 'inprogress')) {
      return 'Đã kết thúc';
    }

    switch (normalizedStatus) {
      case 'inprogress':
        return 'Đang diễn ra';
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


