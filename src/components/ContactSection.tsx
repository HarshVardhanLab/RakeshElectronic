import { useState } from 'react';
import { Button } from "./ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Send,
  Settings,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitContact } from '../hooks/useContacts';

const ContactSection = () => {
  const submitContact = useSubmitContact();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await submitContact.mutateAsync({
        name: formData.name,
        email: `${formData.phone}@contact.form`, // Using phone as identifier
        phone: formData.phone,
        subject: formData.service || 'General Inquiry',
        message: formData.message,
      });

      toast.success('Message sent successfully!', {
        description: "We'll get back to you soon.",
      });

      setFormData({ name: '', phone: '', service: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message', {
        description: 'Please try again or call us directly.',
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Store',
      details: ['123 Electronics Street', 'Tech Plaza, 2nd Floor', 'Jalesar, Maharashtra 400001'],
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
            {/* Google Maps Embed */}
            <div className="card-clean rounded-xl overflow-hidden h-80 border-accent">
              <a 
                href="https://maps.app.goo.gl/qgPKTmYhbEjZZ7fT6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full h-full relative group"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.5!2d78.3!3d27.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRakesh+Electronics!5e0!3m2!1sen!2sin!4v1701878400000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rakesh Electronics Location"
                  className="pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </div>
                </div>
              </a>
            </div>

            {/* Quick Contact Form */}
            <div className="card-clean p-8 rounded-xl border-accent">
              <h3 className="text-xl font-poppins font-semibold mb-6 text-foreground">
                Quick <span className="text-primary">Message</span>
              </h3>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-text-muted focus:border-primary focus:outline-none focus:shadow-md transition-all"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-text-muted focus:border-primary focus:outline-none focus:shadow-md transition-all"
                  />
                </div>
                
                <select 
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:shadow-md transition-all"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="">Select Service</option>
                  <option value="Device Repair">Device Repair</option>
                  <option value="Product Purchase">Product Purchase</option>
                  <option value="Installation Service">Installation Service</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                
                <textarea
                  placeholder="Your Message *"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-text-muted focus:border-primary focus:outline-none focus:shadow-md transition-all resize-none"
                  required
                ></textarea>
                
                <Button variant="green" className="w-full" type="submit" disabled={submitContact.isPending}>
                  {submitContact.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4" />
                    </>
                  )}
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