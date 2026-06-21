/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Database {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string;
          registration_id: string;
          student_name: string;
          dob: string;
          student_class: string;
          school_name: string;
          school_city: string;
          school_code: string | null;
          school_id: string | null;
          parent_name: string;
          mobile_number: string | null;
          whatsapp_number: string;
          parent_email: string;
          country: string;
          state: string;
          district: string;
          language: string;
          why_participating: string;
          how_heard: string;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          referral_code: string | null;
          payment_id: string | null;
          payment_status: string;
          registration_status: string;
          mobile_verified: boolean;
          admin_notes: string | null;
          user_id: string | null;
          registration_source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          registration_id: string;
          student_name: string;
          dob: string;
          student_class: string;
          school_name: string;
          school_city: string;
          school_code?: string | null;
          school_id?: string | null;
          parent_name: string;
          mobile_number?: string | null;
          whatsapp_number: string;
          parent_email: string;
          country: string;
          state: string;
          district: string;
          language: string;
          why_participating: string;
          how_heard: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          referral_code?: string | null;
          payment_id?: string | null;
          payment_status?: string;
          registration_status?: string;
          mobile_verified?: boolean;
          admin_notes?: string | null;
          user_id?: string | null;
          registration_source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          registration_id?: string;
          student_name?: string;
          dob?: string;
          student_class?: string;
          school_name?: string;
          school_city?: string;
          school_code?: string | null;
          school_id?: string | null;
          parent_name?: string;
          mobile_number?: string | null;
          whatsapp_number?: string;
          parent_email?: string;
          country?: string;
          state?: string;
          district?: string;
          language?: string;
          why_participating?: string;
          how_heard?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          referral_code?: string | null;
          payment_id?: string | null;
          payment_status?: string;
          registration_status?: string;
          mobile_verified?: boolean;
          admin_notes?: string | null;
          user_id?: string | null;
          registration_source?: string;
          created_at?: string;
        };
      };
      registration_events: {
        Row: {
          id: string;
          registration_id: string;
          event_type: string;
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          registration_id: string;
          event_type: string;
          metadata?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          registration_id?: string;
          event_type?: string;
          metadata?: Record<string, any>;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          created_at: string;
          status: 'pending' | 'in_progress' | 'resolved' | 'spam';
          admin_notes: string | null;
          priority: 'low' | 'normal' | 'high' | 'urgent';
          source: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          created_at?: string;
          status?: 'pending' | 'in_progress' | 'resolved' | 'spam';
          admin_notes?: string | null;
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          source?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          created_at?: string;
          status?: 'pending' | 'in_progress' | 'resolved' | 'spam';
          admin_notes?: string | null;
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          source?: string;
        };
      };
      system_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          phone_number: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone_number: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          role?: string;
          created_at?: string;
        };
      };
      whatsapp_logs: {
        Row: {
          id: string;
          phone_number_masked: string;
          message_type: string;
          status: string;
          meta_message_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone_number_masked: string;
          message_type: string;
          status: string;
          meta_message_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone_number_masked?: string;
          message_type?: string;
          status?: string;
          meta_message_id?: string | null;
          created_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          school_code: string;
          name: string;
          city: string;
          board: string;
          school_type: string;
          coordinator_name: string;
          coordinator_mobile: string;
          coordinator_email: string;
          quota: number;
          used_quota: number;
          sponsorship_mode: string;
          pin: string;
          status: string;
          notes: string | null;
          created_by: string | null;
          is_featured: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          school_code: string;
          name: string;
          city: string;
          board: string;
          school_type: string;
          coordinator_name: string;
          coordinator_mobile: string;
          coordinator_email: string;
          quota?: number;
          used_quota?: number;
          sponsorship_mode?: string;
          pin: string;
          status?: string;
          notes?: string | null;
          created_by?: string | null;
          is_featured?: boolean;
          joined_at?: string;
        };
        Update: {
          id?: string;
          school_code?: string;
          name?: string;
          city?: string;
          board?: string;
          school_type?: string;
          coordinator_name?: string;
          coordinator_mobile?: string;
          coordinator_email?: string;
          quota?: number;
          used_quota?: number;
          sponsorship_mode?: string;
          pin?: string;
          status?: string;
          notes?: string | null;
          created_by?: string | null;
          is_featured?: boolean;
          joined_at?: string;
        };
      };
    };
  };
}
