import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  chrono_window: string;
  city_name?: string;
  city_lat?: number;
  city_lon?: number;
  created_at: string;
}

export interface Metric {
  id: string;
  user_id: string;
  date: string;
  reaction_ms?: number;
  mood_score?: number;
  created_at: string;
}

export interface Plan {
  id: string;
  user_id: string;
  date: string;
  sunrise_time: string;
  advice: string;
  created_at: string;
}