const cars = [
  {
    countryId: "az",
    country: "Azərbaycan",
    flag: "🇦🇿",
    car: "Maşın 1",
    points: 0,
    distance: 0
  },
  {
    countryId: "tr",
    country: "Türkiyə",
    flag: "🇹🇷",
    car: "Maşın 2",
    points: 0,
    distance: 0
  },
  {
    countryId: "ru",
    country: "Rusiya",
    flag: "🇷🇺",
    car: "Maşın 3",
    points: 0,
    distance: 0
  },
  {
    countryId: "ge",
    country: "Gürcüstan",
    flag: "🇬🇪",
    car: "Maşın 4",
    points: 0,
    distance: 0
  },
  {
    countryId: "ua",
    country: "Ukrayna",
    flag: "🇺🇦",
    car: "Maşın 5",
    points: 0,
    distance: 0
  }
];

function moveCar(countryId, points) {
  const car = cars.find(item => item.countryId === countryId);

  if (!car) return;

  car.points += points;
  car.distance += points;

  return car;
}
