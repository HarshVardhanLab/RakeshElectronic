import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Invoice, InvoiceInsert } from '../types/database';

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    enabled: !!id,
  });
}

export function useInvoiceByNumber(invoiceNumber: string) {
  return useQuery({
    queryKey: ['invoice', 'number', invoiceNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_number', invoiceNumber)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Invoice | null;
    },
    enabled: !!invoiceNumber,
  });
}

export function useGenerateInvoiceNumber() {
  return useQuery({
    queryKey: ['generate-invoice-number'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('generate_invoice_number');
      
      if (error) {
        // Fallback
        const today = new Date();
        const month = today.toISOString().slice(0, 7).replace('-', '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INV-${month}-${random}`;
      }
      
      return data as string;
    },
    staleTime: 0,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: InvoiceInsert) => {
      // Generate invoice number if not provided
      let invoiceNumber = invoice.invoice_number;
      if (!invoiceNumber) {
        const { data } = await supabase.rpc('generate_invoice_number');
        invoiceNumber = data || `INV-${Date.now()}`;
      }

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoice,
          invoice_number: invoiceNumber,
          payment_status: invoice.amount_paid && invoice.amount_paid >= invoice.total 
            ? 'paid' 
            : invoice.amount_paid && invoice.amount_paid > 0 
              ? 'partial' 
              : 'unpaid',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Invoice> & { id: string }) => {
      // Update payment status based on amount
      if (updates.amount_paid !== undefined && updates.total !== undefined) {
        updates.payment_status = updates.amount_paid >= updates.total 
          ? 'paid' 
          : updates.amount_paid > 0 
            ? 'partial' 
            : 'unpaid';
      }

      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
