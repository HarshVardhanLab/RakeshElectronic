import { 
  TrendingUp, 
  IndianRupee, 
  Wrench, 
  Clock,
  CheckCircle,
  Package,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useBookingStats, usePopularDevices, useLowStockProducts, useBookingsByDate } from '../../hooks/useAnalytics';

export default function Analytics() {
  const { data: stats, isLoading: loadingStats } = useBookingStats(30);
  const { data: popularDevices, isLoading: loadingDevices } = usePopularDevices(5);
  const { data: lowStock, isLoading: loadingStock } = useLowStockProducts(5);
  const { data: bookingTrend } = useBookingsByDate(7);

  if (loadingStats) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Bookings (30d)</CardTitle>
            <Wrench className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_bookings || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Pending</CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats?.pending_bookings || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.completed_bookings || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Revenue (30d)</CardTitle>
            <IndianRupee className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ₹{(stats?.total_revenue || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Avg: ₹{Math.round(stats?.avg_repair_cost || 0).toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDevices ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : popularDevices?.length === 0 ? (
              <p className="text-text-muted text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-3">
                {popularDevices?.map((device, index) => (
                  <div key={device.device_type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="capitalize">{device.device_type}</span>
                    </div>
                    <span className="font-semibold">{device.repair_count} repairs</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStock ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : lowStock?.length === 0 ? (
              <p className="text-green-600 text-center py-4">All products well stocked!</p>
            ) : (
              <div className="space-y-3">
                {lowStock?.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-text-muted" />
                      <span>{product.name}</span>
                    </div>
                    <span className={`font-semibold ${product.stock <= 2 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {bookingTrend?.length === 0 ? (
            <p className="text-text-muted text-center py-4">No bookings in the last 7 days</p>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {bookingTrend?.map((day) => {
                const maxCount = Math.max(...(bookingTrend?.map(d => d.count) || [1]));
                const height = (day.count / maxCount) * 100;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium">{day.count}</span>
                    <div 
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                    <span className="text-xs text-text-muted">{day.date.split('/')[0]}/{day.date.split('/')[1]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
