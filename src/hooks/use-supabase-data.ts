
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export function useTeamLeaderboard() {
  return useQuery({
    queryKey: ["team-leaderboard"],
    queryFn: async () => {
      // Use the RPC function we just created
      const { data, error } = await supabase.rpc("get_leaderboard");

      if (error) {
        console.error("Error fetching leaderboard data:", error);
        throw new Error(error.message);
      }

      return data || [];
    },
  });
}

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

export function useDetailedMemberData() {
  return useQuery({
    queryKey: ["detailed-members"],
    queryFn: async () => {
      // First, get all team members
      const { data: members, error: membersError } = await supabase
        .from("team_members")
        .select("*");

      if (membersError) {
        console.error("Error fetching team members:", membersError);
        throw new Error(membersError.message);
      }

      // For each member, get their evaluation metrics
      const membersWithDetails = await Promise.all(
        members.map(async (member) => {
          // Get aggregated evaluation data for this user
          const { data: evalData, error: evalError } = await supabase
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
              totalScore: 0, // Added total score default
              lastActive: new Date().toISOString(),
            };
          }

          // Calculate averages and totals
          let appreciationPoints = 0;
          let totalLeadership = 0;
          let totalCommunication = 0;
          let totalManagement = 0;
          let totalProblemSolving = 0;
          let totalScore = 0; // Added variable to calculate total score
          let evalCount = 0;

          evalData.forEach((evaluation) => {
            appreciationPoints += evaluation.final_score || 0;
            totalLeadership += evaluation.leadership || 0;
            totalCommunication += evaluation.communication || 0;
            totalManagement += evaluation.management || 0;
            totalProblemSolving += evaluation.problem_solving || 0;
            
            // Calculate total score as sum of all evaluation metrics
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
            totalScore, // Add the total score to the returned object
            lastActive: new Date().toISOString(), // Placeholder for now
          };
        })
      );

      return membersWithDetails || [];
    },
  });
}

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

export function useTeamMetrics() {
  return useQuery({
    queryKey: ["team-metrics"],
    queryFn: async () => {
      try {
        // First try to use the SQL function
        const { data, error } = await supabase.rpc("get_team_metrics");
        
        if (error) throw error;
        
        // Transform the returned data into the expected format
        return data.map((item: { category: string; percentage: number }) => ({
          name: item.category,
          score: item.percentage,
          color: getColorForCategory(item.category),
        }));
      } catch (error) {
        console.error("Error using RPC for team metrics:", error);
        
        // Fallback to the previous implementation
        const { data: evalData, error: evalError } = await supabase.from(
          "evaluations"
        ).select(`
          leadership,
          communication,
          management,
          problem_solving
        `);

        if (evalError) {
          console.error("Error in fallback query for team metrics:", evalError);
          throw new Error(evalError.message);
        }

        // Calculate averages for each metric
        let totalLeadership = 0;
        let totalCommunication = 0;
        let totalManagement = 0;
        let totalProblemSolving = 0;
        let count = evalData.length;

        evalData.forEach((evaluation) => {
          if (evaluation.leadership) totalLeadership += evaluation.leadership;
          if (evaluation.communication) totalCommunication += evaluation.communication;
          if (evaluation.management) totalManagement += evaluation.management;
          if (evaluation.problem_solving) totalProblemSolving += evaluation.problem_solving;
        });

        // Convert metrics to percentages
        const getAverage = (value: number) =>
          count > 0 ? Math.round(value / count) : 0;

        return [
          {
            name: "Leadership",
            score: getAverage(totalLeadership),
            color: "#3b82f6",
          },
          {
            name: "Communication",
            score: getAverage(totalCommunication),
            color: "#8b5cf6",
          },
          {
            name: "Management",
            score: getAverage(totalManagement),
            color: "#10b981",
          },
          {
            name: "Problem Solving",
            score: getAverage(totalProblemSolving),
            color: "#f97316",
          },
        ];
      }
    },
  });
}

// Helper function to assign colors based on category
function getColorForCategory(category: string): string {
  switch (category) {
    case 'Leadership': return '#3b82f6'; // blue
    case 'Communication': return '#8b5cf6'; // purple
    case 'Management': return '#10b981'; // green
    case 'Problem Solving': return '#f97316'; // orange
    default: return '#3b82f6';
  }
}
