export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          adresse: string
          arrondissement: string | null
          created_at: string
          id: string
          is_default: boolean | null
          pays: string
          quartier: string | null
          updated_at: string
          user_id: string | null
          ville: string
        }
        Insert: {
          adresse: string
          arrondissement?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          pays: string
          quartier?: string | null
          updated_at?: string
          user_id?: string | null
          ville: string
        }
        Update: {
          adresse?: string
          arrondissement?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          pays?: string
          quartier?: string | null
          updated_at?: string
          user_id?: string | null
          ville?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_action_results: {
        Row: {
          action_id: string | null
          created_at: string
          customer_responded: boolean | null
          feedback_score: number | null
          id: string
          notes: string | null
          order_created: string | null
          response_time_hours: number | null
          revenue_generated: number | null
        }
        Insert: {
          action_id?: string | null
          created_at?: string
          customer_responded?: boolean | null
          feedback_score?: number | null
          id?: string
          notes?: string | null
          order_created?: string | null
          response_time_hours?: number | null
          revenue_generated?: number | null
        }
        Update: {
          action_id?: string | null
          created_at?: string
          customer_responded?: boolean | null
          feedback_score?: number | null
          id?: string
          notes?: string | null
          order_created?: string | null
          response_time_hours?: number | null
          revenue_generated?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_action_results_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "ai_sales_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_customer_scores: {
        Row: {
          calculated_at: string
          created_at: string
          customer_id: string
          engagement_score: number
          id: string
          last_activity_days: number
          order_frequency: number
          preferred_categories: Json | null
          purchase_probability: number
          score_factors: Json | null
          total_spent: number
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          calculated_at?: string
          created_at?: string
          customer_id: string
          engagement_score?: number
          id?: string
          last_activity_days?: number
          order_frequency?: number
          preferred_categories?: Json | null
          purchase_probability?: number
          score_factors?: Json | null
          total_spent?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          calculated_at?: string
          created_at?: string
          customer_id?: string
          engagement_score?: number
          id?: string
          last_activity_days?: number
          order_frequency?: number
          preferred_categories?: Json | null
          purchase_probability?: number
          score_factors?: Json | null
          total_spent?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: []
      }
      ai_sales_actions: {
        Row: {
          action_type: string
          ai_reasoning: string | null
          confidence_level: number | null
          created_at: string
          customer_id: string
          declined_at: string | null
          executed_at: string | null
          expected_revenue: number | null
          id: string
          message_template: string
          priority_score: number
          recommended_products: Json | null
          status: string
          updated_at: string
          vendor_id: string | null
          week_number: number
          year: number
        }
        Insert: {
          action_type: string
          ai_reasoning?: string | null
          confidence_level?: number | null
          created_at?: string
          customer_id: string
          declined_at?: string | null
          executed_at?: string | null
          expected_revenue?: number | null
          id?: string
          message_template: string
          priority_score?: number
          recommended_products?: Json | null
          status?: string
          updated_at?: string
          vendor_id?: string | null
          week_number: number
          year: number
        }
        Update: {
          action_type?: string
          ai_reasoning?: string | null
          confidence_level?: number | null
          created_at?: string
          customer_id?: string
          declined_at?: string | null
          executed_at?: string | null
          expected_revenue?: number | null
          id?: string
          message_template?: string
          priority_score?: number
          recommended_products?: Json | null
          status?: string
          updated_at?: string
          vendor_id?: string | null
          week_number?: number
          year?: number
        }
        Relationships: []
      }
      behavioral_tracking: {
        Row: {
          created_at: string
          device_id: string
          events: Json | null
          id: string
          language: string | null
          referrer: string | null
          screen_resolution: string | null
          session_id: string
          timezone: string | null
          updated_at: string
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id: string
          events?: Json | null
          id?: string
          language?: string | null
          referrer?: string | null
          screen_resolution?: string | null
          session_id: string
          timezone?: string | null
          updated_at?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string
          events?: Json | null
          id?: string
          language?: string | null
          referrer?: string | null
          screen_resolution?: string | null
          session_id?: string
          timezone?: string | null
          updated_at?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          responded_to: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          responded_to?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          responded_to?: boolean
          subject?: string
        }
        Relationships: []
      }
      crm_customers: {
        Row: {
          address: string | null
          city: string
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          last_order_date: string | null
          notes: string | null
          order_count: number | null
          phone: string
          preferred_categories: Json | null
          primary_vendor: string | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          last_order_date?: string | null
          notes?: string | null
          order_count?: number | null
          phone: string
          preferred_categories?: Json | null
          primary_vendor?: string | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          last_order_date?: string | null
          notes?: string | null
          order_count?: number | null
          phone?: string
          preferred_categories?: Json | null
          primary_vendor?: string | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_customers_primary_vendor_fkey"
            columns: ["primary_vendor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_orders: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          customer_info: Json | null
          delivery_address: Json | null
          delivery_fee: number | null
          id: string
          influencer_id: string | null
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          referral_code: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          customer_info?: Json | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          id?: string
          influencer_id?: string | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          referral_code?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          customer_info?: Json | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          id?: string
          influencer_id?: string | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          referral_code?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_orders_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          additional_fee: number | null
          base_fee: number
          city: string
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          zone_name: string
        }
        Insert: {
          additional_fee?: number | null
          base_fee?: number
          city: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          zone_name: string
        }
        Update: {
          additional_fee?: number | null
          base_fee?: number
          city?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          zone_name?: string
        }
        Relationships: []
      }
      influencer_commissions: {
        Row: {
          commission_amount: number
          commission_rate: number
          created_at: string | null
          id: string
          influencer_id: string | null
          order_id: string | null
          order_total: number
          paid_at: string | null
          status: string | null
        }
        Insert: {
          commission_amount: number
          commission_rate: number
          created_at?: string | null
          id?: string
          influencer_id?: string | null
          order_id?: string | null
          order_total: number
          paid_at?: string | null
          status?: string | null
        }
        Update: {
          commission_amount?: number
          commission_rate?: number
          created_at?: string | null
          id?: string
          influencer_id?: string | null
          order_id?: string | null
          order_total?: number
          paid_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_commissions_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "customer_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_payments: {
        Row: {
          amount: number
          commission_ids: string[] | null
          created_at: string
          id: string
          influencer_id: string
          payment_date: string
          payment_method: string
          payment_reference: string | null
          payout_request_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          commission_ids?: string[] | null
          created_at?: string
          id?: string
          influencer_id: string
          payment_date?: string
          payment_method: string
          payment_reference?: string | null
          payout_request_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          commission_ids?: string[] | null
          created_at?: string
          id?: string
          influencer_id?: string
          payment_date?: string
          payment_method?: string
          payment_reference?: string | null
          payout_request_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_payments_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_payments_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "influencer_payout_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_payout_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          influencer_id: string
          payment_details: Json | null
          payment_method: string
          processed_at: string | null
          processed_by: string | null
          requested_at: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          influencer_id: string
          payment_details?: Json | null
          payment_method?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          influencer_id?: string
          payment_details?: Json | null
          payment_method?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_payout_requests_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          commission_rate: number | null
          created_at: string | null
          engagement_rate: number | null
          follower_count: number | null
          id: string
          motivation: string | null
          niche: string[] | null
          referral_code: string | null
          social_networks: Json | null
          status: Database["public"]["Enums"]["influencer_status"] | null
          total_earnings: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          commission_rate?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          follower_count?: number | null
          id?: string
          motivation?: string | null
          niche?: string[] | null
          referral_code?: string | null
          social_networks?: Json | null
          status?: Database["public"]["Enums"]["influencer_status"] | null
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          commission_rate?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          follower_count?: number | null
          id?: string
          motivation?: string | null
          niche?: string[] | null
          referral_code?: string | null
          social_networks?: Json | null
          status?: Database["public"]["Enums"]["influencer_status"] | null
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      installation_contact_logs: {
        Row: {
          contact_date: string | null
          contact_notes: string
          contact_type: string
          created_at: string | null
          created_by: string | null
          id: string
          request_id: string | null
        }
        Insert: {
          contact_date?: string | null
          contact_notes: string
          contact_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          request_id?: string | null
        }
        Update: {
          contact_date?: string | null
          contact_notes?: string
          contact_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installation_contact_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "installation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      installation_purchase_logs: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string | null
          product_description: string
          purchase_date: string
          request_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          product_description: string
          purchase_date: string
          request_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          product_description?: string
          purchase_date?: string
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installation_purchase_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "installation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      installation_requests: {
        Row: {
          admin_notes: string | null
          city: string
          created_at: string
          description: string
          email: string
          estimated_cost: number | null
          id: string
          installation_date: string | null
          name: string
          phase: string | null
          phone: string
          priority_level: string | null
          request_code: string | null
          status: string
          technician_assigned: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          admin_notes?: string | null
          city: string
          created_at?: string
          description: string
          email: string
          estimated_cost?: number | null
          id?: string
          installation_date?: string | null
          name: string
          phase?: string | null
          phone: string
          priority_level?: string | null
          request_code?: string | null
          status?: string
          technician_assigned?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          admin_notes?: string | null
          city?: string
          created_at?: string
          description?: string
          email?: string
          estimated_cost?: number | null
          id?: string
          installation_date?: string | null
          name?: string
          phase?: string | null
          phone?: string
          priority_level?: string | null
          request_code?: string | null
          status?: string
          technician_assigned?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installation_requests_technician_assigned_fkey"
            columns: ["technician_assigned"]
            isOneToOne: false
            referencedRelation: "solar_technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_mission_completions: {
        Row: {
          completed_at: string | null
          id: string
          mission_id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          mission_id: string
          points_earned?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          mission_id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_mission_completions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "loyalty_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_missions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          end_date: string | null
          id: string
          is_active: boolean | null
          max_completions_per_user: number | null
          mission_type: string
          points_reward: number
          requirements: Json | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_completions_per_user?: number | null
          mission_type?: string
          points_reward?: number
          requirements?: Json | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_completions_per_user?: number | null
          mission_type?: string
          points_reward?: number
          requirements?: Json | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          points_earned: number | null
          referral_code: string
          referred_id: string
          referrer_id: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_earned?: number | null
          referral_code: string
          referred_id: string
          referrer_id: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_earned?: number | null
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          status?: string | null
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          points: number
          source_id: string | null
          transaction_source: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          source_id?: string | null
          transaction_source?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          source_id?: string | null
          transaction_source?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "customer_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_campaigns: {
        Row: {
          attachments: Json | null
          channel: string
          completed_at: string | null
          content: string
          created_at: string
          created_by: string
          delivered_count: number
          failed_count: number
          id: string
          scheduled_at: string | null
          segments: Json | null
          sent_count: number
          status: string
          title: string
          total_recipients: number
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          channel: string
          completed_at?: string | null
          content: string
          created_at?: string
          created_by: string
          delivered_count?: number
          failed_count?: number
          id?: string
          scheduled_at?: string | null
          segments?: Json | null
          sent_count?: number
          status?: string
          title: string
          total_recipients?: number
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          channel?: string
          completed_at?: string | null
          content?: string
          created_at?: string
          created_by?: string
          delivered_count?: number
          failed_count?: number
          id?: string
          scheduled_at?: string | null
          segments?: Json | null
          sent_count?: number
          status?: string
          title?: string
          total_recipients?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_sends: {
        Row: {
          campaign_id: string
          created_at: string
          delivered_at: string | null
          failed_reason: string | null
          id: string
          message_content: string
          read_at: string | null
          recipient_name: string | null
          recipient_phone: string
          sent_at: string | null
          status: string
          updated_at: string
          whatsapp_message_id: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          delivered_at?: string | null
          failed_reason?: string | null
          id?: string
          message_content: string
          read_at?: string | null
          recipient_name?: string | null
          recipient_phone: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          whatsapp_message_id?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          delivered_at?: string | null
          failed_reason?: string | null
          id?: string
          message_content?: string
          read_at?: string | null
          recipient_name?: string | null
          recipient_phone?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "message_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          created_at: string | null
          delivery_fee: number
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_fee: number
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_fee?: number
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          customer_order_id: string | null
          id: string
          image: string | null
          order_id: string
          price_at_time: number
          product_id: string
          promo_price: number | null
          quantity: number
          title: string | null
        }
        Insert: {
          created_at?: string | null
          customer_order_id?: string | null
          id?: string
          image?: string | null
          order_id: string
          price_at_time: number
          product_id: string
          promo_price?: number | null
          quantity: number
          title?: string | null
        }
        Update: {
          created_at?: string | null
          customer_order_id?: string | null
          id?: string
          image?: string | null
          order_id?: string
          price_at_time?: number
          product_id?: string
          promo_price?: number | null
          quantity?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_customer_order_id_fkey"
            columns: ["customer_order_id"]
            isOneToOne: false
            referencedRelation: "customer_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          payment_method: string | null
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          config: Json | null
          created_at: string | null
          fees: Json | null
          id: string
          is_active: boolean | null
          method_name: string
          provider: string | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          fees?: Json | null
          id?: string
          is_active?: boolean | null
          method_name: string
          provider?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          fees?: Json | null
          id?: string
          is_active?: boolean | null
          method_name?: string
          provider?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_extensions: {
        Row: {
          city: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_flash_offer: boolean | null
          is_ya_ba_boss: boolean | null
          keywords: string[] | null
          product_id: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_flash_offer?: boolean | null
          is_ya_ba_boss?: boolean | null
          keywords?: string[] | null
          product_id: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_flash_offer?: boolean | null
          is_ya_ba_boss?: boolean | null
          keywords?: string[] | null
          product_id?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          product_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          product_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          external_product_id: string | null
          id: string
          is_verified_purchase: boolean | null
          product_id: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          external_product_id?: string | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          external_product_id?: string | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_stats: {
        Row: {
          click_count: number | null
          created_at: string | null
          id: string
          last_viewed: string | null
          product_id: string | null
          purchases: number | null
          time_spent: number | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          click_count?: number | null
          created_at?: string | null
          id?: string
          last_viewed?: string | null
          product_id?: string | null
          purchases?: number | null
          time_spent?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          click_count?: number | null
          created_at?: string | null
          id?: string
          last_viewed?: string | null
          product_id?: string | null
          purchases?: number | null
          time_spent?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_stats_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          capacity: number | null
          category: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          discount_price: number | null
          id: string
          is_on_sale: boolean | null
          name: string
          power: number | null
          price: number
          subcategory: string | null
          supplier_city: string | null
          supplier_name: string | null
          updated_at: string | null
          user_id: string | null
          voltage: number | null
        }
        Insert: {
          capacity?: number | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          id?: string
          is_on_sale?: boolean | null
          name: string
          power?: number | null
          price: number
          subcategory?: string | null
          supplier_city?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          voltage?: number | null
        }
        Update: {
          capacity?: number | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          id?: string
          is_on_sale?: boolean | null
          name?: string
          power?: number | null
          price?: number
          subcategory?: string | null
          supplier_city?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          voltage?: number | null
        }
        Relationships: []
      }
      products_cache: {
        Row: {
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          external_api_id: string
          id: string
          images: string[] | null
          is_active: boolean | null
          is_flash_offer: boolean | null
          is_ya_ba_boss: boolean | null
          keywords: string[] | null
          last_sync: string | null
          location: string | null
          metadata: Json | null
          name: string
          price: number
          promo_price: number | null
          stock: number | null
          subcategory: string | null
          supplier_name: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          external_api_id: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_flash_offer?: boolean | null
          is_ya_ba_boss?: boolean | null
          keywords?: string[] | null
          last_sync?: string | null
          location?: string | null
          metadata?: Json | null
          name: string
          price: number
          promo_price?: number | null
          stock?: number | null
          subcategory?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          external_api_id?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_flash_offer?: boolean | null
          is_ya_ba_boss?: boolean | null
          keywords?: string[] | null
          last_sync?: string | null
          location?: string | null
          metadata?: Json | null
          name?: string
          price?: number
          promo_price?: number | null
          stock?: number | null
          subcategory?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      products_unified: {
        Row: {
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          external_api_id: string
          id: string
          images: string[] | null
          is_active: boolean | null
          is_flash_offer: boolean | null
          is_ya_ba_boss: boolean | null
          keywords: string[] | null
          last_sync: string | null
          location: string | null
          metadata: Json | null
          name: string
          price: number
          promo_price: number | null
          stock: number | null
          subcategory: string | null
          supplier_name: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          external_api_id: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_flash_offer?: boolean | null
          is_ya_ba_boss?: boolean | null
          keywords?: string[] | null
          last_sync?: string | null
          location?: string | null
          metadata?: Json | null
          name: string
          price: number
          promo_price?: number | null
          stock?: number | null
          subcategory?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          external_api_id?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_flash_offer?: boolean | null
          is_ya_ba_boss?: boolean | null
          keywords?: string[] | null
          last_sync?: string | null
          location?: string | null
          metadata?: Json | null
          name?: string
          price?: number
          promo_price?: number | null
          stock?: number | null
          subcategory?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          first_name: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          last_name: string | null
          loyalty_points: number | null
          nom: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          first_name?: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          last_name?: string | null
          loyalty_points?: number | null
          nom: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name?: string | null
          loyalty_points?: number | null
          nom?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      promotion_combinations: {
        Row: {
          applied_at: string | null
          created_at: string | null
          id: string
          order_id: string | null
          promotion_ids: string[]
          total_discount: number
        }
        Insert: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          promotion_ids: string[]
          total_discount: number
        }
        Update: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          promotion_ids?: string[]
          total_discount?: number
        }
        Relationships: [
          {
            foreignKeyName: "promotion_combinations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "customer_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_usage: {
        Row: {
          created_at: string | null
          discount_applied: number
          id: string
          order_id: string | null
          promotion_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          discount_applied: number
          id?: string
          order_id?: string | null
          promotion_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          discount_applied?: number
          id?: string
          order_id?: string | null
          promotion_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "customer_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usage_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          combination_rules: Json | null
          created_at: string | null
          created_by: string | null
          customer_history_requirement: Json | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id: string
          is_active: boolean | null
          is_combinable: boolean | null
          max_uses_per_user: number | null
          min_order_amount: number | null
          name: string
          promo_code: string | null
          start_date: string
          target_categories: string[] | null
          target_cities: string[] | null
          usage_limit: number | null
          usage_type: string | null
          used_count: number | null
        }
        Insert: {
          combination_rules?: Json | null
          created_at?: string | null
          created_by?: string | null
          customer_history_requirement?: Json | null
          description?: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id?: string
          is_active?: boolean | null
          is_combinable?: boolean | null
          max_uses_per_user?: number | null
          min_order_amount?: number | null
          name: string
          promo_code?: string | null
          start_date: string
          target_categories?: string[] | null
          target_cities?: string[] | null
          usage_limit?: number | null
          usage_type?: string | null
          used_count?: number | null
        }
        Update: {
          combination_rules?: Json | null
          created_at?: string | null
          created_by?: string | null
          customer_history_requirement?: Json | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string
          id?: string
          is_active?: boolean | null
          is_combinable?: boolean | null
          max_uses_per_user?: number | null
          min_order_amount?: number | null
          name?: string
          promo_code?: string | null
          start_date?: string
          target_categories?: string[] | null
          target_cities?: string[] | null
          usage_limit?: number | null
          usage_type?: string | null
          used_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visits: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: unknown | null
          page_path: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          page_path: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          visitor_id?: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          page_path?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      solar_technicians: {
        Row: {
          city: string
          created_at: string
          email: string | null
          experience_years: number
          id: string
          is_active: boolean
          name: string
          phone: string
          rating: number
          specializations: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city: string
          created_at?: string
          email?: string | null
          experience_years?: number
          id?: string
          is_active?: boolean
          name: string
          phone: string
          rating?: number
          specializations?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          email?: string | null
          experience_years?: number
          id?: string
          is_active?: boolean
          name?: string
          phone?: string
          rating?: number
          specializations?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_global: boolean | null
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_global?: boolean | null
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_global?: boolean | null
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          city: string
          country: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          postal_code: string | null
          state: string | null
          street: string
          user_id: string | null
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string | null
          state?: string | null
          street: string
          user_id?: string | null
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string | null
          state?: string | null
          street?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          product_image: string | null
          product_name: string
          product_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          product_image?: string | null
          product_name: string
          product_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          product_image?: string | null
          product_name?: string
          product_price?: number
          user_id?: string
        }
        Relationships: []
      }
      visitor_sessions: {
        Row: {
          device_info: Json | null
          first_visit: string
          id: string
          last_activity: string
          location_info: Json | null
          page_views: number | null
          session_id: string
          visitor_id: string
        }
        Insert: {
          device_info?: Json | null
          first_visit?: string
          id?: string
          last_activity?: string
          location_info?: Json | null
          page_views?: number | null
          session_id: string
          visitor_id: string
        }
        Update: {
          device_info?: Json | null
          first_visit?: string
          id?: string
          last_activity?: string
          location_info?: Json | null
          page_views?: number | null
          session_id?: string
          visitor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_products: {
        Row: {
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          external_api_id: string | null
          id: string | null
          images: string[] | null
          is_active: boolean | null
          is_flash_offer: boolean | null
          is_ya_ba_boss: boolean | null
          keywords: string[] | null
          last_sync: string | null
          location: string | null
          metadata: Json | null
          name: string | null
          price: number | null
          promo_price: number | null
          stock: number | null
          subcategory: string | null
          supplier_name: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          external_api_id?: string | null
          id?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_flash_offer?: boolean | null
          is_ya_ba_boss?: boolean | null
          keywords?: string[] | null
          last_sync?: string | null
          location?: string | null
          metadata?: Json | null
          name?: string | null
          price?: number | null
          promo_price?: number | null
          stock?: number | null
          subcategory?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          external_api_id?: string | null
          id?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_flash_offer?: boolean | null
          is_ya_ba_boss?: boolean | null
          keywords?: string[] | null
          last_sync?: string | null
          location?: string | null
          metadata?: Json | null
          name?: string | null
          price?: number | null
          promo_price?: number | null
          stock?: number | null
          subcategory?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_review_points: {
        Args: { review_id: string; user_id: string }
        Returns: boolean
      }
      calculate_customer_engagement_score: {
        Args: { p_customer_id: string; p_vendor_id: string }
        Returns: number
      }
      check_promotion_eligibility: {
        Args: {
          p_promotion_id: string
          p_user_id: string
          p_order_total: number
          p_customer_city?: string
          p_product_categories?: string[]
        }
        Returns: Json
      }
      cleanup_old_products: {
        Args: { cutoff_hours?: number }
        Returns: number
      }
      cleanup_old_tracking_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      complete_mission: {
        Args: { mission_id: string; user_id: string }
        Returns: boolean
      }
      complete_referral: {
        Args: { referral_id: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_current_week_number: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      increment_product_purchases: {
        Args: { pid: string }
        Returns: undefined
      }
      increment_product_views: {
        Args: { pid: string }
        Returns: undefined
      }
    }
    Enums: {
      gender_type: "male" | "female" | "other"
      influencer_status: "pending" | "approved" | "rejected" | "suspended"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method:
        | "cash_on_delivery"
        | "mobile_money"
        | "bank_transfer"
        | "card"
      user_role:
        | "user"
        | "admin"
        | "seller"
        | "team_lead"
        | "sales_manager"
        | "influencer"
    }
    CompositeTypes: {
      address_type: {
        id: string | null
        user_id: string | null
        ville: string | null
        arrondissement: string | null
        quartier: string | null
        adresse: string | null
        pays: string | null
        is_default: boolean | null
        created_at: string | null
        updated_at: string | null
      }
      profile_type: {
        id: string | null
        nom: string | null
        gender: Database["public"]["Enums"]["gender_type"] | null
        phone: string | null
        created_at: string | null
        updated_at: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_type: ["male", "female", "other"],
      influencer_status: ["pending", "approved", "rejected", "suspended"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: [
        "cash_on_delivery",
        "mobile_money",
        "bank_transfer",
        "card",
      ],
      user_role: [
        "user",
        "admin",
        "seller",
        "team_lead",
        "sales_manager",
        "influencer",
      ],
    },
  },
} as const
