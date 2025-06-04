import 'package:flutter/material.dart';
import '../../models/tour_models.dart';
import '../../services/tour_service.dart';
import 'tour/tour_detail_screen.dart';
import 'package:intl/intl.dart';
import 'package:diacritic/diacritic.dart';

class SearchScreen extends StatefulWidget {
  final VoidCallback? onBack;
  final bool showAppBar;
  const SearchScreen({Key? key, this.onBack, this.showAppBar = true}) : super(key: key);

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _controller = TextEditingController();
  final TourService _tourService = TourService();
  List<Tour> allTours = [];
  List<Tour> filteredTours = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchTours();
    _controller.addListener(_onSearchChanged);
  }

  Future<void> _fetchTours() async {
    final tours = await _tourService.fetchTours();
    setState(() {
      allTours = tours;
      filteredTours = tours;
      isLoading = false;
    });
  }

  void _onSearchChanged() {
    final keyword = removeDiacritics(_controller.text.toLowerCase());
    setState(() {
      filteredTours = allTours.where((tour) {
        final name = removeDiacritics(tour.name.toLowerCase());
        final description = removeDiacritics(tour.description.toLowerCase());
        return name.contains(keyword) || description.contains(keyword);
      }).toList();
    });
  }

  String formatPrice(double? price) {
    if (price == null) return 'N/A';
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');
    return formatter.format(price);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final content = Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Container(
            decoration: BoxDecoration(
              boxShadow: [
                BoxShadow(
                  color: Colors.orange.withOpacity(0.08),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
              borderRadius: BorderRadius.circular(30),
            ),
            child: TextField(
              controller: _controller,
              style: const TextStyle(fontSize: 16, color: Colors.black87),
              decoration: InputDecoration(
                hintText: 'Nhập từ khóa tìm kiếm...',
                hintStyle: TextStyle(color: Colors.grey, fontSize: 16),
                suffixIcon: const Icon(Icons.search, color: Colors.orange, size: 28),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: BorderSide(color: Colors.orange.withOpacity(0.3), width: 1.5),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: const BorderSide(color: Colors.orange, width: 2),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (!isLoading && _controller.text.isNotEmpty)
            Align(
              alignment: Alignment.centerLeft,
              child: Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Text(
                  'Tìm thấy ${filteredTours.length} tour phù hợp',
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    color: Colors.blueGrey,
                    fontSize: 15,
                  ),
                ),
              ),
            ),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : filteredTours.isEmpty
                    ? const Center(child: Text('Không tìm thấy tour phù hợp.'))
                    : ListView.builder(
                        itemCount: filteredTours.length,
                        itemBuilder: (context, index) {
                          final tour = filteredTours[index];
                          return Card(
                            margin: EdgeInsets.fromLTRB(0, index == 0 ? 0 : 10, 0, 10),
                            elevation: 4,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.vertical(top: Radius.circular(14)),
                                  child: tour.imageUrl != null && tour.imageUrl!.isNotEmpty
                                      ? Image.network(
                                          (() {
                                            final url = 'http://10.0.2.2:8080${tour.imageUrl!.startsWith('/') ? '' : '/'}${tour.imageUrl!}';
                                            return url;
                                          })(),
                                          width: double.infinity,
                                          height: 200,
                                          fit: BoxFit.cover,
                                          errorBuilder: (context, error, stackTrace) {
                                            return Container(
                                              width: double.infinity,
                                              height: 200,
                                              color: Colors.grey[200],
                                              child: Icon(Icons.image_not_supported, size: 60, color: Colors.grey),
                                            );
                                          },
                                        )
                                      : Container(
                                          width: double.infinity,
                                          height: 200,
                                          color: Colors.grey[200],
                                          child: Icon(Icons.image_not_supported, size: 60, color: Colors.grey),
                                        ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(14.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        tour.name,
                                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 21, color: Colors.blue[900]),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      SizedBox(height: 7),
                                      Text(
                                        tour.description.length > 70
                                            ? '${tour.description.substring(0, 70)}...'
                                            : tour.description,
                                        style: TextStyle(fontSize: 15, color: Colors.grey[800]),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      SizedBox(height: 10),
                                      Text(
                                        'Số ngày: ${tour.duration}',
                                        style: TextStyle(fontSize: 15, color: Colors.black87),
                                      ),
                                      SizedBox(height: 10),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            'Giá: ${formatPrice(tour.price)}',
                                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.orange[800]),
                                          ),
                                          ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: Colors.orange,
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              padding: EdgeInsets.symmetric(horizontal: 22, vertical: 10),
                                            ),
                                            onPressed: () {
                                              Navigator.push(
                                                context,
                                                MaterialPageRoute(
                                                  builder: (context) => TourDetailScreen(tourId: tour.tourId),
                                                ),
                                              );
                                            },
                                            child: Text(
                                              'Chi tiết',
                                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );

    if (!widget.showAppBar) {
      return SafeArea(child: content);
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.orange),
          onPressed: widget.onBack ?? () => Navigator.of(context).pop(),
        ),
        title: const Text('Tìm kiếm tour du lịch'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        iconTheme: const IconThemeData(color: Colors.orange),
        elevation: 0,
      ),
      body: content,
    );
  }
}




