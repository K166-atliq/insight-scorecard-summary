
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let filter_quarter = null;
    let filter_year = null;
    
    // Parse request body for parameters
    const requestData = await req.json().catch(() => ({}));
    if (requestData) {
      filter_quarter = requestData.filter_quarter || null;
      filter_year = requestData.filter_year || null;
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Get these from the Supabase project settings
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context from the request
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Query the database directly instead of using execute_sql function
    let query = supabaseClient.from('evaluations').select(`
      leadership,
      communication,
      management,
      problem_solving,
      message_id
    `);
    
    // Apply filters if provided
    if (filter_quarter || filter_year) {
      // Get message IDs from appreciations that match our filters
      let appreciationsQuery = supabaseClient.from('appreciations').select('message_id');
      
      if (filter_quarter) {
        appreciationsQuery = appreciationsQuery.eq('quarter', filter_quarter);
      }
      
      if (filter_year) {
        appreciationsQuery = appreciationsQuery.eq('year', filter_year);
      }
      
      const { data: messages, error: messagesError } = await appreciationsQuery;
      
      if (messagesError) {
        throw messagesError;
      }
      
      // Extract message IDs and filter evaluations
      const messageIds = messages.map(msg => msg.message_id);
      
      if (messageIds.length > 0) {
        query = query.in('message_id', messageIds);
      } else {
        // No messages match the filters, return empty dataset
        return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }
    
    // Execute the query
    const { data: evaluations, error: evaluationsError } = await query;
    
    if (evaluationsError) {
      throw evaluationsError;
    }
    
    // Calculate metrics
    let totalLeadership = 0;
    let totalCommunication = 0;
    let totalManagement = 0;
    let totalProblemSolving = 0;
    let count = evaluations.length;
    
    evaluations.forEach((eval) => {
      totalLeadership += eval.leadership || 0;
      totalCommunication += eval.communication || 0;
      totalManagement += eval.management || 0;
      totalProblemSolving += eval.problem_solving || 0;
    });
    
    // Calculate averages as percentages (scale of 0-100)
    const calculatePercentage = (total: number) => {
      return count > 0 ? parseFloat((total / count * 10).toFixed(2)) : 0;
    };
    
    const metrics = [
      {
        category: "Leadership",
        percentage: calculatePercentage(totalLeadership)
      },
      {
        category: "Communication",
        percentage: calculatePercentage(totalCommunication)
      },
      {
        category: "Management",
        percentage: calculatePercentage(totalManagement)
      },
      {
        category: "Problem Solving",
        percentage: calculatePercentage(totalProblemSolving)
      }
    ];
    
    // Return the data
    return new Response(JSON.stringify(metrics), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
