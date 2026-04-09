import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bkdtayppxvzzjlwsswbo.supabase.co'
const supabaseKey = 'sb_publishable__81mrTjebmXQaDI4uD-bPQ_Zp0_DSJ6'

export const supabase = createClient(supabaseUrl, supabaseKey)
