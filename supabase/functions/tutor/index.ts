import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { topic, messages } = await req.json();

    const systemPrompt = `
You are a helpful, encouraging tutor.
Your job is to ask the user five questions about the topic "${topic}" to test their understanding.
After each response, give short feedback before moving to the next question.
Once all five are done, ask the user to choose a new topic.
Make sure you only ask ONE question at a time.
`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...(messages || [])],
        temperature: 0.8,
      }),
    });

    const data = await openaiResponse.json();
    const message = data.choices?.[0]?.message?.content ?? "No response from OpenAI.";

    return new Response(JSON.stringify({ reply: message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error in tutor function:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
});
