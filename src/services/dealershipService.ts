import { supabase } from '../integrations/supabase/client';
import {
  Vehicle, Category, Brand, Order, Enquiry, Booking, CustomerReview, DealershipServiceOffering,
  Accessory, Motorbike, Lead, FinancingApplication, MarketingCampaign, DealershipSettings, UserProfile
} from '../types';
import {
  INITIAL_VEHICLES, INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_REVIEWS, INITIAL_ORDERS, INITIAL_ENQUIRIES,
  INITIAL_ACCESSORIES, INITIAL_MOTORBIKES, INITIAL_LEADS, INITIAL_FINANCING, INITIAL_CAMPAIGNS, INITIAL_SETTINGS
} from '../data/initialData';

export interface DatabaseStatus {
  isConnected: boolean;
  tablesExist: boolean;
  checkedAt: string;
  message: string;
}

// In-memory cache / fallback state for seamless UI responsiveness when migration is pending
let localVehicles = [...INITIAL_VEHICLES];
let localEnquiries = [...INITIAL_ENQUIRIES];
let localOrders = [...INITIAL_ORDERS];
let localFavorites: string[] = ['v1', 'v2', 'v4'];
let localCategories = [...INITIAL_CATEGORIES];
let localBrands = [...INITIAL_BRANDS];
let localAccessories: Accessory[] = [...(INITIAL_ACCESSORIES as any)];
let localMotorbikes: Motorbike[] = [...INITIAL_MOTORBIKES];
let localLeads: Lead[] = [...INITIAL_LEADS];
let localFinancing: FinancingApplication[] = [...INITIAL_FINANCING];
let localCampaigns: MarketingCampaign[] = [...INITIAL_CAMPAIGNS];
let localSettings: DealershipSettings = { ...INITIAL_SETTINGS };
let localReviews = [...INITIAL_REVIEWS];
let localUsers: UserProfile[] = [
  {
    user_id: '3c6a4096-d6e2-4c45-bada-45f0cbf01510',
    role: 'admin',
    full_name: 'Juma Mkwawa',
    email: 'admin@swahivo.com',
    phone: '+255 770 565 656',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    city: 'Dar es Salaam',
    address: 'Victoria Plaza 4th Floor',
    is_verified: true,
    created_at: '2026-01-10'
  },
  {
    user_id: 'seller-ali-hassan',
    role: 'seller',
    full_name: 'Ali Hassan',
    email: 'ali.hassan@primemotors.co.tz',
    phone: '+255 777 998 877',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    city: 'Dar es Salaam',
    address: 'Mikocheni Light Industrial Area',
    is_verified: true,
    created_at: '2026-02-15'
  },
  {
    user_id: 'buyer-juma-rashid',
    role: 'buyer',
    full_name: 'Juma Rashid',
    email: 'juma.rashid@gmail.com',
    phone: '+255 714 889 900',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    city: 'Arusha',
    address: 'Njiro Road Block B',
    is_verified: true,
    created_at: '2026-03-20'
  },
  {
    user_id: 'buyer-fatma-said',
    role: 'buyer',
    full_name: 'Fatma Said',
    email: 'fatma.said@gmail.com',
    phone: '+255 712 334 455',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    city: 'Zanzibar',
    address: 'Stone Town',
    is_verified: false,
    created_at: '2026-04-12'
  }
];

let localBookings: Booking[] = [
  {
    id: 'bk-1',
    booking_number: 'BK-2026-041',
    booking_type: 'test_drive',
    vehicle_id: 'v1',
    customer_id: 'buyer-juma-rashid',
    customer_name: 'Juma Rashid',
    customer_email: 'juma.rashid@gmail.com',
    customer_phone: '+255 714 889 900',
    booking_date: '2026-10-25',
    booking_time: '10:00 AM',
    status: 'Confirmed',
    notes: 'Requested test drive along Bagamoyo road route.',
    created_at: '2026-10-18'
  },
  {
    id: 'bk-2',
    booking_number: 'BK-2026-042',
    booking_type: 'service',
    service_id: 'srv-1',
    customer_id: 'buyer-fatma-said',
    customer_name: 'Fatma Said',
    customer_email: 'fatma.said@gmail.com',
    customer_phone: '+255 712 334 455',
    booking_date: '2026-10-28',
    booking_time: '02:30 PM',
    status: 'Pending',
    notes: 'Comprehensive 150-Point Pre-Purchase Inspection booking.',
    created_at: '2026-10-17'
  }
];

