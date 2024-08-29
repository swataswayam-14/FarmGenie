import 'package:fg_community/Features/home/screens/app_screen_feature.dart';
import 'package:fg_community/Features/home/store/app_store.dart';
import 'package:fg_community/core/AppTheme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(Provider(create: (_) => AppState(), child: const FarmCommunityApp(),),);
}

class FarmCommunityApp extends StatelessWidget {
  const FarmCommunityApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: AppScreenFeature(),
    );
  }
}
