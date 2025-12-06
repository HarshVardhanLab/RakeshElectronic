import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { 
  Fan, 
  Settings, 
  Star, 
  ShoppingCart, 
  ArrowRight,
  Wind,
  Zap,
  Loader2
} from 'lucide-react';
import { useFeaturedProducts } from '../hooks/useProducts';

const ProductsSection = () => {
  const { data: dbProducts, isLoading, error } = useFeaturedProducts();

  // Fallback static products (used when DB is not configured or empty)
  const staticProducts = [
    {
      id: '1',
      name: 'Premium Ceiling Fan',
      category: 'fans' as const,
      price: 3499,
      brand: 'Havells',
      description: 'Remote Control, LED Light, Energy Efficient',
      stock: 15,
      is_featured: true,
      is_active: true,
      created_at: '',
    },
    {
      id: '2',
      name: 'Silent Table Fan',
      category: 'fans' as const,
      price: 1899,
      brand: 'Bajaj',
      description: 'Ultra Quiet, Oscillation, Timer Function',
      stock: 20,
      is_featured: true,
      is_active: true,
      created_at: '',
    },
    {
      id: '3',
      name: 'Industrial Exhaust Fan',
      category: 'fans' as const,
      price: 2799,
      brand: 'Crompton',
      description: 'Heavy Duty, Weather Resistant, High CFM',
      stock: 10,
      is_featured: true,
      is_active: true,
      created_at: '',
    },
  ];

  // Use DB products if available, otherwise fallback to static
  const products = dbProducts && dbProducts.length > 0 ? dbProducts : staticProducts;

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-text-muted">
            <p>Unable to load products. Showing sample products.</p>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="card-clean rounded-xl overflow-hidden hover-scale group border-accent">
              {/* Product Badge */}
              {product.is_featured && (
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-48 bg-secondary overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fan className="h-20 w-20 text-primary/50" />
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="text-destructive font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-3">
                  <p className="text-sm text-text-muted mb-1 capitalize">{product.category}</p>
                  <h3 className="text-lg font-poppins font-semibold group-hover:text-primary transition-colors text-foreground">
                    {product.name}
                  </h3>
                </div>

                {/* Brand */}
                {product.brand && (
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-text-secondary">{product.brand}</span>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-poppins font-bold text-primary">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-text-muted">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant={product.stock > 0 ? "green" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
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
          <Link to="/products">
            <Button variant="light" size="lg">
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;