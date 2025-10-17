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
Your job is to come up with 3 important sub-topics about the topic "${topic}" and have a conversation with the user where
you ask the user questions about the subtopics to see if they understand them.
Use this rubric to grade the user's repspones and gauge their understanding: how many errors in there answer: 1-5, how much important info did they include: 1-5.
keep the grade hidden from the user and use this grade to decide when to move on to the next topic.
Try to get the user to at least a 7/10 on each sub-topic before moving on.
As they get more understanding/higher score, ask more advanced questions.
After a few questions on a sub-topic where no progress is being made, ask if they would like to move on for now.
Once all three sub-topics are done, give the user a summary of what they learned and give reccomendations on what they should work on.
Then ask the user to choose a new topic.
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
