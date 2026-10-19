import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, ADMIN_UID } from '../integrations/supabase/client';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, role?: UserRole, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, role: UserRole, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; name: string; phone: string; city: string }> = {
  admin: {
    email: 'admin@swahivo.com',
    password: 'AdminPassword2026!',
    name: 'Swahivo Administrator',
    phone: '+255 770 565656',
    city: 'Dar es Salaam'
  },
  seller: {
    email: 'seller@swahivo.com',
    password: 'SellerPassword2026!',
    name: 'Ali Hassan (Prime Motors)',
    phone: '+255 777 998877',
    city: 'Dar es Salaam'
  },
  buyer: {
    email: 'buyer@swahivo.com',
    password: 'BuyerPassword2026!',
    name: 'Salim Khamis',
    phone: '+255 777 123456',
    city: 'Dar es Salaam'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('swahivo_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to load or create profile for a Supabase user
  const syncUserProfile = async (sessionUser: any): Promise<UserProfile> => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', sessionUser.id)
        .maybeSingle();

      if (profileData) {
        const up: UserProfile = {
          user_id: profileData.user_id,
          id: profileData.user_id,
          role: profileData.role as UserRole,
          full_name: profileData.full_name || 'User',
          name: profileData.full_name || 'User',
          email: profileData.email || sessionUser.email,
          phone: profileData.phone || null,
          avatar_url: profileData.avatar_url || null,
          city: profileData.city || 'Dar es Salaam',
          address: profileData.address || null,
          bio: profileData.bio || null,
          is_verified: profileData.is_verified ?? true
        };
        setUser(up);
        localStorage.setItem('swahivo_active_user', JSON.stringify(up));
        return up;
      }

      // If no profile found in database, insert one
      const roleFromMeta = (sessionUser.user_metadata?.role || (sessionUser.id === ADMIN_UID ? 'admin' : 'buyer')) as UserRole;
      const fullNameFromMeta = sessionUser.user_metadata?.full_name || (roleFromMeta === 'admin' ? 'Swahivo Administrator' : 'User');

      const newProfile = {
        user_id: sessionUser.id,
        role: roleFromMeta,
        full_name: fullNameFromMeta,
        email: sessionUser.email,
        is_verified: true
      };

      await supabase.from('profiles').insert([newProfile]);

      const up: UserProfile = {
        user_id: sessionUser.id,
        id: sessionUser.id,
        role: roleFromMeta,
        full_name: fullNameFromMeta,
        name: fullNameFromMeta,
        email: sessionUser.email,
        city: 'Dar es Salaam',
        is_verified: true
      };
      setUser(up);
      localStorage.setItem('swahivo_active_user', JSON.stringify(up));
      return up;
    } catch (e) {
      console.warn('syncUserProfile warning:', e);
      const fallback: UserProfile = {
        user_id: sessionUser.id,
        id: sessionUser.id,
        role: (sessionUser.user_metadata?.role || 'admin') as UserRole,
        full_name: sessionUser.user_metadata?.full_name || 'User',
        name: sessionUser.user_metadata?.full_name || 'User',
        email: sessionUser.email,
        is_verified: true
      };
      setUser(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          await syncUserProfile(session.user);
        } else if (isMounted) {
          // If no session exists, log in with default admin credentials so client is fully authenticated
          const adminDemo = DEMO_CREDENTIALS.admin;
          const { data: loginData } = await supabase.auth.signInWithPassword({
            email: adminDemo.email,
            password: adminDemo.password
          });
          if (loginData?.user && isMounted) {
            await syncUserProfile(loginData.user);
          }
        }
      } catch (err) {
        console.warn('Initial Supabase auth setup error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('swahivo_active_user');
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const switchRole = async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      const demo = DEMO_CREDENTIALS[newRole];
      if (demo) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: demo.email,
          password: demo.password
        });
        if (!error && data?.user) {
          await syncUserProfile(data.user);
        }
      }
    } catch (err) {
      console.warn('switchRole error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, chosenRole: UserRole = 'buyer', password?: string) => {
    setIsLoading(true);
    try {
      // Determine password (custom or demo)
      let targetPassword = password;
      if (!targetPassword && DEMO_CREDENTIALS[chosenRole]?.email === email) {
        targetPassword = DEMO_CREDENTIALS[chosenRole].password;
      }

      if (targetPassword) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: targetPassword });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          await syncUserProfile(data.user);
          return { success: true };
        }
      }

      // Try signing in with chosen role's demo account
      const demo = DEMO_CREDENTIALS[chosenRole];
      if (demo) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: demo.email,
          password: demo.password
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          await syncUserProfile(data.user);
          return { success: true };
        }
      }

      return { success: false, error: 'Password is required' };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, fullName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, full_name: fullName }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        // Insert corresponding profile in public.profiles table
        try {
          await supabase.from('profiles').insert([{
            user_id: data.user.id,
            role,
            full_name: fullName,
            email,
            is_verified: true
          }]);

          if (role === 'seller') {
            await supabase.from('seller_profiles').insert([{
              seller_id: data.user.id,
              business_name: fullName + ' Dealership',
              email
            }]);
          }
        } catch (dbErr) {
          console.warn('Profile creation after signup:', dbErr);
        }

        await syncUserProfile(data.user);
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    localStorage.removeItem('swahivo_active_user');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('swahivo_active_user', JSON.stringify(updated));

    if (user.user_id && user.user_id.length > 20) {
      try {
        const { error } = await supabase.from('profiles').update({
          full_name: updated.full_name || updated.name,
          phone: updated.phone,
          city: updated.city,
          address: updated.address,
          avatar_url: updated.avatar_url,
          bio: updated.bio,
          updated_at: new Date().toISOString()
        }).eq('user_id', user.user_id);

        if (error) {
          console.warn('Update profile in Supabase warning:', error.message);
        }
      } catch (err) {
        console.warn('Update profile in Supabase error:', err);
      }
    }
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
