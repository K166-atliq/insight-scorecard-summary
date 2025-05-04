
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
