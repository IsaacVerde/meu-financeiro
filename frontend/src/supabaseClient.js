import { createClient } from '@supabase/supabase-js'

// Substitua pelos seus dados do Supabase (Project URL e Anon Key)
const supabaseUrl = 'https://fnvcmfwwfekzlhybdlrq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudmNtZnd3ZmVremxoeWJkbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjMxMTQsImV4cCI6MjA4MDkzOTExNH0.DC6o_YKahCoqtpt3vbjUVCmhUbFpYdk3oCasE6suaw8'

export const supabase = createClient(supabaseUrl, supabaseKey)