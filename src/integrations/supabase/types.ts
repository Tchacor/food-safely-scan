export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      production_ingredients: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          production_order_id: string | null
          quantity_used: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          production_order_id?: string | null
          quantity_used: number
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          production_order_id?: string | null
          quantity_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_ingredients_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_orders: {
        Row: {
          chef_notes: string | null
          created_at: string | null
          created_by: string | null
          dish_name: string
          expiry_date: string | null
          id: string
          order_number: string
          production_date: string | null
          qr_code: string | null
          quantity: number
          status: Database["public"]["Enums"]["production_status"] | null
          updated_at: string | null
        }
        Insert: {
          chef_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          dish_name: string
          expiry_date?: string | null
          id?: string
          order_number: string
          production_date?: string | null
          qr_code?: string | null
          quantity: number
          status?: Database["public"]["Enums"]["production_status"] | null
          updated_at?: string | null
        }
        Update: {
          chef_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          dish_name?: string
          expiry_date?: string | null
          id?: string
          order_number?: string
          production_date?: string | null
          qr_code?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["production_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          batch_number: string | null
          category: Database["public"]["Enums"]["product_category"]
          cost_per_unit: number | null
          created_at: string | null
          expiry_date: string
          id: string
          is_valuable: boolean | null
          name: string
          notes: string | null
          purchase_date: string | null
          quantity: number
          status: Database["public"]["Enums"]["product_status"] | null
          supplier: string | null
          unit: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          batch_number?: string | null
          category: Database["public"]["Enums"]["product_category"]
          cost_per_unit?: number | null
          created_at?: string | null
          expiry_date: string
          id?: string
          is_valuable?: boolean | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["product_status"] | null
          supplier?: string | null
          unit?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          batch_number?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          cost_per_unit?: number | null
          created_at?: string | null
          expiry_date?: string
          id?: string
          is_valuable?: boolean | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["product_status"] | null
          supplier?: string | null
          unit?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          movement_type: string
          product_id: string | null
          quantity: number
          reason: string | null
          reference_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type: string
          product_id?: string | null
          quantity: number
          reason?: string | null
          reference_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type?: string
          product_id?: string | null
          quantity?: number
          reason?: string | null
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_category:
        | "carnes"
        | "vegetais"
        | "laticinios"
        | "graos"
        | "temperos"
        | "bebidas"
        | "outros"
      product_status: "ativo" | "vencido" | "descartado"
      production_status: "pendente" | "em_preparo" | "finalizado" | "cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_category: [
        "carnes",
        "vegetais",
        "laticinios",
        "graos",
        "temperos",
        "bebidas",
        "outros",
      ],
      product_status: ["ativo", "vencido", "descartado"],
      production_status: ["pendente", "em_preparo", "finalizado", "cancelado"],
    },
  },
} as const
