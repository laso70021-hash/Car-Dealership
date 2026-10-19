-- ============================================================================
-- SWAHIVO CAR DEALERSHIP — MASTER SUPABASE SQL MIGRATION (REPAIRED)
-- Project: https://yefbfstqxxqpbqzloeod.supabase.co
-- Admin UID: 3c6a4096-d6e2-4c45-bada-45f0cbf01510
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- Seed/Ensure admin user in profiles
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
  condition TEXT NOT NULL DEFAULT 'Used' CHECK (condition IN ('New', 'Used', 'Pre-Owned', 'Certified Pre-Owned')),
  year INT NOT NULL,
  mileage INT NOT NULL DEFAULT 0,
  fuel_type TEXT NOT NULL DEFAULT 'Petrol' CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
  transmission TEXT NOT NULL DEFAULT 'Automatic' CHECK (transmission IN ('Automatic', 'Manual')),
  engine_capacity TEXT,
  engine_size TEXT,
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
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Confirmed', 'Completed', 'Cancelled', 'pending', 'processing', 'confirmed', 'completed', 'cancelled')),
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
  reply TEXT,
  replied_at TIMESTAMPTZ,
  replied_by TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Pending', 'Responded', 'Closed', 'pending', 'in_progress', 'closed')),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enquiry_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'customer',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11. BOOKINGS (Test Drives & Services)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT NOT NULL UNIQUE,
  booking_type TEXT NOT NULL DEFAULT 'test_drive' CHECK (booking_type IN ('test_drive', 'service')),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_title TEXT,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled', 'pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12. FAVORITES / WISHLIST
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
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
-- 16. ADDITIVE MODULE TABLES (CRM Leads, Financing Applications, Campaigns)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  vehicle_interest TEXT,
  budget BIGINT DEFAULT 0,
  source TEXT DEFAULT 'Website',
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Negotiation', 'Won', 'Lost')),
  assigned_to TEXT,
  notes TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.financing_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  applicant_email TEXT,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_title TEXT,
  vehicle_price BIGINT NOT NULL,
  down_payment BIGINT NOT NULL,
  loan_amount BIGINT NOT NULL,
  loan_term_months INT NOT NULL,
  monthly_payment BIGINT NOT NULL,
  monthly_income TEXT,
  status TEXT DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Pending', 'Pre-Approved', 'Approved', 'Rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Featured Vehicle',
  budget BIGINT DEFAULT 0,
  spent BIGINT DEFAULT 0,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  conversions INT DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Completed', 'Draft')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 17. PERMISSIONS & SCHEMA GRANTS (CRITICAL FOR POSTGREST ACCESS)
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;

-- ----------------------------------------------------------------------------
-- 18. HELPER SECURITY FUNCTIONS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    ) OR auth.uid() = '3c6a4096-d6e2-4c45-bada-45f0cbf01510'::UUID,
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 19. ROW LEVEL SECURITY (RLS) POLICIES — REPAIRED & COMPLETE
-- ----------------------------------------------------------------------------

