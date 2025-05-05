
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to get the total count of appreciation posts
 */
export function useAppreciationsCount() {
  return useQuery({
    queryKey: ["appreciations-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("appreciations")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching appreciations count:", error);
        throw new Error(error.message);
      }

      return count || 0;
    },
  });
}

/**
 * Hook to fetch all kudos/appreciations with details
 */
export function useKudos() {
  return useQuery({
    queryKey: ["kudos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appreciations")
        .select(
          `
          *,
          posted_by:posted_by_user_id(user_id, display_name),
          details:message_id(mentioned_user_id)
        `
        )
        .order("created_time", { ascending: false });

      if (error) {
        console.error("Error fetching kudos:", error);
        throw new Error(error.message);
      }

      return data || [];
    },
  });
}

/**
 * Hook to get available years from appreciations data
 */
export function useAvailableYears() {
  return useQuery({
    queryKey: ["available-years"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appreciations")
        .select("year")
        .not("year", "is", null)
        .order("year", { ascending: false });

      if (error) {
        console.error("Error fetching available years:", error);
        throw new Error(error.message);
      }

      // Extract unique years
      const years = [...new Set(data.map(item => item.year))];
      return years.filter(Boolean);
    },
  });
}
