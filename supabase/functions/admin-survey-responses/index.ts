import { createClient } from 'npm:@supabase/supabase-js@2.111.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { username, password } = body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: surveys, error: surveyError } = await adminClient
      .from('user_surveys')
      .select(`
        id,
        user_id,
        ward_id,
        cleanliness_rating,
        infrastructure_rating,
        water_supply_rating,
        public_services_rating,
        overall_rating,
        comments,
        created_at,
        profiles!inner (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (surveyError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch survey responses' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const responses = (surveys || []).map((s: any) => ({
      id: s.id,
      user_id: s.user_id,
      ward_id: s.ward_id,
      user_email: s.profiles?.email || '',
      user_name: s.profiles?.full_name || '',
      cleanliness_rating: s.cleanliness_rating,
      infrastructure_rating: s.infrastructure_rating,
      water_supply_rating: s.water_supply_rating,
      public_services_rating: s.public_services_rating,
      overall_rating: s.overall_rating,
      comments: s.comments,
      created_at: s.created_at,
    }));

    return new Response(
      JSON.stringify({ responses }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
