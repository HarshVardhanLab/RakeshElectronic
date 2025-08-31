import React from 'react';
import { Button } from "./ui/button";
import { ArrowRight, Settings, Wrench, Fan } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32">
          <Fan className="w-full h-full text-primary animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute bottom-32 right-20 w-24 h-24">
          <Settings className="w-full h-full text-primary animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        </div>
        <div className="absolute top-1/2 left-1/6 w-20 h-20">
          <Wrench className="w-full h-full text-primary" />
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto section-padding text-center">
        <div className="space-y-8 fade-in">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-poppins font-bold leading-tight text-foreground">
              <span className="text-primary">RAKESH</span>
              <br />
              <span className="text-text-secondary">ELECTRONICS</span>
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-primary w-16"></div>
              <Settings className="h-6 w-6 text-primary" />
              <div className="h-px bg-primary w-16"></div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-text-secondary font-roboto max-w-3xl mx-auto leading-relaxed">
            Your trusted partner for{' '}
            <span className="text-primary font-semibold">electronic repairs</span>{' '}
            and{' '}
            <span className="text-primary font-semibold">premium appliances</span>
            <br />
            Professional service with reliable solutions
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-clean p-6 rounded-lg hover-scale">
              <Fan className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-poppins font-semibold text-lg mb-2 text-foreground">Expert Repairs</h3>
              <p className="text-text-muted text-sm">Professional repair services for all electronic devices</p>
            </div>
            <div className="card-clean p-6 rounded-lg hover-scale">
              <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-poppins font-semibold text-lg mb-2 text-foreground">Quality Products</h3>
              <p className="text-text-muted text-sm">Premium fans and electrical appliances</p>
            </div>
            <div className="card-clean p-6 rounded-lg hover-scale">
              <Wrench className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-poppins font-semibold text-lg mb-2 text-foreground">Fast Service</h3>
              <p className="text-text-muted text-sm">Quick turnaround with quality guarantee</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="green" size="lg" className="group">
              Book Repair Service
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              View Products
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
            <div className="text-center">
              <div className="text-3xl font-poppins font-bold text-primary">1000+</div>
              <div className="text-text-secondary text-sm">Repairs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-poppins font-bold text-primary">5★</div>
              <div className="text-text-secondary text-sm">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-poppins font-bold text-primary">24/7</div>
              <div className="text-text-secondary text-sm">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;