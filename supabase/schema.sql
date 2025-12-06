-- Rakesh Electronics Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: bookings
-- Stores repair service requests
-- ============================================
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  device_type TEXT NOT NULL,
  brand TEXT,
  issue_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  estimated_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: products
-- Stores product catalog
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fans', 'appliances', 'accessories', 'spare-parts')),
  brand TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: contacts
-- Stores contact form submissions
-- ============================================
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNCTION: Update timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for bookings
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- INDEXES for better performance
-- ============================================
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_contacts_is_read ON contacts(is_read);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
INSERT INTO products (name, description, price, category, brand, stock, is_featured, is_active) VALUES
  ('Ceiling Fan 48"', 'High-speed ceiling fan with 3-year warranty', 2499.00, 'fans', 'Havells', 15, true, true),
  ('Table Fan 16"', 'Portable table fan with oscillation', 1299.00, 'fans', 'Bajaj', 20, true, true),
  ('Exhaust Fan 12"', 'Kitchen exhaust fan with copper winding', 899.00, 'fans', 'Crompton', 10, false, true),
  ('LED Bulb 9W', 'Energy-efficient LED bulb, cool daylight', 149.00, 'appliances', 'Philips', 50, false, true),
  ('Extension Board 4-way', 'Surge protected extension board', 399.00, 'accessories', 'Anchor', 25, false, true),
  ('Capacitor 2.5MF', 'Fan capacitor for ceiling fans', 79.00, 'spare-parts', 'Generic', 100, false, true);
