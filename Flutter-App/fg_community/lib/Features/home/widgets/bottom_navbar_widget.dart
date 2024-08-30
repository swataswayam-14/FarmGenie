import 'package:fg_community/Features/home/store/app_store.dart';
import 'package:fg_community/core/App%20Icons%20Path/app_icons_path.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:provider/provider.dart';
import 'package:svg_icon/svg_icon.dart';

class BottomNavbarWidget extends StatelessWidget {
  final ValueChanged<int?> onTabTapped;
  const BottomNavbarWidget({
    super.key,
    required this.onTabTapped,
  });

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (context) {
        final index = context.read<AppState>().currentScreenIndex;
        return BottomNavigationBar(
          currentIndex: index,
          onTap: onTabTapped,
          items: const [
            BottomNavigationBarItem(
              icon: SvgIcon(AppIcon.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: SvgIcon(AppIcon.search),
              label: '',
            ),
            BottomNavigationBarItem(
              icon: SvgIcon(AppIcon.heart),
              label: '',
            ),
            BottomNavigationBarItem(
              icon: SvgIcon(AppIcon.create),
              label: '',
            ),
            BottomNavigationBarItem(
              icon: SvgIcon(AppIcon.community),
              label: '',
            ),
            BottomNavigationBarItem(
              icon: SvgIcon(AppIcon.profile),
              label: '',
            ),
          ],
        );
      },
    );
  }
}
