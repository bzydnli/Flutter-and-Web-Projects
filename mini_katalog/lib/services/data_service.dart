// lib/services/api_service.dart
import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/product.dart';

class DataService {
  Future<List<Product>> fetchProducts() async {
    await Future.delayed(const Duration(seconds: 1));
    final String response = await rootBundle.loadString('assets/products.json');   
    final Map<String, dynamic> jsonResponse = jsonDecode(response);
    final List<dynamic> list = jsonResponse['data'];
    
    // 5. Listeyi Product nesnelerine çevir
    return list.map((dynamic item) => Product.fromJson(item)).toList();
  }
}