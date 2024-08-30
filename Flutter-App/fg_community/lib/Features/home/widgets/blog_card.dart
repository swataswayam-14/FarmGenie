import 'package:fg_community/core/App%20Icons%20Path/app_icons_path.dart';
import 'package:flutter/material.dart';
import 'package:svg_icon/svg_icon.dart';

class BlogCard extends StatelessWidget {
  final String description;
  final String title;
  const BlogCard({
    super.key,
    required this.description,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 43,
                  child: Image.network(
                    'https://media.licdn.com/dms/image/v2/D5603AQEtfdAqUkk4tw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1703661470339?e=1730332800&v=beta&t=vDu4OGj493RbDe9zVFaF_GtJwq1jnNXYV6PZZXLPHTE',
                    fit: BoxFit.contain,
                  ),
                ),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
            SizedBox(height: 16),
            Column(
              children: [
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    SvgIcon(
                      AppIcon.heart,
                      height: 28,
                      width: 28,
                    ),
                    SizedBox(width: 9),
                    SvgIcon(
                      AppIcon.reply,
                      height: 28,
                      width: 28,
                    ),
                    SizedBox(width: 9),
                    SvgIcon(
                      AppIcon.repost,
                      height: 28,
                      width: 28,
                    ),
                    SizedBox(width: 9),
                    SvgIcon(
                      AppIcon.share,
                      height: 28,
                      width: 28,
                    ),
                    SizedBox(width: 9),
                    SvgIcon(
                      AppIcon.googleTranslate,
                      height: 28,
                      width: 28,
                      color: Colors.transparent,
                    ),
                    SizedBox(width: 9),
                  ],
                )
              ],
            ),
          ],
        ),
      ),
    );
  }
}
