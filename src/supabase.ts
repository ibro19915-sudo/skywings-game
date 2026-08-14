import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vhrtcaknjrfjijbmuonh.supabase.co";
const SUPABASE_KEY = "sb_publishable_vDGYO4t6KDWLy4s45aHatg_ZNbB6Igu";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);