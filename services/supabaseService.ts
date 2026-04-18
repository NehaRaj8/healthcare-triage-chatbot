// supabaseService.ts
import { createClient } from '@supabase/supabase-js';

// Load from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debugging — these MUST show correct values in your browser console
console.log("🔗 Supabase URL:", supabaseUrl);
console.log("🔐 Supabase Key Loaded:", !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

// Store chatbot session in the "chat_history" table
export const storeSessionData = async (session: any) => {
  console.log("📤 Payload:", session);

  const { error } = await supabase
    .from("chat_history")
    .insert([session]); // must be an array

  if (error) {
    console.error("❌ Supabase Error:", error);
  } else {
    console.log("✅ Data saved successfully");
  }
};
