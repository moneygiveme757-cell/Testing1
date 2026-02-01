const map = document.getElementById("worldMap");
const marker = document.getElementById("marker");
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

  const longitude = (x / rect.width) * 360 - 180;
  const latitude = 90 - (y / rect.height) * 180;

  placeMarker(latitude, longitude);
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

  const { latitude, longitude } = geoData.results[0];

  placeMarker(latitude, longitude);
  fetchWeatherByCoords(latitude, longitude);
}
function placeMarker(lat, lon) {
  const rect = map.getBoundingClientRect();

  const x = ((lon + 180) / 360) * rect.width;
  const y = ((90 - lat) / 180) * rect.height;

  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
  marker.style.display = "block";
}
function displayWeather(data, lat, lon) {
  if (!data.current_weather) {
    weatherContent.innerHTML = "<p>Weather unavailable</p>";
    weatherModal.show();
    return;
  }

  const w = data.current_weather;

  weatherContent.innerHTML = `
    <p><strong>📍 Location:</strong> ${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
    <p><strong>🌡 Temperature:</strong> ${w.temperature}°C</p>
    <p><strong>💨 Wind Speed:</strong> ${w.windspeed} km/h</p>
    <p><strong>🧭 Wind Direction:</strong> ${w.winddirection}°</p>
    <p><strong>⏱ Time:</strong> ${w.time}</p>
  `;

  weatherModal.show();
}
