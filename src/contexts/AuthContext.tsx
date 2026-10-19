import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const ADMIN_UID = '3c6a4096-d6e2-4c45-bada-45f0cbf01510';

const PRESET_USERS: Record<UserRole, UserProfile> = {
  admin: {
    user_id: ADMIN_UID,
    role: 'admin',
    full_name: 'Swahivo Admin',
    email: 'admin@swahivo.com',
    phone: '+255 770 565656',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    city: 'Dar es Salaam',
    address: 'Swahivo Tower, Ocean Road',
    is_verified: true,
  },
  seller: {
    user_id: 'seller-ali-hassan',
    role: 'seller',
    full_name: 'Ali Hassan',
    email: 'ali.hassan@swahivocars.com',
    phone: '+255 777 998877',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    city: 'Dar es Salaam',
    address: 'Ali Auto Showroom, Bagamoyo Rd',
    is_verified: true,
  },
  buyer: {
    user_id: 'buyer-salim-khamis',
    role: 'buyer',
    full_name: 'Salim Khamis',
    email: 'salim.khamis@example.com',
    phone: '+255 777 123456',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    city: 'Dar es Salaam',
    address: 'Mikocheni B, Dar es Salaam',
    is_verified: true,
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('swahivo_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    // Default to admin or visitor
    return PRESET_USERS.admin;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // If current user is the configured admin UID
        const isAdmin = session.user.id === ADMIN_UID;
        const currentRole = isAdmin ? 'admin' : (session.user.user_metadata?.role || 'buyer');
        const profile: UserProfile = {
          user_id: session.user.id,
          role: currentRole,
          full_name: session.user.user_metadata?.full_name || (isAdmin ? 'Swahivo Admin' : 'User'),
          email: session.user.email || null,
          phone: session.user.phone || null,
          avatar_url: session.user.user_metadata?.avatar_url || null,
          city: session.user.user_metadata?.city || 'Dar es Salaam',
          address: session.user.user_metadata?.address || null,
          is_verified: true
        };
        setUser(profile);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const isAdmin = session.user.id === ADMIN_UID;
        const currentRole = isAdmin ? 'admin' : (session.user.user_metadata?.role || 'buyer');
        const profile: UserProfile = {
          user_id: session.user.id,
          role: currentRole,
          full_name: session.user.user_metadata?.full_name || (isAdmin ? 'Swahivo Admin' : 'User'),
          email: session.user.email || null,
          phone: session.user.phone || null,
          avatar_url: session.user.user_metadata?.avatar_url || null,
          city: session.user.user_metadata?.city || 'Dar es Salaam',
          address: session.user.user_metadata?.address || null,
          is_verified: true
        };
        setUser(profile);
        localStorage.setItem('swahivo_active_user', JSON.stringify(profile));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('swahivo_active_user');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const switchRole = (newRole: UserRole) => {
    const newUser = PRESET_USERS[newRole];
    setUser(newUser);
    localStorage.setItem('swahivo_active_user', JSON.stringify(newUser));
  };

  const signIn = async (email: string, chosenRole: UserRole = 'buyer') => {
    setIsLoading(true);
    try {
      // In production Supabase, signInWithPassword or signInWithOtp is used
      // For instant testing without email confirmation barriers, we switch to preset or mock session
      const targetUser = PRESET_USERS[chosenRole];
      setUser({ ...targetUser, email });
      localStorage.setItem('swahivo_active_user', JSON.stringify({ ...targetUser, email }));
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

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('swahivo_active_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'buyer',
        isAuthenticated: !!user,
        isLoading,
        signIn,
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
