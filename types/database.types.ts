export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chart: {
        Row: {
          id: number
          created_at: string | null
          query_id: number
          chart_type: string
          chart_meta_data: Json
          org_id: number
          user_id: string
          title: string
          public_chart: boolean
        }
        Insert: {
          id?: number
          created_at?: string | null
          query_id: number
          chart_type: string
          chart_meta_data: Json
          org_id: number
          user_id: string
          title: string
          public_chart?: boolean
        }
        Update: {
          id?: number
          created_at?: string | null
          query_id?: number
          chart_type?: string
          chart_meta_data?: Json
          org_id?: number
          user_id?: string
          title?: string
          public_chart?: boolean
        }
      }
      export: {
        Row: {
          id: number
          created_at: string | null
          query_id: number
          spreadsheet: string
          user_id: string
          org_id: number
        }
        Insert: {
          id?: number
          created_at?: string | null
          query_id: number
          spreadsheet: string
          user_id: string
          org_id: number
        }
        Update: {
          id?: number
          created_at?: string | null
          query_id?: number
          spreadsheet?: string
          user_id?: string
          org_id?: number
        }
      }
      integration_credentials: {
        Row: {
          id: number
          created_at: string | null
          access_token: string
          refresh_token: string
          scope: string
          user_id: string
          expiry_date: number
          provider: string
        }
        Insert: {
          id?: number
          created_at?: string | null
          access_token: string
          refresh_token: string
          scope: string
          user_id: string
          expiry_date: number
          provider: string
        }
        Update: {
          id?: number
          created_at?: string | null
          access_token?: string
          refresh_token?: string
          scope?: string
          user_id?: string
          expiry_date?: number
          provider?: string
        }
      }
      org_invitations: {
        Row: {
          id: number
          created_at: string
          invited_email: string
          status: string
          role_id: number
          org_id: number
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          invited_email: string
          status: string
          role_id: number
          org_id: number
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          invited_email?: string
          status?: string
          role_id?: number
          org_id?: number
          user_id?: string
        }
      }
      org_users: {
        Row: {
          id: number
          created_at: string | null
          org_id: number
          user_id: string
          role_id: number
        }
        Insert: {
          id?: number
          created_at?: string | null
          org_id: number
          user_id: string
          role_id: number
        }
        Update: {
          id?: number
          created_at?: string | null
          org_id?: number
          user_id?: string
          role_id?: number
        }
      }
      organisations: {
        Row: {
          id: number
          created_at: string
          name: string
          user_id: string
          plan_id: number
          stripe_customer_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          user_id: string
          plan_id?: number
          stripe_customer_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          user_id?: string
          plan_id?: number
          stripe_customer_id?: string | null
        }
      }
      plan: {
        Row: {
          id: number
          created_at: string | null
          name: string | null
          scheduled_query_limit: number | null
          user_limit: number | null
          stripe_price_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          name?: string | null
          scheduled_query_limit?: number | null
          user_limit?: number | null
          stripe_price_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string | null
          scheduled_query_limit?: number | null
          user_limit?: number | null
          stripe_price_id?: string | null
        }
      }
      queries: {
        Row: {
          id: number
          created_at: string
          name: string
          body: string
          database: number | null
          publicQuery: boolean
          user_id: string
          updated_at: string
          org_id: number | null
          query_vars: Json | null
          query_filter_by: Json | null
          query_group_by: Json | null
          query_sort_by: Json | null
          query_limit: string | null
          query_table: string | null
          query_builder: boolean
          query_type: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          body: string
          database?: number | null
          publicQuery: boolean
          user_id: string
          updated_at?: string
          org_id?: number | null
          query_vars?: Json | null
          query_filter_by?: Json | null
          query_group_by?: Json | null
          query_sort_by?: Json | null
          query_limit?: string | null
          query_table?: string | null
          query_builder?: boolean
          query_type?: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          body?: string
          database?: number | null
          publicQuery?: boolean
          user_id?: string
          updated_at?: string
          org_id?: number | null
          query_vars?: Json | null
          query_filter_by?: Json | null
          query_group_by?: Json | null
          query_sort_by?: Json | null
          query_limit?: string | null
          query_table?: string | null
          query_builder?: boolean
          query_type?: string
        }
      }
      roles: {
        Row: {
          id: number
          created_at: string | null
          name: string
        }
        Insert: {
          id?: number
          created_at?: string | null
          name?: string
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string
        }
      }
      schedule: {
        Row: {
          id: number
          created_at: string | null
          user_id: string
          org_id: number | null
          export_id: number
          name: string
          periodicity: string
          run_at_time: number
          run_at_day: number
          run_at_month_date: number
          timestamp_utc: string
          timestamp_user_zone: string
          timezone: string
          notify_email: boolean
        }
        Insert: {
          id?: number
          created_at?: string | null
          user_id: string
          org_id?: number | null
          export_id: number
          name: string
          periodicity: string
          run_at_time: number
          run_at_day: number
          run_at_month_date: number
          timestamp_utc: string
          timestamp_user_zone: string
          timezone: string
          notify_email?: boolean
        }
        Update: {
          id?: number
          created_at?: string | null
          user_id?: string
          org_id?: number | null
          export_id?: number
          name?: string
          periodicity?: string
          run_at_time?: number
          run_at_day?: number
          run_at_month_date?: number
          timestamp_utc?: string
          timestamp_user_zone?: string
          timezone?: string
          notify_email?: boolean
        }
      }
      sources: {
        Row: {
          id: number
          created_at: string
          name: string
          host: string
          dbUser: string
          password: string
          port: number
          ssl: boolean
          user_id: string
          database: string
          org_id: number
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          host: string
          dbUser: string
          password: string
          port: number
          ssl: boolean
          user_id: string
          database: string
          org_id: number
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          host?: string
          dbUser?: string
          password?: string
          port?: number
          ssl?: boolean
          user_id?: string
          database?: string
          org_id?: number
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
        }
        Insert: {
          id: string
          email?: string | null
        }
        Update: {
          id?: string
          email?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
