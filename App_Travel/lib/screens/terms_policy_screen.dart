import 'package:flutter/material.dart';

class TermsPolicyScreen extends StatelessWidget {
  const TermsPolicyScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Điều khoản & Chính sách'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSection(
              '1. Điều khoản sử dụng',
              'Bằng việc sử dụng ứng dụng Tour Du Lịch, bạn đồng ý tuân thủ các điều khoản và điều kiện sau:',
              [
                '• Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản.',
                '• Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình.',
                '• Không được sử dụng ứng dụng cho mục đích bất hợp pháp.',
                '• Không được phép sao chép, phân phối lại nội dung của ứng dụng.',
              ],
            ),
            const SizedBox(height: 24),
            _buildSection(
              '2. Chính sách bảo mật',
              'Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng:',
              [
                '• Thu thập và sử dụng thông tin cá nhân một cách hợp lý.',
                '• Không chia sẻ thông tin cá nhân với bên thứ ba mà không có sự đồng ý.',
                '• Áp dụng các biện pháp bảo mật để bảo vệ thông tin người dùng.',
                '• Người dùng có quyền truy cập và chỉnh sửa thông tin cá nhân của mình.',
              ],
            ),
            const SizedBox(height: 24),
            _buildSection(
              '3. Quyền và trách nhiệm',
              'Người dùng có các quyền và trách nhiệm sau:',
              [
                '• Quyền truy cập và sử dụng các tính năng của ứng dụng.',
                '• Quyền được bảo vệ thông tin cá nhân.',
                '• Trách nhiệm cung cấp thông tin chính xác.',
                '• Trách nhiệm bảo mật tài khoản và mật khẩu.',
              ],
            ),
            const SizedBox(height: 24),
            _buildSection(
              '4. Giới hạn trách nhiệm',
              'Chúng tôi không chịu trách nhiệm về:',
              [
                '• Các thông tin không chính xác do người dùng cung cấp.',
                '• Các thiệt hại phát sinh từ việc sử dụng ứng dụng.',
                '• Các vấn đề kỹ thuật ngoài tầm kiểm soát.',
                '• Các nội dung do người dùng đăng tải.',
              ],
            ),
            const SizedBox(height: 24),
            _buildSection(
              '5. Thay đổi điều khoản',
              'Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào:',
              [
                '• Thông báo sẽ được gửi đến người dùng khi có thay đổi quan trọng.',
                '• Việc tiếp tục sử dụng ứng dụng sau khi thay đổi đồng nghĩa với việc chấp nhận điều khoản mới.',
                '• Người dùng có thể từ chối các thay đổi bằng cách ngừng sử dụng ứng dụng.',
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String description, List<String> points) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          description,
          style: const TextStyle(
            fontSize: 16,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 12),
        ...points.map((point) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                point,
                style: const TextStyle(
                  fontSize: 15,
                  color: Colors.black87,
                ),
              ),
            )),
      ],
    );
  }
} 