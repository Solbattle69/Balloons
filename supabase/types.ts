// Auto-generated types for Supabase schema.
// To regenerate, run:
//   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > supabase/types.ts
// Install the CLI first: npm install -g supabase

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      balloons: {
        Row: {
          id: string
          image_url: string
          thumbnail_url: string | null
          tags: string[]
          color: string | null
          size: 'small' | 'medium' | 'large' | null
          shape: 'round' | 'long' | 'heart' | 'star' | 'other' | null
          event_name: string | null
          event_location: string | null
          event_date: string | null
          event_id: string | null
          embedding: number[] | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['balloons']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['balloons']['Insert']>
      }
      events: {
        Row: {
          id: string
          name: string
          location: string | null
          date: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
    }
  }
}
