import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const config = Constants?.expoConfig ?? Constants?.manifest ?? {};
const extra = config?.extra ?? {};

const supabaseUrl = extra?.supabaseUrl ?? process.env.SUPABASE_URL ?? '';
const supabaseAnonKey = extra?.supabaseAnonKey ?? process.env.SUPABASE_ANON_KEY ?? '';

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
} else {
  console.warn('Supabase environment variables are not configured.');
}

export const isSupabaseConfigured = Boolean(supabase);

export default supabase;
