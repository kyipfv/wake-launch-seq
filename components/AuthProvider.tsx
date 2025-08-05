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
        console.log('Auth state change:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, checking profile...');
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('chrono_window')
              .eq('id', session.user.id)
              .single();

            console.log('Profile lookup result:', { profile, error });

            // If no profile exists or no chronotype, go to onboarding
            if (error || !profile?.chrono_window) {
              console.log('Redirecting to onboarding...');
              router.push('/onboarding');
            } else {
              console.log('Redirecting to home...');
              router.push('/home');
            }
          } catch (err) {
            // If any error occurs, redirect to onboarding
            console.error('Profile lookup error:', err);
            console.log('Redirecting to onboarding due to error...');
            router.push('/onboarding');
          }
        }

        if (event === 'SIGNED_OUT') {
          console.log('User signed out, redirecting to home page...');
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
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}