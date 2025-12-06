-- Rakesh Electronics Database Schema V2
-- Additional tables and columns for enhanced admin features

-- ============================================
-- Add new columns to bookings table
-- ============================================
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS technician_name TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS technician_phone TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS completed_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS warranty_until DATE;

-- ============================================
-- TABLE: customers
-- Customer management
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  total_repairs INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  is_vip BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: settings
-- Business settings
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('business_name', 'Rakesh Electronics', 'Business name'),
  ('business_phone', '+91 98765 43210', 'Primary contact number'),
  ('business_email', 'info@rakeshelectronics.com', 'Business email'),
  ('business_address', '123 Electronics Street, Tech Plaza, Jalesar', 'Business address'),
  ('working_hours_start', '09:00', 'Opening time'),
  ('working_hours_end', '20:00', 'Closing time'),
  ('working_days', 'Mon,Tue,Wed,Thu,Fri,Sat', 'Working days'),
  ('warranty_days', '90', 'Default warranty period in days'),
  ('gst_number', '', 'GST registration number'),
  ('low_stock_threshold', '5', 'Alert when stock falls below this')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- TABLE: service_rates
-- Default service pricing
-- ============================================
CREATE TABLE IF NOT EXISTS service_rates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_type TEXT NOT NULL,
  service_name TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default service rates
INSERT INTO service_rates (device_type, service_name, base_price, description) VALUES
  ('Fan', 'General Service', 200, 'Cleaning, oiling, and basic maintenance'),
  ('Fan', 'Motor Repair', 500, 'Motor rewinding or replacement'),
  ('Fan', 'Capacitor Replace', 150, 'Capacitor replacement'),
  ('Television', 'Screen Repair', 2500, 'LED/LCD panel repair'),
  ('Television', 'Board Repair', 1500, 'Main board or power board repair'),
  ('Air Conditioner', 'Gas Refill', 1500, 'Refrigerant gas refilling'),
  ('Air Conditioner', 'General Service', 500, 'Cleaning and maintenance'),
  ('Air Conditioner', 'Compressor Repair', 3500, 'Compressor repair or replacement'),
  ('Refrigerator', 'Gas Refill', 1200, 'Refrigerant gas refilling'),
  ('Refrigerator', 'Thermostat Replace', 800, 'Thermostat replacement'),
  ('Washing Machine', 'Motor Repair', 1500, 'Motor repair or replacement'),
  ('Washing Machine', 'Drum Repair', 1000, 'Drum bearing replacement')
ON CONFLICT DO NOTHING;

-- ============================================
-- TABLE: activity_log
-- Track admin activities
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Enable RLS on new tables
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policies for customers
CREATE POLICY "Authenticated users can manage customers" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies for settings
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can update settings" ON settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Policies for service_rates
CREATE POLICY "Anyone can read service rates" ON service_rates
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage service rates" ON service_rates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies for activity_log
CREATE POLICY "Authenticated users can manage activity log" ON activity_log
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_rates_device ON service_rates(device_type);

-- ============================================
-- FUNCTIONS for analytics
-- ============================================

-- Function to get booking stats
CREATE OR REPLACE FUNCTION get_booking_stats(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  total_bookings BIGINT,
  pending_bookings BIGINT,
  completed_bookings BIGINT,
  total_revenue NUMERIC,
  avg_repair_cost NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_bookings,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_bookings,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_bookings,
    COALESCE(SUM(actual_cost), 0) as total_revenue,
    COALESCE(AVG(actual_cost) FILTER (WHERE actual_cost > 0), 0) as avg_repair_cost
  FROM bookings
  WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Function to get popular devices
CREATE OR REPLACE FUNCTION get_popular_devices(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  device_type TEXT,
  repair_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT b.device_type, COUNT(*)::BIGINT as repair_count
  FROM bookings b
  GROUP BY b.device_type
  ORDER BY repair_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
