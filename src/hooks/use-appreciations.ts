
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to get the total count of appreciation posts with optional filtering
 */
export function useAppreciationsCount(quarter: string | null = null, year: number | null = null) {
  return useQuery({
    queryKey: ["appreciations-count", quarter, year],
    queryFn: async () => {
      let query = supabase.from("appreciations").select("*", { count: "exact", head: true });

      // Apply filters if provided
      if (quarter && quarter !== "All") {
        query = query.eq("quarter", quarter);
      }

      if (year && year > 0) {
        query = query.eq("year", year);
      }

      const { count, error } = await query;

      if (error) {
        console.error("Error fetching appreciations count:", error);
        throw new Error(error.message);
      }

      return count || 0;
    },
  });
}

/**
 * Hook to fetch all kudos/appreciations with details and optional filters
 */
export function useKudos(quarter: string | null = null, year: number | null = null) {
  return useQuery({
    queryKey: ["kudos", quarter, year],
    queryFn: async () => {
      let query = supabase
        .from("appreciations")
        .select(
          `
          *,
          posted_by:posted_by_user_id(user_id, display_name),
          details:message_id(mentioned_user_id)
        `
        );

      // Apply filters if provided
      if (quarter && quarter !== "All") {
        query = query.eq("quarter", quarter);
      }

      if (year && year > 0) {
        query = query.eq("year", year);
      }

      // Apply ordering
      query = query.order("created_time", { ascending: false });

      const { data, error } = await query;

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
