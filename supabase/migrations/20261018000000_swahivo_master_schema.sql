-- ============================================================================
-- SWAHIVO CAR DEALERSHIP — MASTER SUPABASE SQL MIGRATION
-- Project: https://yefbfstqxxqpbqzloeod.supabase.co
-- Admin UID: 3c6a4096-d6e2-4c45-bada-45f0cbf01510
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES & ROLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin', 'seller', 'buyer')),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  city TEXT DEFAULT 'Dar es Salaam',
  address TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Set admin role for administrator UID
INSERT INTO public.profiles (user_id, role, full_name, email, is_verified)
VALUES (
  '3c6a4096-d6e2-4c45-bada-45f0cbf01510',
  'admin',
  'Swahivo Administrator',
  'admin@swahivo.com',
  true
)
ON CONFLICT (user_id) DO UPDATE 
SET role = 'admin', is_verified = true;

-- ----------------------------------------------------------------------------
-- 2. SELLER PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seller_profiles (
  seller_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  dealership_license TEXT,
  tagline TEXT DEFAULT 'Trusted Automobile Dealer in Tanzania',
  phone TEXT,
  email TEXT,
  location TEXT DEFAULT 'Dar es Salaam, Tanzania',
  rating NUMERIC(3,2) DEFAULT 4.9,
  total_sales INT DEFAULT 0,
  active_listings_count INT DEFAULT 0,
  verified_badge BOOLEAN DEFAULT true,
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. BRANDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  country TEXT,
  vehicle_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  vehicle_count INT DEFAULT 0,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. VEHICLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  vehicle_type TEXT DEFAULT 'SUV',
  condition TEXT NOT NULL DEFAULT 'Used' CHECK (condition IN ('New', 'Used', 'Pre-Owned')),
  year INT NOT NULL,
  mileage INT NOT NULL DEFAULT 0,
  fuel_type TEXT NOT NULL DEFAULT 'Petrol' CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
  transmission TEXT NOT NULL DEFAULT 'Automatic' CHECK (transmission IN ('Automatic', 'Manual')),
  engine_capacity TEXT,
  color TEXT,
  seats INT DEFAULT 5,
  doors INT DEFAULT 4,
  drive_type TEXT DEFAULT '4WD',
  vin TEXT,
  price BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TZS',
  negotiable BOOLEAN DEFAULT true,
  description TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  country TEXT DEFAULT 'Tanzania',
  region TEXT DEFAULT 'Dar es Salaam',
  city TEXT DEFAULT 'Dar es Salaam',
  location TEXT DEFAULT 'Dar es Salaam',
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'reserved', 'sold')),
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'unverified')),
  featured_status BOOLEAN DEFAULT false,
  promotion_status TEXT DEFAULT 'none',
  publication_status TEXT NOT NULL DEFAULT 'approved' CHECK (publication_status IN ('draft', 'pending_approval', 'approved', 'rejected', 'active', 'inactive', 'archived')),
  views_count INT DEFAULT 0,
  enquiries_count INT DEFAULT 0,
  primary_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. VEHICLE IMAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 7. ACCESSORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accessories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  price BIGINT NOT NULL,
  currency TEXT DEFAULT 'TZS',
  quantity INT DEFAULT 10,
  sku TEXT,
  compatibility TEXT[] DEFAULT ARRAY[]::TEXT[],
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. SERVICES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  duration TEXT DEFAULT '2 Hours',
  price BIGINT NOT NULL,
  currency TEXT DEFAULT 'TZS',
  active_status BOOLEAN DEFAULT true,
  icon_name TEXT DEFAULT 'Wrench',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9. ORDERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT DEFAULT 'Dar es Salaam',
  address TEXT,
  country TEXT DEFAULT 'Tanzania',
  product_name TEXT NOT NULL,
  product_variant TEXT,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  accessory_id UUID REFERENCES public.accessories(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'TZS',
  notes TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Confirmed', 'Completed', 'Cancelled')),
  payment_status TEXT DEFAULT 'pending_verification' CHECK (payment_status IN ('unpaid', 'pending_verification', 'paid', 'refunded')),
  timeline JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10. ENQUIRIES & MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  vehicle_title TEXT,
  vehicle_image TEXT,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Pending', 'Responded', 'Closed')),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enquiry_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11. BOOKINGS (Test Drives & Services)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT NOT NULL UNIQUE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('test_drive', 'service')),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12. FAVORITES / WISHLIST
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, vehicle_id)
);

