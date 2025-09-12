import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  Fan, 
  Settings, 
  Star, 
  ShoppingCart, 
  ArrowRight,
  Wind,
  Power,
  Zap,
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';

const Products = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  const allProducts = [
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
      badge: 'Best Seller',
      description: 'High-quality ceiling fan with LED lighting and remote control for ultimate convenience.'
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
      badge: 'New Arrival',
      description: 'Ultra-quiet table fan perfect for bedrooms and study areas with timer functionality.'
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
      badge: 'Professional',
      description: 'Durable industrial exhaust fan designed for continuous operation in harsh conditions.'
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
      badge: 'Smart Home',
      description: 'Smart LED bulbs with app control and voice command compatibility for modern homes.'
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
      badge: 'Essential',
      description: 'Reliable voltage stabilizer to protect your appliances from power fluctuations.'
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
      badge: 'Popular',
      description: 'Multi-socket extension board with USB ports and surge protection for modern needs.'
    },
    {
      id: 7,
      name: 'Pedestal Fan',
      category: 'Pedestal Fans',
      price: '₹2,199',
      originalPrice: '₹2,799',
      rating: 4.3,
      reviews: 145,
      features: ['Adjustable Height', 'Oscillation', '3 Speed Settings', 'Stable Base'],
      inStock: true,
      badge: 'Versatile',
      description: 'Height-adjustable pedestal fan with oscillation feature for better air circulation.'
    },
    {
      id: 8,
      name: 'LED Strip Lights',
      category: 'LED Lights',
      price: '₹799',
      originalPrice: '₹1,099',
      rating: 4.7,
      reviews: 89,
      features: ['16.4ft Length', 'Cuttable', 'Adhesive Back', 'Multiple Colors'],
      inStock: true,
      badge: 'Decorative',
      description: 'Flexible LED strip lights perfect for accent lighting and decorative applications.'
    },
    {
      id: 9,
      name: 'Wall Mount Fan',
      category: 'Wall Fans',
      price: '₹1,699',
      originalPrice: '₹2,199',
      rating: 4.4,
      reviews: 67,
      features: ['Space Saving', '3 Speed Control', 'Oscillation', 'Metal Blades'],
      inStock: true,
      badge: 'Compact',
      description: 'Space-saving wall-mounted fan ideal for small rooms and commercial spaces.'
    },
    {
      id: 10,
      name: 'Power Bank',
      category: 'Accessories',
      price: '₹1,299',
      originalPrice: '₹1,699',
      rating: 4.6,
      reviews: 203,
      features: ['10000mAh', 'Fast Charging', 'Dual USB', 'LED Indicator'],
      inStock: true,
      badge: 'Portable',
      description: 'High-capacity power bank for charging mobile devices on the go.'
    },
    {
      id: 11,
      name: 'Exhaust Fan 6-inch',
      category: 'Exhaust Fans',
      price: '₹899',
      originalPrice: '₹1,199',
      rating: 4.2,
      reviews: 78,
      features: ['6-inch Size', 'Low Noise', 'Easy Installation', 'Durable Motor'],
      inStock: true,
      badge: 'Compact',
      description: 'Compact 6-inch exhaust fan perfect for bathrooms and small spaces.'
    },
    {
      id: 12,
      name: 'Smart Switch',
      category: 'Electrical',
      price: '₹599',
      originalPrice: '₹799',
      rating: 4.5,
      reviews: 156,
      features: ['WiFi Enabled', 'App Control', 'Voice Control', 'Touch Panel'],
      inStock: true,
      badge: 'Smart Home',
      description: 'WiFi-enabled smart switch for controlling lights and appliances remotely.'
    }
  ];

  const categories = [
    { name: 'All', icon: Grid, count: allProducts.length },
    { name: 'Ceiling Fans', icon: Fan, count: allProducts.filter(p => p.category === 'Ceiling Fans').length },
    { name: 'Table Fans', icon: Wind, count: allProducts.filter(p => p.category === 'Table Fans').length },
    { name: 'Pedestal Fans', icon: Wind, count: allProducts.filter(p => p.category === 'Pedestal Fans').length },
    { name: 'Wall Fans', icon: Wind, count: allProducts.filter(p => p.category === 'Wall Fans').length },
    { name: 'Exhaust Fans', icon: Wind, count: allProducts.filter(p => p.category === 'Exhaust Fans').length },
    { name: 'LED Lights', icon: Zap, count: allProducts.filter(p => p.category === 'LED Lights').length },
    { name: 'Electrical', icon: Power, count: allProducts.filter(p => p.category === 'Electrical').length },
    { name: 'Accessories', icon: Settings, count: allProducts.filter(p => p.category === 'Accessories').length }
  ];

  const filteredProducts = allProducts
    .filter(product => 
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return parseInt(a.price.replace(/[₹,]/g, '')) - parseInt(b.price.replace(/[₹,]/g, ''));
        case 'price-high':
          return parseInt(b.price.replace(/[₹,]/g, '')) - parseInt(a.price.replace(/[₹,]/g, ''));
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-poppins font-bold text-4xl text-foreground mb-4">
              {t('products.hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('products.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('products.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort and View */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="name">{t('products.sort.name')}</option>
                <option value="price-low">{t('products.sort.priceLow')}</option>
                <option value="price-high">{t('products.sort.priceHigh')}</option>
                <option value="rating">{t('products.sort.rating')}</option>
              </select>
              
              <div className="flex rounded-md border border-border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-1/4">
            <div className="sticky top-32">
              <h3 className="font-poppins font-semibold text-lg text-foreground mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                {t('products.categories.title')}
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    <div className="flex items-center">
                      <category.icon className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-bold text-foreground">
                {selectedCategory === 'All' 
                  ? t('products.results.allProducts') 
                  : `${selectedCategory}`
                } 
                <span className="text-muted-foreground ml-2">
                  ({filteredProducts.length} {t('products.results.items')})
                </span>
              </h2>
            </div>

            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`hover:shadow-lg transition-shadow ${
                    viewMode === 'list' ? 'flex-row' : ''
                  }`}
                >
                  <CardContent className={`p-6 ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                    {/* Product Image */}
                    <div className={`relative bg-muted rounded-lg flex items-center justify-center ${
                      viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'h-48 mb-4'
                    }`}>
                      <Fan className="h-16 w-16 text-primary/50" />
                      {product.badge && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge variant="default" className="text-xs">
                            {product.badge}
                          </Badge>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                          <span className="text-destructive font-semibold text-sm">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <h3 className="text-lg font-poppins font-semibold text-foreground hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        {viewMode === 'list' && (
                          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                        <span className="text-sm text-muted-foreground ml-2">({product.reviews} reviews)</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-1 mb-4">
                        {product.features.slice(0, viewMode === 'list' ? 4 : 2).map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center">
                            <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-poppins font-bold text-primary">{product.price}</span>
                          <span className="text-sm text-muted-foreground line-through ml-2">{product.originalPrice}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant={product.inStock ? "default" : "outline"} 
                            size="sm"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.inStock ? t('products.buttons.addToCart') : t('products.buttons.outOfStock')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-muted-foreground text-lg mb-2">{t('products.noResults.title')}</div>
                <p className="text-muted-foreground">{t('products.noResults.description')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="font-poppins font-bold text-primary">RAKESH ELECTRONICS</span>
            </div>
            <p className="text-text-muted text-sm max-w-md mx-auto mb-4">
              Your trusted partner for electronic repairs and premium appliances. 
              Quality service with reliable technology solutions.
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs text-text-secondary">
              <span>© 2024 RAKESH Electronics</span>
              <span>•</span>
              <span>All Rights Reserved</span>
              <span>•</span>
              <span>Made with 💚 in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Products;
