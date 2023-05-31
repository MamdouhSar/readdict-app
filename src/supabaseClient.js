import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pmkhjwrzddlgnkqbcisi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBta2hqd3J6ZGRsZ25rcWJjaXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU0NjgxMTEsImV4cCI6MjAwMTA0NDExMX0.iTv3c85FRFkbiQFhgx5eIVP5dVydHEHDuUDMvV5IxTE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
