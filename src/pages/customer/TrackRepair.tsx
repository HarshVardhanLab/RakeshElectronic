import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowLeft,
  Phone,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  FileText,
  Shield,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import type { DeviceEntry, Booking, Warranty } from '../../types/database';

type RepairStatus = 'received' | 'in-repair' | 'ready' | 'delivered' | 'cancelled' | 'pending' | 'in-progress' | 'completed';

const statusConfig: Record<RepairStatus, { label: string; color: string; icon: typeof Clock; step: number }> = {
  received: { label: 'Received', color: 'bg-blue-500', icon: Package, step: 1 },
  pending: { label: 'Pending', color: 'bg-blue-500', icon: Package, step: 1 },
  'in-repair': { label: 'In Repair', color: 'bg-yellow-500', icon: Clock, step: 2 },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-500', icon: Clock, step: 2 },
  ready: { label: 'Ready for Pickup', color: 'bg-green-500', icon: CheckCircle, step: 3 },
  completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle, step: 3 },
  delivered: { label: 'Delivered', color: 'bg-gray-500', icon: Truck, step: 4 },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle, step: 0 },
};

export default function TrackRepair() {
  const [searchType, setSearchType] = useState<'serial' | 'phone'>('serial');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    deviceEntries: DeviceEntry[];
    bookings: Booking[];
    warranties: Warranty[];
  } | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a search value');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      if (searchType === 'serial') {
        // Search by serial number
        const { data: deviceEntries } = await supabase
          .from('device_entries')
          .select('*')
          .ilike('serial_number', `%${searchValue}%`);

        setResults({
          deviceEntries: deviceEntries || [],
          bookings: [],
          warranties: [],
        });
      } else {
        // Search by phone number
        const [deviceRes, bookingRes, warrantyRes] = await Promise.all([
          supabase.from('device_entries').select('*').eq('mobile_number', searchValue),
          supabase.from('bookings').select('*').eq('phone', searchValue),
          supabase.from('warranties').select('*').eq('customer_phone', searchValue),
        ]);

        setResults({
          deviceEntries: deviceRes.data || [],
          bookings: bookingRes.data || [],
          warranties: warrantyRes.data || [],
        });
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalResults = results 
    ? results.deviceEntries.length + results.bookings.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Repair</h1>
          <p className="text-text-secondary">
            Enter your serial number or phone number to check repair status
          </p>
        </div>

        {/* Search Box */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-2 mb-4">
              <Button
                variant={searchType === 'serial' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType('serial')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Serial Number
              </Button>
              <Button
                variant={searchType === 'phone' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType('phone')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder={searchType === 'serial' ? 'Enter serial number (e.g., RE241206001)' : 'Enter phone number'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {totalResults === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-text-muted mb-4" />
                  <p className="text-text-muted">No repairs found</p>
                  <p className="text-sm text-text-muted mt-2">
                    Please check your {searchType === 'serial' ? 'serial number' : 'phone number'} and try again
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-text-secondary">Found {totalResults} repair(s)</p>

                {/* Device Entries */}
                {results.deviceEntries.map((entry) => {
                  const status = statusConfig[entry.status];
                  const StatusIcon = status.icon;
                  return (
                    <Card key={entry.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="font-mono bg-secondary px-2 py-1 rounded text-sm">
                              {entry.serial_number}
                            </span>
                            {entry.device_type}
                          </CardTitle>
                          <span className={`px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 ${status.color}`}>
                            <StatusIcon className="h-4 w-4" />
                            {status.label}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Progress Steps */}
                        {entry.status !== 'cancelled' && (
                          <div className="flex items-center justify-between mb-6 px-4">
                            {['Received', 'In Repair', 'Ready', 'Delivered'].map((step, index) => {
                              const stepNum = index + 1;
                              const isActive = status.step >= stepNum;
                              const isCurrent = status.step === stepNum;
                              return (
                                <div key={step} className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-text-muted'
                                  } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                                    {stepNum}
                                  </div>
                                  <span className={`text-xs mt-1 ${isActive ? 'text-foreground' : 'text-text-muted'}`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-muted">Customer:</span>
                            <p className="font-medium">{entry.customer_name}</p>
                          </div>
                          <div>
                            <span className="text-text-muted">Received:</span>
                            <p className="font-medium">{new Date(entry.received_date).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div>
                            <span className="text-text-muted">Brand:</span>
                            <p className="font-medium">{entry.device_brand || '-'}</p>
                          </div>
                          <div>
                            <span className="text-text-muted">Estimated Cost:</span>
                            <p className="font-medium">₹{entry.estimated_cost || 'TBD'}</p>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-secondary rounded-lg">
                          <span className="text-text-muted text-sm">Problem:</span>
                          <p className="text-sm">{entry.problem_description}</p>
                        </div>

                        {entry.status === 'ready' && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium flex items-center gap-2">
                              <CheckCircle className="h-5 w-5" />
                              Your device is ready for pickup!
                            </p>
                            <p className="text-green-700 text-sm mt-1">
                              Please bring your receipt and ID to collect your device.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Bookings */}
                {results.bookings.map((booking) => {
                  const status = statusConfig[booking.status as RepairStatus] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="font-mono bg-secondary px-2 py-1 rounded text-sm">
                              {booking.id.slice(0, 8).toUpperCase()}
                            </span>
                            {booking.device_type}
                          </CardTitle>
                          <span className={`px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 ${status.color}`}>
                            <StatusIcon className="h-4 w-4" />
                            {status.label}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-muted">Customer:</span>
                            <p className="font-medium">{booking.customer_name}</p>
                          </div>
                          <div>
                            <span className="text-text-muted">Booked:</span>
                            <p className="font-medium">{new Date(booking.created_at).toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Warranties */}
                {results.warranties.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Your Warranties
                    </h2>
                    {results.warranties.map((warranty) => {
                      const isExpired = new Date(warranty.end_date) < new Date();
                      return (
                        <Card key={warranty.id} className={isExpired ? 'opacity-60' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{warranty.device_type} - {warranty.device_brand}</p>
                                <p className="text-sm text-text-muted">
                                  Valid until: {new Date(warranty.end_date).toLocaleDateString('en-IN')}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {isExpired ? 'Expired' : 'Active'}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
