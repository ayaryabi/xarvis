import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzyikufufpydsxgievta.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eWlrdWZ1ZnB5ZHN4Z2lldnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTA5MjUsImV4cCI6MjA1ODQ4NjkyNX0.KTrWHHvSGl-1aOmaqDaWd7M8VaxxMefnfZj-xhVdo0o';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eWlrdWZ1ZnB5ZHN4Z2lldnRhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjkxMDkyNSwiZXhwIjoyMDU4NDg2OTI1fQ.Q58sPK5VMFOK3Mijefky2psOo5PS90d1Zy-F-Lbp2D8';

// Create a Supabase client with the service role key for admin operations (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Create a Supabase client with the anon key for client-side operations
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Default export for easier imports
export default supabaseClient; 