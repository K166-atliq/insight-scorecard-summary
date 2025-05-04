
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTeamMembersCount() {
  return useQuery({
    queryKey: ['team-members-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Error fetching team members count:", error);
        throw new Error(error.message);
      }
      
      return count || 0;
    }
  });
}

export function useAppreciationsCount() {
  return useQuery({
    queryKey: ['appreciations-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('appreciations')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Error fetching appreciations count:", error);
        throw new Error(error.message);
      }
      
      return count || 0;
    }
  });
}

export function useTeamLeaderboard() {
  return useQuery({
    queryKey: ['team-leaderboard'],
    queryFn: async () => {
      // Use the RPC function we just created
      const { data, error } = await supabase
        .rpc('get_leaderboard');
      
      if (error) {
        console.error("Error fetching leaderboard data:", error);
        throw new Error(error.message);
      }
      
      return data || [];
    }
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*');
      
      if (error) {
        console.error("Error fetching users:", error);
        throw new Error(error.message);
      }
      
      return data || [];
    }
  });
}

export function useDetailedMemberData() {
  return useQuery({
    queryKey: ['detailed-members'],
    queryFn: async () => {
      // First, get all team members
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('*');
      
      if (membersError) {
        console.error("Error fetching team members:", membersError);
        throw new Error(membersError.message);
      }

      // For each member, get their evaluation metrics
      const membersWithDetails = await Promise.all(
        members.map(async (member) => {
          // Get aggregated evaluation data for this user
          const { data: evalData, error: evalError } = await supabase
            .from('evaluations')
            .select(`
              user_id,
              leadership,
              communication,
              management,
              problem_solving,
              final_score
            `)
            .eq('user_id', member.user_id);

          if (evalError) {
            console.error(`Error fetching evaluations for user ${member.user_id}:`, evalError);
            return {
              ...member,
              appreciationPoints: 0,
              leadership: 0,
              communication: 0,
              management: 0,
              problemSolving: 0,
              lastActive: new Date().toISOString()
            };
          }

          // Calculate averages and totals
          let appreciationPoints = 0;
          let totalLeadership = 0;
          let totalCommunication = 0; 
          let totalManagement = 0;
          let totalProblemSolving = 0;
          let evalCount = 0;

          evalData.forEach(evaluation => {
            appreciationPoints += evaluation.final_score || 0;
            totalLeadership += evaluation.leadership || 0;
            totalCommunication += evaluation.communication || 0;
            totalManagement += evaluation.management || 0;
            totalProblemSolving += evaluation.problem_solving || 0;
            evalCount++;
          });

          return {
            ...member,
            appreciationPoints,
            leadership: evalCount ? Math.round(totalLeadership / evalCount) : 0,
            communication: evalCount ? Math.round(totalCommunication / evalCount) : 0,
            management: evalCount ? Math.round(totalManagement / evalCount) : 0,
            problemSolving: evalCount ? Math.round(totalProblemSolving / evalCount) : 0,
            lastActive: new Date().toISOString() // Placeholder for now
          };
        })
      );

      return membersWithDetails || [];
    }
  });
}

export function useKudos() {
  return useQuery({
    queryKey: ['kudos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appreciations')
        .select(`
          *,
          posted_by:posted_by_user_id(user_id, display_name),
          details:message_id(mentioned_user_id)
        `)
        .order('created_time', { ascending: false });
      
      if (error) {
        console.error("Error fetching kudos:", error);
        throw new Error(error.message);
      }
      
      return data || [];
    }
  });
}
