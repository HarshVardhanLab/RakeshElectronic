import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { BookingStats, PopularDevice } from '../types/database';

export function useBookingStats(daysBack: number = 30) {
  return useQuery({
    queryKey: ['booking-stats', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_booking_stats', {
        days_back: daysBack,
      });

      if (error) {
        // Fallback to manual calculation if function doesn't exist
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);

        const { data: bookings } = await supabase
          .from('bookings')
          .select('status, actual_cost')
          .gte('created_at', startDate.toISOString());

        if (!bookings) return null;

        const stats: BookingStats = {
          total_bookings: bookings.length,
          pending_bookings: bookings.filter(b => b.status === 'pending').length,
          completed_bookings: bookings.filter(b => b.status === 'completed').length,
          total_revenue: bookings.reduce((sum, b) => sum + (b.actual_cost || 0), 0),
          avg_repair_cost: 0,
        };

        const completedWithCost = bookings.filter(b => b.actual_cost && b.actual_cost > 0);
        if (completedWithCost.length > 0) {
          stats.avg_repair_cost = stats.total_revenue / completedWithCost.length;
        }

        return stats;
      }

      return data[0] as BookingStats;
    },
  });
}

export function usePopularDevices(limit: number = 5) {
  return useQuery({
    queryKey: ['popular-devices', limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_popular_devices', {
        limit_count: limit,
      });

      if (error) {
        // Fallback to manual calculation
        const { data: bookings } = await supabase
          .from('bookings')
          .select('device_type');

        if (!bookings) return [];

        const deviceCounts: Record<string, number> = {};
        bookings.forEach(b => {
          deviceCounts[b.device_type] = (deviceCounts[b.device_type] || 0) + 1;
        });

        return Object.entries(deviceCounts)
          .map(([device_type, repair_count]) => ({ device_type, repair_count }))
          .sort((a, b) => b.repair_count - a.repair_count)
          .slice(0, limit) as PopularDevice[];
      }

      return data as PopularDevice[];
    },
  });
}

export function useRecentBookings(limit: number = 5) {
  return useQuery({
    queryKey: ['recent-bookings', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
}

export function useLowStockProducts(threshold: number = 5) {
  return useQuery({
    queryKey: ['low-stock', threshold],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .lte('stock', threshold)
        .order('stock');

      if (error) throw error;
      return data;
    },
  });
}

export function useBookingsByDate(days: number = 7) {
  return useQuery({
    queryKey: ['bookings-by-date', days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('bookings')
        .select('created_at, status')
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      if (error) throw error;

      // Group by date
      const byDate: Record<string, number> = {};
      data?.forEach(booking => {
        const date = new Date(booking.created_at).toLocaleDateString('en-IN');
        byDate[date] = (byDate[date] || 0) + 1;
      });

      return Object.entries(byDate).map(([date, count]) => ({ date, count }));
    },
  });
}
