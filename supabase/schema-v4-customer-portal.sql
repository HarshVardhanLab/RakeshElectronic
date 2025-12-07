-- Rakesh Electronics - Customer Portal Schema
-- Adds customer accounts, invoices, warranties

-- ============================================
-- TABLE: customer_accounts
-- For customer login/portal
-- ============================================
CREATE TABLE IF NOT EXISTS customer_accounts (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: invoices
-- For billing and receipts
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  
  -- Link to booking or device entry
  booking_id UUID REFERENCES bookings(id),
  device_entry_id UUID REFERENCES device_entries(id),
  
  -- Customer info
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  
  -- Items
  items JSONB NOT NULL DEFAULT '[]',
  -- Format: [{ "description": "Motor Rewinding", "qty": 1, "rate": 500, "amount": 500 }]
  
  -- Amounts
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  tax_percent NUMERIC(5,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  -- Payment
  amount_paid NUMERIC(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  payment_method TEXT,
  payment_date DATE,
  
  -- Dates
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: warranties
-- Track warranty for repairs
-- ============================================
CREATE TABLE IF NOT EXISTS warranties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Link to repair
  booking_id UUID REFERENCES bookings(id),
  device_entry_id UUID REFERENCES device_entries(id),
  invoice_id UUID REFERENCES invoices(id),
  
  -- Customer
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Device
  device_type TEXT NOT NULL,
  device_brand TEXT,
  serial_number TEXT,
  
  -- Warranty details
  warranty_days INTEGER DEFAULT 90,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  
  -- Service details
  service_description TEXT,
  technician_name TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed', 'void')),
  claim_count INTEGER DEFAULT 0,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: warranty_claims
-- Track warranty claims
-- ============================================
CREATE TABLE IF NOT EXISTS warranty_claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  warranty_id UUID REFERENCES warranties(id) NOT NULL,
  
  claim_date DATE DEFAULT CURRENT_DATE,
  issue_description TEXT NOT NULL,
  resolution TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Function to generate invoice number
-- Format: INV-YYYYMM-001
-- ============================================
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  month_count INTEGER;
  inv_number TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO month_count
  FROM invoices
  WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
  
  inv_number := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(month_count::TEXT, 3, '0');
  RETURN inv_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function to calculate warranty end date
-- ============================================
CREATE OR REPLACE FUNCTION calculate_warranty_end()
RETURNS TRIGGER AS $$
BEGIN
  NEW.end_date := NEW.start_date + (NEW.warranty_days || ' days')::INTERVAL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER warranty_end_date_trigger
  BEFORE INSERT OR UPDATE ON warranties
  FOR EACH ROW
  EXECUTE FUNCTION calculate_warranty_end();

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE customer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_claims ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Customer accounts - users can only see their own
CREATE POLICY "Users can view own account" ON customer_accounts
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own account" ON customer_accounts
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Invoices - customers see their own, admin sees all
CREATE POLICY "Customers can view own invoices" ON invoices
  FOR SELECT TO authenticated
  USING (
    customer_phone IN (
      SELECT phone FROM customer_accounts WHERE id = auth.uid()
    )
    OR 
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );

CREATE POLICY "Admin can manage invoices" ON invoices
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- Warranties - customers see their own, admin sees all
CREATE POLICY "Customers can view own warranties" ON warranties
  FOR SELECT TO authenticated
  USING (
    customer_phone IN (
      SELECT phone FROM customer_accounts WHERE id = auth.uid()
    )
    OR 
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );

CREATE POLICY "Admin can manage warranties" ON warranties
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- Warranty claims
CREATE POLICY "Customers can view own claims" ON warranty_claims
  FOR SELECT TO authenticated
  USING (
    warranty_id IN (
      SELECT w.id FROM warranties w
      JOIN customer_accounts ca ON w.customer_phone = ca.phone
      WHERE ca.id = auth.uid()
    )
  );

CREATE POLICY "Customers can create claims" ON warranty_claims
  FOR INSERT TO authenticated
  WITH CHECK (
    warranty_id IN (
      SELECT w.id FROM warranties w
      JOIN customer_accounts ca ON w.customer_phone = ca.phone
      WHERE ca.id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage claims" ON warranty_claims
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_invoices_customer_phone ON invoices(customer_phone);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_warranties_customer_phone ON warranties(customer_phone);
CREATE INDEX IF NOT EXISTS idx_warranties_end_date ON warranties(end_date);
CREATE INDEX IF NOT EXISTS idx_warranties_status ON warranties(status);