-- ----------------------------------------------------------------------------
-- 13. REVIEWS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_avatar TEXT,
  customer_city TEXT DEFAULT 'Dar es Salaam',
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 14. NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 15. WEBSITE SETTINGS & NEWSLETTER
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) OR auth.uid() = '3c6a4096-d6e2-4c45-bada-45f0cbf01510'::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Profiles are readable by anyone" ON public.profiles;
  CREATE POLICY "Profiles are readable by anyone" ON public.profiles FOR SELECT USING (true);
  
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (
    auth.uid() = user_id OR public.is_admin()
  );
  
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (
    auth.uid() = user_id OR public.is_admin()
  );
END $$;

-- Public readable tables (Brands, Categories, Approved Vehicles, Accessories, Services, Reviews)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Brands are publicly readable" ON public.brands;
  CREATE POLICY "Brands are publicly readable" ON public.brands FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
  CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Approved vehicles are publicly readable" ON public.vehicles;
  CREATE POLICY "Approved vehicles are publicly readable" ON public.vehicles FOR SELECT USING (
    publication_status IN ('approved', 'active') OR seller_id = auth.uid() OR public.is_admin()
  );

  DROP POLICY IF EXISTS "Vehicle images are publicly readable" ON public.vehicle_images;
  CREATE POLICY "Vehicle images are publicly readable" ON public.vehicle_images FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Accessories are publicly readable" ON public.accessories;
  CREATE POLICY "Accessories are publicly readable" ON public.accessories FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Services are publicly readable" ON public.services;
  CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Approved reviews are publicly readable" ON public.reviews;
  CREATE POLICY "Approved reviews are publicly readable" ON public.reviews FOR SELECT USING (status = 'approved' OR public.is_admin());

  DROP POLICY IF EXISTS "Website settings are publicly readable" ON public.website_settings;
  CREATE POLICY "Website settings are publicly readable" ON public.website_settings FOR SELECT USING (true);
END $$;

-- Seller & Admin vehicle management
DO $$ BEGIN
  DROP POLICY IF EXISTS "Sellers can manage own vehicles" ON public.vehicles;
  CREATE POLICY "Sellers can manage own vehicles" ON public.vehicles FOR ALL USING (
    seller_id = auth.uid() OR public.is_admin()
  );

  DROP POLICY IF EXISTS "Users can manage favorites" ON public.favorites;
  CREATE POLICY "Users can manage favorites" ON public.favorites FOR ALL USING (
    auth.uid() = user_id OR public.is_admin()
  );

  DROP POLICY IF EXISTS "Enquiries readable by participant" ON public.enquiries;
  CREATE POLICY "Enquiries readable by participant" ON public.enquiries FOR SELECT USING (
    customer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin()
  );

  DROP POLICY IF EXISTS "Enquiries insertable by users" ON public.enquiries;
  CREATE POLICY "Enquiries insertable by users" ON public.enquiries FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Orders readable by buyer seller or admin" ON public.orders;
  CREATE POLICY "Orders readable by buyer seller or admin" ON public.orders FOR SELECT USING (
    customer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin()
  );

  DROP POLICY IF EXISTS "Bookings readable by participant" ON public.bookings;
  CREATE POLICY "Bookings readable by participant" ON public.bookings FOR SELECT USING (
    customer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin()
  );

  DROP POLICY IF EXISTS "Notifications readable by recipient" ON public.notifications;
  CREATE POLICY "Notifications readable by recipient" ON public.notifications FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
  );
END $$;

-- ----------------------------------------------------------------------------
-- 17. SEED INITIAL DATA (Matching Approved Reference Designs)
-- ----------------------------------------------------------------------------
INSERT INTO public.brands (name, slug, country, vehicle_count) VALUES
('Toyota', 'toyota', 'Japan', 92),
('BMW', 'bmw', 'Germany', 48),
('Mercedes-Benz', 'mercedes-benz', 'Germany', 36),
('Ford', 'ford', 'USA', 28),
('Honda', 'honda', 'Japan', 24),
('Land Rover', 'land-rover', 'UK', 18),
('Nissan', 'nissan', 'Japan', 14),
('Mitsubishi', 'mitsubishi', 'Japan', 12)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, slug, description, display_order) VALUES
('New Cars', 'new-cars', 'Latest models straight from showroom', 1),
('Used Cars', 'used-cars', 'Quality pre-owned certified vehicles', 2),
('Accessories', 'accessories', 'Genuine and aftermarket quality parts', 3),
('Motorbike', 'motorbike', 'Explore top motorbikes and scooters', 4),
('Electric', 'electric', 'Eco-friendly hybrid and electric vehicles', 5),
('Other Vehicles', 'other-vehicles', 'Commercial trucks, pickups, and vans', 6)
ON CONFLICT (name) DO NOTHING;

