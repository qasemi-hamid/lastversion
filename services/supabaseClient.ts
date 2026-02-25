
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const DEFAULT_SUPABASE_URL = 'https://xacjexmmqknlowpotjjh.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2pleG1tcWtubG93cG90ampoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjQ4MDUsImV4cCI6MjA4MTYwMDgwNX0.FFQ-KFfT0kHGLEObuVu6S3Lw2uz5Cm8Nw0Fx22t6BXE';

let supabase: SupabaseClient | null = null;
// Track current configuration to avoid accessing protected properties on SupabaseClient
let currentUrl: string | null = null;
let currentKey: string | null = null;

/**
 * Returns a shared instance of the Supabase client.
 * If the configuration (url or key) changes, a new client is instantiated.
 */
export const getSupabaseClient = (url?: string, key?: string): SupabaseClient => {
  let finalUrl = DEFAULT_SUPABASE_URL;
  let finalKey = DEFAULT_SUPABASE_KEY;

  try {
      const saved = localStorage.getItem('GIFTINO_SUPABASE_CONFIG');
      if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.url && parsed.key) {
              finalUrl = parsed.url;
              finalKey = parsed.key;
          }
      }
  } catch (e) {
      console.warn("Error reading Supabase config from storage, using defaults.", e);
  }

  if (url) finalUrl = url;
  if (key) finalKey = key;

  // Use local tracking variables to compare configuration to avoid Class member access errors
  if (!supabase || currentUrl !== finalUrl || currentKey !== finalKey) {
      try {
          supabase = createClient(finalUrl, finalKey, {
              auth: {
                  persistSession: false,
                  autoRefreshToken: false,
                  detectSessionInUrl: false
              },
              db: {
                  schema: 'public',
              },
          });
          currentUrl = finalUrl;
          currentKey = finalKey;
      } catch (e) {
          console.error("Failed to initialize Supabase client", e);
          supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
          currentUrl = DEFAULT_SUPABASE_URL;
          currentKey = DEFAULT_SUPABASE_KEY;
      }
  }
  
  return supabase!;
};

export const checkConnection = async (url: string, key: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const tempClient = createClient(url, key);
        const { error } = await tempClient.from('users').select('count', { count: 'exact', head: true });
        if (error) {
            if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
                return { success: false, message: 'کلید API (Anon Key) نامعتبر است.' };
            }
            if (error.message?.includes('FetchError') || error.message?.includes('connection')) {
                return { success: false, message: 'خطا در برقراری ارتباط با سرور. لطفاً URL را بررسی کنید.' };
            }
            throw error;
        }
        return { success: true };
    } catch (err: any) {
        return { success: false, message: err.message || 'خطا در اتصال به پایگاه داده' };
    }
};
