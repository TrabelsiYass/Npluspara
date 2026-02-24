import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvujrqrurgyzdfxodrds.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dWpycXJ1cmd5emRmeG9kcmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjczNjYsImV4cCI6MjA4NjQwMzM2Nn0.iqABJ61aEmCWpuHNXSaWLdlef0dfjOXfpqsR6tnltX0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)