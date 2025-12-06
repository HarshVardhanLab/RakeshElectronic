import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Setting, ServiceRate, ServiceRateInsert } from '../types/database';

// Settings hooks
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key');

      if (error) throw error;
      
      // Convert to key-value object
      const settingsMap: Record<string, string> = {};
      (data as Setting[]).forEach(s => {
        settingsMap[s.key] = s.value;
      });
      return settingsMap;
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

// Service rates hooks
export function useServiceRates() {
  return useQuery({
    queryKey: ['service-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_rates')
        .select('*')
        .eq('is_active', true)
        .order('device_type');

      if (error) throw error;
      return data as ServiceRate[];
    },
  });
}

export function useCreateServiceRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rate: ServiceRateInsert) => {
      const { data, error } = await supabase
        .from('service_rates')
        .insert(rate)
        .select()
        .single();

      if (error) throw error;
      return data as ServiceRate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-rates'] });
    },
  });
}

export function useUpdateServiceRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceRate> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_rates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ServiceRate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-rates'] });
    },
  });
}

export function useDeleteServiceRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('service_rates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-rates'] });
    },
  });
}
