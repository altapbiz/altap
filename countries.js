const countries = [
  {
    id: "az",
    name: "Azərbaycan",
    flag: "🇦🇿",
    car: "Maşın 1",
    points: 0,
    distance: 0
  },
  {
    id: "tr",
    name: "Türkiyə",
    flag: "🇹🇷",
    car: "Maşın 2",
    points: 0,
    distance: 0
  },
  {
    id: "ru",
    name: "Rusiya",
    flag: "🇷🇺",
    car: "Maşın 3",
    points: 0,
    distance: 0
  },
  {
    id: "ge",
    name: "Gürcüstan",
    flag: "🇬🇪",
    car: "Maşın 4",
    points: 0,
    distance: 0
  },
  {
    id: "ua",
    name: "Ukrayna",
    flag: "🇺🇦",
    car: "Maşın 5",
    points: 0,
    distance: 0
  }
];

function addGift(countryId, giftPoints) {
  const country = countries.find(item => item.id === countryId);

  if (!country) return;

  country.points += giftPoints;
  country.distance += giftPoints;

  return country;
}

function getCountry(countryId) {
  return countries.find(item => item.id === countryId);
}