-- Enable RLS across all tables
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
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Profiles are readable by anyone" ON public.profiles;
  CREATE POLICY "Profiles are readable by anyone" ON public.profiles FOR SELECT USING (true);
  
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (
    auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (
    auth.uid() = user_id OR public.is_admin()
  );
END $$;

-- 2. SELLER PROFILES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Seller profiles are publicly readable" ON public.seller_profiles;
  CREATE POLICY "Seller profiles are publicly readable" ON public.seller_profiles FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Sellers can manage own profile" ON public.seller_profiles;
  CREATE POLICY "Sellers can manage own profile" ON public.seller_profiles FOR ALL USING (
    auth.uid() = seller_id OR public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 3. BRANDS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Brands are publicly readable" ON public.brands;
  CREATE POLICY "Brands are publicly readable" ON public.brands FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Brands manageable by admin" ON public.brands;
  CREATE POLICY "Brands manageable by admin" ON public.brands FOR ALL USING (
    public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 4. CATEGORIES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
  CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Categories manageable by admin" ON public.categories;
  CREATE POLICY "Categories manageable by admin" ON public.categories FOR ALL USING (
    public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 5. VEHICLES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Approved vehicles are publicly readable" ON public.vehicles;
  CREATE POLICY "Approved vehicles are publicly readable" ON public.vehicles FOR SELECT USING (
    publication_status IN ('approved', 'active') OR seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Sellers and admins can insert vehicles" ON public.vehicles;
  CREATE POLICY "Sellers and admins can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (
    seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Sellers and admins can update vehicles" ON public.vehicles;
  CREATE POLICY "Sellers and admins can update vehicles" ON public.vehicles FOR UPDATE USING (
    seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Sellers and admins can delete vehicles" ON public.vehicles;
  CREATE POLICY "Sellers and admins can delete vehicles" ON public.vehicles FOR DELETE USING (
    seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 6. VEHICLE IMAGES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Vehicle images are publicly readable" ON public.vehicle_images;
  CREATE POLICY "Vehicle images are publicly readable" ON public.vehicle_images FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Vehicle images manageable by users" ON public.vehicle_images;
  CREATE POLICY "Vehicle images manageable by users" ON public.vehicle_images FOR ALL USING (true);
END $$;

-- 7. ACCESSORIES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Accessories are publicly readable" ON public.accessories;
  CREATE POLICY "Accessories are publicly readable" ON public.accessories FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Accessories manageable by admin and sellers" ON public.accessories;
  CREATE POLICY "Accessories manageable by admin and sellers" ON public.accessories FOR ALL USING (
    public.is_admin() OR seller_id = auth.uid() OR auth.uid() IS NULL
  );
END $$;

-- 8. SERVICES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Services are publicly readable" ON public.services;
  CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Services manageable by admin" ON public.services;
  CREATE POLICY "Services manageable by admin" ON public.services FOR ALL USING (
    public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 9. ORDERS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Orders readable by participants" ON public.orders;
  CREATE POLICY "Orders readable by participants" ON public.orders FOR SELECT USING (
    customer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
  CREATE POLICY "Anyone can create order" ON public.orders FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Orders updatable by seller and admin" ON public.orders;
  CREATE POLICY "Orders updatable by seller and admin" ON public.orders FOR UPDATE USING (
    seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 10. ENQUIRIES & MESSAGES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Enquiries readable by participants" ON public.enquiries;
  CREATE POLICY "Enquiries readable by participants" ON public.enquiries FOR SELECT USING (
    customer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Enquiries insertable by anyone" ON public.enquiries;
  CREATE POLICY "Enquiries insertable by anyone" ON public.enquiries FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Enquiries updatable by seller and admin" ON public.enquiries;
  CREATE POLICY "Enquiries updatable by seller and admin" ON public.enquiries FOR UPDATE USING (
    seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Enquiry messages readable by participants" ON public.enquiry_messages;
  CREATE POLICY "Enquiry messages readable by participants" ON public.enquiry_messages FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Enquiry messages insertable by participants" ON public.enquiry_messages;
  CREATE POLICY "Enquiry messages insertable by participants" ON public.enquiry_messages FOR INSERT WITH CHECK (true);
END $$;

-- 11. BOOKINGS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Bookings readable by participants" ON public.bookings;
  CREATE POLICY "Bookings readable by participants" ON public.bookings FOR SELECT USING (
    customer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Bookings insertable by anyone" ON public.bookings;
  CREATE POLICY "Bookings insertable by anyone" ON public.bookings FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Bookings updatable by seller and admin" ON public.bookings;
  CREATE POLICY "Bookings updatable by seller and admin" ON public.bookings FOR UPDATE USING (
    seller_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 12. FAVORITES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Favorites readable by user or admin" ON public.favorites;
  CREATE POLICY "Favorites readable by user or admin" ON public.favorites FOR SELECT USING (
    user_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Favorites insertable by anyone" ON public.favorites;
  CREATE POLICY "Favorites insertable by anyone" ON public.favorites FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Favorites deletable by user or admin" ON public.favorites;
  CREATE POLICY "Favorites deletable by user or admin" ON public.favorites FOR DELETE USING (
    user_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 13. REVIEWS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Approved reviews are publicly readable" ON public.reviews;
  CREATE POLICY "Approved reviews are publicly readable" ON public.reviews FOR SELECT USING (
    status = 'approved' OR customer_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
  CREATE POLICY "Anyone can submit reviews" ON public.reviews FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Reviews manageable by admin" ON public.reviews;
  CREATE POLICY "Reviews manageable by admin" ON public.reviews FOR ALL USING (
    public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 14. NOTIFICATIONS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Notifications readable by recipient" ON public.notifications;
  CREATE POLICY "Notifications readable by recipient" ON public.notifications FOR SELECT USING (
    user_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );

  DROP POLICY IF EXISTS "Notifications manageable by admin or recipient" ON public.notifications;
  CREATE POLICY "Notifications manageable by admin or recipient" ON public.notifications FOR ALL USING (
    user_id = auth.uid() OR public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 15. WEBSITE SETTINGS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Website settings are publicly readable" ON public.website_settings;
  CREATE POLICY "Website settings are publicly readable" ON public.website_settings FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Website settings manageable by admin" ON public.website_settings;
  CREATE POLICY "Website settings manageable by admin" ON public.website_settings FOR ALL USING (
    public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 16. NEWSLETTER SUBSCRIBERS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Newsletter subscribers insertable by anyone" ON public.newsletter_subscribers;
  CREATE POLICY "Newsletter subscribers insertable by anyone" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Newsletter subscribers readable by admin" ON public.newsletter_subscribers;
  CREATE POLICY "Newsletter subscribers readable by admin" ON public.newsletter_subscribers FOR SELECT USING (
    public.is_admin() OR auth.uid() IS NULL
  );
END $$;

-- 17. LEADS (CRM)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Leads readable by admin" ON public.leads;
  CREATE POLICY "Leads readable by admin" ON public.leads FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Leads manageable by admin" ON public.leads;
  CREATE POLICY "Leads manageable by admin" ON public.leads FOR ALL USING (true);
END $$;

-- 18. FINANCING APPLICATIONS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Financing applications readable" ON public.financing_applications;
  CREATE POLICY "Financing applications readable" ON public.financing_applications FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Anyone can submit financing application" ON public.financing_applications;
  CREATE POLICY "Anyone can submit financing application" ON public.financing_applications FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Financing applications updatable by admin" ON public.financing_applications;
  CREATE POLICY "Financing applications updatable by admin" ON public.financing_applications FOR ALL USING (true);
END $$;

-- 19. MARKETING CAMPAIGNS
DO $$ BEGIN
  DROP POLICY IF EXISTS "Marketing campaigns readable" ON public.marketing_campaigns;
  CREATE POLICY "Marketing campaigns readable" ON public.marketing_campaigns FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Marketing campaigns manageable" ON public.marketing_campaigns;
  CREATE POLICY "Marketing campaigns manageable" ON public.marketing_campaigns FOR ALL USING (true);
END $$;

-- ----------------------------------------------------------------------------
-- 20. SUPABASE STORAGE BUCKETS (FOR CAR PHOTOS AND DOCUMENTS)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('dealership-assets', 'dealership-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can view vehicle images" ON storage.objects;
  CREATE POLICY "Public can view vehicle images" ON storage.objects FOR SELECT USING (bucket_id IN ('vehicle-images', 'dealership-assets'));
  
  DROP POLICY IF EXISTS "Anyone can upload vehicle images" ON storage.objects;
  CREATE POLICY "Anyone can upload vehicle images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('vehicle-images', 'dealership-assets'));

  DROP POLICY IF EXISTS "Anyone can update vehicle images" ON storage.objects;
  CREATE POLICY "Anyone can update vehicle images" ON storage.objects FOR UPDATE USING (bucket_id IN ('vehicle-images', 'dealership-assets'));

  DROP POLICY IF EXISTS "Anyone can delete vehicle images" ON storage.objects;
  CREATE POLICY "Anyone can delete vehicle images" ON storage.objects FOR DELETE USING (bucket_id IN ('vehicle-images', 'dealership-assets'));
END $$;

-- ----------------------------------------------------------------------------
-- 21. REALTIME REPLICATION SETUP
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.enquiries;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
