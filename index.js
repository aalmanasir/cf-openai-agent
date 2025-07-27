export default {
  async fetch(request, env, ctx) {
    if (request.method === "GET") {
      return new Response("🤖 This is an AI-powered endpoint. Send a POST request with a 'prompt'.", {
        headers: { "Content-Type": "text/plain" },
        status: 200,
      });
    }

    if (request.method === "POST") {
      try {
        const body = await request.json();
        const prompt = body.prompt || "Hello, who are you?";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }]
          })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "⚠️ No response.";

        return new Response(JSON.stringify({ reply }), {
          headers: { "Content-Type": "application/json" }
        });

      } catch (err) {
        return new Response("❌ Error parsing prompt or OpenAI request failed.", {
          status: 500
        });
      }
    }

    return new Response("❌ Method Not Allowed", { status: 405 });
  }
};
