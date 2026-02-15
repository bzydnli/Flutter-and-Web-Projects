import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/data_service.dart';
import '../widgets/product_card.dart';
import 'cart_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Product> allProducts = []; 
  List<Product> displayedProducts = []; 
  
  bool isLoading = true; 

  @override
  void initState() {
    super.initState();
    _loadProducts(); 
  }


  Future<void> _loadProducts() async {
    try {
      
      final products = await DataService().fetchProducts();
      
      setState(() {
        allProducts = products;
        displayedProducts = products; 
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
    
      });
      debugPrint("Hata: $e");
    }
  }

  void _runFilter(String keyword) {
    List<Product> results = [];
    if (keyword.isEmpty) {
    
      results = allProducts;
    } else {
      
      results = allProducts
          .where((product) =>
              product.name.toLowerCase().contains(keyword.toLowerCase()))
          .toList();
    }

    setState(() {
      displayedProducts = results;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text("Discover", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.black)),
        centerTitle: false,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: IconButton(
              icon: const Icon(Icons.shopping_bag_outlined, color: Colors.black),
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const CartScreen()));
              },
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
              children: [
                const SizedBox(height: 10),
                
                TextField(
                  onChanged: (value) => _runFilter(value), 
                  decoration: InputDecoration(
                    hintText: "Search products",
                    hintStyle: TextStyle(color: Colors.grey[500]),
                    prefixIcon: Icon(Icons.search, color: Colors.grey[500]),
                    filled: true,
                    fillColor: Colors.grey[100],
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                  ),
                ),
                
                const SizedBox(height: 20),
                
                Container(
                  width: double.infinity,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    borderRadius: BorderRadius.circular(16),
                    image: const DecorationImage(
                      image: AssetImage('assets/images/banner.png'), 
                      fit: BoxFit.cover,
                    ),
                  ),              
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator()) 
                : displayedProducts.isEmpty
                    ? const Center(child: Text("No products found")) 
                    : GridView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: displayedProducts.length,
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.70, 
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                        ),
                        itemBuilder: (context, index) {
                          return ProductCard(product: displayedProducts[index]);
                        },
                      ),
          ),
        ],
      ),
    );
  }
}