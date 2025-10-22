import { supabase } from "@/lib/supabase";

export async function sendTutorMessage(topic, messages, name, competencyLevel) {
  try {
    const { data, error } = await supabase.functions.invoke("tutor", {
      body: { topic, messages, name, competencyLevel },
    });

    if (error) {
      console.error("Error calling tutor function:", error);
      throw new Error(error.message || "Failed to contact tutor");
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in sendTutorMessage:", err);
    throw err;
  }
}
