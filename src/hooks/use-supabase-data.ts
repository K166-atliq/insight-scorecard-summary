
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
      const { data, error } = await supabase
        .rpc('get_leaderboard')
        .limit(5);
      
      if (error) {
        // If the RPC function doesn't exist, try the raw query
        const { data: rawData, error: rawError } = await supabase
          .from('evaluations')
          .select(`
            user_id,
            team_members!inner(user_id, display_name, is_active)
          `)
          .eq('team_members.is_active', true)
          .then(result => {
            if (result.error) throw result.error;
            
            // Process and aggregate data
            const aggregatedData = Object.values(result.data.reduce((acc, curr) => {
              const userId = curr.user_id;
              const displayName = curr.team_members?.display_name || 'Unknown';
              const finalScore = curr.final_score || 0;
              
              if (!acc[userId]) {
                acc[userId] = {
                  user_id: userId,
                  display_name: displayName,
                  total_score: 0
                };
              }
              
              acc[userId].total_score += finalScore;
              return acc;
            }, {}))
            .sort((a, b) => b.total_score - a.total_score)
            .slice(0, 5)
            .map(item => ({
              ...item,
              avatar: null // Add a placeholder for the avatar
            }));
            
            return { data: aggregatedData, error: null };
          });
        
        if (rawError) {
          console.error("Error fetching leaderboard data:", rawError);
          throw new Error(rawError.message);
        }
        
        return rawData || [];
      }
      
      return data || [];
    }
  });
}

export function useKudosTypes() {
  return useQuery({
    queryKey: ['kudos-types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('kudos_types').select('*');
      
      if (error) {
        console.error("Error fetching kudos types:", error);
        throw new Error(error.message);
      }
      
      return data;
    }
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team_members').select('*');
      
      if (error) {
        console.error("Error fetching users:", error);
        throw new Error(error.message);
      }
      
      return data;
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
      
      return data;
    }
  });
}
