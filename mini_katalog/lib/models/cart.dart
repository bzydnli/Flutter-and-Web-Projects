import 'product.dart';

class Cart {

  static List<Product> items = [];

  static void addItem(Product product) {
    items.add(product);
  }

  static void removeItem(Product product) {
    items.remove(product);
  }


  static double getTotal() {
    double total = 0;
    for (var item in items) {
      total += item.price;
    }
    return total;
  }
}