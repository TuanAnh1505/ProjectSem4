import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:flutter_carousel_widget/flutter_carousel_widget.dart';
import '../models/tour_models.dart';
import '../services/tour_service.dart';
import 'tour/tour_detail_screen.dart';
import 'tour/tour_screen.dart';
import 'package:diacritic/diacritic.dart';

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
  final List<String> filters = ['Tất cả', 'Miền bắc', 'Miền trung', 'Miền nam'];
  
  
  // Thêm danh sách ảnh banner
  final List<String> bannerImages = [
    'assets/images/banner.jpg',
    'assets/images/banner ha long bay.jpg',
    'assets/images/banner hoi an.jpg',
    'assets/images/banner sapa.jpg',
  ];

  // Map từ khóa cho từng vùng
  final Map<String, List<String>> regionKeywords = {
    'Miền bắc': [
      // Tỉnh/thành
      'Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Bắc Ninh', 'Bắc Giang', 'Bắc Kạn', 'Cao Bằng', 'Điện Biên', 'Hà Giang', 'Hà Nam', 'Hải Dương', 'Hòa Bình', 'Hưng Yên', 'Lai Châu', 'Lạng Sơn', 'Lào Cai', 'Nam Định', 'Ninh Bình', 'Phú Thọ', 'Sơn La', 'Thái Bình', 'Thái Nguyên', 'Tuyên Quang', 'Vĩnh Phúc', 'Yên Bái',
      // Điểm đến nổi bật
      'Sapa', 'Hạ Long', 'Bái Đính', 'Tràng An', 'Tam Đảo', 'Mộc Châu', 'Fansipan', 'Cát Bà', 'Đồng Văn', 'Ba Bể', 'Mai Châu', 'Núi Đôi Quản Bạ', 'Thác Bản Giốc', 'Yên Tử', 'Chùa Hương', 'Làng cổ Đường Lâm'
    ],
    'Miền trung': [
      // Tỉnh/thành
      'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng',
      // Điểm đến nổi bật
      'Huế', 'Đà Nẵng', 'Hội An', 'Phong Nha', 'Kẻ Bàng', 'Bà Nà Hills', 'Cù Lao Chàm', 'Mỹ Sơn', 'Nha Trang', 'Đà Lạt', 'Mũi Né', 'Phan Thiết', 'Tuy Hòa', 'Quy Nhơn', 'Buôn Ma Thuột', 'Pleiku', 'Đồi cát Bay', 'Tháp Chàm', 'Biển Lăng Cô', 'Đèo Hải Vân'
    ],
    'Miền nam': [
      // Tỉnh/thành
      'TP. Hồ Chí Minh', 'Bà Rịa - Vũng Tàu', 'Bình Dương', 'Bình Phước', 'Cà Mau', 'Cần Thơ', 'Đồng Nai', 'Đồng Tháp', 'Hậu Giang', 'Kiên Giang', 'Long An', 'Sóc Trăng', 'Tây Ninh', 'Tiền Giang', 'Trà Vinh', 'Vĩnh Long', 'An Giang', 'Bạc Liêu', 'Bến Tre',
      // Điểm đến nổi bật
      'Sài Gòn', 'Vũng Tàu', 'Phú Quốc', 'Côn Đảo', 'Cần Giờ', 'Mỹ Tho', 'Bến Tre', 'Châu Đốc', 'Sa Đéc', 'Hà Tiên', 'Rạch Giá', 'Cà Mau', 'Bạc Liêu', 'Sóc Trăng', 'Tràm Chim', 'Chợ Nổi Cái Răng', 'Núi Bà Đen', 'Đảo Nam Du', 'Đảo Thổ Chu'
    ]
  };

  int selectedCategory = -1; // -1: tất cả, 0: Biển đảo, 1: Miền núi, 2: Di sản, 3: Thành phố
  final List<String> categories = ['Biển đảo', 'Miền núi', 'Di sản', 'Thành phố'];
  final Map<String, List<String>> categoryKeywords = {
    'Biển đảo': ['biển', 'đảo', 'cát bà', 'phú quốc', 'côn đảo', 'vũng tàu', 'cù lao chàm', 'nam du', 'thổ chu', 'hạ long'],
    'Miền núi': ['núi', 'cao nguyên', 'sapa', 'fansipan', 'mộc châu', 'tây bắc', 'đà lạt', 'tam đảo', 'ba bể', 'mai châu', 'bà nà', 'bà đen'],
    'Di sản': ['di sản', 'phong nha', 'kẻ bàng', 'hội an', 'huế', 'mỹ sơn', 'tràng an', 'bái đính', 'yên tử', 'chùa hương'],
    'Thành phố': ['thành phố', 'hà nội', 'sài gòn', 'tp. hồ chí minh', 'đà nẵng', 'cần thơ', 'hải phòng', 'nha trang', 'huế'],
  };

  String formatPrice(num? price) {
    if (price == null) return '';
    final formatter = NumberFormat('#,###', 'vi_VN');
    return formatter.format(price);
  }

  // Hàm loại bỏ dấu tiếng Việt
  String removeDiacriticsVN(String str) {
    return removeDiacritics(str.toLowerCase());
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Thanh filter cố định
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16),
          child: SizedBox(
            height: 38,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.symmetric(horizontal: 12),
              itemCount: filters.length,
              separatorBuilder: (_, __) => SizedBox(width: 10),
              itemBuilder: (context, idx) => ChoiceChip(
                showCheckmark: false,
                label: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (selectedFilter == idx) ...[
                      Icon(Icons.check, color: Colors.white, size: 18),
                      SizedBox(width: 4),
                    ],
                    Text(filters[idx]),
                  ],
                ),
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
        ),
        // Phần còn lại cuộn được
        Expanded(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 18),
                  // Banner quảng cáo với carousel
                  FlutterCarousel(
                    items: bannerImages.map((imagePath) {
                      return Container(
                        width: MediaQuery.of(context).size.width,
                        margin: EdgeInsets.symmetric(horizontal: 5.0),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.asset(
                            imagePath,
                            fit: BoxFit.cover,
                          ),
                        ),
                      );
                    }).toList(),
                    options: CarouselOptions(
                      height: 240,
                      autoPlay: true,
                      autoPlayInterval: Duration(seconds: 4),
                      autoPlayAnimationDuration: Duration(milliseconds: 800),
                      autoPlayCurve: Curves.fastOutSlowIn,
                      enlargeCenterPage: true,
                      viewportFraction: 1.0,
                      showIndicator: true,
                    ),
                  ),
                  const SizedBox(height: 32),
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
                  const SizedBox(height: 16),
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
                        final filteredTours = selectedFilter == 0
                            ? tours
                            : tours.where((tour) {
                                final region = filters[selectedFilter];
                                final keywords = regionKeywords[region] ?? [];
                                final name = removeDiacriticsVN(tour.name);
                                final description = removeDiacriticsVN(tour.description);
                                print('Tour: \\${tour.name} - \\${tour.description}');
                                print('Tour (no diacritics): \\${name}');
                                for (var kw in keywords) {
                                  final keyword = removeDiacriticsVN(kw);
                                  print('Keyword: \\${kw} - \\${keyword}');
                                  if (name.contains(keyword) || description.contains(keyword)) {
                                    print('==> MATCHED');
                                  }
                                }
                                return keywords.any((kw) {
                                  final keyword = removeDiacriticsVN(kw);
                                  return name.contains(keyword) || description.contains(keyword);
                                });
                              }).toList();
                        if (filteredTours.isEmpty) {
                          return Center(
                            child: Card(
                              color: Colors.orange[50],
                              margin: EdgeInsets.symmetric(vertical: 32, horizontal: 24),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.sentiment_dissatisfied, color: Colors.orange, size: 32),
                                    SizedBox(width: 10),
                                    Flexible(
                                      child: Text(
                                        'Hiện không có tour nào trong mục này',
                                        style: TextStyle(fontSize: 17, color: Colors.grey[700], fontWeight: FontWeight.w500),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }
                        return SizedBox(
                          height: 310,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: filteredTours.length > 5 ? 5 : filteredTours.length,
                            separatorBuilder: (_, __) => SizedBox(width: 14),
                            itemBuilder: (context, idx) {
                              final tour = filteredTours[idx];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 16.0),
                                child: GestureDetector(
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
                                ),
                              );
                            },
                          ),
                        );
                      }
                    },
                  ),
                  const SizedBox(height: 32),

                  Text('Danh mục du lịch', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                  // Danh mục tour
                  const SizedBox(height: 32),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: List.generate(categories.length, (idx) {
                        print('assets/images/' + removeDiacriticsVN(categories[idx].toLowerCase().replaceAll(' ', '_')) + '.png');
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              selectedCategory = selectedCategory == idx ? -1 : idx;
                            });
                          },
                          child: Column(
                            children: [
                              Container(
                                width: 80,
                                height: 80,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: selectedCategory == idx ? Colors.orange : Colors.orange[50],
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Image.asset(
                                    'assets/images/' + removeDiacriticsVN(categories[idx].toLowerCase().replaceAll(' ', '_')) + '.png',
                                    fit: BoxFit.contain,
                                  ),
                                ),
                              ),
                              SizedBox(height: 6),
                              Text(
                                categories[idx],
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                  color: selectedCategory == idx ? Colors.orange : Colors.black87,
                                ),
                              ),
                            ],
                          ),
                        );
                      }),
                    ),
                  ),
                  const SizedBox(height: 32),
                  // Tour nổi bật
                  Text('Tour nổi bật', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                  const SizedBox(height: 32),
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
                        // Lọc theo danh mục nếu có chọn
                        final filteredFeaturedTours = selectedCategory == -1
                            ? tours.take(5).toList()
                            : tours.where((tour) {
                                final cat = categories[selectedCategory];
                                final keywords = categoryKeywords[cat] ?? [];
                                final name = removeDiacriticsVN(tour.name);
                                final description = removeDiacriticsVN(tour.description);
                                return keywords.any((kw) {
                                  final keyword = removeDiacriticsVN(kw);
                                  return name.contains(keyword) || description.contains(keyword);
                                });
                              }).take(5).toList();
                        if (filteredFeaturedTours.isEmpty) {
                          return Center(child: Text('Không có tour nổi bật phù hợp'));
                        }
                        return Column(
                          children: filteredFeaturedTours.map((tour) => Card(
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
          ),
        ),
      ],
    );
  }
}
