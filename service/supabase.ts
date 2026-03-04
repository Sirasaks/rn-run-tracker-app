import { createClient } from "@supabase/supabase-js";

// you can store these in env variables or a secret management solution
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://kgjzqvemovqzpveguftu.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  "sb_publishable_32Rt6UxNsPlQ4uvmUXoANw_0cokSnDz";

// initialize the client once and re‑use it throughout the app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
