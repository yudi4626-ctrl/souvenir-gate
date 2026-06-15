import { createClient } from '@supabase/supabase-js'

// Ambil data dari file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Inisialisasi & export client supaya bisa dipakai di komponen lain
export const supabase = createClient(supabaseUrl, supabaseAnonKey)