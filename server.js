const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const race = {
  az: { points: 0, distance: 0 },
  tr: { points: 0, distance: 0 },
  ru: { points: 0, distance: 0 },
  ge: { points: 0, distance: 0 },
  ua: { points: 0, distance: 0 }
};

// Server yoxlama
app.get("/", (req, res) => {
  res.send("Altap.Biz LIVE server işləyir 🏎️🎁");
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

app.listen(PORT, () => {
  console.log(`Altap.Biz server ${PORT} portunda işləyir 🏎️`);
});
