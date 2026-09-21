export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY tapılmadı."
      });
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
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "OpenAI API xətası baş verdi."
      });
    }

    return res.status(200).json({
      answer: data.output_text || "Cavab alınmadı."
    });

  } catch (error) {

    return res.status(500).json({
      error:
        error?.message ||
        "Server xətası baş verdi."
    });
  }
}
