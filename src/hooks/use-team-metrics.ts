
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to fetch team metrics data with optional filters
 */
export function useTeamMetrics(quarter: string | null = null, year: number | null = null) {
  return useQuery({
    queryKey: ["team-metrics", quarter, year],
    queryFn: async () => {
      try {
        // Build the function parameters
        const functionParams: { filter_quarter?: string; filter_year?: number } = {};
        
        // Add query parameters if they exist
        if (quarter && quarter !== "All") {
          functionParams.filter_quarter = quarter;
        }
        
        if (year && year > 0) {
          functionParams.filter_year = year;
        }
        
        // Invoke the function with parameters
        const { data: metricsData, error } = await supabase.functions.invoke("get_team_metrics", {
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
        let query = supabase.from("evaluations").select(`
          leadership,
          communication,
          management,
          problem_solving
        `);
        
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
            query = query.in("message_id", messageIds);
          } else {
            // No messages match the filters, return empty dataset
            return [];
          }
        }
        
        const { data: evalData, error: evalError } = await query;
        
        if (evalError) {
          console.error("Error in fallback query for team metrics:", evalError);
          throw new Error(evalError.message);
        }

        // Calculate averages for each metric
        let totalLeadership = 0;
        let totalCommunication = 0;
        let totalManagement = 0;
        let totalProblemSolving = 0;
        let count = evalData ? evalData.length : 0;

        evalData?.forEach((evaluation) => {
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
