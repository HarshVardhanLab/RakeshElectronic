import { useState } from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  Star,
  Loader2,
  Search,
  IndianRupee,
  Wrench
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useCustomers } from '../../hooks/useCustomers';
import { useBookings } from '../../hooks/useBookings';
import type { Customer } from '../../types/database';

export default function CustomersManager() {
  const { data: customers, isLoading: loadingCustomers } = useCustomers();
  const { data: bookings } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Build customer data from bookings if customers table is empty
  const customerData = customers?.length ? customers : buildCustomersFromBookings();

  function buildCustomersFromBookings() {
    if (!bookings) return [];
    
    const customerMap = new Map<string, {
      phone: string;
      name: string;
      email?: string;
      repairs: number;
      spent: number;
    }>();

    bookings.forEach(booking => {
      const existing = customerMap.get(booking.phone);
      if (existing) {
        existing.repairs += 1;
        existing.spent += booking.actual_cost || 0;
      } else {
        customerMap.set(booking.phone, {
          phone: booking.phone,
          name: booking.customer_name,
          email: booking.email,
          repairs: 1,
          spent: booking.actual_cost || 0,
        });
      }
    });

    return Array.from(customerMap.values()).map((c, i) => ({
      id: `temp-${i}`,
      name: c.name,
      phone: c.phone,
      email: c.email,
      total_repairs: c.repairs,
      total_spent: c.spent,
      is_vip: c.repairs >= 3 || c.spent >= 5000,
      created_at: '',
      updated_at: '',
    })) as Customer[];
  }

  const filteredCustomers = customerData?.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customerBookings = selectedCustomer 
    ? bookings?.filter(b => b.phone === selectedCustomer.phone)
    : [];

  if (loadingCustomers) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customerData?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">VIP Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {customerData?.filter(c => c.is_vip).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Repeat Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {customerData?.filter(c => c.total_repairs > 1).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customers ({filteredCustomers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers?.length === 0 ? (
              <p className="text-center py-8 text-text-muted">No customers found</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredCustomers?.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCustomer?.id === customer.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{customer.name}</span>
                          {customer.is_vip && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                          {customer.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1 text-text-muted">
                          <Wrench className="h-3 w-3" />
                          {customer.total_repairs} repairs
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <IndianRupee className="h-3 w-3" />
                          {customer.total_spent.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedCustomer ? (
              <p className="text-center py-12 text-text-muted">
                Select a customer to view details
              </p>
            ) : (
              <div className="space-y-6">
                <div className="text-center pb-4 border-b">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary">
                      {selectedCustomer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                    {selectedCustomer.name}
                    {selectedCustomer.is_vip && (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    )}
                  </h3>
                  <p className="text-text-muted">{selectedCustomer.phone}</p>
                  {selectedCustomer.email && (
                    <p className="text-text-muted text-sm">{selectedCustomer.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-secondary p-4 rounded-lg">
                    <div className="text-2xl font-bold">{selectedCustomer.total_repairs}</div>
                    <div className="text-sm text-text-muted">Total Repairs</div>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{selectedCustomer.total_spent.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-text-muted">Total Spent</div>
                  </div>
                </div>

                {/* Repair History */}
                <div>
                  <h4 className="font-semibold mb-3">Repair History</h4>
                  {customerBookings?.length === 0 ? (
                    <p className="text-text-muted text-sm">No repair history</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {customerBookings?.map((booking) => (
                        <div key={booking.id} className="text-sm p-2 bg-secondary rounded">
                          <div className="flex justify-between">
                            <span>{booking.device_type}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-text-muted mt-1">
                            <span>{new Date(booking.created_at).toLocaleDateString('en-IN')}</span>
                            {booking.actual_cost && <span>₹{booking.actual_cost}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
