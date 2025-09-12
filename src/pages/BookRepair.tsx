import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Phone, Mail, User, Wrench, MessageSquare, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import Navigation from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

// Form validation schema
const bookRepairSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  deviceType: z.string({
    required_error: "Please select a device type.",
  }),
  deviceBrand: z.string().min(1, {
    message: "Please enter the device brand.",
  }),
  deviceModel: z.string().min(1, {
    message: "Please enter the device model.",
  }),
  issue: z.string().min(10, {
    message: "Please describe the issue in at least 10 characters.",
  }),
  address: z.string().min(10, {
    message: "Please enter your complete address.",
  }),
  preferredDate: z.string().optional(),
});

type BookRepairForm = z.infer<typeof bookRepairSchema>;

const deviceTypes = [
  "Television",
  "Air Conditioner",
  "Refrigerator",
  "Washing Machine",
  "Microwave",
  "Fan",
  "Mobile Phone",
  "Laptop",
  "Speaker",
  "Other",
];

const BookRepair: React.FC = () => {
  const { t } = useTranslation();
  
  const form = useForm<BookRepairForm>({
    resolver: zodResolver(bookRepairSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      deviceType: "",
      deviceBrand: "",
      deviceModel: "",
      issue: "",
      address: "",
      preferredDate: "",
    },
  });

  const onSubmit = async (values: BookRepairForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Repair request submitted:", values);
      
      toast.success("Repair request submitted successfully!", {
        description: "We'll contact you within 24 hours to confirm your appointment.",
        duration: 5000,
      });
      
      form.reset();
    } catch (error) {
      toast.error("Failed to submit repair request", {
        description: "Please try again or contact us directly.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('buttons.backToHome', 'Back to Home')}
              </Link>
            </Button>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Wrench className="h-4 w-4" />
              Professional Repair Service
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-poppins">
              {t('bookRepair.title', 'Book Your Repair Service')}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-roboto">
              {t('bookRepair.subtitle', 'Get your electronic devices repaired by our certified technicians. Quick, reliable, and affordable service.')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins">
                    {t('bookRepair.form.title', 'Service Request Details')}
                  </CardTitle>
                  <CardDescription>
                    {t('bookRepair.form.description', 'Please fill in all the required information so we can provide you with the best service.')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Personal Information
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input placeholder="your.email@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Address *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter your complete address where the service is required"
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Please include landmark details for easy location
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Device Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          Device Information
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="deviceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Device Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select device type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {deviceTypes.map((type) => (
                                    <SelectItem key={type} value={type.toLowerCase()}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="deviceBrand"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Brand *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Samsung, LG, Sony" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deviceModel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Model *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., LED-55AU7700, RT28" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Issue Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Issue Details
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="issue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Describe the Issue *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please describe the problem in detail. For example: 'TV turns on but no display', 'AC not cooling properly', etc."
                                  rows={4}
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                The more details you provide, the better we can prepare for the service
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="preferredDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Service Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormDescription>
                                Optional - We'll try to accommodate your preferred date
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Submit Repair Request
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-poppins">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-sm text-text-secondary">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email Us</p>
                      <p className="text-sm text-text-secondary">service@rakeshelectronics.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-poppins">Our Promise</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>24-hour response guarantee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Certified technicians</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>90-day service warranty</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Transparent pricing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookRepair;
