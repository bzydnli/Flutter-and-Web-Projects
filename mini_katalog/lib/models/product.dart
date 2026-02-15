class Product {
  final int id;
  final String name; 
  final String tagline;
  final String description;
  final double price;
  final String image;
  final Map<String, String> specs;

  Product({
    required this.id,
    required this.name,
    required this.tagline,
    required this.description,
    required this.price,
    required this.image,
    required this.specs,
  });

  factory Product.fromJson(Map<String, dynamic> json) {

    String priceString = json['price'].toString();
    priceString = priceString.replaceAll('\$', '').replaceAll(',', '');
    double parsedPrice = double.tryParse(priceString) ?? 0.0;

    return Product(
      id: json['id'] ?? 0, 
      name: json['name'] ?? "İsimsiz Ürün", 
      tagline: json['tagline'] ?? "", 
      description: json['description'] ?? "Açıklama bulunamadı.",
      price: parsedPrice,
      image: json['image'] ?? "", 
      specs: Map<String, String>.from(json['specs'] ?? {}),
    );
  }
}