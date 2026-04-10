import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whvxeqxmphvppdzamweg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndodnhlcXhtcGh2cHBkemFtd2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTM5NzUsImV4cCI6MjA5MDc4OTk3NX0.J3b3A4pERp0K5eQFqsqfnTq20pCEmZCWjV4GvwDgBJ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
