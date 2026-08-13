const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname)));
const race = {
  az: { points: 0, distance: 0 },
  tr: { points: 0, distance: 0 },
  ru: { points: 0, distance: 0 },
  am: { points: 0, distance: 0 },
  ge: { points: 0, distance: 0 }
};
// Hədiyyə dəyərləri
const giftPoints = {
  "5 jeton": 5,
  "10 jeton": 10,
  "20 jeton": 20,
  "1 tac": 150,
  "200 jeton": 450
};
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/race", (req, res) => {
  res.json(race);
});
// Test üçün hədiyyə
app.post("/gift", (req, res) => {
  const { countryId, giftName } = req.body;
  if (!race[countryId]) {
    return res.status(400).json({
      success: false,
      message: "Ölkə tapılmadı"
    });
  }
  const points = giftPoints[giftName];
  if (!points) {
    return res.status(400).json({
      success: false,
      message: "Hədiyyə tanınmadı"
    });
  }
  race[countryId].points += points;
  race[countryId].distance += points;
  console.log(
    `🎁 ${giftName} → ${countriesName(countryId)} → +${points} xal`
  );
  res.json({
    success: true,
    countryId,
    giftName,
    points,
    race: race[countryId]
  });
});
function countriesName(id) {
  const names = {
    az: "Azərbaycan",
    tr: "Türkiyə",
    ru: "Rusiya",
    am: "Ermənistan",
    ge: "Gürcüstan"
  };
  return names[id] || id;
}
// TikTok LIVE
async function startTikTok() {
  try {
    const { TikTokLive } = await import("@tiktool/live");
    const username = process.env.TIKTOK_USERNAME;
    const apiKey = process.env.TIKTOOL_API_KEY;
    if (!username || !apiKey) {
      console.log("❌ TikTok dəyişənləri tapılmadı");
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
  console.log(
    `Altap.Biz server ${PORT} portunda işləyir 🏎️`
  );
  startTikTok();
});
