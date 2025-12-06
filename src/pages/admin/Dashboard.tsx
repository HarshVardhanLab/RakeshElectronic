import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Wrench,
  Package,
  MessageSquare,
  RefreshCw,
  LogOut,
  BarChart3,
  Users,
  Settings,
  ClipboardList,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useBookings } from '../../hooks/useBookings';
import { useProducts } from '../../hooks/useProducts';
import { useContacts, useMarkContactRead } from '../../hooks/useContacts';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

// Import sub-pages
import Analytics from './Analytics';
import BookingsManager from './BookingsManager';
import ProductsManager from './ProductsManager';
import CustomersManager from './CustomersManager';
import ContactsManager from './ContactsManager';
import SettingsPage from './Settings';
import DeviceEntryManager from './DeviceEntryManager';
import { useDeviceEntries } from '../../hooks/useDeviceEntries';

type TabType = 'analytics' | 'device-entry' | 'bookings' | 'products' | 'customers' | 'contacts' | 'settings';

export default function AdminDashboard() {
  const { data: bookings, refetch: refetchBookings } = useBookings();
  const { data: products } = useProducts();
  const { data: contacts, refetch: refetchContacts } = useContacts();
  const { data: deviceEntries, refetch: refetchDevices } = useDeviceEntries();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleRefresh = () => {
    refetchBookings();
    refetchContacts();
    refetchDevices();
    toast.success('Data refreshed');
  };

  const pendingBookings = bookings?.filter((b) => b.status === 'pending').length || 0;
  const unreadContacts = contacts?.filter((c) => !c.is_read).length || 0;
  const pendingDevices = deviceEntries?.filter((d) => d.status === 'received' || d.status === 'in-repair' || d.status === 'ready').length || 0;

  const tabs: { id: TabType; label: string; icon: typeof Wrench; badge?: number }[] = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'device-entry', label: 'Device Entry', icon: ClipboardList, badge: pendingDevices },
    { id: 'bookings', label: 'Bookings', icon: Wrench, badge: pendingBookings },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'contacts', label: 'Messages', icon: MessageSquare, badge: unreadContacts },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-2 border-primary/20"
            onClick={() => setActiveTab('device-entry')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Device Entry</p>
                  <p className="text-2xl font-bold">{deviceEntries?.length || 0}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-primary/20" />
              </div>
              {pendingDevices > 0 && (
                <p className="text-xs text-orange-600 mt-1">{pendingDevices} in shop</p>
              )}
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('bookings')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Bookings</p>
                  <p className="text-2xl font-bold">{bookings?.length || 0}</p>
                </div>
                <Wrench className="h-8 w-8 text-primary/20" />
              </div>
              {pendingBookings > 0 && (
                <p className="text-xs text-yellow-600 mt-1">{pendingBookings} pending</p>
              )}
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('products')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Products</p>
                  <p className="text-2xl font-bold">{products?.length || 0}</p>
                </div>
                <Package className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('contacts')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Messages</p>
                  <p className="text-2xl font-bold">{contacts?.length || 0}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary/20" />
              </div>
              {unreadContacts > 0 && (
                <p className="text-xs text-blue-600 mt-1">{unreadContacts} unread</p>
              )}
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('customers')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Customers</p>
                  <p className="text-2xl font-bold">
                    {new Set(bookings?.map((b) => b.phone)).size || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="relative"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'device-entry' && <DeviceEntryManager />}
          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'customers' && <CustomersManager />}
          {activeTab === 'contacts' && <ContactsManager />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
