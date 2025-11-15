import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shjaqnvtpzzjvtrxhtsa.supabase.co';
// This key is safe to use in a browser as long as Row Level Security is enabled.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoamFxbnZ0cHp6anZ0cnhodHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTEyODksImV4cCI6MjA3ODY4NzI4OX0.ZNPAjft6t2JNcnEB_CUXkXYRRWD-pbRIeNKiB59QgtI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

