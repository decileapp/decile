export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chart: {
        Row: {
          id: string;
          created_at: string | null;
          chart_type: string;
          chart_meta_data: Json;
          user_id: string;
          org_id: string;
          title: string;
          public_chart: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          chart_type: string;
          chart_meta_data: Json;
          user_id: string;
          org_id: string;
          title: string;
          public_chart?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          chart_type?: string;
          chart_meta_data?: Json;
          user_id?: string;
          org_id?: string;
          title?: string;
          public_chart?: boolean;
        };
      };
      export: {
        Row: {
          id: string;
          created_at: string | null;
          spreadsheet: string;
          user_id: string;
          org_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          spreadsheet: string;
          user_id: string;
          org_id: string;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          spreadsheet?: string;
          user_id?: string;
          org_id?: string;
        };
      };
      integration_credentials: {
        Row: {
          id: string;
          created_at: string | null;
          access_token: string;
          refresh_token: string;
          scope: string;
          user_id: string;
          org_id: string;
          expiry_date: number;
          provider: string;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          access_token: string;
          refresh_token: string;
          scope: string;
          user_id: string;
          org_id: string;
          expiry_date: number;
          provider: string;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          access_token?: string;
          refresh_token?: string;
          scope?: string;
          user_id?: string;
          org_id?: string;
          expiry_date?: number;
          provider?: string;
        };
      };
      org_invitations: {
        Row: {
          id: string;
          created_at: string;
          invited_email: string;
          status: string;
          role_id: number;
          user_id: string;
          org_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          invited_email: string;
          status: string;
          role_id: number;
          user_id: string;
          org_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          invited_email?: string;
          status?: string;
          role_id?: number;
          user_id?: string;
          org_id?: string;
        };
      };
      org_users: {
        Row: {
          id: string;
          created_at: string | null;
          org_id: string;
          user_id: string;
          role_id: number;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          org_id: string;
          user_id: string;
          role_id: number;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          org_id?: string;
          user_id?: string;
          role_id?: number;
        };
      };
      organisations: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          user_id: string;
          plan_id: number;
          stripe_customer_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          user_id: string;
          plan_id?: number;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          user_id?: string;
          plan_id?: number;
          stripe_customer_id?: string | null;
        };
      };
      plan: {
        Row: {
          id: number;
          created_at: string | null;
          name: string | null;
          scheduled_query_limit: number | null;
          user_limit: number | null;
          stripe_price_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          name?: string | null;
          scheduled_query_limit?: number | null;
          user_limit?: number | null;
          stripe_price_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          name?: string | null;
          scheduled_query_limit?: number | null;
          user_limit?: number | null;
          stripe_price_id?: string | null;
        };
      };
      queries: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          body: string;
          publicQuery: boolean;
          user_id: string;
          updated_at: string;
          org_id: string;
          query_vars: Json | null;
          query_filter_by: Json | null;
          query_group_by: Json | null;
          query_sort_by: Json | null;
          query_limit: string | null;
          query_table: string | null;
          query_builder: boolean;
          query_type: string;
          database: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          body: string;
          publicQuery: boolean;
          user_id: string;
          updated_at?: string;
          org_id: string;
          query_vars?: Json | null;
          query_filter_by?: Json | null;
          query_group_by?: Json | null;
          query_sort_by?: Json | null;
          query_limit?: string | null;
          query_table?: string | null;
          query_builder?: boolean;
          query_type?: string;
          database?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          body?: string;
          publicQuery?: boolean;
          user_id?: string;
          updated_at?: string;
          org_id?: string;
          query_vars?: Json | null;
          query_filter_by?: Json | null;
          query_group_by?: Json | null;
          query_sort_by?: Json | null;
          query_limit?: string | null;
          query_table?: string | null;
          query_builder?: boolean;
          query_type?: string;
          database?: string | null;
        };
      };
      roles: {
        Row: {
          id: number;
          created_at: string | null;
          name: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          name?: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          name?: string;
        };
      };
      schedule: {
        Row: {
          id: string;
          created_at: string | null;
          user_id: string;
          org_id: string;
          export_id: string;
          name: string;
          periodicity: string;
          run_at_time: number;
          run_at_day: number;
          run_at_month_date: number;
          timestamp_utc: string;
          timestamp_user_zone: string;
          timezone: string;
          notify_email: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          user_id: string;
          org_id: string;
          export_id: string;
          name: string;
          periodicity: string;
          run_at_time: number;
          run_at_day: number;
          run_at_month_date: number;
          timestamp_utc: string;
          timestamp_user_zone: string;
          timezone: string;
          notify_email?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          user_id?: string;
          org_id?: string;
          export_id?: string;
          name?: string;
          periodicity?: string;
          run_at_time?: number;
          run_at_day?: number;
          run_at_month_date?: number;
          timestamp_utc?: string;
          timestamp_user_zone?: string;
          timezone?: string;
          notify_email?: boolean;
        };
      };
      sources: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          host: string;
          dbUser: string;
          password: string;
          port: number;
          ssl: boolean;
          user_id: string;
          org_id: string;
          database: string;
          public: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          host: string;
          dbUser: string;
          password: string;
          port: number;
          ssl: boolean;
          user_id: string;
          org_id: string;
          database: string;
          public?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          host?: string;
          dbUser?: string;
          password?: string;
          port?: number;
          ssl?: boolean;
          user_id?: string;
          org_id?: string;
          database?: string;
          public?: boolean;
        };
      };
      users: {
        Row: {
          id: string;
          email: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
