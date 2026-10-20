export type UserRole = 'admin' | 'seller' | 'buyer';

export interface UserProfile {
  user_id: string;
  id?: string;
  role: UserRole;
  full_name: string | null;
  name?: string | null;
  email: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  address?: string | null;
  bio?: string | null;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SellerProfile {
  seller_id: string;
  business_name: string;
  dealership_license?: string | null;
  tagline?: string | null;
  phone?: string | null;
  email?: string | null;
  location?: string | null;
  rating?: number;
  total_sales?: number;
  active_listings_count?: number;
  verified_badge?: boolean;
  banner_url?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  country?: string | null;
  vehicle_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  vehicle_count?: number;
  display_order?: number;
  is_active?: boolean;
}

export interface Vehicle {
  id: string;
  seller_id?: string | null;
  title: string;
  slug: string;
  brand: string;
  model: string;
  variant?: string | null;
  vehicle_type: string;
  condition: 'New' | 'Used' | 'Pre-Owned' | 'Certified Pre-Owned';
  year: number;
  mileage: number;
  fuel_type: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | string;
  transmission: 'Automatic' | 'Manual';
  engine_capacity?: string | null;
  engine_size?: string | null;
  color?: string | null;
  seats?: number;
  doors?: number;
  drive_type?: string | null;
  vin?: string | null;
  price: number;
  currency: string;
  negotiable?: boolean;
  description?: string | null;
  features?: string[];
  country?: string;
  region?: string;
  city?: string;
  location?: string;
  availability: 'available' | 'reserved' | 'sold';
  verification_status: 'verified' | 'pending' | 'unverified';
  featured_status: boolean;
  promotion_status?: string;
  publication_status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'active' | 'inactive' | 'archived';
  views_count?: number;
  enquiries_count?: number;
  primary_image?: string | null;
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Accessory {
  id: string;
  seller_id?: string | null;
  name: string;
  slug: string;
  category: string;
  brand?: string | null;
  description?: string | null;
  price: number;
  currency: string;
  quantity: number;
  sku?: string | null;
  compatibility?: string[];
  images?: string[];
  image?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at?: string;
}

export interface DealershipServiceOffering {
  id: string;
  service_name: string;
  slug: string;
  description?: string | null;
  duration?: string;
  price: number;
  currency: string;
  active_status: boolean;
  icon_name?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_id?: string | null;
  customer_name: string;
  phone?: string;
  customer_phone?: string;
  email?: string;
  customer_email?: string;
  city?: string;
  address?: string;
  country?: string;
  product_name: string;
  product_variant?: string | null;
  vehicle_id?: string | null;
  accessory_id?: string | null;
  seller_id?: string | null;
  quantity?: number;
  amount: number;
  total_amount?: number;
  currency?: string;
  notes?: string | null;
  status: 'Pending' | 'Processing' | 'Confirmed' | 'Completed' | 'Cancelled' | 'pending' | 'processing' | 'confirmed' | 'completed' | 'cancelled';
  fulfillment_status?: 'Pending' | 'Processing' | 'Ready for Pickup' | 'Dispatched' | 'Delivered' | 'Cancelled';
  tracking_number?: string;
  payment_status?: 'unpaid' | 'pending_verification' | 'paid' | 'refunded';
  items?: Array<{ name: string; quantity: number; price?: number }>;
  shipping_address?: { street?: string; city?: string; district?: string };
  timeline?: Array<{ status: string; date: string; note?: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface Enquiry {
  id: string;
  vehicle_id?: string | null;
  vehicle_title?: string;
  vehicle_image?: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  seller_id?: string | null;
  message: string;
  reply?: string | null;
  replied_at?: string | null;
  replied_by?: string | null;
  status: 'New' | 'Contacted' | 'Pending' | 'Responded' | 'Closed' | 'pending' | 'in_progress' | 'closed';
  fulfillment_status?: 'Pending' | 'Contacted' | 'Scheduled' | 'Fulfilled' | 'Cancelled';
  last_message_at?: string;
  created_at?: string;
}

export interface Booking {
  id: string;
  booking_number?: string;
  booking_reference?: string;
  booking_type?: 'test_drive' | 'service';
  vehicle_id?: string | null;
  vehicle_title?: string;
  service_id?: string | null;
  customer_id?: string | null;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  seller_id?: string | null;
  booking_date?: string;
  preferred_date?: string;
  booking_time?: string;
  preferred_time?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string | null;
  created_at?: string;
}

export interface CustomerReview {
  id: string;
  seller_id?: string | null;
  seller_name?: string | null;
  vehicle_id?: string | null;
  customer_id?: string | null;
  customer_name: string;
  user_name?: string;
  customer_city: string;
  customer_avatar?: string;
  customer_id?: string | null;
  vehicle_id?: string | null;
  seller_id?: string | null;
  rating: number;
  category?: string;
  comment: string;
  verified_buyer?: boolean;
  status: 'approved' | 'pending' | 'rejected';
  reply?: string | null;
  reply_at?: string | null;
  created_at?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'alert' | 'booking';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface Motorbike {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  engine_cc: number;
  mileage: number;
  price: number;
  currency: string;
  condition: 'New' | 'Used';
  color: string;
  image_url: string;
  availability: 'available' | 'sold' | 'reserved';
  location: string;
  slug?: string;
  fuel_type?: string;
  engine_capacity?: string;
  primary_image?: string;
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_interest: string;
  budget: number;
  source: 'Website' | 'Walk-in' | 'Facebook' | 'WhatsApp' | 'Phone';
  status: 'New' | 'Contacted' | 'Qualified' | 'Negotiation' | 'Won' | 'Lost';
  assigned_to?: string;
  notes: string[];
  created_at: string;
}

export interface FinancingApplication {
  id: string;
  application_number?: string;
  customer_id?: string;
  applicant_name: string;
  applicant_email?: string;
  applicant_phone?: string;
  national_id?: string;
  phone?: string;
  email?: string;
  employment_status?: 'Employed' | 'Self-Employed' | 'Business Owner';
  monthly_income: number;
  vehicle_id?: string;
  vehicle_title: string;
  vehicle_price: number;
  down_payment: number;
  loan_amount?: number;
  loan_term_months?: number;
  loan_period_months?: number;
  term_months?: number;
  monthly_payment: number;
  bank_partner?: string;
  status?: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'More Info Needed' | 'approved' | 'under_review' | 'pending' | 'rejected';
  notes?: string;
  created_at?: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  name?: string;
  type: 'Social' | 'Featured Vehicle' | 'Seasonal Discount' | 'Banner Spotlight';
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  conversions: number;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Scheduled' | 'Paused' | 'Ended';
}

export interface DealershipSettings {
  dealership_name: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  working_hours: string;
  currency: string;
  tax_percentage: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  showroom_video_url: string;
  maintenance_mode: boolean;
}

