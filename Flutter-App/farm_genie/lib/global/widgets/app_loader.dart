import 'package:flutter/cupertino.dart';

class AppLoader extends StatelessWidget {
  const AppLoader({super.key});
  @override
  Widget build(BuildContext context) {
    return const CupertinoActivityIndicator(
      radius: 15,
    );
  }
}