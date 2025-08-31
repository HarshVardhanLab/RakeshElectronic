import React from 'react';
import { Button } from "./ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Send,
  Settings
} from 'lucide-react';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Store',
      details: ['123 Electronics Street', 'Tech Plaza, 2nd Floor', 'Mumbai, Maharashtra 400001'],
      action: 'Get Directions'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 98765 43210', '+91 98765 43211', 'Toll Free: 1800-123-4567'],
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@RAKESHelectronics.com', 'support@RAKESHelectronics.com', 'sales@RAKESHelectronics.com'],
      action: 'Send Email'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Sat: 9:00 AM - 8:00 PM', 'Sunday: 10:00 AM - 6:00 PM', 'Emergency: 24/7 Available'],
      action: 'Book Slot'
    }
  ];

  const socialLinks = [
    { name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500', href: '#' },
    { name: 'Facebook', icon: Send, color: 'text-blue-500', href: '#' },
    { name: 'Instagram', icon: Send, color: 'text-pink-500', href: '#' },
  ];

  return (
    <section id="contact" className="section-padding bg-surface relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6 text-foreground">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-roboto">
            Ready to fix your electronics or upgrade your home? Contact us today!
          </p>
          <div className="flex items-center justify-center mt-6">
            <div className="h-px bg-primary w-24"></div>
            <Settings className="h-8 w-8 text-primary mx-4" />
            <div className="h-px bg-primary w-24"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card-clean p-8 rounded-xl border-accent">
              <h3 className="text-2xl font-poppins font-bold mb-8 text-primary">
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                        <info.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h4 className="font-poppins font-semibold text-foreground">{info.title}</h4>
                    </div>
                    
                    <div className="space-y-1 ml-15">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-text-secondary text-sm">{detail}</p>
                      ))}
                    </div>
                    
                    <Button variant="outline" size="sm" className="ml-15">
                      {info.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="green" size="lg" className="h-16">
                <MessageCircle className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">WhatsApp Chat</div>
                  <div className="text-xs opacity-80">Instant Support</div>
                </div>
              </Button>
              
              <Button variant="light" size="lg" className="h-16">
                <Phone className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Emergency Call</div>
                  <div className="text-xs opacity-80">24/7 Available</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Map & Quick Contact */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="card-clean rounded-xl overflow-hidden h-80 border-accent">
              <div className="w-full h-full bg-secondary flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h4 className="font-poppins font-semibold text-lg mb-2 text-foreground">Interactive Map</h4>
                  <p className="text-text-muted">Click to view in Google Maps</p>
                </div>
                
                {/* Static Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="card-clean p-8 rounded-xl border-accent">
              <h3 className="text-xl font-poppins font-semibold mb-6 text-foreground">
                Quick <span className="text-primary">Message</span>
              </h3>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-text-muted focus:border-primary focus:outline-none focus:shadow-md transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-text-muted focus:border-primary focus:outline-none focus:shadow-md transition-all"
                  />
                </div>
                
                <select className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:shadow-md transition-all">
                  <option value="">Select Service</option>
                  <option value="repair">Device Repair</option>
                  <option value="purchase">Product Purchase</option>
                  <option value="installation">Installation Service</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-text-muted focus:border-primary focus:outline-none focus:shadow-md transition-all resize-none"
                ></textarea>
                
                <Button variant="green" className="w-full">
                  Send Message
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Social Media & Additional Info */}
        <div className="mt-16 card-clean p-8 rounded-xl border-accent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-poppins font-semibold mb-4 text-foreground">
                Connect With <span className="text-primary">Us</span>
              </h3>
              <p className="text-text-secondary mb-6">
                Follow us on social media for updates, tips, and exclusive offers
              </p>
              
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Button key={index} variant="outline" size="icon" className="hover:shadow-md">
                    <social.icon className={`h-5 w-5 ${social.color}`} />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="space-y-2">
                <p className="text-text-muted text-sm">Trusted by 1000+ customers</p>
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-warning text-lg">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary">4.9/5 Rating</span>
                </div>
                <p className="text-xs text-text-muted">Based on customer reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;