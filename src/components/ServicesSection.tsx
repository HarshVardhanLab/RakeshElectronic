import React from 'react';
import { Button } from "./ui/button";
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tv, 
  Fan, 
  Settings, 
  Clock, 
  Shield, 
  CheckCircle,
  Calendar 
} from 'lucide-react';

const ServicesSection = () => {
  const repairServices = [
    {
      icon: Smartphone,
      title: 'Mobile Repairs',
      description: 'Screen replacement, battery issues, charging problems',
      features: ['Screen Repair', 'Battery Replacement', 'Charging Port Fix', 'Software Issues']
    },
    {
      icon: Laptop,
      title: 'Laptop Services', 
      description: 'Hardware upgrades, cooling solutions, performance optimization',
      features: ['Hardware Upgrade', 'Cooling System', 'Performance Boost', 'Data Recovery']
    },
    {
      icon: Monitor,
      title: 'Display Repairs',
      description: 'Monitor repairs, LED/LCD fixes, calibration services',
      features: ['Screen Replacement', 'Color Calibration', 'Connection Issues', 'Power Problems']
    },
    {
      icon: Tv,
      title: 'TV & Electronics',
      description: 'Television repairs, audio systems, home appliances',
      features: ['Smart TV Setup', 'Audio Systems', 'Remote Control', 'Cable Management']
    },
    {
      icon: Fan,
      title: 'Fan Services',
      description: 'Ceiling fans, table fans, exhaust fans repair & installation',
      features: ['Motor Repair', 'Speed Control', 'Installation', 'Maintenance']
    },
    {
      icon: Settings,
      title: 'Electrical Work',
      description: 'Wiring, switches, outlets, electrical troubleshooting',
      features: ['Home Wiring', 'Switch Repair', 'Outlet Installation', 'Safety Check']
    }
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: 'Fast Turnaround',
      description: 'Most repairs completed within 24-48 hours'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '6-month warranty on all repair services'
    },
    {
      icon: CheckCircle,
      title: 'Expert Technicians',
      description: 'Certified professionals with years of experience'
    }
  ];

  return (
    <section id="services" className="section-padding bg-surface relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6 text-foreground">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-roboto">
            Professional repair and maintenance services for all your electronic devices
          </p>
          <div className="flex items-center justify-center mt-6">
            <div className="h-px bg-primary w-24"></div>
            <Settings className="h-8 w-8 text-primary mx-4" />
            <div className="h-px bg-primary w-24"></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {repairServices.map((service, index) => (
            <div key={index} className="card-clean p-8 rounded-xl hover-scale group border-accent">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-4 group-hover:bg-primary-light transition-colors duration-200">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-poppins font-semibold mb-2 group-hover:text-primary transition-colors text-foreground">
                  {service.title}
                </h3>
                <p className="text-text-muted mb-4">{service.description}</p>
              </div>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full">
                Book Service
              </Button>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="card-clean p-8 rounded-xl border-accent">
          <h3 className="text-2xl font-poppins font-bold text-center mb-12 text-foreground">
            Why Choose <span className="text-primary">RAKESH Electronics</span>?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-poppins font-semibold mb-2 text-foreground">{item.title}</h4>
                <p className="text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="green" size="lg">
              <Calendar className="h-5 w-5" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;