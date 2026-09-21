export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message boşdur."
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },

      body: JSON.stringify({
        model: "gpt-5.6-luna",
        instructions:
          "Sən Altap.Biz saytının AI köməkçisisən. Azərbaycan dilində cavab ver. Aydın, faydalı və qısa danış.",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI xətası"
      });
    }

    let answer = data.output_text;

    if (!answer && Array.isArray(data.output)) {
      answer = data.output
        .flatMap(item => item.content || [])
        .filter(item => item.type === "output_text")
        .map(item => item.text)
        .join("");
    }

    if (!answer) {
      return res.status(500).json({
        error: "OpenAI cavabı boş qaytardı."
      });
    }

    return res.status(200).json({
      answer: answer
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server xətası"
    });
  }
}
