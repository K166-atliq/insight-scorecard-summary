
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to get the total count of team members
 */
export function useTeamMembersCount() {
  return useQuery({
    queryKey: ["team-members-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("team_members")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching team members count:", error);
        throw new Error(error.message);
      }

      return count || 0;
    },
  });
}

/**
 * Hook to fetch all team members with detailed evaluation data
 * Now with optional quarter and year filtering
 */
export function useDetailedMemberData(quarter: string | null = null, year: number | null = null) {
  return useQuery({
    queryKey: ["detailed-members", quarter, year],
    queryFn: async () => {
      // First, get all team members
      const { data: members, error: membersError } = await supabase
        .from("team_members")
        .select("*");

      if (membersError) {
        console.error("Error fetching team members:", membersError);
        throw new Error(membersError.message);
      }

      // Get the message IDs that match our quarter and year filters if provided
      let filteredMessageIds: string[] = [];
      if ((quarter && quarter !== "All") || (year && year > 0)) {
        // Filter appreciations by quarter and year
        let appreciationsQuery = supabase.from("appreciations").select("message_id");
        
        if (quarter && quarter !== "All") {
          appreciationsQuery = appreciationsQuery.eq("quarter", quarter);
        }
        
        if (year && year > 0) {
          appreciationsQuery = appreciationsQuery.eq("year", year);
        }
        
        const { data: appreciations, error: appreciationsError } = await appreciationsQuery;
        
        if (appreciationsError) {
          console.error("Error fetching filtered appreciations:", appreciationsError);
          throw new Error(appreciationsError.message);
        }
        
        filteredMessageIds = appreciations.map(a => a.message_id);
      }

      // For each member, get their evaluation metrics
      const membersWithDetails = await Promise.all(
        members.map(async (member) => {
          // Base query for evaluations for this user
          let evalQuery = supabase
            .from("evaluations")
            .select(
              `
              user_id,
              leadership,
              communication,
              management,
              problem_solving,
              final_score
            `
            )
            .eq("user_id", member.user_id);
          
          // Apply message_id filter if we have filters active
          if ((quarter && quarter !== "All") || (year && year > 0)) {
            if (filteredMessageIds.length > 0) {
              evalQuery = evalQuery.in("message_id", filteredMessageIds);
            } else {
              // No messages match our filters, return member with zero metrics
              return {
                ...member,
                appreciationPoints: 0,
                leadership: 0,
                communication: 0,
                management: 0,
                problemSolving: 0,
                totalScore: 0,
                lastActive: new Date().toISOString(),
              };
            }
          }

          const { data: evalData, error: evalError } = await evalQuery;

          if (evalError) {
            console.error(
              `Error fetching evaluations for user ${member.user_id}:`,
              evalError
            );
            return {
              ...member,
              appreciationPoints: 0,
              leadership: 0,
              communication: 0,
              management: 0,
              problemSolving: 0,
              totalScore: 0,
              lastActive: new Date().toISOString(),
            };
          }

          // Calculate averages and totals
          let appreciationPoints = 0;
          let totalLeadership = 0;
          let totalCommunication = 0;
          let totalManagement = 0;
          let totalProblemSolving = 0;
          let totalScore = 0;
          let evalCount = 0;

          evalData.forEach((evaluation) => {
            appreciationPoints += evaluation.final_score || 0;
            totalLeadership += evaluation.leadership || 0;
            totalCommunication += evaluation.communication || 0;
            totalManagement += evaluation.management || 0;
            totalProblemSolving += evaluation.problem_solving || 0;
            
            totalScore += (evaluation.leadership || 0) + 
                        (evaluation.communication || 0) + 
                        (evaluation.management || 0) + 
                        (evaluation.problem_solving || 0);
            
            evalCount++;
          });

          return {
            ...member,
            appreciationPoints,
            leadership: evalCount ? Math.round(totalLeadership / evalCount) : 0,
            communication: evalCount
              ? Math.round(totalCommunication / evalCount)
              : 0,
            management: evalCount ? Math.round(totalManagement / evalCount) : 0,
            problemSolving: evalCount
              ? Math.round(totalProblemSolving / evalCount)
              : 0,
            totalScore,
            lastActive: new Date().toISOString(),
          };
        })
      );

      return membersWithDetails || [];
    },
  });
}

/**
 * Hook to fetch all users
 */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*");

      if (error) {
        console.error("Error fetching users:", error);
        throw new Error(error.message);
      }

      return data || [];
    },
  });
}
