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
      customers: {
        Row: {
          address: string
          created_at: string
          id: string
          last_order_date: string | null
          name: string
          order_count: number
          phone: string
          total_spent: number
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          last_order_date?: string | null
          name: string
          order_count?: number
          phone: string
          total_spent?: number
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          last_order_date?: string | null
          name?: string
          order_count?: number
          phone?: string
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          auto_discount_amount: number | null
          auto_discount_type: string | null
          auto_distance_meters: number | null
          created_at: string
          customer_address: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          delivery_date: string
          delivery_latitude: number | null
          delivery_longitude: number | null
          discount_amount: number | null
          distance_fee: number
          distance_meters: number
          distance_source: string | null
          duration_minutes: number | null
          end_time: string | null
          express_bonus: number | null
          final_fee: number
          id: string
          is_bad_weather: boolean | null
          is_defective: boolean | null
          is_fast_delivery: boolean | null
          is_off_hour: boolean | null
          manual_discount_percent: number | null
          month: string
          off_hour_surcharge: number | null
          order_description: string | null
          order_value: number | null
          performance_score: number | null
          pickup_latitude: number | null
          pickup_longitude: number | null
          profit: number
          start_time: string | null
          subtotal: number
          total_costs: number
          total_surcharges: number
          vendor_id: string | null
          weather_surcharge: number | null
          weight_kg: number | null
          weight_surcharge: number | null
        }
        Insert: {
          auto_discount_amount?: number | null
          auto_discount_type?: string | null
          auto_distance_meters?: number | null
          created_at?: string
          customer_address: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          delivery_date?: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          discount_amount?: number | null
          distance_fee: number
          distance_meters: number
          distance_source?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          express_bonus?: number | null
          final_fee: number
          id?: string
          is_bad_weather?: boolean | null
          is_defective?: boolean | null
          is_fast_delivery?: boolean | null
          is_off_hour?: boolean | null
          manual_discount_percent?: number | null
          month: string
          off_hour_surcharge?: number | null
          order_description?: string | null
          order_value?: number | null
          performance_score?: number | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          profit: number
          start_time?: string | null
          subtotal: number
          total_costs: number
          total_surcharges: number
          vendor_id?: string | null
          weather_surcharge?: number | null
          weight_kg?: number | null
          weight_surcharge?: number | null
        }
        Update: {
          auto_discount_amount?: number | null
          auto_discount_type?: string | null
          auto_distance_meters?: number | null
          created_at?: string
          customer_address?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_date?: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          discount_amount?: number | null
          distance_fee?: number
          distance_meters?: number
          distance_source?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          express_bonus?: number | null
          final_fee?: number
          id?: string
          is_bad_weather?: boolean | null
          is_defective?: boolean | null
          is_fast_delivery?: boolean | null
          is_off_hour?: boolean | null
          manual_discount_percent?: number | null
          month?: string
          off_hour_surcharge?: number | null
          order_description?: string | null
          order_value?: number | null
          performance_score?: number | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          profit?: number
          start_time?: string | null
          subtotal?: number
          total_costs?: number
          total_surcharges?: number
          vendor_id?: string | null
          weather_surcharge?: number | null
          weight_kg?: number | null
          weight_surcharge?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          expense_date: string
          id: string
          month: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          description: string
          expense_date?: string
          id?: string
          month: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          month?: string
        }
        Relationships: []
      }
      monthly_summary: {
        Row: {
          cash_on_hand_start: number
          created_at: string
          id: string
          month: string
          net_income: number
          total_deliveries: number
          total_discounts: number
          total_expenses: number
          total_profit: number
          total_revenue: number
          total_surcharges: number
          updated_at: string
        }
        Insert: {
          cash_on_hand_start?: number
          created_at?: string
          id?: string
          month: string
          net_income?: number
          total_deliveries?: number
          total_discounts?: number
          total_expenses?: number
          total_profit?: number
          total_revenue?: number
          total_surcharges?: number
          updated_at?: string
        }
        Update: {
          cash_on_hand_start?: number
          created_at?: string
          id?: string
          month?: string
          net_income?: number
          total_deliveries?: number
          total_discounts?: number
          total_expenses?: number
          total_profit?: number
          total_revenue?: number
          total_surcharges?: number
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string
          commission_rate: number | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          rating: number | null
          updated_at: string
          vendor_type: string
        }
        Insert: {
          address: string
          commission_rate?: number | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          rating?: number | null
          updated_at?: string
          vendor_type?: string
        }
        Update: {
          address?: string
          commission_rate?: number | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          rating?: number | null
          updated_at?: string
          vendor_type?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
