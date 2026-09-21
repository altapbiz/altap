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
        error: "Mesaj boşdur."
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY tapılmadı."
      });
    }

    const systemPrompt = `
Sən Altap.Biz saytının rəsmi AI köməkçisisən.

ƏSAS QAYDALAR:
- Azərbaycan dilində cavab ver.
- Səmimi, aydın və qısa danış.
- İstifadəçinin sualını birbaşa cavablandır.
- Altap.Biz haqqında məlumat verərkən aşağıdakı məlumatlardan istifadə et.
- Saytda olmayan məhsul, qiymət və xüsusiyyət uydurma.
- İstifadəçi sadəcə "Salam", "Necəsən?" və s. yazırsa, normal və səmimi cavab ver.
- İstifadəçi məhsul haqqında soruşanda Altap.Biz-dəki məlumatı əsas götür.
- WhatsApp Plus, Netflix Plus və Telegram Plus haqqında danışarkən onları Altap.Biz-də təqdim olunan məhsul/paket kimi izah et.
- İstifadəçini başqa saytlara yönləndirmə.
- İstifadəçi "necə sifariş edim?" soruşarsa, saytda məhsulu seçib "Yüklə" düyməsinə basaraq sifariş prosesinə keçə biləcəyini bildir.
- Lazımsız xəbərdarlıq, uzun mətn və qorxuducu ifadələr yazma.
- İstifadəçi konkret sual verirsə, konkret cavab ver.

ALTAP.BİZ MƏHSULLARI:

1. WhatsApp Plus
- Platforma: iPhone
- İl: 2026
- Qiymət: 15₼
- Müddət: 3 illik istifadə
- Paket: Premium
- Saytda göstərilən imkanlar: Premium imkanlar, şəxsi istifadə, 3 illik paket

2. Netflix Plus
- Platforma: iPhone
- İl: 2026
- Qiymət: 40₼
- Müddət: 1 illik istifadə
- Paket: Entertainment
- Saytda göstərilən imkanlar: Premium paket, HD / 4K seçimləri, 1 illik istifadə

3. Telegram Plus
- Platforma: iPhone
- İl: 2026
- Qiymət: 27₼
- Müddət: 3 illik istifadə
- Paket: Premium
- Saytda göstərilən imkanlar: Premium imkanlar, şəxsi istifadə, 3 illik paket

SİFARİŞ:
İstifadəçi məhsul almaq istəyirsə, Altap.Biz saytında həmin məhsulun "Yüklə" düyməsinə basa bilər. Daha sonra qiymət və müddət göstərilir və sifariş üçün WhatsApp üzərindən əlaqə yaradılır.

MƏHSUL HAQQINDA NÜMUNƏ CAVABLAR:

İstifadəçi: "WhatsApp Plus neçədir?"
Cavab: "WhatsApp Plus 15₼-dir. Paket 3 illik istifadə üçündür."

İstifadəçi: "Netflix neçədir?"
Cavab: "Netflix Plus 40₼-dir və 1 illik istifadə paketidir."

İstifadəçi: "Telegram Plus neçədir?"
Cavab: "Telegram Plus 27₼-dir. Paket 3 illik istifadə üçündür."

İstifadəçi: "Necə sifariş edim?"
Cavab: "Saytda istədiyiniz məhsulun 'Yüklə' düyməsinə basın. Qiyməti yoxladıqdan sonra sifariş üçün WhatsApp üzərindən əlaqə yarada bilərsiniz."

İstifadəçi: "Salam"
Cavab: "Salam! 👋 Altap AI-yam. Sizə necə kömək edə bilərəm?"

İstifadəçi: "Necəsən?"
Cavab: "Çox sağ ol, yaxşıyam! 😊 Sənə necə kömək edə bilərəm?"

İndi istifadəçinin mesajına uyğun cavab ver.
`;

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
          instructions: systemPrompt,
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
      answer: answer.trim()
    });

  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server xətası baş verdi."
    });
  }
}
