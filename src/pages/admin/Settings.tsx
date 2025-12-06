import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save,
  Loader2,
  Building,
  Clock,
  IndianRupee,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { useSettings, useUpdateSetting, useServiceRates, useCreateServiceRate, useDeleteServiceRate } from '../../hooks/useSettings';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const updateSetting = useUpdateSetting();
  const { data: serviceRates, isLoading: loadingRates } = useServiceRates();
  const createRate = useCreateServiceRate();
  const deleteRate = useDeleteServiceRate();

  const [formData, setFormData] = useState({
    business_name: '',
    business_phone: '',
    business_email: '',
    business_address: '',
    working_hours_start: '',
    working_hours_end: '',
    warranty_days: '',
    gst_number: '',
    low_stock_threshold: '',
  });

  const [newRate, setNewRate] = useState({
    device_type: '',
    service_name: '',
    base_price: 0,
    description: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || '',
        business_phone: settings.business_phone || '',
        business_email: settings.business_email || '',
        business_address: settings.business_address || '',
        working_hours_start: settings.working_hours_start || '',
        working_hours_end: settings.working_hours_end || '',
        warranty_days: settings.warranty_days || '',
        gst_number: settings.gst_number || '',
        low_stock_threshold: settings.low_stock_threshold || '',
      });
    }
  }, [settings]);

  const handleSaveSetting = async (key: string, value: string) => {
    try {
      await updateSetting.mutateAsync({ key, value });
      toast.success('Setting saved');
    } catch (error) {
      toast.error('Failed to save setting');
    }
  };

  const handleSaveAll = async () => {
    try {
      for (const [key, value] of Object.entries(formData)) {
        if (settings?.[key] !== value) {
          await updateSetting.mutateAsync({ key, value });
        }
      }
      toast.success('All settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleAddRate = async () => {
    if (!newRate.device_type || !newRate.service_name || !newRate.base_price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await createRate.mutateAsync(newRate);
      toast.success('Service rate added');
      setNewRate({ device_type: '', service_name: '', base_price: 0, description: '' });
    } catch (error) {
      toast.error('Failed to add service rate');
    }
  };

  const handleDeleteRate = async (id: string) => {
    try {
      await deleteRate.mutateAsync(id);
      toast.success('Service rate deleted');
    } catch (error) {
      toast.error('Failed to delete service rate');
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group service rates by device type
  const ratesByDevice = serviceRates?.reduce((acc, rate) => {
    if (!acc[rate.device_type]) acc[rate.device_type] = [];
    acc[rate.device_type].push(rate);
    return acc;
  }, {} as Record<string, typeof serviceRates>);

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>Basic information about your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Business Name</Label>
              <Input
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="Rakesh Electronics"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={formData.business_phone}
                onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={formData.business_email}
                onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                placeholder="info@example.com"
              />
            </div>
            <div>
              <Label>GST Number</Label>
              <Input
                value={formData.gst_number}
                onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={formData.business_address}
              onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
              placeholder="Full business address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours & Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Opening Time</Label>
              <Input
                type="time"
                value={formData.working_hours_start}
                onChange={(e) => setFormData({ ...formData, working_hours_start: e.target.value })}
              />
            </div>
            <div>
              <Label>Closing Time</Label>
              <Input
                type="time"
                value={formData.working_hours_end}
                onChange={(e) => setFormData({ ...formData, working_hours_end: e.target.value })}
              />
            </div>
            <div>
              <Label>Warranty Period (Days)</Label>
              <Input
                type="number"
                value={formData.warranty_days}
                onChange={(e) => setFormData({ ...formData, warranty_days: e.target.value })}
                placeholder="90"
              />
            </div>
          </div>
          <div>
            <Label>Low Stock Alert Threshold</Label>
            <Input
              type="number"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
              placeholder="5"
              className="w-32"
            />
            <p className="text-sm text-text-muted mt-1">Alert when product stock falls below this number</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveAll} disabled={updateSetting.isPending}>
        {updateSetting.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        <Save className="h-4 w-4 mr-2" />
        Save All Settings
      </Button>

      {/* Service Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Service Rates
          </CardTitle>
          <CardDescription>Default pricing for repair services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Rate */}
          <div className="p-4 border rounded-lg bg-secondary/50">
            <h4 className="font-medium mb-3">Add New Service Rate</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Device Type (e.g., Fan)"
                value={newRate.device_type}
                onChange={(e) => setNewRate({ ...newRate, device_type: e.target.value })}
              />
              <Input
                placeholder="Service Name"
                value={newRate.service_name}
                onChange={(e) => setNewRate({ ...newRate, service_name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Base Price (₹)"
                value={newRate.base_price || ''}
                onChange={(e) => setNewRate({ ...newRate, base_price: parseFloat(e.target.value) || 0 })}
              />
              <Button onClick={handleAddRate} disabled={createRate.isPending}>
                {createRate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add
              </Button>
            </div>
          </div>

          {/* Existing Rates */}
          {loadingRates ? (
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          ) : !ratesByDevice || Object.keys(ratesByDevice).length === 0 ? (
            <p className="text-center py-4 text-text-muted">No service rates configured</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(ratesByDevice).map(([deviceType, rates]) => (
                <div key={deviceType}>
                  <h4 className="font-medium text-sm text-text-muted mb-2">{deviceType}</h4>
                  <div className="space-y-2">
                    {rates?.map((rate) => (
                      <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{rate.service_name}</span>
                          {rate.description && (
                            <p className="text-sm text-text-muted">{rate.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">₹{rate.base_price}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRate(rate.id)}
                            disabled={deleteRate.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