export const DealershipService = {
  async checkDatabaseStatus(): Promise<DatabaseStatus> {
    try {
      const { data, error } = await supabase.from('vehicles').select('id').limit(1);
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
          return {
            isConnected: true,
            tablesExist: false,
            checkedAt: new Date().toLocaleTimeString(),
            message: 'Supabase project is connected. Run the SQL Migration in Supabase SQL Editor to activate live database tables.'
          };
        }
        return {
          isConnected: false,
          tablesExist: false,
          checkedAt: new Date().toLocaleTimeString(),
          message: error.message
        };
      }
      return {
        isConnected: true,
        tablesExist: true,
        checkedAt: new Date().toLocaleTimeString(),
        message: 'Connected to Supabase live database successfully.'
      };
    } catch (err: any) {
      return {
        isConnected: false,
        tablesExist: false,
        checkedAt: new Date().toLocaleTimeString(),
        message: err.message || 'Unable to reach Supabase'
      };
    }
  },

  async getVehicles(filter?: {
    category?: string;
    brand?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    condition?: string;
    featured?: boolean;
    sellerId?: string;
  }): Promise<Vehicle[]> {
    try {
      let query = supabase.from('vehicles').select('*');
      
      if (filter?.brand && filter.brand !== 'All Makes') {
        query = query.ilike('brand', `%${filter.brand}%`);
      }
      if (filter?.type && filter.type !== 'All Types') {
        query = query.eq('vehicle_type', filter.type);
      }
      if (filter?.condition && filter.condition !== 'All') {
        query = query.eq('condition', filter.condition);
      }
      if (filter?.featured !== undefined) {
        query = query.eq('featured_status', filter.featured);
      }
      if (filter?.sellerId) {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(filter.sellerId)) {
          query = query.eq('seller_id', filter.sellerId);
        }
      }
      if (filter?.location && filter.location !== 'All Locations') {
        query = query.ilike('location', `%${filter.location}%`);
      }
      if (filter?.minPrice) {
        query = query.gte('price', filter.minPrice);
      }
      if (filter?.maxPrice) {
        query = query.lte('price', filter.maxPrice);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Vehicle[];
      }
    } catch (e) {
      console.warn('Falling back to verified dataset:', e);
    }

    return localVehicles.filter(v => {
      if (filter?.brand && filter.brand !== 'All Makes' && v.brand.toLowerCase() !== filter.brand.toLowerCase()) return false;
      if (filter?.type && filter.type !== 'All Types' && v.vehicle_type.toLowerCase() !== filter.type.toLowerCase()) return false;
      if (filter?.condition && filter.condition !== 'All' && v.condition.toLowerCase() !== filter.condition.toLowerCase()) return false;
      if (filter?.featured !== undefined && v.featured_status !== filter.featured) return false;
      if (filter?.location && filter.location !== 'All Locations' && !v.location?.toLowerCase().includes(filter.location.toLowerCase())) return false;
      if (filter?.minPrice && v.price < filter.minPrice) return false;
      if (filter?.maxPrice && v.price > filter.maxPrice) return false;
      if (filter?.sellerId && v.seller_id !== filter.sellerId) return false;
      return true;
    });
  },

  async getVehicleBySlug(slug: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase.from('vehicles').select('*').eq('slug', slug).maybeSingle();
      if (!error && data) return data as Vehicle;
    } catch {}
    return localVehicles.find(v => v.slug === slug || v.id === slug) || null;
  },

  async createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle> {
    const newId = 'veh_' + Math.random().toString(36).substring(2, 9);
    const newVehicle: Vehicle = {
      ...vehicle,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('vehicles').insert([newVehicle]).select().maybeSingle();
      if (!error && data) {
        localVehicles.unshift(data as Vehicle);
        return data as Vehicle;
      }
    } catch {}

    localVehicles.unshift(newVehicle);
    return newVehicle;
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase.from('vehicles').update(updates).eq('id', id).select().maybeSingle();
      if (!error && data) {
        const index = localVehicles.findIndex(v => v.id === id);
        if (index !== -1) localVehicles[index] = data as Vehicle;
        return data as Vehicle;
      }
    } catch {}

    const index = localVehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      localVehicles[index] = { ...localVehicles[index], ...updates };
      return localVehicles[index];
    }
    return null;
  },

  async deleteVehicle(id: string): Promise<boolean> {
    try {
      await supabase.from('vehicles').delete().eq('id', id);
    } catch {}
    localVehicles = localVehicles.filter(v => v.id !== id);
    return true;
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('display_order');
      if (!error && data && data.length > 0) return data as Category[];
    } catch {}
    return localCategories;
  },

  async createCategory(cat: Omit<Category, 'id'>): Promise<Category> {
    const newCat: Category = { ...cat, id: 'cat_' + Date.now() };
    try {
      const { data } = await supabase.from('categories').insert([newCat]).select().maybeSingle();
      if (data) {
        localCategories.push(data as Category);
        return data as Category;
      }
    } catch {}
    localCategories.push(newCat);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const idx = localCategories.findIndex(c => c.id === id);
    if (idx !== -1) {
      localCategories[idx] = { ...localCategories[idx], ...updates };
      return localCategories[idx];
    }
    return null;
  },

  async deleteCategory(id: string): Promise<boolean> {
    localCategories = localCategories.filter(c => c.id !== id);
    return true;
  },

  // BRANDS
  async getBrands(): Promise<Brand[]> {
    try {
      const { data, error } = await supabase.from('brands').select('*').order('vehicle_count', { ascending: false });
      if (!error && data && data.length > 0) return data as Brand[];
    } catch {}
    return localBrands;
  },

  async createBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
    const newBrand: Brand = { ...brand, id: 'br_' + Date.now() };
    localBrands.push(newBrand);
    return newBrand;
  },

  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | null> {
    const idx = localBrands.findIndex(b => b.id === id);
    if (idx !== -1) {
      localBrands[idx] = { ...localBrands[idx], ...updates };
      return localBrands[idx];
    }
    return null;
  },

  async deleteBrand(id: string): Promise<boolean> {
    localBrands = localBrands.filter(b => b.id !== id);
    return true;
  },

  // ACCESSORIES
  async getAccessories(): Promise<Accessory[]> {
    return localAccessories;
  },

  async createAccessory(acc: Omit<Accessory, 'id'>): Promise<Accessory> {
    const newAcc: Accessory = { ...acc, id: 'acc_' + Date.now() };
    localAccessories.unshift(newAcc);
    return newAcc;
  },

  async updateAccessory(id: string, updates: Partial<Accessory>): Promise<Accessory | null> {
    const idx = localAccessories.findIndex(a => a.id === id);
    if (idx !== -1) {
      localAccessories[idx] = { ...localAccessories[idx], ...updates };
      return localAccessories[idx];
    }
    return null;
  },

  async deleteAccessory(id: string): Promise<boolean> {
    localAccessories = localAccessories.filter(a => a.id !== id);
    return true;
  },

  // MOTORBIKES
  async getMotorbikes(): Promise<Motorbike[]> {
    return localMotorbikes;
  },

  async createMotorbike(mb: Omit<Motorbike, 'id'>): Promise<Motorbike> {
    const newMb: Motorbike = { ...mb, id: 'mb_' + Date.now() };
    localMotorbikes.unshift(newMb);
    return newMb;
  },

  async updateMotorbike(id: string, updates: Partial<Motorbike>): Promise<Motorbike | null> {
    const idx = localMotorbikes.findIndex(m => m.id === id);
    if (idx !== -1) {
      localMotorbikes[idx] = { ...localMotorbikes[idx], ...updates };
      return localMotorbikes[idx];
    }
    return null;
  },

  async deleteMotorbike(id: string): Promise<boolean> {
    localMotorbikes = localMotorbikes.filter(m => m.id !== id);
    return true;
  },

  // ORDERS
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (userId) query = query.eq('customer_id', userId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as Order[];
    } catch {}
    if (userId) return localOrders.filter(o => o.customer_id === userId);
    return localOrders;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const idx = localOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      localOrders[idx] = { ...localOrders[idx], status };
      return localOrders[idx];
    }
    return null;
  },

  // ENQUIRIES
  async getEnquiries(sellerId?: string, customerId?: string): Promise<Enquiry[]> {
    try {
      let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (sellerId && uuidRegex.test(sellerId)) query = query.eq('seller_id', sellerId);
      if (customerId && uuidRegex.test(customerId)) query = query.eq('customer_id', customerId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as Enquiry[];
    } catch {}
    if (sellerId) return localEnquiries.filter(e => e.seller_id === sellerId || !e.seller_id);
    if (customerId) return localEnquiries.filter(e => e.customer_id === customerId);
    return localEnquiries;
  },

  async sendEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at'>): Promise<Enquiry> {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: 'enq_' + Date.now(),
      created_at: new Date().toISOString(),
      last_message_at: 'Just now'
    };
    try {
      const { data } = await supabase.from('enquiries').insert([newEnquiry]).select().maybeSingle();
      if (data) {
        localEnquiries.unshift(data as Enquiry);
        return data as Enquiry;
      }
    } catch {}
    localEnquiries.unshift(newEnquiry);
    return newEnquiry;
  },

  async updateEnquiryStatus(id: string, status: Enquiry['status']): Promise<Enquiry | null> {
    const idx = localEnquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      localEnquiries[idx] = { ...localEnquiries[idx], status };
      return localEnquiries[idx];
    }
    return null;
  },

  async replyToEnquiry(id: string, reply: string, repliedBy?: string): Promise<Enquiry> {
    const idx = localEnquiries.findIndex(e => e.id === id);
    const existing = localEnquiries[idx] || ({} as Enquiry);
    const updated: Enquiry = {
      ...existing,
      reply,
      replied_at: new Date().toISOString(),
      replied_by: repliedBy || 'Showroom Agent',
      status: 'Responded',
      last_message_at: 'Just now'
    };
    if (idx !== -1) {
      localEnquiries[idx] = updated;
    }
    try {
      await supabase.from('enquiries').update({
        reply,
        status: 'Responded',
        replied_at: new Date().toISOString()
      }).eq('id', id);
    } catch {}
    return updated;
  },

  // BOOKINGS
  async getBookings(sellerId?: string, customerId?: string): Promise<Booking[]> {
    if (customerId) return localBookings.filter(b => b.customer_id === customerId);
    if (sellerId) return localBookings.filter(b => b.seller_id === sellerId || !b.seller_id);
    return localBookings;
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const idx = localBookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      localBookings[idx] = { ...localBookings[idx], status };
      return localBookings[idx];
    }
    return null;
  },

  async createBooking(booking: Omit<Booking, 'id' | 'booking_number' | 'created_at'>): Promise<Booking> {
    const newB: Booking = {
      ...booking,
      id: 'bk_' + Date.now(),
      booking_number: 'BK-2026-' + Math.floor(100 + Math.random() * 900),
      created_at: new Date().toISOString()
    };
    localBookings.unshift(newB);
    return newB;
  },

  // LEADS (CRM)
  async getLeads(): Promise<Lead[]> {
    return localLeads;
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead | null> {
    const idx = localLeads.findIndex(l => l.id === id);
    if (idx !== -1) {
      localLeads[idx] = { ...localLeads[idx], status };
      return localLeads[idx];
    }
    return null;
  },

  async assignLead(id: string, assigned_to: string): Promise<Lead | null> {
    const idx = localLeads.findIndex(l => l.id === id);
    if (idx !== -1) {
      localLeads[idx] = { ...localLeads[idx], assigned_to };
      return localLeads[idx];
    }
    return null;
  },

  async addLeadNote(id: string, note: string): Promise<Lead | null> {
    const idx = localLeads.findIndex(l => l.id === id);
    if (idx !== -1) {
      localLeads[idx] = { ...localLeads[idx], notes: [note, ...localLeads[idx].notes] };
      return localLeads[idx];
    }
    return null;
  },

  // FINANCING
  async getFinancingApplications(): Promise<FinancingApplication[]> {
    return localFinancing;
  },

  async updateFinancingStatus(id: string, status: FinancingApplication['status'], notes?: string): Promise<FinancingApplication | null> {
    const idx = localFinancing.findIndex(f => f.id === id);
    if (idx !== -1) {
      localFinancing[idx] = {
        ...localFinancing[idx],
        status,
        ...(notes ? { notes } : {})
      };
      return localFinancing[idx];
    }
    return null;
  },

  // MARKETING
  async getCampaigns(): Promise<MarketingCampaign[]> {
    return localCampaigns;
  },

  async updateCampaignStatus(id: string, status: MarketingCampaign['status']): Promise<MarketingCampaign | null> {
    const idx = localCampaigns.findIndex(c => c.id === id);
    if (idx !== -1) {
      localCampaigns[idx] = { ...localCampaigns[idx], status };
      return localCampaigns[idx];
    }
    return null;
  },

  async createCampaign(campaign: Omit<MarketingCampaign, 'id'>): Promise<MarketingCampaign> {
    const newC: MarketingCampaign = { ...campaign, id: 'cmp_' + Date.now() };
    localCampaigns.unshift(newC);
    return newC;
  },

  // SETTINGS
  async getSettings(): Promise<DealershipSettings> {
    return localSettings;
  },

  async updateSettings(settings: Partial<DealershipSettings>): Promise<DealershipSettings> {
    localSettings = { ...localSettings, ...settings };
    return localSettings;
  },

  // USERS
  async getUsers(): Promise<UserProfile[]> {
    return localUsers;
  },

  async updateUserRole(userId: string, role: UserProfile['role']): Promise<UserProfile | null> {
    const idx = localUsers.findIndex(u => u.user_id === userId);
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], role };
      return localUsers[idx];
    }
    return null;
  },

  async toggleUserVerification(userId: string): Promise<UserProfile | null> {
    const idx = localUsers.findIndex(u => u.user_id === userId);
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], is_verified: !localUsers[idx].is_verified };
      return localUsers[idx];
    }
    return null;
  },

  // REVIEWS
  async getReviews(): Promise<CustomerReview[]> {
    try {
      const { data, error } = await supabase.from('reviews').select('*');
      if (!error && data && data.length > 0) return data as CustomerReview[];
    } catch {}
    return localReviews;
  },

  async updateReviewStatus(id: string, status: CustomerReview['status']): Promise<CustomerReview | null> {
    const idx = localReviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      localReviews[idx] = { ...localReviews[idx], status };
      return localReviews[idx];
    }
    return null;
  },

  // FAVORITES
  async toggleFavorite(vehicleId: string): Promise<string[]> {
    if (localFavorites.includes(vehicleId)) {
      localFavorites = localFavorites.filter(id => id !== vehicleId);
    } else {
      localFavorites.push(vehicleId);
    }
    return [...localFavorites];
  },

  getFavorites(): string[] {
    return [...localFavorites];
  }
};

