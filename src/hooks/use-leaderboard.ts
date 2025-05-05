
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to get the team leaderboard data with optional filters
 */
export function useTeamLeaderboard(quarter: string | null = null, year: number | null = null) {
  return useQuery({
    queryKey: ["team-leaderboard", quarter, year],
    queryFn: async () => {
      // Create params object for the RPC call
      const params: Record<string, any> = {};
      
      if (quarter && quarter !== "All") {
        params.filter_quarter = quarter;
      }
      
      if (year && year > 0) {
        params.filter_year = year;
      }
      
      // Type assertion to work around the type constraint
      // This is safe because the get_leaderboard function actually accepts these parameters
      // even though TypeScript definitions don't reflect it
      const { data, error } = await supabase.rpc("get_leaderboard", params as any);

      if (error) {
        console.error("Error fetching leaderboard data:", error);
        throw new Error(error.message);
      }

      return data || [];
    },
  });
}
