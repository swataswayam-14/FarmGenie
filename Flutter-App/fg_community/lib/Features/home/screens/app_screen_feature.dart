import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:provider/provider.dart';

import '../enums/app_screen_enum.dart';
import '../store/app_store.dart';
import '../widgets/bottom_navbar_widget.dart';

class AppScreenFeature extends StatelessWidget {
  const AppScreenFeature({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Observer(builder: (context) {
              final index = context.read<AppState>().currentScreenIndex;
              final screen = AppScreen.values[index];
              return screen.getScreen();
            }),
          ),
          BottomNavbarWidget(
            onTabTapped: (val) {
              context.read<AppState>().currentScreenIndex = val ?? 0;
            },
          ),
        ],
      ),
    );
  }
}
