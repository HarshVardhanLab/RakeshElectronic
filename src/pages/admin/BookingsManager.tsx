import { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Loader2,
  Printer,
  IndianRupee,
  User,
  Phone,
  Calendar,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useBookings, useUpdateBooking } from '../../hooks/useBookings';
import { toast } from 'sonner';
import type { Booking, BookingStatus, BookingPriority } from '../../types/database';

const statusConfig: Record<BookingStatus, { color: string; icon: typeof Clock }> = {
  'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'in-progress': { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function BookingsManager() {
  const { data: bookings, isLoading } = useBookings();
  const updateBooking = useUpdateBooking();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [editData, setEditData] = useState({
    status: '' as BookingStatus,
    priority: '' as BookingPriority,
    estimated_cost: 0,
    actual_cost: 0,
    technician_name: '',
    technician_phone: '',
    scheduled_date: '',
    notes: '',
  });

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditData({
      status: booking.status,
      priority: booking.priority,
      estimated_cost: booking.estimated_cost || 0,
      actual_cost: booking.actual_cost || 0,
      technician_name: booking.technician_name || '',
      technician_phone: booking.technician_phone || '',
      scheduled_date: booking.scheduled_date || '',
      notes: booking.notes || '',
    });
  };

  const handleSave = async () => {
    if (!selectedBooking) return;

    try {
      await updateBooking.mutateAsync({
        id: selectedBooking.id,
        ...editData,
        completed_date: editData.status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
      });
      toast.success('Booking updated');
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const handlePrint = (booking: Booking) => {
    const printContent = `
      <html>
        <head>
          <title>Job Card - ${booking.id.slice(0, 8).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #16a34a; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; background: #f0f0f0; padding: 5px; }
            .row { display: flex; padding: 5px 0; border-bottom: 1px solid #eee; }
            .label { width: 150px; font-weight: bold; }
            .value { flex: 1; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RAKESH ELECTRONICS</h1>
            <p>Job Card / Repair Slip</p>
          </div>
          
          <div class="section">
            <div class="section-title">Job Details</div>
            <div class="row"><span class="label">Job ID:</span><span class="value">${booking.id.slice(0, 8).toUpperCase()}</span></div>
            <div class="row"><span class="label">Date:</span><span class="value">${new Date(booking.created_at).toLocaleDateString('en-IN')}</span></div>
            <div class="row"><span class="label">Status:</span><span class="value">${booking.status.toUpperCase()}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Customer Details</div>
            <div class="row"><span class="label">Name:</span><span class="value">${booking.customer_name}</span></div>
            <div class="row"><span class="label">Phone:</span><span class="value">${booking.phone}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${booking.email || '-'}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Device Details</div>
            <div class="row"><span class="label">Device Type:</span><span class="value">${booking.device_type}</span></div>
            <div class="row"><span class="label">Brand:</span><span class="value">${booking.brand || '-'}</span></div>
            <div class="row"><span class="label">Issue:</span><span class="value">${booking.issue_description}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Service Details</div>
            <div class="row"><span class="label">Technician:</span><span class="value">${booking.technician_name || 'Not assigned'}</span></div>
            <div class="row"><span class="label">Estimated Cost:</span><span class="value">₹${booking.estimated_cost || 0}</span></div>
            <div class="row"><span class="label">Actual Cost:</span><span class="value">₹${booking.actual_cost || 0}</span></div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Rakesh Electronics!</p>
            <p>Contact: +91 98765 43210 | info@rakeshelectronics.com</p>
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by name, phone, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      {filteredBookings?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-text-muted">
            No bookings found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings?.map((booking) => {
            const StatusIcon = statusConfig[booking.status].icon;
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{booking.customer_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[booking.status].color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {booking.status}
                        </span>
                        {booking.priority === 'high' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            High Priority
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">
                            {booking.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {booking.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.created_at).toLocaleDateString('en-IN')}
                        </div>
                        <div>
                          {booking.device_type} {booking.brand && `• ${booking.brand}`}
                        </div>
                      </div>

                      {booking.technician_name && (
                        <div className="mt-2 text-sm flex items-center gap-1 text-text-muted">
                          <User className="h-3 w-3" />
                          Assigned to: {booking.technician_name}
                        </div>
                      )}

                      {(booking.estimated_cost || booking.actual_cost) && (
                        <div className="mt-2 flex gap-4 text-sm">
                          {booking.estimated_cost && (
                            <span className="text-text-muted">Est: ₹{booking.estimated_cost}</span>
                          )}
                          {booking.actual_cost && (
                            <span className="text-green-600 font-medium">Final: ₹{booking.actual_cost}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePrint(booking)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleOpenEdit(booking)}>
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Booking - {selectedBooking?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              {/* Customer Info (Read-only) */}
              <div className="bg-secondary p-3 rounded-lg text-sm">
                <p><strong>{selectedBooking.customer_name}</strong></p>
                <p>{selectedBooking.phone} • {selectedBooking.email || 'No email'}</p>
                <p className="mt-2">{selectedBooking.device_type} • {selectedBooking.brand}</p>
                <p className="text-text-muted mt-1">{selectedBooking.issue_description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editData.status}
                    onValueChange={(v: BookingStatus) => setEditData({ ...editData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={editData.priority}
                    onValueChange={(v: BookingPriority) => setEditData({ ...editData, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Technician Name</Label>
                  <Input
                    value={editData.technician_name}
                    onChange={(e) => setEditData({ ...editData, technician_name: e.target.value })}
                    placeholder="Assign technician"
                  />
                </div>
                <div>
                  <Label>Technician Phone</Label>
                  <Input
                    value={editData.technician_phone}
                    onChange={(e) => setEditData({ ...editData, technician_phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <Label>Scheduled Date</Label>
                <Input
                  type="date"
                  value={editData.scheduled_date}
                  onChange={(e) => setEditData({ ...editData, scheduled_date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Estimated Cost (₹)</Label>
                  <Input
                    type="number"
                    value={editData.estimated_cost}
                    onChange={(e) => setEditData({ ...editData, estimated_cost: parseFloat(e.target.value) || 0 })}
                    min={0}
                  />
                </div>
                <div>
                  <Label>Actual Cost (₹)</Label>
                  <Input
                    type="number"
                    value={editData.actual_cost}
                    onChange={(e) => setEditData({ ...editData, actual_cost: parseFloat(e.target.value) || 0 })}
                    min={0}
                  />
                </div>
              </div>

              <div>
                <Label>Internal Notes</Label>
                <Textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  placeholder="Private notes for staff..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateBooking.isPending}>
                  {updateBooking.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
