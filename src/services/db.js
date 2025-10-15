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
