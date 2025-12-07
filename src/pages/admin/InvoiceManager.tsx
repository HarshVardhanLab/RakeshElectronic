import { useState } from 'react';
import {
  Plus,
  Search,
  Loader2,
  Printer,
  FileText,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertCircle,
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
import { useInvoices, useCreateInvoice, useUpdateInvoice } from '../../hooks/useInvoices';
import { toast } from 'sonner';
import type { Invoice, InvoiceItem, PaymentStatus } from '../../types/database';

const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string; icon: typeof Clock }> = {
  unpaid: { label: 'Unpaid', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  partial: { label: 'Partial', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};

const emptyItem: InvoiceItem = { description: '', qty: 1, rate: 0, amount: 0 };

export default function InvoiceManager() {
  const { data: invoices, isLoading } = useInvoices();
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    items: [{ ...emptyItem }] as InvoiceItem[],
    discount: 0,
    tax_percent: 0,
    amount_paid: 0,
    payment_method: '',
    notes: '',
  });

  const filteredInvoices = invoices?.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || inv.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal - formData.discount) * (formData.tax_percent / 100);
    const total = subtotal - formData.discount + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'qty' || field === 'rate') {
      newItems[index].amount = newItems[index].qty * newItems[index].rate;
    }
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { ...emptyItem }] });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone) {
      toast.error('Please fill customer details');
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();

    try {
      await createInvoice.mutateAsync({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        items: formData.items.filter(i => i.description),
        subtotal,
        discount: formData.discount,
        tax_percent: formData.tax_percent,
        tax_amount: taxAmount,
        total,
        amount_paid: formData.amount_paid,
        payment_method: formData.payment_method,
        notes: formData.notes,
      });
      toast.success('Invoice created!');
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      items: [{ ...emptyItem }],
      discount: 0,
      tax_percent: 0,
      amount_paid: 0,
      payment_method: '',
      notes: '',
    });
  };

  const handlePrint = (invoice: Invoice) => {
    const printContent = `
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #16a34a; margin: 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .info-box { background: #f5f5f5; padding: 15px; border-radius: 8px; }
            .info-box h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f5f5f5; }
            .totals { text-align: right; }
            .totals .row { display: flex; justify-content: flex-end; gap: 50px; padding: 5px 0; }
            .totals .total { font-size: 18px; font-weight: bold; color: #16a34a; border-top: 2px solid #16a34a; padding-top: 10px; }
            .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RAKESH ELECTRONICS</h1>
            <p>Tax Invoice</p>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <h3>INVOICE TO</h3>
              <p><strong>${invoice.customer_name}</strong></p>
              <p>${invoice.customer_phone}</p>
              <p>${invoice.customer_address || ''}</p>
            </div>
            <div class="info-box">
              <h3>INVOICE DETAILS</h3>
              <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
              <p><strong>Date:</strong> ${new Date(invoice.invoice_date).toLocaleDateString('en-IN')}</p>
              <p><strong>Status:</strong> ${invoice.payment_status.toUpperCase()}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${item.description}</td>
                  <td>${item.qty}</td>
                  <td>₹${item.rate}</td>
                  <td>₹${item.amount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="row"><span>Subtotal:</span><span>₹${invoice.subtotal}</span></div>
            ${invoice.discount ? `<div class="row"><span>Discount:</span><span>-₹${invoice.discount}</span></div>` : ''}
            ${invoice.tax_amount ? `<div class="row"><span>Tax (${invoice.tax_percent}%):</span><span>₹${invoice.tax_amount}</span></div>` : ''}
            <div class="row total"><span>Total:</span><span>₹${invoice.total}</span></div>
            <div class="row"><span>Paid:</span><span>₹${invoice.amount_paid}</span></div>
            <div class="row"><span>Balance:</span><span>₹${invoice.total - invoice.amount_paid}</span></div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Rakesh Electronics | +91 98765 43210 | info@rakeshelectronics.com</p>
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

  const handleMarkPaid = async (invoice: Invoice) => {
    try {
      await updateInvoice.mutateAsync({
        id: invoice.id,
        amount_paid: invoice.total,
        payment_status: 'paid',
        payment_date: new Date().toISOString().split('T')[0],
      });
      toast.success('Marked as paid');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();
  const totalRevenue = invoices?.reduce((sum, inv) => sum + inv.amount_paid, 0) || 0;
  const pendingAmount = invoices?.reduce((sum, inv) => sum + (inv.total - inv.amount_paid), 0) || 0;

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-muted">Total Invoices</p>
            <p className="text-2xl font-bold">{invoices?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-muted">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-muted">Pending Amount</p>
            <p className="text-2xl font-bold text-red-600">₹{pendingAmount.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by invoice #, name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PaymentStatus | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="z-[200]" position="popper">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice List */}
      {filteredInvoices?.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-text-muted">No invoices found</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filteredInvoices?.map((invoice) => {
            const status = paymentStatusConfig[invoice.payment_status];
            const StatusIcon = status.icon;
            return (
              <Card key={invoice.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold">{invoice.invoice_number}</span>
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="font-medium">{invoice.customer_name}</p>
                      <p className="text-sm text-text-muted">{invoice.customer_phone} • {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>Total: <strong>₹{invoice.total}</strong></span>
                        <span>Paid: <strong className="text-green-600">₹{invoice.amount_paid}</strong></span>
                        {invoice.total - invoice.amount_paid > 0 && (
                          <span>Due: <strong className="text-red-600">₹{invoice.total - invoice.amount_paid}</strong></span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePrint(invoice)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      {invoice.payment_status !== 'paid' && (
                        <Button size="sm" onClick={() => handleMarkPaid(invoice)}>
                          Mark Paid
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

      {/* Create Invoice Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Customer Name *</Label>
                <Input value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={formData.customer_phone} onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input value={formData.customer_address} onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })} />
            </div>

            {/* Items */}
            <div>
              <Label>Items</Label>
              <div className="space-y-2 mt-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <Input className="col-span-5" placeholder="Description" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} />
                    <Input className="col-span-2" type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)} />
                    <Input className="col-span-2" type="number" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)} />
                    <span className="col-span-2 text-right font-medium">₹{item.amount}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} className="col-span-1">×</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addItem}>+ Add Item</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Discount (₹)</Label>
                <Input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Tax %</Label>
                <Input type="number" value={formData.tax_percent} onChange={(e) => setFormData({ ...formData, tax_percent: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Amount Paid (₹)</Label>
                <Input type="number" value={formData.amount_paid} onChange={(e) => setFormData({ ...formData, amount_paid: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(v) => setFormData({ ...formData, payment_method: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="z-[200]" position="popper">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-secondary p-4 rounded-lg text-right space-y-1">
              <p>Subtotal: ₹{subtotal}</p>
              {formData.discount > 0 && <p>Discount: -₹{formData.discount}</p>}
              {formData.tax_percent > 0 && <p>Tax ({formData.tax_percent}%): ₹{taxAmount.toFixed(2)}</p>}
              <p className="text-xl font-bold text-primary">Total: ₹{total.toFixed(2)}</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createInvoice.isPending}>
                {createInvoice.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
