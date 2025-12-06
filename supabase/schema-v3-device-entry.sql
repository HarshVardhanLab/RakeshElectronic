-- Rakesh Electronics - Device Entry Table
-- For walk-in customer device registration (like a notebook)
-- Run this AFTER schema.sql (needs update_updated_at function)

-- ============================================
-- TABLE: device_entries
-- Register devices brought in for repair
-- ============================================
CREATE TABLE IF NOT EXISTS device_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Customer Info
  customer_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  village_name TEXT,
  address TEXT,
  
  -- Device Info
  device_type TEXT NOT NULL,
  device_brand TEXT,
  device_model TEXT,
  serial_number TEXT,  -- Written by marker on device
  
  -- For Motors/Fans specific
  winding_type TEXT CHECK (winding_type IN ('copper', 'aluminium', 'other') OR winding_type IS NULL),
  motor_hp TEXT,  -- e.g., "1/4 HP", "1/2 HP"
  
  -- Problem & Service
  problem_description TEXT NOT NULL,
  accessories_received TEXT,  -- e.g., "Remote, Stand, Capacitor"
  
  -- Pricing
  estimated_cost NUMERIC(10,2),
  advance_paid NUMERIC(10,2) DEFAULT 0,
  final_cost NUMERIC(10,2),
  
  -- Status
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'in-repair', 'ready', 'delivered', 'cancelled')),
  
  -- Dates
  received_date DATE DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  delivered_date DATE,
  
  -- Internal
  technician_name TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE device_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for CRUD operations
-- ============================================

-- DROP existing policies if re-running
DROP POLICY IF EXISTS "Authenticated users can select device entries" ON device_entries;
DROP POLICY IF EXISTS "Authenticated users can insert device entries" ON device_entries;
DROP POLICY IF EXISTS "Authenticated users can update device entries" ON device_entries;
DROP POLICY IF EXISTS "Authenticated users can delete device entries" ON device_entries;
DROP POLICY IF EXISTS "Anyone can view by serial number" ON device_entries;

-- SELECT - Authenticated users can view all entries
CREATE POLICY "Authenticated users can select device entries" 
  ON device_entries FOR SELECT 
  TO authenticated 
  USING (true);

-- INSERT - Authenticated users can create entries
CREATE POLICY "Authenticated users can insert device entries" 
  ON device_entries FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- UPDATE - Authenticated users can update entries
CREATE POLICY "Authenticated users can update device entries" 
  ON device_entries FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- DELETE - Authenticated users can delete entries
CREATE POLICY "Authenticated users can delete device entries" 
  ON device_entries FOR DELETE 
  TO authenticated 
  USING (true);

-- PUBLIC - Anyone can check device status by serial (for customer lookup)
CREATE POLICY "Anyone can view by serial number" 
  ON device_entries FOR SELECT 
  TO anon 
  USING (serial_number IS NOT NULL);

-- ============================================
-- Indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_device_entries_serial ON device_entries(serial_number);
CREATE INDEX IF NOT EXISTS idx_device_entries_mobile ON device_entries(mobile_number);
CREATE INDEX IF NOT EXISTS idx_device_entries_status ON device_entries(status);
CREATE INDEX IF NOT EXISTS idx_device_entries_received ON device_entries(received_date DESC);
CREATE INDEX IF NOT EXISTS idx_device_entries_created ON device_entries(created_at DESC);

-- ============================================
-- Trigger for auto-updating updated_at
-- ============================================
-- Note: This requires the update_updated_at() function from schema.sql
-- If you haven't run schema.sql, create the function first:

-- CREATE OR REPLACE FUNCTION update_updated_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS device_entries_updated_at ON device_entries;
CREATE TRIGGER device_entries_updated_at
  BEFORE UPDATE ON device_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Function to generate next serial number
-- Format: RE + YYMMDD + 3-digit counter (e.g., RE241206001)
-- ============================================
CREATE OR REPLACE FUNCTION generate_device_serial()
RETURNS TEXT AS $$
DECLARE
  today_count INTEGER;
  serial TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO today_count
  FROM device_entries
  WHERE DATE(created_at) = CURRENT_DATE;
  
  serial := 'RE' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || LPAD(today_count::TEXT, 3, '0');
  RETURN serial;
END;
$$ LANGUAGE plpgsql;
