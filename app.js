const map = document.getElementById("worldMap");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherContent = document.getElementById("weatherContent");

const weatherModal = new bootstrap.Modal(
  document.getElementById("weatherModal")
);
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
map.addEventListener("click", (e) => {
  const rect = map.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const width = rect.width;
  const height = rect.height;

  const longitude = (x / width) * 360 - 180;
  const latitude = 90 - (y / height) * 180;

  fetchWeatherByCoords(latitude, longitude);
});
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeatherByCity(city);
});
async function fetchWeatherByCoords(lat, lon) {
  const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const res = await fetch(url);
  const data = await res.json();

  displayWeather(data, lat, lon);
}
async function fetchWeatherByCity(city) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );
  const geoData = await geoRes.json();

  if (!geoData.results) {
    weatherContent.innerHTML = `<p class="text-danger">City not found ❗</p>`;
    weatherModal.show();
    return;
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  fetchWeatherByCoords(latitude, longitude, name, country);
}
function displayWeather(data, lat, lon) {
  if (!data.current_weather) {
    weatherContent.innerHTML = `<p>Weather data unavailable</p>`;
    weatherModal.show();
    return;
  }

  const weather = data.current_weather;

  weatherContent.innerHTML = `
    <p><strong>📍 Coordinates:</strong> ${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
    <p><strong>🌡 Temperature:</strong> ${weather.temperature}°C</p>
    <p><strong>💨 Wind Speed:</strong> ${weather.windspeed} km/h</p>
    <p><strong>🧭 Wind Direction:</strong> ${weather.winddirection}°</p>
    <p><strong>⏱ Time:</strong> ${weather.time}</p>
  `;

  weatherModal.show();
}
