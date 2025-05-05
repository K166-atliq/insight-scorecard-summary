
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
    // Parse the request to get query parameters
    const url = new URL(req.url);
    const quarter = url.searchParams.get("quarter") || null;
    const year = url.searchParams.get("year") ? parseInt(url.searchParams.get("year") || "0") : null;

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

    // Execute the SQL query with optional quarter and year filters
    const { data, error } = await supabaseClient.rpc('get_team_metrics', {
      filter_quarter: quarter !== "All" ? quarter : null,
      filter_year: year > 0 ? year : null
    });

    if (error) {
      throw error;
    }

    // Return the data
    return new Response(JSON.stringify(data), {
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
