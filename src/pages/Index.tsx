import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import ProductsSection from "../components/ProductsSection";
import ContactSection from "../components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SE</span>
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

export default Index;
