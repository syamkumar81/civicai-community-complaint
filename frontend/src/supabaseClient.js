import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://aneiimekiyrfoxxmnhfr.supabase.co";
const supabaseAnonKey = "sb_publishable_j8YVC9ETl1cUEyynHWjtEg_LWrLB3A9";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);