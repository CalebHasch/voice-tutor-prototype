import { supabase } from "@/lib/supabase";

export async function getAllTopics() {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching topics:", error.message);
    throw error;
  }

  return data;
}

export async function loadUserData(userId) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

  if (error) {
    console.error("Error loading user data:", error.message);
    throw error;
  }

  return data;
}

export async function getCompetency(userId, topicId) {
  try {
    const { data, error } = await supabase
      .from("user_skills")
      .select("proficiency")
      .eq("user_id", userId)
      .eq("topic_id", topicId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching competency:", error);
      throw error;
    }

    return data?.proficiency ?? 5;
  } catch (err) {
    console.error("Unexpected error fetching competency:", err);
    return 5;
  }
}
