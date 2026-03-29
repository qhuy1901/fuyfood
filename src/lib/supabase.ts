import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfbxufxvfwyvclawdajb.supabase.co';
const supabaseAnonKey = 'sb_publishable_Vne0hSUFk5n1T_HW4gLqBg__G8VI4Dx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
