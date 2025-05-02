
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase.from('users').select('*');
      
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
        .from('kudos')
        .select(`
          *,
          sender:sender_id(id, name),
          receiver:receiver_id(id, name),
          type:type_id(id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching kudos:", error);
        throw new Error(error.message);
      }
      
      return data;
    }
  });
}
