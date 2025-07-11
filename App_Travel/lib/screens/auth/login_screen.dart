import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../../models/auth_models.dart';
import 'register_screen.dart';
import '../home_screen.dart';
import 'forgot_password_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:another_flushbar/flushbar.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  bool _obscurePassword = true;


  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      try {
        final response = await _authService.login(
          LoginRequest(
            email: _emailController.text,
            password: _passwordController.text,
          ),
        );
        if (!mounted) return;
        // Lấy token, role và publicId từ response
        final token = response.token;
        final role = response.role;
        final publicId = response.publicId;
        
        // Debug prints
        print('Login successful!');
        print('Token: $token');
        print('PublicId: $publicId');
        
        // Lưu vào SharedPreferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        await prefs.setString('public_id', publicId);
        await prefs.setString('user_role', role);
        await prefs.setString('email', _emailController.text);
        
        // Verify saved data
        final savedToken = prefs.getString('auth_token');
        final savedPublicId = prefs.getString('public_id');
        final savedRole = prefs.getString('user_role');
        final savedEmail = prefs.getString('email');
        print('Saved token: $savedToken');
        print('Saved publicId: $savedPublicId');
        print('Saved role: $savedRole');
        print('Saved email: $savedEmail');
        
        // Hiển thị thông báo thành công
        Flushbar(
          message: 'Đăng nhập thành công!',
          icon: Icon(Icons.check_circle, color: Colors.white),
          duration: Duration(seconds: 2),
          backgroundColor: Colors.green,
          borderRadius: BorderRadius.circular(10),
          margin: EdgeInsets.all(16),
          flushbarPosition: FlushbarPosition.TOP,
        )..show(context);
        
        Navigator.pushReplacementNamed(
          context,
          '/home',
          arguments: {
            'userRole': role,
            'email': _emailController.text,
            'loginSuccess': true, 
          },
        );
      } catch (e) {
        if (!mounted) return;
        
        // Xác định loại lỗi để hiển thị icon và màu sắc phù hợp
        String errorMessage = e.toString().replaceAll('Exception: ', '');
        IconData errorIcon = Icons.error_outline;
        Color backgroundColor = Colors.red;
        
        if (errorMessage.contains('Mật khẩu không đúng')) {
          errorIcon = Icons.lock_outline;
          backgroundColor = Colors.orange;
          // Clear password field khi sai mật khẩu
          _passwordController.clear();
        } else if (errorMessage.contains('Email không tồn tại')) {
          errorIcon = Icons.email_outlined;
          backgroundColor = Colors.red;
          // Clear cả email và password khi email không tồn tại
          _emailController.clear();
          _passwordController.clear();
        } else if (errorMessage.contains('Không thể kết nối')) {
          errorIcon = Icons.wifi_off;
          backgroundColor = Colors.grey;
        } else if (errorMessage.contains('Dữ liệu không hợp lệ')) {
          errorIcon = Icons.warning_amber_outlined;
          backgroundColor = Colors.orange;
        }
        
        Flushbar(
          message: errorMessage,
          icon: Icon(errorIcon, color: Colors.white),
          duration: Duration(seconds: 4),
          backgroundColor: backgroundColor,
          borderRadius: BorderRadius.circular(10),
          margin: EdgeInsets.all(16),
          flushbarPosition: FlushbarPosition.TOP,
          mainButton: TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Đóng', style: TextStyle(color: Colors.white)),
          ),
        )..show(context);
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FF),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Align(
                alignment: Alignment.topLeft,
                child: Padding(
                  padding: const EdgeInsets.only(top: 8, left: 8, bottom: 8),
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.orange, size: 32),
                    onPressed: () {
                      Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
                    },
                    tooltip: 'Quay lại',
                  ),
                ),
              ),
              // Logo
              SizedBox(
                width: 250,
                height: 250,
                child: Image.asset(
                  'assets/images/logo.png',
                  fit: BoxFit.contain,
                  color: Colors.orange,
                  colorBlendMode: BlendMode.srcIn,
                ),
              ),
              // const SizedBox(height: 28),
              // Card chứa form
              Card(
                elevation: 8,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18),
                ),
                margin: const EdgeInsets.symmetric(horizontal: 24),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'Đăng nhập',
                          style: theme.textTheme.headlineSmall?.copyWith(
                            color: Colors.orange,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        TextFormField(
                          controller: _emailController,
                          decoration: InputDecoration(
                            labelText: 'Email',
                            hintText: 'Nhập email',
                            prefixIcon: const Icon(Icons.person, color: Colors.grey),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Colors.white,
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Vui lòng nhập email';
                            }
                            // Kiểm tra định dạng email
                            final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                            if (!emailRegex.hasMatch(value)) {
                              return 'Email không đúng định dạng. Vui lòng kiểm tra lại.';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 18),
                        TextFormField(
                          controller: _passwordController,
                          decoration: InputDecoration(
                            labelText: 'Mật khẩu',
                            hintText: 'Nhập mật khẩu',
                            prefixIcon: const Icon(Icons.lock, color: Colors.grey),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Colors.white,
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword ? Icons.visibility_off : Icons.visibility,
                                color: Colors.grey,
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscurePassword = !_obscurePassword;
                                });
                              },
                            ),
                          ),
                          obscureText: _obscurePassword,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Vui lòng nhập mật khẩu';
                            }
                            if (value.length < 6) {
                              return 'Mật khẩu phải có ít nhất 6 ký tự';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Checkbox(
                              value: false,
                              onChanged: (_) {},
                              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            const Text('Ghi nhớ đăng nhập'),
                            const Spacer(),
                            GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) => const ForgotPasswordScreen()),
                                );
                              },
                              child: const Text(
                                'Quên mật khẩu?',
                                style: TextStyle(
                                  color: Colors.orange,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.orange,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              elevation: 0,
                            ),
                            onPressed: _isLoading ? null : _login,
                            child: _isLoading
                                ? const CircularProgressIndicator(color: Colors.white)
                                : const Text(
                                    'Đăng nhập',
                                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('Chưa có tài khoản?'),
                            TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) => const RegisterScreen()),
                                );
                              },
                              child: const Text(
                                'Đăng ký ngay',
                                style: TextStyle(
                                  color: Colors.orange,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 50),
              // Hoặc đăng nhập với
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    Row(
                      children: const [
                        Expanded(child: Divider()),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 8.0),
                          child: Text('Hoặc đăng nhập với', style: TextStyle(color: Colors.grey)),
                        ),
                        Expanded(child: Divider()),
                      ],
                    ),
                    const SizedBox(height: 50),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              side: const BorderSide(color: Colors.grey, width: 1),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            onPressed: () {},
                            icon: FaIcon(FontAwesomeIcons.google, color: Colors.red, size: 22),
                            label: const Text('Google', style: TextStyle(color: Colors.black)),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              side: const BorderSide(color: Colors.grey, width: 1),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            onPressed: () {},
                            icon: Icon(Icons.facebook, color: Color(0xFF1877F3), size: 24),
                            label: const Text('Facebook', style: TextStyle(color: Colors.black)),
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
      ),
    );
  }
} 