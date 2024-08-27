import 'package:farm_genie/Features/Market%20Place/model/product_model.dart';
import 'package:farm_genie/Features/Market%20Place/screens/my_order_screen.dart';
import 'package:farm_genie/Features/Market%20Place/widgets/product_card_widget.dart';
import 'package:flutter/material.dart';

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
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () {},
          label: Text(
            'Wanna Chat and Shop?',
          ),
          icon: Icon(
            Icons.message,
          ),
        ),
        body: ListView.builder(
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
      ),
    );
  }
}
