import 'package:flutter/material.dart';

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Search 🔍'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: 10,
              itemBuilder: (context, index) {
                return ListTile(
                  leading: CircleAvatar(
                    radius: 43,
                    child: Image.network(
                      'https://media.licdn.com/dms/image/v2/D5603AQEtfdAqUkk4tw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1703661470339?e=1730332800&v=beta&t=vDu4OGj493RbDe9zVFaF_GtJwq1jnNXYV6PZZXLPHTE',
                      fit: BoxFit.contain,
                    ),
                  ),
                  title: Text('Swata Swayam'),
                  subtitle: Text('@swataswayam.14'),
                  trailing: ElevatedButton(
                    onPressed: () {},
                    child: Text(
                      'View',
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
