import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Warranty, WarrantyInsert, WarrantyClaim } from '../types/database';

export function useWarranties() {
  return useQuery({
    queryKey: ['warranties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Warranty[];
    },
  });
}

export function useActiveWarranties() {
  return useQuery({
    queryKey: ['warranties', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('end_date', { ascending: true });

      if (error) throw error;
      return data as Warranty[];
    },
  });
}

export function useExpiringWarranties(days: number = 7) {
  return useQuery({
    queryKey: ['warranties', 'expiring', days],
    queryFn: async () => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('status', 'active')
        .gte('end_date', today.toISOString().split('T')[0])
        .lte('end_date', futureDate.toISOString().split('T')[0])
        .order('end_date', { ascending: true });

      if (error) throw error;
      return data as Warranty[];
    },
  });
}

export function useWarranty(id: string) {
  return useQuery({
    queryKey: ['warranty', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Warranty;
    },
    enabled: !!id,
  });
}

export function useWarrantyByPhone(phone: string) {
  return useQuery({
    queryKey: ['warranties', 'phone', phone],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Warranty[];
    },
    enabled: !!phone && phone.length >= 10,
  });
}

export function useCreateWarranty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (warranty: WarrantyInsert) => {
      const { data, error } = await supabase
        .from('warranties')
        .insert({
          ...warranty,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Warranty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warranties'] });
    },
  });
}

export function useUpdateWarranty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Warranty> & { id: string }) => {
      const { data, error } = await supabase
        .from('warranties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Warranty;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warranties'] });
      queryClient.invalidateQueries({ queryKey: ['warranty', data.id] });
    },
  });
}

// Warranty Claims
export function useWarrantyClaims(warrantyId: string) {
  return useQuery({
    queryKey: ['warranty-claims', warrantyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warranty_claims')
        .select('*')
        .eq('warranty_id', warrantyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WarrantyClaim[];
    },
    enabled: !!warrantyId,
  });
}

export function useCreateWarrantyClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (claim: { warranty_id: string; issue_description: string }) => {
      const { data, error } = await supabase
        .from('warranty_claims')
        .insert(claim)
        .select()
        .single();

      if (error) throw error;

      // Increment claim count on warranty
      await supabase.rpc('increment_warranty_claims', { warranty_id: claim.warranty_id });

      return data as WarrantyClaim;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warranty-claims', data.warranty_id] });
      queryClient.invalidateQueries({ queryKey: ['warranties'] });
    },
  });
}

export function useUpdateWarrantyClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, warranty_id, ...updates }: Partial<WarrantyClaim> & { id: string; warranty_id: string }) => {
      const { data, error } = await supabase
        .from('warranty_claims')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, warranty_id } as WarrantyClaim & { warranty_id: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warranty-claims', data.warranty_id] });
    },
  });
}
