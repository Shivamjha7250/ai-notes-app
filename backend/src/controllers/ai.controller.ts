import { Context } from "hono";

export const processAiAction = async (c: Context) => {
  try {
    console.log(" API HIT");

    const body = await c.req.json();
    console.log("BODY:", body);

    const { content, action } = body;

    if (!content || !action) {
      return c.json({ result: "Missing content or action" }, 400);
    }

    const apiKey = process.env.GROQ_API_KEY;
    console.log("KEY:", apiKey ? "EXISTS" : "MISSING");

    if (!apiKey) {
      return c.json({ result: "API key missing" }, 500);
    }

    let prompt = "";

    if (action === "summarize") {
      prompt = `Summarize the following text in 2 short points:\n${content}`;
    } else if (action === "improve") {
      prompt = `Improve grammar and clarity:\n${content}`;
    } else if (action === "tags") {
      prompt = `Give 3 short tags (comma separated):\n${content}`;
    } else {
      return c.json({ result: "Invalid action" }, 400);
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", 
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
      }),
    });


    const raw = await res.text();
    console.log("GROQ RAW:", raw);

    if (!res.ok) {
      return c.json({ result: "Groq API error" }, 500);
    }

    const data = JSON.parse(raw);

    const aiText =
      data.choices?.[0]?.message?.content || "No response";

    return c.json({ result: aiText });

  } catch (error: any) {
    console.error("AI ERROR FULL:", error);
    return c.json({ result: "AI failed: " + error.message }, 500);
  }
};