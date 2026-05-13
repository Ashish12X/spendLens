import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client if env vars are missing so we don't crash on import
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side client with service role key (for API routes only)
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase environment variables are not configured');
  }
  return createClient(supabaseUrl, serviceKey);
}

export type Database = {
  public: {
    Tables: {
      audits: {
        Row: {
          id: string;
          form_data: Record<string, unknown>;
          results: Record<string, unknown>[];
          total_monthly_spend: number;
          total_monthly_savings: number;
          total_annual_savings: number;
          savings_percentage: number;
          use_case: string;
          team_size: number;
          ai_summary: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audits']['Row'], 'created_at'>;
      };
      leads: {
        Row: {
          id: string;
          audit_id: string;
          email: string;
          company: string | null;
          role: string | null;
          team_size: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'created_at'>;
      };
    };
  };
};
