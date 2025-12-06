# Backend Setup Guide - Rakesh Electronics

This guide covers setting up Supabase as the backend for Rakesh Electronics web application.

---

## 📋 Overview

**Backend Provider:** Supabase (PostgreSQL + Auth + REST API)

**Features to Implement:**
1. Repair Booking System
2. Product Catalog Management
3. Contact Form Submissions
4. Admin Dashboard
5. Customer Authentication (optional)

---

## 🗄️ Database Schema

### Table 1: `bookings`
Stores repair service requests from customers.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| customer_name | text | Customer's full name |
| phone | text | Contact number |
| email | text | Email address (optional) |
| device_type | text | Type of device (Fan, TV, AC, etc.) |
| brand | text | Device brand |
| issue_description | text | Problem description |
| status | text | pending / in-progress / completed / cancelled |
| priority | text | low / medium / high |
| estimated_cost | numeric | Estimated repair cost |
| actual_cost | numeric | Final cost after repair |
| notes | text | Internal notes |
| created_at | timestamptz | Booking date |
| updated_at | timestamptz | Last update |

### Table 2: `products`
Stores product catalog for the shop.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Product name |
| description | text | Product description |
| price | numeric | Selling price |
| category | text | fans / appliances / accessories |
| brand | text | Product brand |
| image_url | text | Product image URL |
| stock | integer | Available quantity |
| is_featured | boolean | Show on homepage |
| is_active | boolean | Product visibility |
| created_at | timestamptz | Date added |

### Table 3: `contacts`
Stores contact form submissions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Sender's name |
| email | text | Sender's email |
| phone | text | Phone number (optional) |
| subject | text | Message subject |
| message | text | Message content |
| is_read | boolean | Read status |
| created_at | timestamptz | Submission date |

### Table 4: `customers` (Optional)
For customer accounts and history tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (links to auth.users) |
| name | text | Customer name |
| email | text | Email address |
| phone | text | Phone number |
| address | text | Address |
| created_at | timestamptz | Registration date |

---

## 🚀 Setup Steps

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Choose organization, name it "rakesh-electronics"
5. Set a strong database password (save it!)
6. Select region closest to your users (e.g., Mumbai)
7. Wait for project to be created (~2 minutes)

### Step 2: Get API Credentials
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (safe for frontend)
3. Save these for `.env` file

### Step 3: Create Database Tables
Run the SQL commands in Supabase SQL Editor (see `supabase/schema.sql`)

### Step 4: Set Up Row Level Security (RLS)
Enable RLS policies for secure data access (see `supabase/policies.sql`)

### Step 5: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 6: Configure Environment Variables
Create `.env` file:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 7: Initialize Supabase Client
Create `src/lib/supabase.ts` with client configuration

### Step 8: Create API Hooks
Create React Query hooks for data fetching in `src/hooks/`

---

## 📁 Files to Create

```
src/
├── lib/
│   └── supabase.ts          # Supabase client
├── hooks/
│   ├── useBookings.ts       # Booking CRUD operations
│   ├── useProducts.ts       # Product queries
│   └── useContacts.ts       # Contact form submission
├── types/
│   └── database.ts          # TypeScript types for tables
├── pages/
│   └── admin/
│       ├── Dashboard.tsx    # Admin dashboard
│       ├── Bookings.tsx     # Manage bookings
│       └── Products.tsx     # Manage products
supabase/
├── schema.sql               # Database schema
└── policies.sql             # RLS policies
.env                         # Environment variables (git-ignored)
```

---

## 🔧 Implementation Tasks

### Phase 1: Core Setup
- [ ] Create Supabase project (manual step)
- [x] Set up database tables (SQL ready in supabase/schema.sql)
- [x] Configure RLS policies (SQL ready in supabase/policies.sql)
- [x] Install dependencies (@supabase/supabase-js)
- [x] Create Supabase client (src/lib/supabase.ts)
- [x] Add TypeScript types (src/types/database.ts)

### Phase 2: Booking System
- [x] Update BookRepair form to save to database
- [x] Add booking confirmation with ID
- [ ] Create booking status tracking page

### Phase 3: Product Catalog
- [x] Fetch products from database
- [x] Update ProductsSection to use real data
- [ ] Add product detail page

### Phase 4: Contact Form
- [x] Connect ContactSection form to database
- [x] Add success/error handling

### Phase 5: Admin Dashboard
- [x] Create admin routes with authentication
- [x] Build bookings management UI with status, cost, technician assignment
- [x] Build products management UI (CRUD)
- [x] Add analytics dashboard with stats and charts
- [x] Customer management with repair history
- [x] Contact messages management
- [x] Business settings configuration
- [x] Service rates management
- [x] Print job card feature
- [x] Low stock alerts

---

## 🔒 Security Considerations

1. **Never expose service_role key** in frontend
2. **Enable RLS** on all tables
3. **Validate inputs** on both client and database
4. **Use HTTPS** always
5. **Sanitize user inputs** to prevent XSS

---

---

## 🆕 V2 Features (Enhanced Admin)

Run `supabase/schema-v2.sql` after the initial setup to enable:

### New Database Tables
- `customers` - Customer management with VIP tracking
- `settings` - Business configuration
- `service_rates` - Default repair pricing
- `activity_log` - Admin activity tracking

### New Booking Fields
- `technician_name` / `technician_phone` - Assign technicians
- `scheduled_date` / `completed_date` - Date tracking
- `warranty_until` - Warranty expiry

### Admin Features
1. **Analytics Dashboard** - Stats, charts, popular devices, revenue
2. **Device Entry Register** - Walk-in customer notebook (NEW!)
   - Register devices with serial number
   - Customer info (name, mobile, village)
   - Device details (type, brand, winding type, HP)
   - Status tracking (received → in-repair → ready → delivered)
   - Print receipt for customer
   - Full CRUD operations
3. **Bookings Manager** - Full CRUD, status management, print job cards
4. **Products Manager** - Add/edit/delete products, stock management
5. **Customers Manager** - Customer list, repair history, VIP tracking
6. **Contacts Manager** - Message inbox with read/unread status
7. **Settings** - Business info, working hours, service rates

---

## 📞 Support

For issues with this setup, check:
- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