-- Initial Featured Vehicles (matching exact Reference 1 & 4 numbers)
INSERT INTO public.vehicles (
  title, slug, brand, model, variant, vehicle_type, condition, year, mileage,
  fuel_type, transmission, price, location, city, region, featured_status, publication_status
) VALUES
(
  'Toyota Land Cruiser', 'toyota-land-cruiser-2023', 'Toyota', 'Land Cruiser 300', 'VXR V6 Twin-Turbo',
  'SUV', 'Used', 2023, 12000, 'Diesel', 'Automatic', 76500000, 'Dar es Salaam', 'Dar es Salaam', 'Dar es Salaam', true, 'approved'
),
(
  'BMW 3 Series', 'bmw-3-series-2022', 'BMW', '3 Series 330i', 'M Sport Package',
  'Sedan', 'Used', 2022, 18000, 'Petrol', 'Automatic', 45000000, 'Dar es Salaam', 'Dar es Salaam', 'Dar es Salaam', true, 'approved'
),
(
  'Honda Civic', 'honda-civic-2021', 'Honda', 'Civic', 'RS Turbo 1.5L',
  'Sedan', 'Used', 2021, 24000, 'Petrol', 'Automatic', 28500000, 'Arusha', 'Arusha', 'Arusha', true, 'approved'
),
(
  'Ford Ranger', 'ford-ranger-2023', 'Ford', 'Ranger', 'Wildtrak Bi-Turbo 4x4',
  'Pickup', 'Used', 2023, 15000, 'Diesel', 'Automatic', 42000000, 'Mwanza', 'Mwanza', 'Mwanza', true, 'approved'
),
(
  'Toyota RAV4', 'toyota-rav4-2022', 'Toyota', 'RAV4', 'Adventure AWD 2.5L',
  'SUV', 'Used', 2022, 20000, 'Petrol', 'Automatic', 38800000, 'Zanzibar', 'Zanzibar', 'Zanzibar', true, 'approved'
),
(
  'Mercedes-Benz C-Class', 'mercedes-benz-c-class-2022', 'Mercedes-Benz', 'C-Class', 'C200 AMG Line',
  'Sedan', 'Used', 2022, 16000, 'Petrol', 'Automatic', 68000000, 'Dar es Salaam', 'Dar es Salaam', 'Dar es Salaam', true, 'approved'
)
ON CONFLICT (slug) DO NOTHING;

-- Initial Reviews
INSERT INTO public.reviews (customer_name, customer_city, rating, comment, status) VALUES
('Ahmed S.', 'Dar es Salaam', 5, 'Amazing service and genuine cars. Swahivo made the whole buying process so easy!', 'approved'),
('Fatma A.', 'Zanzibar', 5, 'I got my dream car with flexible payments. Highly recommend Swahivo!', 'approved'),
('Juma M.', 'Arusha', 5, 'Professional, transparent and trustworthy. The best car dealership in Tanzania.', 'approved')
ON CONFLICT DO NOTHING;

-- Initial Website Settings
INSERT INTO public.website_settings (key, value) VALUES
('hero', '{"headline": "Find Your Perfect Drive", "subtext": "Swahivo Car Dealership brings you a wide range of new and pre-owned vehicles with trusted service, flexible finance options, and a smooth buying experience.", "badge": "PREMIUM CARS. REAL PEOPLE. BETTER JOURNEYS."}'::JSONB),
('contact', '{"address": "Kiembe Samaki - Zanzibar Tanzania", "phone": "+255 770 565656", "email": "auto.link@yahoo.com", "hours": "Mon - Sat: 8:00 AM - 6:00 PM"}'::JSONB)
ON CONFLICT (key) DO NOTHING;
