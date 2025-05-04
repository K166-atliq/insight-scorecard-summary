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
      appreciations: {
        Row: {
          created_time: string | null
          message: string | null
          message_id: string
          posted_by_user_id: string | null
          quarter: string | null
          year: number | null
        }
        Insert: {
          created_time?: string | null
          message?: string | null
          message_id: string
          posted_by_user_id?: string | null
          quarter?: string | null
          year?: number | null
        }
        Update: {
          created_time?: string | null
          message?: string | null
          message_id?: string
          posted_by_user_id?: string | null
          quarter?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appreciations_posted_by_user_id_fkey"
            columns: ["posted_by_user_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["user_id"]
          },
        ]
      }
      appreciations_details: {
        Row: {
          mentioned_user_id: string
          message_id: string
        }
        Insert: {
          mentioned_user_id: string
          message_id: string
        }
        Update: {
          mentioned_user_id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appreciations_details_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "appreciations_details_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "appreciations"
            referencedColumns: ["message_id"]
          },
        ]
      }
      evaluations: {
        Row: {
          collaboration: number | null
          communication: number | null
          consistency: number | null
          final_score: number | null
          impact: number | null
          initiative: number | null
          leadership: number | null
          management: number | null
          message_id: string
          problem_solving: number | null
          reasoning: string | null
          upvote: number | null
          user_id: string
        }
        Insert: {
          collaboration?: number | null
          communication?: number | null
          consistency?: number | null
          final_score?: number | null
          impact?: number | null
          initiative?: number | null
          leadership?: number | null
          management?: number | null
          message_id: string
          problem_solving?: number | null
          reasoning?: string | null
          upvote?: number | null
          user_id: string
        }
        Update: {
          collaboration?: number | null
          communication?: number | null
          consistency?: number | null
          final_score?: number | null
          impact?: number | null
          initiative?: number | null
          leadership?: number | null
          management?: number | null
          message_id?: string
          problem_solving?: number | null
          reasoning?: string | null
          upvote?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "appreciations"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "evaluations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["user_id"]
          },
        ]
      }
      team_members: {
        Row: {
          display_name: string | null
          email: string | null
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          display_name?: string | null
          email?: string | null
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          display_name?: string | null
          email?: string | null
          is_active?: boolean | null
          user_id?: string
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
