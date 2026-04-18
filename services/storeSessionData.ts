import { createClient } from '@supabase/supabase-js';
import { SessionData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const storeSessionData = async (session: SessionData) => {
  // Flatten dashboardSummary for DB insert
  const payload = {
    session_timestamp: session.sessionTimestamp,
    first_name: session.dashboardSummary.first_name,
    last_name: session.dashboardSummary.last_name,
    age: session.dashboardSummary.age,
    postcode: session.dashboardSummary.postcode,
    symptoms: session.dashboardSummary.symptoms, // this is already an array
    severity: session.dashboardSummary.severity,
    chat_history: session.chatHistory, // array of chat messages -> stored as JSONB
  };

  console.log("📤 Payload:", payload);

  const { data, error } = await supabase
    .from('chat_history')
    .insert([payload]);

  if (error) {
    console.error("❌ Supabase Error:", error);
  } else {
    console.log("✅ Data saved successfully", data);
  }
};
