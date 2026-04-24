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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      consignment_requests: {
        Row: {
          ciudad: string
          correo: string
          created_at: string
          descripcion: string | null
          fotos: Json | null
          id: string
          kilometraje: number
          marca: string
          modelo: string
          nombre: string
          precio_esperado: number | null
          status: string | null
          telefono: string
          year: number
        }
        Insert: {
          ciudad: string
          correo: string
          created_at?: string
          descripcion?: string | null
          fotos?: Json | null
          id?: string
          kilometraje: number
          marca: string
          modelo: string
          nombre: string
          precio_esperado?: number | null
          status?: string | null
          telefono: string
          year: number
        }
        Update: {
          ciudad?: string
          correo?: string
          created_at?: string
          descripcion?: string | null
          fotos?: Json | null
          id?: string
          kilometraje?: number
          marca?: string
          modelo?: string
          nombre?: string
          precio_esperado?: number | null
          status?: string | null
          telefono?: string
          year?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          correo: string | null
          created_at: string
          id: string
          mensaje: string
          nombre: string
          status: string | null
          telefono: string
        }
        Insert: {
          correo?: string | null
          created_at?: string
          id?: string
          mensaje: string
          nombre: string
          status?: string | null
          telefono: string
        }
        Update: {
          correo?: string | null
          created_at?: string
          id?: string
          mensaje?: string
          nombre?: string
          status?: string | null
          telefono?: string
        }
        Relationships: []
      }
      vehicle_views: {
        Row: {
          id: string
          vehicle_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_views_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          cilindrada: string | null
          color: string | null
          combustible: string
          comision_pactada: number | null
          comprador_cedula: string | null
          comprador_ciudad: string | null
          comprador_correo: string | null
          comprador_direccion: string | null
          comprador_nombre: string | null
          comprador_telefono: string | null
          created_at: string
          descripcion: string | null
          destacado: boolean | null
          estado_vehiculo: string | null
          fecha_ingreso: string | null
          fecha_venta: string | null
          id: string
          images: Json | null
          kilometraje: number
          marca: string
          modelo: string
          num_puertas: number | null
          placa: string | null
          price: number
          propietario_cedula: string | null
          propietario_correo: string | null
          propietario_direccion: string | null
          propietario_nombre: string | null
          propietario_notas: string | null
          propietario_placa: string | null
          propietario_telefono: string | null
          propietario_tipo_documento: string | null
          recien_ingresado: boolean | null
          slug: string
          status: string | null
          tipo_propiedad: string
          traccion: string | null
          transito: string | null
          transmision: string
          ubicacion: string
          updated_at: string
          user_id: string
          valor_venta: number | null
          vendedor_nombre: string | null
          version: string | null
          year: number
        }
        Insert: {
          cilindrada?: string | null
          color?: string | null
          combustible: string
          comision_pactada?: number | null
          comprador_cedula?: string | null
          comprador_ciudad?: string | null
          comprador_correo?: string | null
          comprador_direccion?: string | null
          comprador_nombre?: string | null
          comprador_telefono?: string | null
          created_at?: string
          descripcion?: string | null
          destacado?: boolean | null
          estado_vehiculo?: string | null
          fecha_ingreso?: string | null
          fecha_venta?: string | null
          id?: string
          images?: Json | null
          kilometraje: number
          marca: string
          modelo: string
          num_puertas?: number | null
          placa?: string | null
          price: number
          propietario_cedula?: string | null
          propietario_correo?: string | null
          propietario_direccion?: string | null
          propietario_nombre?: string | null
          propietario_notas?: string | null
          propietario_placa?: string | null
          propietario_telefono?: string | null
          propietario_tipo_documento?: string | null
          recien_ingresado?: boolean | null
          slug: string
          status?: string | null
          tipo_propiedad?: string
          traccion?: string | null
          transito?: string | null
          transmision: string
          ubicacion?: string
          updated_at?: string
          user_id: string
          valor_venta?: number | null
          vendedor_nombre?: string | null
          version?: string | null
          year: number
        }
        Update: {
          cilindrada?: string | null
          color?: string | null
          combustible?: string
          comision_pactada?: number | null
          comprador_cedula?: string | null
          comprador_ciudad?: string | null
          comprador_correo?: string | null
          comprador_direccion?: string | null
          comprador_nombre?: string | null
          comprador_telefono?: string | null
          created_at?: string
          descripcion?: string | null
          destacado?: boolean | null
          estado_vehiculo?: string | null
          fecha_ingreso?: string | null
          fecha_venta?: string | null
          id?: string
          images?: Json | null
          kilometraje?: number
          marca?: string
          modelo?: string
          num_puertas?: number | null
          placa?: string | null
          price?: number
          propietario_cedula?: string | null
          propietario_correo?: string | null
          propietario_direccion?: string | null
          propietario_nombre?: string | null
          propietario_notas?: string | null
          propietario_placa?: string | null
          propietario_telefono?: string | null
          propietario_tipo_documento?: string | null
          recien_ingresado?: boolean | null
          slug?: string
          status?: string | null
          tipo_propiedad?: string
          traccion?: string | null
          transito?: string | null
          transmision?: string
          ubicacion?: string
          updated_at?: string
          user_id?: string
          valor_venta?: number | null
          vendedor_nombre?: string | null
          version?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      vehicle_view_counts: {
        Row: {
          total_views: number | null
          vehicle_id: string | null
          views_last_7_days: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_views_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
