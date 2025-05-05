
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
      
      // Use the RPC function with params - we use Record<string, any> for compatibility
      // with the Supabase client's typing expectation for the rpc method
      const { data, error } = await supabase.rpc("get_leaderboard", params);

      if (error) {
        console.error("Error fetching leaderboard data:", error);
        throw new Error(error.message);
      }

      return data || [];
    },
  });
}
