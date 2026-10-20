import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, ADMIN_UID } from '../integrations/supabase/client';
import { UserProfile, UserRole } from '../types';

export interface VerifiedCredentials {
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}

export const VERIFIED_ACCOUNTS: Record<UserRole, { email: string; password: string; name: string; role: UserRole }> = {
  admin: {
    email: 'admin@swahivo.com',
    password: 'AdminPassword2026!',
    name: 'Swahivo Administrator',
    role: 'admin'
  },
  seller: {
    email: 'seller@swahivo.com',
    password: 'SellerPassword2026!',
    name: 'Ali Hassan (Prime Motors)',
    role: 'seller'
  },
  buyer: {
    email: 'buyer@swahivo.com',
    password: 'BuyerPassword2026!',
    name: 'Salim Khamis',
    role: 'buyer'
  }
};

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signUp: (
    email: string,
    password: string,
    role: UserRole,
    fullName: string,
    metadata?: { phone?: string; city?: string; businessName?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Securely query profile from public.profiles table based on auth.uid()
  const fetchDatabaseProfile = async (sessionUser: any): Promise<UserProfile> => {
    if (!sessionUser?.id) throw new Error('No authenticated user session');

    try {
      const { data: dbProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', sessionUser.id)
        .maybeSingle();

      if (dbProfile) {
        const profile: UserProfile = {
          user_id: dbProfile.user_id,
          id: dbProfile.user_id,
          role: dbProfile.role as UserRole,
          full_name: dbProfile.full_name || sessionUser.user_metadata?.full_name || 'User',
          name: dbProfile.full_name || sessionUser.user_metadata?.full_name || 'User',
          email: dbProfile.email || sessionUser.email,
          phone: dbProfile.phone || null,
          avatar_url: dbProfile.avatar_url || null,
          city: dbProfile.city || 'Dar es Salaam',
          address: dbProfile.address || null,
          bio: dbProfile.bio || null,
          is_verified: dbProfile.is_verified ?? true
        };
        setUser(profile);
        return profile;
      }

      // If no profile exists yet in the profiles table, insert one securely
      const assignedRole: UserRole =
        (sessionUser.user_metadata?.role as UserRole) ||
        (sessionUser.id === ADMIN_UID ? 'admin' : 'buyer');
      const fullName = sessionUser.user_metadata?.full_name || 'User';

      const newRecord = {
        user_id: sessionUser.id,
        role: assignedRole,
        full_name: fullName,
        email: sessionUser.email,
        is_verified: true,
        city: 'Dar es Salaam'
      };

      const { data: inserted, error: insertErr } = await supabase
        .from('profiles')
        .insert([newRecord])
        .select()
        .single();

      const profile: UserProfile = {
        user_id: sessionUser.id,
        id: sessionUser.id,
        role: (inserted?.role || assignedRole) as UserRole,
        full_name: inserted?.full_name || fullName,
        name: inserted?.full_name || fullName,
        email: sessionUser.email,
        city: 'Dar es Salaam',
        is_verified: true
      };
      setUser(profile);
      return profile;
    } catch (err) {
      console.error('Error fetching database-derived profile:', err);
      // Fallback to authenticated session object
      const fallbackProfile: UserProfile = {
        user_id: sessionUser.id,
        id: sessionUser.id,
        role: (sessionUser.user_metadata?.role || (sessionUser.id === ADMIN_UID ? 'admin' : 'buyer')) as UserRole,
        full_name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
        name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
        email: sessionUser.email,
        is_verified: true
      };
      setUser(fallbackProfile);
      return fallbackProfile;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user && isMounted) {
          await fetchDatabaseProfile(session.user);
        } else if (isMounted) {
          setUser(null);
        }
      } catch (err) {
        console.warn('Session restoration note:', err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    restoreSession();

    // Listen to real Supabase auth state change events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchDatabaseProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async (): Promise<UserProfile | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return await fetchDatabaseProfile(session.user);
    }
    return null;
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        return { success: false, error: 'Both email and password are required.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const profile = await fetchDatabaseProfile(data.user);
        return { success: true, role: profile.role };
      }

      return { success: false, error: 'Authentication failed. Please verify credentials.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during sign in.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: UserRole,
    fullName: string,
    metadata?: { phone?: string; city?: string; businessName?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            role,
            full_name: fullName,
            phone: metadata?.phone || null,
            city: metadata?.city || 'Dar es Salaam'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Create user record in public.profiles table
        const profilePayload = {
          user_id: data.user.id,
          role,
          full_name: fullName,
          email: email.trim(),
          phone: metadata?.phone || null,
          city: metadata?.city || 'Dar es Salaam',
          is_verified: role === 'buyer'
        };

        const { error: profileErr } = await supabase.from('profiles').insert([profilePayload]);
        if (profileErr) {
          console.warn('Profile record insert warning:', profileErr);
        }

        // If registered as seller, create record in seller_profiles
        if (role === 'seller') {
          const sellerPayload = {
            seller_id: data.user.id,
            business_name: metadata?.businessName || `${fullName} Dealership`,
            email: email.trim(),
            phone: metadata?.phone || null,
            location: metadata?.city || 'Dar es Salaam, Tanzania',
            verified_badge: false
          };
          await supabase.from('seller_profiles').insert([sellerPayload]);
        }

        await fetchDatabaseProfile(data.user);
        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut note:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Switch role by authenticating with the verified account for that role in Supabase
  const switchRole = async (targetRole: UserRole): Promise<{ success: boolean; error?: string }> => {
    const creds = VERIFIED_ACCOUNTS[targetRole];
    if (!creds) return { success: false, error: 'Unknown role' };

    return await signIn(creds.email, creds.password);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user?.user_id) throw new Error('User not authenticated');

    const updatePayload: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.full_name !== undefined) updatePayload.full_name = updates.full_name;
    if (updates.phone !== undefined) updatePayload.phone = updates.phone;
    if (updates.avatar_url !== undefined) updatePayload.avatar_url = updates.avatar_url;
    if (updates.city !== undefined) updatePayload.city = updates.city;
    if (updates.address !== undefined) updatePayload.address = updates.address;
    if (updates.bio !== undefined) updatePayload.bio = updates.bio;

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('user_id', user.user_id);

    if (error) {
      throw new Error(error.message);
    }

    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'buyer',
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        switchRole,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
