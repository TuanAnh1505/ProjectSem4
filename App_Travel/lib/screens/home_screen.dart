import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/tour_models.dart';
import '../services/tour_service.dart';
import 'tour/tour_detail_screen.dart';
import 'tour/tour_screen.dart';

class HomeScreen extends StatefulWidget {
  final String userName;
  final String userRole;

  const HomeScreen({Key? key, required this.userName, required this.userRole}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TourService _tourService = TourService();
  int selectedFilter = 0;
  final List<String> filters = ['Tất cả', 'Trong nước', 'Nước ngoài', 'Tour hot'];

  String formatPrice(num? price) {
    if (price == null) return '';
    final formatter = NumberFormat('#,###', 'vi_VN');
    return formatter.format(price);
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            // Thanh filter
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: filters.length,
                separatorBuilder: (_, __) => SizedBox(width: 10),
                itemBuilder: (context, idx) => ChoiceChip(
                  label: Text(filters[idx]),
                  selected: selectedFilter == idx,
                  selectedColor: Colors.orange,
                  backgroundColor: Colors.grey[200],
                  labelStyle: TextStyle(
                    color: selectedFilter == idx ? Colors.white : Colors.black87,
                    fontWeight: FontWeight.bold,
                  ),
                  onSelected: (_) {
                    setState(() => selectedFilter = idx);
                  },
                ),
              ),
            ),
            const SizedBox(height: 18),
            // Banner quảng cáo
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Stack(
                children: [
                  Image.asset(
                    'assets/images/banner.jpg', // Thay bằng ảnh banner của bạn
                    width: double.infinity,
                    height: 240,
                    fit: BoxFit.cover,
                  ),
                  // Positioned(
                  //   left: 18,
                  //   top: 18,
                  //   child: Column(
                  //     crossAxisAlignment: CrossAxisAlignment.start,
                  //     children: [
                  //       Text('Khám phá Việt Nam', style: TextStyle(fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold)),
                  //       SizedBox(height: 6),
                  //       Text('Giảm đến 30% cho tour hè 2025', style: TextStyle(fontSize: 15, color: Colors.white)),
                  //     ],
                  //   ),
                  // ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Tour đề xuất', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => TourScreen()),
                    );
                  },
                  child: Text('Xem tất cả', style: TextStyle(color: Colors.orange)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            // Danh sách tour đề xuất
            FutureBuilder<List<Tour>>(
              future: _tourService.fetchTours(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Lỗi: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('Không có tour đề xuất'));
                } else {
                  final tours = snapshot.data!;
                  return SizedBox(
                    height: 290,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: tours.length > 5 ? 5 : tours.length,
                      separatorBuilder: (_, __) => SizedBox(width: 14),
                      itemBuilder: (context, idx) {
                        final tour = tours[idx];
                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => TourDetailScreen(tourId: tour.tourId),
                              ),
                            );
                          },
                          child: Container(
                            width: 220,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black12,
                                  blurRadius: 6,
                                  offset: Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                                      child: tour.imageUrl != null && tour.imageUrl!.isNotEmpty
                                          ? Image.network(
                                              'http://10.0.2.2:8080${tour.imageUrl}',
                                              width: 220,
                                              height: 160,
                                              fit: BoxFit.cover,
                                            )
                                          : Container(
                                              width: 220,
                                              height: 160,
                                              color: Colors.grey[200],
                                              child: Icon(Icons.image_not_supported, size: 60, color: Colors.grey),
                                            ),

                                    ),
                                    // Positioned(
                                    //   top: 10,
                                    //   left: 10,
                                    //   child: Container(
                                    //     padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    //     decoration: BoxDecoration(
                                    //       color: Colors.orange,
                                    //       borderRadius: BorderRadius.circular(8),
                                    //     ),
                                    //     child: Text(
                                    //       '-15%',
                                    //       style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                                    //     ),
                                    //   ),
                                    // ),
                                  ],
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        tour.name,
                                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue[900]),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      SizedBox(height: 6),
                                      Row(
                                        children: [
                                          Icon(Icons.star, color: Colors.amber, size: 16),
                                          SizedBox(width: 3),
                                          Text('4.8 (126 đánh giá)', style: TextStyle(fontSize: 13, color: Colors.grey[700])),
                                        ],
                                      ),
                                      SizedBox(height: 6),
                                      Text('${tour.duration} ngày', style: TextStyle(fontSize: 13, color: Colors.black87)),
                                      SizedBox(height: 6),
                                      // Text(
                                      //   '6.500.000đ',
                                      //   style: TextStyle(
                                      //     color: Colors.grey,
                                      //     fontSize: 14,
                                      //     decoration: TextDecoration.lineThrough,
                                      //   ),
                                      // ),
                                      Text(
                                        '${formatPrice(tour.price)}đ',
                                        style: TextStyle(
                                          color: Colors.orange,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  );
                }
              },
            ),
            const SizedBox(height: 32),
            // Tour nổi bật
            Text('Tour nổi bật', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
            const SizedBox(height: 8),
            FutureBuilder<List<Tour>>(
              future: _tourService.fetchTours(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Lỗi: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('Không có tour nổi bật'));
                } else {
                  final tours = snapshot.data!;
                  final featuredTours = tours.take(2).toList();
                  return Column(
                    children: featuredTours.map((tour) => Card(
                      margin: EdgeInsets.symmetric(vertical: 8),
                      elevation: 4,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(14),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => TourDetailScreen(tourId: tour.tourId),
                            ),
                          );
                        },
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.vertical(top: Radius.circular(14)),
                              child: tour.imageUrl != null && tour.imageUrl!.isNotEmpty
                                  ? Image.network(
                                      'http://10.0.2.2:8080${tour.imageUrl}',
                                      width: double.infinity,
                                      height: 250,
                                      fit: BoxFit.cover,
                                    )
                                  : Container(
                                      width: double.infinity,
                                      height: 140,
                                      color: Colors.grey[200],
                                      child: Icon(Icons.image_not_supported, size: 40, color: Colors.grey),
                                    ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(14.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    tour.name,
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.blue[900]),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  SizedBox(height: 6),
                                  Text(
                                    tour.description.length > 60
                                        ? '${tour.description.substring(0, 60)}...'
                                        : tour.description,
                                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  SizedBox(height: 8),
                                  Text('Số ngày: ${tour.duration}', style: TextStyle(fontSize: 15, color: Colors.black87)),
                                  SizedBox(height: 12),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      RichText(
                                        text: TextSpan(
                                          children: [
                                            TextSpan(
                                              text: 'Giá: ',
                                              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black, fontSize: 16),
                                            ),
                                            TextSpan(
                                              text: '${formatPrice(tour.price)} đ',
                                              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange, fontSize: 18),
                                            ),
                                          ],
                                        ),
                                      ),
                                      ElevatedButton(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.orange,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
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
                                          'Đặt ngay',
                                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    )).toList(),
                  );
                }
              },
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
