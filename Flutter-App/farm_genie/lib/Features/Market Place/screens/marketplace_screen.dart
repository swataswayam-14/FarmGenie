import 'package:farm_genie/Features/Home/store/app_store.dart';
import 'package:farm_genie/Features/Market%20Place/model/product_model.dart';
import 'package:farm_genie/Features/Market%20Place/screens/my_order_screen.dart';
import 'package:farm_genie/Features/Market%20Place/widgets/product_card_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:provider/provider.dart';

class MarketplaceScreen extends StatelessWidget {
  const MarketplaceScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: Text(
            'Market Place',
          ),
          actions: <Widget>[
            PopupMenuButton<String>(
              onSelected: (String result) {
                if (result == 'My Orders') {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const MyOrderScreen(),
                    ),
                  );
                }

                if (result == 'Products') {}
              },
              itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
                // const PopupMenuItem<String>(
                //   value: 'Home',
                //   child: Text('Home'),
                // ),
                const PopupMenuItem<String>(
                  value: 'Products',
                  child: Text('Products'),
                ),
                const PopupMenuItem<String>(
                  value: 'My Orders',
                  child: Text('My Orders'),
                ),
              ],
            ),
          ],
        ),
        floatingActionButton: Observer(builder: (context) {
          final isChatOpen =
              context.read<AppState>().marketPlaceStore.isChatBotOpen;
          if (isChatOpen) {
            return SizedBox();
          }
          return FloatingActionButton.extended(
            onPressed: () {
              context.read<AppState>().marketPlaceStore.isChatBotOpen = true;
            },
            label: Text(
              'Wanna Chat and Shop?',
            ),
            icon: Icon(
              Icons.message,
            ),
          );
        }),
        body: Stack(
          children: [
            ListView.builder(
              itemCount: 10,
              itemBuilder: (context, index) {
                // final product = list[index];
                return ProductCard(
                  product: ProductModel(
                    title: 'Organic Manure',
                    price: 23,
                    description:
                        'Organic manure is a natural, sustainable solution for enhancing soil fertility and promoting healthy plant growth. It is made from decomposed plant matter, animal waste, and beneficial microorganisms, ensuring a pure and natural product. Organi',
                    imageUrl:
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3MuQqOBPaxDzquAhVSLshyGqaQXqPCbSDeQ&s',
                  ),
                );
              },
            ),
            Observer(builder: (context) {
              final isChatOpen =
                  context.read<AppState>().marketPlaceStore.isChatBotOpen;
              if (!isChatOpen) {
                return SizedBox();
              }
              return Positioned(
                right: 20,
                bottom: 20,
                child: Container(
                  width: 300,
                  height: 400,
                  decoration: BoxDecoration(
                    // color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        // color: Colors.grey.withOpacity(0.5),
                        spreadRadius: 2,
                        blurRadius: 5,
                        offset: Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Chat header
                      Container(
                        padding: EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          // color: Colors.blue[100],
                          borderRadius:
                              BorderRadius.vertical(top: Radius.circular(12)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Chat with Us!'),
                            IconButton(
                              icon: Icon(Icons.close),
                              onPressed: () {
                                context
                                    .read<AppState>()
                                    .marketPlaceStore
                                    .isChatBotOpen = false;
                              },
                            ),
                          ],
                        ),
                      ),

                      // Chat messages would go here
                      Expanded(
                        child: Container(
                            // Chat messages list
                            ),
                      ),

                      // Message input
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Row(
                          children: [
                            Expanded(
                              child: TextField(
                                // controller: _messageController,
                                decoration: InputDecoration(
                                  hintText: 'Type your message...',
                                  border: OutlineInputBorder(),
                                ),
                              ),
                            ),
                            SizedBox(width: 8),
                            ElevatedButton(
                              child: Icon(Icons.send),
                              onPressed: () {
                                // Send message logic
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
