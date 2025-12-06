import { useState } from 'react';
import {
  Plus,
  Search,
  Loader2,
  Printer,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Trash2,
  CheckCircle,
  Package,
  Clock,
  Truck,
  XCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
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
import {
  useDeviceEntries,
  useCreateDeviceEntry,
  useUpdateDeviceEntry,
  useDeleteDeviceEntry,
} from '../../hooks/useDeviceEntries';
import { toast } from 'sonner';
import type { DeviceEntry, DeviceEntryInsert, DeviceEntryStatus, WindingType } from '../../types/database';

const statusConfig: Record<DeviceEntryStatus, { label: string; color: string; icon: typeof Clock }> = {
  received: { label: 'Received', color: 'bg-blue-100 text-blue-800', icon: Package },
  'in-repair': { label: 'In Repair', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-gray-100 text-gray-800', icon: Truck },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const deviceTypes = [
  'Cooler Motor', 'Ceiling Fan', 'Table Fan', 'Exhaust Fan', 'Submersible Motor',
  'Water Pump', 'Mixer Grinder', 'Television', 'Washing Machine', 'Refrigerator',
  'Air Conditioner', 'Inverter', 'Stabilizer', 'Other'
];

const emptyForm: DeviceEntryInsert = {
  customer_name: '',
  mobile_number: '',
  village_name: '',
  device_type: '',
  device_brand: '',
  serial_number: '',
  winding_type: undefined,
  motor_hp: '',
  problem_description: '',
  accessories_received: '',
  estimated_cost: undefined,
  advance_paid: undefined,
  technician_name: '',
  notes: '',
};


export default function DeviceEntryManager() {
  const [statusFilter, setStatusFilter] = useState<DeviceEntryStatus | 'all'>('all');
  const { data: entries, isLoading } = useDeviceEntries(statusFilter);
  const createEntry = useCreateDeviceEntry();
  const updateEntry = useUpdateDeviceEntry();
  const deleteEntry = useDeleteDeviceEntry();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DeviceEntry | null>(null);
  const [formData, setFormData] = useState<DeviceEntryInsert>(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewEntry, setViewEntry] = useState<DeviceEntry | null>(null);

  const filteredEntries = entries?.filter((entry) => {
    const search = searchTerm.toLowerCase();
    return (
      entry.customer_name.toLowerCase().includes(search) ||
      entry.mobile_number.includes(search) ||
      entry.serial_number?.toLowerCase().includes(search) ||
      entry.village_name?.toLowerCase().includes(search) ||
      entry.device_type.toLowerCase().includes(search)
    );
  });

  const generateSerial = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RE${dateStr}${random}`;
  };

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setFormData({ ...emptyForm, serial_number: generateSerial() });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (entry: DeviceEntry) => {
    setEditingEntry(entry);
    setFormData({
      customer_name: entry.customer_name,
      mobile_number: entry.mobile_number,
      village_name: entry.village_name || '',
      device_type: entry.device_type,
      device_brand: entry.device_brand || '',
      serial_number: entry.serial_number || '',
      winding_type: entry.winding_type,
      motor_hp: entry.motor_hp || '',
      problem_description: entry.problem_description,
      accessories_received: entry.accessories_received || '',
      estimated_cost: entry.estimated_cost,
      advance_paid: entry.advance_paid,
      technician_name: entry.technician_name || '',
      notes: entry.notes || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.mobile_number || !formData.device_type || !formData.problem_description) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      if (editingEntry) {
        await updateEntry.mutateAsync({ id: editingEntry.id, ...formData });
        toast.success('Entry updated');
      } else {
        await createEntry.mutateAsync(formData);
        toast.success('Device registered successfully!', {
          description: `Serial: ${formData.serial_number}`,
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to save entry');
    }
  };

  const handleStatusChange = async (entry: DeviceEntry, newStatus: DeviceEntryStatus) => {
    try {
      await updateEntry.mutateAsync({ id: entry.id, status: newStatus });
      toast.success(`Status updated to ${statusConfig[newStatus].label}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry.mutateAsync(id);
      toast.success('Entry deleted');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };


  const handlePrintReceipt = (entry: DeviceEntry) => {
    const printContent = `
      <html>
        <head>
          <title>Device Receipt - ${entry.serial_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }
            .header h1 { margin: 0; font-size: 18px; }
            .header p { margin: 5px 0; font-size: 12px; }
            .serial { font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background: #f0f0f0; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #ccc; font-size: 12px; }
            .label { font-weight: bold; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; border-top: 2px dashed #000; padding-top: 10px; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RAKESH ELECTRONICS</h1>
            <p>Device Repair Receipt</p>
            <p>📞 +91 98765 43210</p>
          </div>
          
          <div class="serial">${entry.serial_number || 'N/A'}</div>
          <p style="text-align:center;font-size:10px;margin-top:-5px;">Write this number on device</p>
          
          <div class="row"><span class="label">Date:</span><span>${new Date(entry.received_date).toLocaleDateString('en-IN')}</span></div>
          <div class="row"><span class="label">Customer:</span><span>${entry.customer_name}</span></div>
          <div class="row"><span class="label">Mobile:</span><span>${entry.mobile_number}</span></div>
          <div class="row"><span class="label">Village:</span><span>${entry.village_name || '-'}</span></div>
          <div class="row"><span class="label">Device:</span><span>${entry.device_type}</span></div>
          <div class="row"><span class="label">Brand:</span><span>${entry.device_brand || '-'}</span></div>
          ${entry.winding_type ? `<div class="row"><span class="label">Winding:</span><span>${entry.winding_type}</span></div>` : ''}
          ${entry.motor_hp ? `<div class="row"><span class="label">HP:</span><span>${entry.motor_hp}</span></div>` : ''}
          <div class="row"><span class="label">Problem:</span><span>${entry.problem_description}</span></div>
          ${entry.accessories_received ? `<div class="row"><span class="label">Accessories:</span><span>${entry.accessories_received}</span></div>` : ''}
          <div class="row"><span class="label">Est. Cost:</span><span>₹${entry.estimated_cost || 'TBD'}</span></div>
          <div class="row"><span class="label">Advance:</span><span>₹${entry.advance_paid || 0}</span></div>
          
          <div class="footer">
            <p>⚠️ Please bring this receipt when collecting your device</p>
            <p>Thank you for choosing Rakesh Electronics!</p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const pendingCount = entries?.filter((e) => e.status === 'received' || e.status === 'in-repair').length || 0;
  const readyCount = entries?.filter((e) => e.status === 'ready').length || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Device Entry Register</h2>
          <p className="text-sm text-text-muted">
            {pendingCount} pending • {readyCount} ready for pickup
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by name, mobile, serial, village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as DeviceEntryStatus | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent className="z-[200]" position="popper" sideOffset={4}>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="in-repair">In Repair</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Entries List */}
      {filteredEntries?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-text-muted mb-4" />
            <p className="text-text-muted">No device entries found</p>
            <Button className="mt-4" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Register First Device
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEntries?.map((entry) => {
            const status = statusConfig[entry.status];
            const StatusIcon = status.icon;
            return (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm bg-secondary px-2 py-1 rounded font-bold">
                          {entry.serial_number || 'N/A'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                        {entry.winding_type && (
                          <span className={`px-2 py-1 rounded text-xs ${
                            entry.winding_type === 'copper' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.winding_type}
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg">{entry.customer_name}</h3>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {entry.mobile_number}
                        </span>
                        {entry.village_name && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {entry.village_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.received_date).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="font-medium">{entry.device_type}</span>
                        {entry.device_brand && <span className="text-text-muted"> • {entry.device_brand}</span>}
                        {entry.motor_hp && <span className="text-text-muted"> • {entry.motor_hp}</span>}
                      </div>

                      <p className="text-sm text-text-muted mt-1 line-clamp-1">{entry.problem_description}</p>

                      {(entry.estimated_cost || entry.advance_paid || entry.final_cost) && (
                        <div className="flex gap-4 mt-2 text-sm">
                          {entry.estimated_cost && <span>Est: ₹{entry.estimated_cost}</span>}
                          {entry.advance_paid && <span className="text-blue-600">Adv: ₹{entry.advance_paid}</span>}
                          {entry.final_cost && <span className="text-green-600 font-medium">Final: ₹{entry.final_cost}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePrintReceipt(entry)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setViewEntry(entry)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(entry)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {entry.status !== 'delivered' && entry.status !== 'cancelled' && (
                        <>
                          {entry.status === 'received' && (
                            <Button size="sm" variant="outline" onClick={() => handleStatusChange(entry, 'in-repair')}>
                              Start Repair
                            </Button>
                          )}
                          {entry.status === 'in-repair' && (
                            <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleStatusChange(entry, 'ready')}>
                              Mark Ready
                            </Button>
                          )}
                          {entry.status === 'ready' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(entry, 'delivered')}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Delivered
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}


      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Device Entry' : 'Register New Device'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Serial Number */}
            <div className="bg-secondary p-3 rounded-lg text-center">
              <Label className="text-xs text-text-muted">Serial Number (Write on device)</Label>
              <Input
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value.toUpperCase() })}
                className="text-center text-xl font-mono font-bold mt-1"
                placeholder="RE241206001"
              />
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Customer Name *</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Ram Kumar"
                />
              </div>
              <div>
                <Label>Mobile Number *</Label>
                <Input
                  value={formData.mobile_number}
                  onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <Label>Village / Area</Label>
              <Input
                value={formData.village_name}
                onChange={(e) => setFormData({ ...formData, village_name: e.target.value })}
                placeholder="Village or area name"
              />
            </div>

            {/* Device Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Device Type *</Label>
                <Select
                  value={formData.device_type}
                  onValueChange={(v) => setFormData({ ...formData, device_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] max-h-[200px]" position="popper" sideOffset={4}>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brand</Label>
                <Input
                  value={formData.device_brand}
                  onChange={(e) => setFormData({ ...formData, device_brand: e.target.value })}
                  placeholder="Crompton, Havells, etc."
                />
              </div>
            </div>

            {/* Motor specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Winding Type</Label>
                <Select
                  value={formData.winding_type || ''}
                  onValueChange={(v) => setFormData({ ...formData, winding_type: v as WindingType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select winding" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="copper">Copper (ताम्बा)</SelectItem>
                    <SelectItem value="aluminium">Aluminium (एल्युमिनियम)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Motor HP</Label>
                <Input
                  value={formData.motor_hp}
                  onChange={(e) => setFormData({ ...formData, motor_hp: e.target.value })}
                  placeholder="1/4 HP, 1/2 HP, 1 HP"
                />
              </div>
            </div>

            <div>
              <Label>Problem Description *</Label>
              <Textarea
                value={formData.problem_description}
                onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                placeholder="Describe the problem..."
                rows={2}
              />
            </div>

            <div>
              <Label>Accessories Received</Label>
              <Input
                value={formData.accessories_received}
                onChange={(e) => setFormData({ ...formData, accessories_received: e.target.value })}
                placeholder="Remote, Stand, Capacitor, etc."
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Estimated Cost (₹)</Label>
                <Input
                  type="number"
                  value={formData.estimated_cost || ''}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || undefined })}
                  placeholder="500"
                />
              </div>
              <div>
                <Label>Advance Paid (₹)</Label>
                <Input
                  type="number"
                  value={formData.advance_paid || ''}
                  onChange={(e) => setFormData({ ...formData, advance_paid: parseFloat(e.target.value) || undefined })}
                  placeholder="200"
                />
              </div>
              <div>
                <Label>Technician</Label>
                <Input
                  value={formData.technician_name}
                  onChange={(e) => setFormData({ ...formData, technician_name: e.target.value })}
                  placeholder="Assigned to"
                />
              </div>
            </div>

            <div>
              <Label>Internal Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Private notes..."
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createEntry.isPending || updateEntry.isPending}>
                {(createEntry.isPending || updateEntry.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {editingEntry ? 'Update' : 'Register Device'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      {/* View Details Dialog */}
      <Dialog open={!!viewEntry} onOpenChange={() => setViewEntry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Device Details - {viewEntry?.serial_number}</DialogTitle>
          </DialogHeader>
          {viewEntry && (
            <div className="space-y-4">
              <div className={`p-3 rounded-lg text-center ${statusConfig[viewEntry.status].color}`}>
                <span className="font-medium">{statusConfig[viewEntry.status].label}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Customer:</span>
                  <p className="font-medium">{viewEntry.customer_name}</p>
                </div>
                <div>
                  <span className="text-text-muted">Mobile:</span>
                  <p className="font-medium">{viewEntry.mobile_number}</p>
                </div>
                <div>
                  <span className="text-text-muted">Village:</span>
                  <p className="font-medium">{viewEntry.village_name || '-'}</p>
                </div>
                <div>
                  <span className="text-text-muted">Received:</span>
                  <p className="font-medium">{new Date(viewEntry.received_date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Device Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Device:</span>
                    <p className="font-medium">{viewEntry.device_type}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Brand:</span>
                    <p className="font-medium">{viewEntry.device_brand || '-'}</p>
                  </div>
                  {viewEntry.winding_type && (
                    <div>
                      <span className="text-text-muted">Winding:</span>
                      <p className="font-medium capitalize">{viewEntry.winding_type}</p>
                    </div>
                  )}
                  {viewEntry.motor_hp && (
                    <div>
                      <span className="text-text-muted">HP:</span>
                      <p className="font-medium">{viewEntry.motor_hp}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-text-muted text-sm">Problem:</span>
                <p className="mt-1">{viewEntry.problem_description}</p>
              </div>

              {viewEntry.accessories_received && (
                <div>
                  <span className="text-text-muted text-sm">Accessories:</span>
                  <p>{viewEntry.accessories_received}</p>
                </div>
              )}

              <div className="border-t pt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-secondary p-3 rounded">
                  <p className="text-xs text-text-muted">Estimated</p>
                  <p className="font-bold">₹{viewEntry.estimated_cost || '-'}</p>
                </div>
                <div className="bg-secondary p-3 rounded">
                  <p className="text-xs text-text-muted">Advance</p>
                  <p className="font-bold text-blue-600">₹{viewEntry.advance_paid || 0}</p>
                </div>
                <div className="bg-secondary p-3 rounded">
                  <p className="text-xs text-text-muted">Final</p>
                  <p className="font-bold text-green-600">₹{viewEntry.final_cost || '-'}</p>
                </div>
              </div>

              {viewEntry.notes && (
                <div className="bg-yellow-50 p-3 rounded text-sm">
                  <span className="text-text-muted">Notes:</span>
                  <p>{viewEntry.notes}</p>
                </div>
              )}

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => handlePrintReceipt(viewEntry)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" onClick={() => { setViewEntry(null); handleOpenEdit(viewEntry); }}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="text-red-600" onClick={() => { setViewEntry(null); setDeleteConfirm(viewEntry.id); }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Entry?</DialogTitle>
          </DialogHeader>
          <p className="text-text-secondary">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteEntry.isPending}
            >
              {deleteEntry.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
