import { useState } from 'react';
import {
  Plus,
  Search,
  Loader2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useWarranties, useExpiringWarranties, useCreateWarranty, useUpdateWarranty } from '../../hooks/useWarranties';
import { toast } from 'sonner';
import type { Warranty, WarrantyStatus } from '../../types/database';

const statusConfig: Record<WarrantyStatus, { label: string; color: string; icon: typeof Shield }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-800', icon: Clock },
  claimed: { label: 'Claimed', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  void: { label: 'Void', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function WarrantyManager() {
  const { data: warranties, isLoading } = useWarranties();
  const { data: expiringWarranties } = useExpiringWarranties(7);
  const createWarranty = useCreateWarranty();
  const updateWarranty = useUpdateWarranty();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WarrantyStatus | 'all'>('all');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    device_type: '',
    device_brand: '',
    serial_number: '',
    warranty_days: 90,
    service_description: '',
    technician_name: '',
  });

  const filteredWarranties = warranties?.filter((w) => {
    const matchesSearch =
      w.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customer_phone.includes(searchTerm) ||
      w.serial_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.device_type) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      await createWarranty.mutateAsync(formData);
      toast.success('Warranty created!');
      setIsFormOpen(false);
      setFormData({
        customer_name: '',
        customer_phone: '',
        device_type: '',
        device_brand: '',
        serial_number: '',
        warranty_days: 90,
        service_description: '',
        technician_name: '',
      });
    } catch (error) {
      toast.error('Failed to create warranty');
    }
  };

  const handleVoid = async (warranty: Warranty) => {
    try {
      await updateWarranty.mutateAsync({ id: warranty.id, status: 'void' });
      toast.success('Warranty voided');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const activeCount = warranties?.filter((w) => w.status === 'active').length || 0;

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-muted">Total Warranties</p>
            <p className="text-2xl font-bold">{warranties?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-muted">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className={expiringWarranties && expiringWarranties.length > 0 ? 'border-yellow-500' : ''}>
          <CardContent className="p-4">
            <p className="text-sm text-text-muted">Expiring Soon (7 days)</p>
            <p className="text-2xl font-bold text-yellow-600">{expiringWarranties?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Soon Alert */}
      {expiringWarranties && expiringWarranties.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="p-4">
            <h3 className="font-semibold flex items-center gap-2 text-yellow-800 mb-2">
              <AlertTriangle className="h-5 w-5" />
              Warranties Expiring Soon
            </h3>
            <div className="space-y-2">
              {expiringWarranties.slice(0, 3).map((w) => (
                <div key={w.id} className="flex justify-between text-sm">
                  <span>{w.customer_name} - {w.device_type}</span>
                  <span className="text-yellow-700">Expires: {new Date(w.end_date).toLocaleDateString('en-IN')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold">Warranties</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Warranty
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by name, phone, serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as WarrantyStatus | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="z-[200]" position="popper">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="claimed">Claimed</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Warranty List */}
      {filteredWarranties?.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-text-muted">No warranties found</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filteredWarranties?.map((warranty) => {
            const status = statusConfig[warranty.status];
            const StatusIcon = status.icon;
            const isExpired = new Date(warranty.end_date) < new Date();
            const daysLeft = Math.ceil((new Date(warranty.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <Card key={warranty.id} className={isExpired && warranty.status === 'active' ? 'border-red-300' : ''}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-medium">{warranty.device_type}</span>
                        {warranty.device_brand && <span className="text-text-muted">• {warranty.device_brand}</span>}
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="font-medium">{warranty.customer_name}</p>
                      <p className="text-sm text-text-muted">{warranty.customer_phone}</p>
                      {warranty.serial_number && (
                        <p className="text-sm font-mono text-text-muted">Serial: {warranty.serial_number}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>Start: {new Date(warranty.start_date).toLocaleDateString('en-IN')}</span>
                        <span>End: {new Date(warranty.end_date).toLocaleDateString('en-IN')}</span>
                        {warranty.status === 'active' && !isExpired && (
                          <span className={daysLeft <= 7 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                            {daysLeft} days left
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {warranty.status === 'active' && (
                        <Button variant="outline" size="sm" onClick={() => handleVoid(warranty)}>
                          Void
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Warranty Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Warranty</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Name *</Label>
                <Input value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={formData.customer_phone} onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Device Type *</Label>
                <Input value={formData.device_type} onChange={(e) => setFormData({ ...formData, device_type: e.target.value })} placeholder="e.g., Ceiling Fan" />
              </div>
              <div>
                <Label>Brand</Label>
                <Input value={formData.device_brand} onChange={(e) => setFormData({ ...formData, device_brand: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Serial Number</Label>
                <Input value={formData.serial_number} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} />
              </div>
              <div>
                <Label>Warranty Days</Label>
                <Input type="number" value={formData.warranty_days} onChange={(e) => setFormData({ ...formData, warranty_days: parseInt(e.target.value) || 90 })} />
              </div>
            </div>
            <div>
              <Label>Service Description</Label>
              <Input value={formData.service_description} onChange={(e) => setFormData({ ...formData, service_description: e.target.value })} placeholder="What was repaired?" />
            </div>
            <div>
              <Label>Technician</Label>
              <Input value={formData.technician_name} onChange={(e) => setFormData({ ...formData, technician_name: e.target.value })} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createWarranty.isPending}>
                {createWarranty.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Warranty
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
