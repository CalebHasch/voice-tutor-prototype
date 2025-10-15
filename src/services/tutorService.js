const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function sendTutorMessage(topic, messages) {
  const res = await fetch("https://zhcfbmpgttdzetyibetn.functions.supabase.co/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseAnonKey}` },
    body: JSON.stringify({ topic, messages }),
  });

  if (!res.ok) throw new Error("Failed to contact tutor");
  return await res.json();
}
