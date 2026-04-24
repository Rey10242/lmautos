import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "super_admin";

export const useUserRoles = () => {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["user-roles", user?.id],
    queryFn: async (): Promise<AppRole[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []).map((r: any) => r.role as AppRole);
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  return {
    roles: query.data || [],
    isSuperAdmin: (query.data || []).includes("super_admin"),
    isAdmin: (query.data || []).length > 0,
    isLoading: query.isLoading,
  };
};
