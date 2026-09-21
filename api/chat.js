export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {
      const body = await request.json();
      const message = body?.message;

      if (!message || !message.trim()) {
        return new Response(
          JSON.stringify({ error: "Message is required" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error: "OPENAI_API_KEY tapılmadı."
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-5.6-luna",
            instructions:
              "Sən Altap.Biz saytının süni intellekt köməkçisisən. İstifadəçinin suallarına Azərbaycan dilində aydın, faydalı və qısa cavab ver.",
            input: message
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error:
              data?.error?.message ||
              "OpenAI API xətası baş verdi."
          }),
          {
            status: response.status,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      return new Response(
        JSON.stringify({
          answer: data.output_text || "Cavab alınmadı."
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error?.message || "Server xətası"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
