export async function sendTutorMessage(topic, messages) {
  const res = await fetch("https://zhcfbmpgttdzetyibetn.functions.supabase.co/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, messages }),
  });

  if (!res.ok) throw new Error("Failed to contact tutor");
  return await res.json();
}
