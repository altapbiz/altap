const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Altap.Biz LIVE server işləyir 🏎️🎁");
});

app.post("/gift", (req, res) => {
  const { countryId, points } = req.body;

  console.log("Hədiyyə gəldi:", {
    countryId,
    points
  });

  res.json({
    success: true,
    countryId,
    points
  });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
});
