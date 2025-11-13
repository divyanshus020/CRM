import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try multiple possible locations for the .env file
const envPaths = [
  resolve(__dirname, '../../../.env'),  // From server/config/ to project root
  resolve(process.cwd(), '.env'),       // Current working directory
  resolve(process.cwd(), '../.env')     // One level up from cwd
];

// Try each path until one works
let envLoaded = false;
for (const path of envPaths) {
  try {
    const result = dotenv.config({ path, override: true });
    if (!result.error) {
      console.log(`✅ Loaded environment variables from: ${path}`);
      envLoaded = true;
      break;
    } else if (result.error && result.error.code === 'ENOENT') {
      console.log(`⚠️  No .env file found at: ${path}`);
    } else {
      console.error(`❌ Error loading .env from ${path}:`, result.error);
    }
  } catch (e) {
    console.error(`❌ Error processing .env at ${path}:`, e);
  }
}

if (!envLoaded) {
  console.error('❌ Could not load .env file from any of these locations:', envPaths);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || supabaseKey; // Fallback to anon key if service key not set

console.log('🔍 Supabase Configuration:');
console.log('   URL:', supabaseUrl || '❌ Missing');
console.log('   Anon Key:', supabaseKey ? '✅ Found' : '❌ Missing');
console.log('   Service Key:', supabaseServiceKey !== supabaseKey ? '✅ Found' : '⚠️ Using anon key');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase configuration. Please check your .env file. ' + 
    `Looked in: ${envPaths.join(', ')}`);
}

// Create two clients - one with anon key for public operations
// and one with service role key for admin operations
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test the connection on startup
(async () => {
  try {
    const { data, error } = await supabase.from('customers').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Successfully connected to Supabase');
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error.message);
    if (error.code) console.error('   Error code:', error.code);
    if (error.hint) console.error('   Hint:', error.hint);
  }
})();
