import 'Core/theme/app_theme.dart';
import 'Features/Home/screens/home_screen.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const FarmGenieApp());
}

class FarmGenieApp extends StatelessWidget {
  const FarmGenieApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.darkTheme,
      debugShowCheckedModeBanner: false,
      home: const HomeScreen(),
    );
  }
}

