
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srskvvxiffyrlcdgumoa.supabase.co';
const supabaseKey = 'sb_publishable_8_t2HEDfcZ87DY7ia4pxiA_vrUSEDsw';

export const supabase = createClient(supabaseUrl, supabaseKey);
