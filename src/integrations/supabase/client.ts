// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://omaiknrkjmknyluiwamq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYWlrbnJram1rbnlsdWl3YW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzQ0MDksImV4cCI6MjA2NTUxMDQwOX0.s4AZGx3L32u_HYny00gV_z4jEGefztkXXSvXrKHjhHU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);