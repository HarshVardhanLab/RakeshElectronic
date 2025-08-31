import React from 'react';
import { Button } from "./ui/button";
import { 
  Fan, 
  Settings, 
  Star, 
  ShoppingCart, 
  ArrowRight,
  Wind,
  Power,
  Zap
} from 'lucide-react';

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Ceiling Fan',
      category: 'Ceiling Fans',
      price: '₹3,499',
      originalPrice: '₹4,299',
      rating: 4.8,
      reviews: 156,
      features: ['Remote Control', 'LED Light', 'Energy Efficient', '5 Speed Control'],
      inStock: true,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Silent Table Fan',
      category: 'Table Fans',
      price: '₹1,899',
      originalPrice: '₹2,399',
      rating: 4.6,
      reviews: 89,
      features: ['Ultra Quiet', 'Oscillation', 'Timer Function', 'Copper Motor'],
      inStock: true,
      badge: 'New Arrival'
    },
    {
      id: 3,
      name: 'Industrial Exhaust Fan',
      category: 'Exhaust Fans',
      price: '₹2,799',
      originalPrice: '₹3,299',
      rating: 4.7,
      reviews: 67,
      features: ['Heavy Duty', 'Weather Resistant', 'Low Maintenance', 'High CFM'],
      inStock: true,
      badge: 'Professional'
    },
    {
      id: 4,
      name: 'Smart LED Bulb Set',
      category: 'LED Lights',
      price: '₹899',
      originalPrice: '₹1,199',
      rating: 4.9,
      reviews: 234,
      features: ['App Control', '16M Colors', 'Voice Control', 'Energy Saving'],
      inStock: false,
      badge: 'Smart Home'
    },
    {
      id: 5,
      name: 'Voltage Stabilizer',
      category: 'Electrical',
      price: '₹2,299',
      originalPrice: '₹2,799',
      rating: 4.5,
      reviews: 123,
      features: ['Surge Protection', 'Digital Display', 'Auto Cut-off', 'Wide Range'],
      inStock: true,
      badge: 'Essential'
    },
    {
      id: 6,
      name: 'Extension Board',
      category: 'Accessories',
      price: '₹599',
      originalPrice: '₹799',
      rating: 4.4,
      reviews: 78,
      features: ['6 Sockets', 'USB Ports', 'Surge Protection', 'Long Cable'],
      inStock: true,
      badge: 'Popular'
    }
  ];

  const categories = [
    { name: 'Ceiling Fans', icon: Fan, count: 25 },
    { name: 'Table Fans', icon: Wind, count: 18 },
    { name: 'Electrical', icon: Zap, count: 42 },
    { name: 'Accessories', icon: Settings, count: 35 }
  ];

  return (
    <section id="products" className="section-padding bg-background relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6 text-foreground">
            Our <span className="text-primary">Products</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-roboto">
            Premium quality fans, electrical appliances, and accessories for your home and office
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category, index) => (
            <div key={index} className="card-clean p-6 rounded-xl text-center hover-scale cursor-pointer group border-accent">
              <category.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:text-primary-light transition-colors" />
              <h3 className="font-poppins font-semibold text-sm mb-1 text-foreground">{category.name}</h3>
              <p className="text-xs text-text-muted">{category.count} items</p>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="card-clean rounded-xl overflow-hidden hover-scale group border-accent">
              {/* Product Badge */}
              {product.badge && (
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {product.badge}
                  </div>
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-48 bg-secondary overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Fan className="h-20 w-20 text-primary/50" />
                </div>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="text-destructive font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-3">
                  <p className="text-sm text-text-muted mb-1">{product.category}</p>
                  <h3 className="text-lg font-poppins font-semibold group-hover:text-primary transition-colors text-foreground">
                    {product.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-warning fill-current" />
                    <span className="text-sm font-medium ml-1 text-foreground">{product.rating}</span>
                  </div>
                  <span className="text-sm text-text-muted ml-2">({product.reviews} reviews)</span>
                </div>

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {product.features.slice(0, 2).map((feature, idx) => (
                    <li key={idx} className="text-sm text-text-secondary flex items-center">
                      <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-poppins font-bold text-primary">{product.price}</span>
                    <span className="text-sm text-text-muted line-through ml-2">{product.originalPrice}</span>
                  </div>
                  <div className="text-sm text-success">
                    {Math.round(((parseInt(product.originalPrice.replace('₹', '').replace(',', '')) - parseInt(product.price.replace('₹', '').replace(',', ''))) / parseInt(product.originalPrice.replace('₹', '').replace(',', ''))) * 100)}% OFF
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant={product.inStock ? "green" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-12">
          <Button variant="light" size="lg">
            View All Products
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;