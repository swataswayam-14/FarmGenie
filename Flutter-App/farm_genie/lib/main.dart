import 'package:farm_genie/Features/Home/store/app_store.dart';
import 'package:farm_genie/Features/Market%20Place/Store/market_place_store.dart';
import 'package:farm_genie/Features/auth/screens/login_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'Core/theme/app_theme.dart';

void main() {
  runApp(Provider(
    create: (_) => AppState(
      marketPlaceStore: MarketPlaceStore(),
    ),
    child: FarmGenieApp(),
  ));
}

class FarmGenieApp extends StatelessWidget {
  const FarmGenieApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.darkTheme,
      debugShowCheckedModeBanner: false,
      home: const LoginScreen(),
    );
  }
}
