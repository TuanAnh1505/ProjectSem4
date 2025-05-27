import 'package:flutter/material.dart';
import '../../models/tour_models.dart';
import '../../services/tour_service.dart';
import 'package:intl/intl.dart';
import 'tour_detail_screen.dart';
import 'package:diacritic/diacritic.dart';

class TourScreen extends StatefulWidget {
  final VoidCallback? onBack;
  TourScreen({this.onBack});
  @override
  _TourScreenState createState() => _TourScreenState();
}

class _TourScreenState extends State<TourScreen> {
  final TourService _tourService = TourService();

  double? minPrice;
  double? maxPrice;
  bool sortAZ = false;
  int selectedFilter = 0;
  final List<String> filters = ['Tất cả', 'Miền bắc', 'Miền trung', 'Miền nam'];


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

  String formatPrice(double? price) {
    if (price == null) return 'N/A';
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');
    return formatter.format(price);
  }

  String formatDate(DateTime? date) {
    if (date == null) return '';
    return DateFormat('dd/MM/yyyy').format(date);
  }

  // Hàm loại bỏ dấu tiếng Việt
  String removeDiacriticsVN(String str) {
    return removeDiacritics(str.toLowerCase());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Custom AppBar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.arrow_back, color: Colors.orange),
                    onPressed: widget.onBack ?? () => Navigator.pop(context),
                  ),
                  Expanded(
                    child: Text(
                      'Danh sách Tour',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 20,
                        fontWeight: FontWeight.bold
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.search, color: Colors.black),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            // Thanh filter tab
            SizedBox(
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
            // Hàng chứa Bộ lọc và Sắp xếp
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () async {
                      double? tempMin = minPrice;
                      double? tempMax = maxPrice;
                      await showDialog(
                        context: context,
                        builder: (context) {
                          return AlertDialog(
                            title: Text('Lọc theo khoảng giá'),
                            content: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                TextField(
                                  keyboardType: TextInputType.number,
                                  decoration: InputDecoration(labelText: 'Giá thấp nhất'),
                                  onChanged: (val) {
                                    tempMin = double.tryParse(val);
                                  },
                                ),
                                TextField(
                                  keyboardType: TextInputType.number,
                                  decoration: InputDecoration(labelText: 'Giá cao nhất'),
                                  onChanged: (val) {
                                    tempMax = double.tryParse(val);
                                  },
                                ),
                              ],
                            ),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                },
                                child: Text('Hủy'),
                              ),
                              ElevatedButton(
                                onPressed: () {
                                  setState(() {
                                    minPrice = tempMin;
                                    maxPrice = tempMax;
                                  });
                                  Navigator.pop(context);
                                },
                                child: Text('Lọc'),
                              ),
                            ],
                          );
                        },
                      );
                    },
                    // const SizedBox(height: 32),
                    child: Row(
                      children: [
                        Icon(Icons.filter_list, size: 20, color: Colors.grey[700]),
                        SizedBox(width: 4),
                        Text('Bộ lọc', style: TextStyle(color: Colors.grey[800])),
                        if (minPrice != null || maxPrice != null)
                          Padding(
                            padding: const EdgeInsets.only(left: 4),
                            child: Text(
                              '(${minPrice != null ? formatPrice(minPrice) : ''} - ${maxPrice != null ? formatPrice(maxPrice) : ''})',
                              style: TextStyle(color: Colors.blue, fontSize: 12),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        sortAZ = !sortAZ;
                      });
                    },
                    child: Row(
                      children: [
                        Text('Sắp xếp', style: TextStyle(color: Colors.grey[800])),
                        SizedBox(width: 4),
                        Icon(Icons.sort_by_alpha, size: 20, color: sortAZ ? Colors.blue : Colors.grey[700]),
                        if (sortAZ)
                          Padding(
                            padding: const EdgeInsets.only(left: 4),
                            child: Text('(A-Z)', style: TextStyle(color: Colors.blue, fontSize: 12)),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            // Expanded để chứa danh sách tour
            const SizedBox(height: 20),
            Expanded(
              child: FutureBuilder<List<Tour>>(
                future: _tourService.fetchTours(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(child: Text('No tours available'));
                  } else {
                    List<Tour> tours = snapshot.data!;
                    
                    // Lọc theo miền
                    if (selectedFilter != 0) {
                      final region = filters[selectedFilter];
                      final keywords = regionKeywords[region] ?? [];
                      tours = tours.where((tour) {
                        final name = removeDiacriticsVN(tour.name);
                        final description = removeDiacriticsVN(tour.description);
                        return keywords.any((kw) {
                          final keyword = removeDiacriticsVN(kw);
                          return name.contains(keyword) || description.contains(keyword);
                        });
                      }).toList();
                    }

                    // Lọc theo khoảng giá
                    if (minPrice != null) {
                      tours = tours.where((t) => t.price != null && t.price! >= minPrice!).toList();
                    }
                    if (maxPrice != null) {
                      tours = tours.where((t) => t.price != null && t.price! <= maxPrice!).toList();
                    }
                    // Sắp xếp A-Z
                    if (sortAZ) {
                      tours.sort((a, b) => a.name.toLowerCase().compareTo(b.name.toLowerCase()));
                    }

                    if (tours.isEmpty) {
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
                    
                    return ListView.builder(
                      padding: EdgeInsets.only(top: 0),
                      itemCount: tours.length,
                      itemBuilder: (context, index) {
                        final tour = tours[index];
                        print('Tour imageUrl: \u001b[200m\u001b[200m[200m${tour.imageUrl}');
                        return Card(
                          margin: EdgeInsets.fromLTRB(16, index == 0 ? 0 : 10, 16, 10),
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
                                        height: 250,
                                        fit: BoxFit.cover,
                                        errorBuilder: (context, error, stackTrace) {
                                          return Container(
                                            width: double.infinity,
                                            height: 250,
                                            color: Colors.grey[200],
                                            child: Icon(Icons.image_not_supported, size: 60, color: Colors.grey),
                                          );
                                        },
                                      )
                                    : Container(
                                        width: double.infinity,
                                        height: 250,
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
                                            print('TourId: ${tour.tourId}');
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
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
