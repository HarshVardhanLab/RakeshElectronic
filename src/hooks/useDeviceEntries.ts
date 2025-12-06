import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { DeviceEntry, DeviceEntryInsert, DeviceEntryStatus } from '../types/database';

// Fetch all device entries
export function useDeviceEntries(status?: DeviceEntryStatus | 'all') {
  return useQuery({
    queryKey: ['device-entries', status],
    queryFn: async () => {
      let query = supabase
        .from('device_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DeviceEntry[];
    },
  });
}

// Fetch single device entry by ID
export function useDeviceEntry(id: string) {
  return useQuery({
    queryKey: ['device-entry', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('device_entries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as DeviceEntry;
    },
    enabled: !!id,
  });
}

// Search device by serial number (for customer lookup)
export function useDeviceBySerial(serialNumber: string) {
  return useQuery({
    queryKey: ['device-entry', 'serial', serialNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('device_entries')
        .select('*')
        .eq('serial_number', serialNumber)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as DeviceEntry | null;
    },
    enabled: !!serialNumber && serialNumber.length >= 3,
  });
}

// Generate next serial number
export function useGenerateSerial() {
  return useQuery({
    queryKey: ['generate-serial'],
    queryFn: async () => {
      // Try to use the database function first
      const { data, error } = await supabase.rpc('generate_device_serial');
      
      if (error) {
        // Fallback: generate locally
        const today = new Date();
        const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `RE${dateStr}${random}`;
      }
      
      return data as string;
    },
    staleTime: 0, // Always fetch fresh
  });
}

// Create new device entry
export function useCreateDeviceEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: DeviceEntryInsert) => {
      const { data, error } = await supabase
        .from('device_entries')
        .insert({
          ...entry,
          status: 'received',
          received_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data as DeviceEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-entries'] });
      queryClient.invalidateQueries({ queryKey: ['generate-serial'] });
    },
  });
}

// Update device entry
export function useUpdateDeviceEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DeviceEntry> & { id: string }) => {
      // If status is being set to 'delivered', set delivered_date
      if (updates.status === 'delivered' && !updates.delivered_date) {
        updates.delivered_date = new Date().toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('device_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as DeviceEntry;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['device-entries'] });
      queryClient.invalidateQueries({ queryKey: ['device-entry', data.id] });
    },
  });
}

// Delete device entry
export function useDeleteDeviceEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('device_entries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-entries'] });
    },
  });
}

// Get today's entries count
export function useTodayEntriesCount() {
  return useQuery({
    queryKey: ['device-entries', 'today-count'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('device_entries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      if (error) throw error;
      return count || 0;
    },
  });
}
