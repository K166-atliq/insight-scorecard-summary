
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
      
      // Use the RPC function with params
      const { data, error } = await supabase.rpc("get_leaderboard", params);

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

export function useTeamMetrics(quarter: string | null = null, year: number | null = null) {
  return useQuery({
    queryKey: ["team-metrics", quarter, year],
    queryFn: async () => {
      try {
        // Build the function URL and parameters
        const functionName = "get_team_metrics";
        let functionParams: Record<string, any> = {};
        
        // Add query parameters if they exist
        if (quarter && quarter !== "All") {
          functionParams.filter_quarter = quarter;
        }
        
        if (year && year > 0) {
          functionParams.filter_year = year;
        }
        
        // Invoke the function with parameters
        const { data: metricsData, error } = await supabase.functions.invoke(functionName, {
          body: functionParams
        });
        
        if (error) throw error;
        
        // Transform the returned data into the expected format
        return metricsData.map((item: { category: string; percentage: number }) => ({
          name: item.category,
          score: item.percentage,
          color: getColorForCategory(item.category),
        }));
      } catch (error) {
        console.error("Error using function for team metrics:", error);
        
        // Fallback to direct database query when edge function fails
        const { data: evalData, error: evalError } = await supabase
          .from("evaluations")
          .select(`
            leadership,
            communication,
            management,
            problem_solving
          `);

        // Apply filters if they exist
        let filteredData = evalData;
        
        if ((quarter && quarter !== "All") || (year && year > 0)) {
          // Get IDs for messages that match our filters
          let messageQuery = supabase
            .from("appreciations")
            .select("message_id");
            
          if (quarter && quarter !== "All") {
            messageQuery = messageQuery.eq("quarter", quarter);
          }
            
          if (year && year > 0) {
            messageQuery = messageQuery.eq("year", year);
          }
            
          const { data: messages, error: messagesError } = await messageQuery;
          
          if (messagesError) {
            console.error("Error fetching filtered messages:", messagesError);
            throw new Error(messagesError.message);
          }
          
          // Extract message IDs
          const messageIds = messages.map(msg => msg.message_id);
          
          // Filter evaluation data to only include these message IDs
          if (messageIds.length > 0) {
            const { data: filteredEvals, error: filteredError } = await supabase
              .from("evaluations")
              .select(`
                leadership,
                communication,
                management,
                problem_solving
              `)
              .in("message_id", messageIds);
              
            if (filteredError) {
              console.error("Error fetching filtered evaluations:", filteredError);
              throw new Error(filteredError.message);
            }
            
            filteredData = filteredEvals;
          } else {
            // No messages match the filters, return empty dataset
            filteredData = [];
          }
        }

        if (evalError && !filteredData) {
          console.error("Error in fallback query for team metrics:", evalError);
          throw new Error(evalError.message);
        }

        // Calculate averages for each metric
        let totalLeadership = 0;
        let totalCommunication = 0;
        let totalManagement = 0;
        let totalProblemSolving = 0;
        let count = filteredData ? filteredData.length : 0;

        filteredData?.forEach((evaluation) => {
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

// Add a function to get available years from data
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
