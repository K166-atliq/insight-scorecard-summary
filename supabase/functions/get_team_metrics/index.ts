
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

    // Construct the SQL query to get metrics data with optional filters
    let query = `
      SELECT
          'Leadership' AS category,
          ROUND(AVG(leadership), 2) AS percentage
      FROM evaluations
      ${filter_quarter || filter_year ? 'WHERE message_id IN (SELECT message_id FROM appreciations WHERE 1=1' : ''}
      ${filter_quarter ? ` AND quarter = '${filter_quarter}'` : ''}
      ${filter_year ? ` AND year = ${filter_year}` : ''}
      ${filter_quarter || filter_year ? ')' : ''}
      UNION ALL
      SELECT
          'Communication' AS category,
          ROUND(AVG(communication), 2) AS percentage
      FROM evaluations
      ${filter_quarter || filter_year ? 'WHERE message_id IN (SELECT message_id FROM appreciations WHERE 1=1' : ''}
      ${filter_quarter ? ` AND quarter = '${filter_quarter}'` : ''}
      ${filter_year ? ` AND year = ${filter_year}` : ''}
      ${filter_quarter || filter_year ? ')' : ''}
      UNION ALL
      SELECT
          'Management' AS category,
          ROUND(AVG(management), 2) AS percentage
      FROM evaluations
      ${filter_quarter || filter_year ? 'WHERE message_id IN (SELECT message_id FROM appreciations WHERE 1=1' : ''}
      ${filter_quarter ? ` AND quarter = '${filter_quarter}'` : ''}
      ${filter_year ? ` AND year = ${filter_year}` : ''}
      ${filter_quarter || filter_year ? ')' : ''}
      UNION ALL
      SELECT
          'Problem Solving' AS category,
          ROUND(AVG(problem_solving), 2) AS percentage
      FROM evaluations
      ${filter_quarter || filter_year ? 'WHERE message_id IN (SELECT message_id FROM appreciations WHERE 1=1' : ''}
      ${filter_quarter ? ` AND quarter = '${filter_quarter}'` : ''}
      ${filter_year ? ` AND year = ${filter_year}` : ''}
      ${filter_quarter || filter_year ? ')' : ''}
    `;

    // Execute the SQL query
    const { data, error } = await supabaseClient.rpc('execute_sql', { sql: query });

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
