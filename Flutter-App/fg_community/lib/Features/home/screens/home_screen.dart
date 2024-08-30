import 'package:flutter/material.dart';

import '../widgets/blog_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Page'),
      ),
      body: ListView.builder(
        itemCount: 10,
        itemBuilder: (context, index) {
          return BlogCard(
            title: 'Swata Swayam',
            description:
                "As a farmer, I'm facing a significant challenge with the unpredictable weather patterns this season. The heavy rains in early spring delayed my planting schedule, and now, as we enter the peak growing season, I'm worried about the possibility of drought. My crops, which rely on consistent moisture, are showing signs of stress, and I'm anxious about the potential yield loss. Additionally, the rising costs of fertilizers and fuel are squeezing my budget, making it even harder to manage my farm effectively. I need to find a way to adapt to these changing conditions while ensuring my family's livelihood remains secure.",
          );
        },
      ),
    );
  }
}
