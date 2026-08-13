const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// index.html və digər faylları göstər
app.use(express.static(path.join(__dirname)));

const race = {
  az: { points: 0, distance: 0 },
  tr: { points: 0, distance: 0 },
  ru: { points: 0, distance: 0 },
  ge: { points: 0, distance: 0 },
  ua: { points: 0, distance: 0 }
};

// Ana səhifə
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Yarış məlumatları
app.get("/race", (req, res) => {
  res.json(race);
});

// Hədiyyə qəbul et
app.post("/gift", (req, res) => {
  const { countryId, points } = req.body;

  if (!race[countryId]) {
    return res.status(400).json({
      success: false,
      message: "Ölkə tapılmadı"
    });
  }

  const giftPoints = Number(points);

  if (!Number.isFinite(giftPoints) || giftPoints <= 0) {
    return res.status(400).json({
      success: false,
      message: "Xal düzgün deyil"
    });
  }

  race[countryId].points += giftPoints;
  race[countryId].distance += giftPoints;

  console.log("🎁 Hədiyyə gəldi:", {
    countryId,
    points: giftPoints
  });

  res.json({
    success: true,
    countryId,
    points: giftPoints,
    race: race[countryId]
  });
});

// TikTok LIVE bağlantısı
async function startTikTok() {
  try {
    const { TikTokLive } = await import("@tiktool/live");

    const username = process.env.TIKTOK_USERNAME;
    const apiKey = process.env.TIKTOOL_API_KEY;

    if (!username) {
      console.log("❌ TIKTOK_USERNAME tapılmadı");
      return;
    }

    if (!apiKey) {
      console.log("❌ TIKTOOL_API_KEY tapılmadı");
      return;
    }

    const client = new TikTokLive({
      uniqueId: username,
      apiKey: apiKey
    });

    client.on("gift", (event) => {
      console.log("🎁 TikTok hədiyyəsi:", event);
    });

    await client.connect();

    console.log(`🎵 TikTok LIVE qoşuldu: @${username}`);
  } catch (error) {
    console.error("❌ TikTok bağlantı xətası:", error);
  }
}

app.listen(PORT, () => {
  console.log(`Altap.Biz server ${PORT} portunda işləyir 🏎️`);
  startTikTok();
});
