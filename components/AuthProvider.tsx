'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('chrono_window')
              .eq('id', session.user.id)
              .single();

            // If no profile exists or no chronotype, go to onboarding
            if (error || !profile?.chrono_window) {
              router.push('/onboarding');
            } else {
              router.push('/home');
            }
          } catch (err) {
            // If any error occurs, redirect to onboarding
            console.error('Profile lookup error:', err);
            router.push('/onboarding');
          }
        }

        if (event === 'SIGNED_OUT') {
          router.push('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!loading && user && pathname === '/') {
      router.push('/home');
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}