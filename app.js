const map = document.getElementById("worldMap");
const marker = document.getElementById("marker");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherContent = document.getElementById("weatherContent");
const userLabel = document.getElementById("userLabel");

const modal = new bootstrap.Modal(document.getElementById("weatherModal"));

const currentUser = localStorage.getItem("currentUser");
userLabel.textContent = currentUser ? `👋 ${currentUser}` : "Guest";

document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};

map.onclick = e => {
  const r = map.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const lon = (x / r.width) * 360 - 180;
  const lat = 90 - (y / r.height) * 180;
  placeMarker(lat, lon);
  fetchWeather(lat, lon);
};

searchBtn.onclick = async () => {
  const city = cityInput.value.trim();
  if (!city) return;

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
  const data = await res.json();
  if (!data.results) return;

  const { latitude, longitude } = data.results[0];
  placeMarker(latitude, longitude);
  fetchWeather(latitude, longitude);
};

async function fetchWeather(lat, lon) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  );
  const data = await res.json();
  const w = data.current_weather;

  weatherContent.innerHTML = `
    🌡 ${w.temperature}°C<br>
    💨 ${w.windspeed} km/h<br>
    ⏱ ${w.time}<br>
    ${currentUser ? `<button id="saveBtn" class="btn btn-success btn-sm mt-2">Save</button>` : ""}
  `;

  modal.show();

  if (currentUser) {
    document.getElementById("saveBtn").onclick = () => saveWeather(lat, lon, w);
  }
}

function saveWeather(lat, lon, w) {
  const users = JSON.parse(localStorage.getItem("users"));
  users[currentUser].saved.push({
    lat,
    lon,
    temperature: w.temperature,
    time: w.time
  });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Saved!");
}

function placeMarker(lat, lon) {
  const r = map.getBoundingClientRect();
  marker.style.left = `${((lon + 180) / 360) * r.width}px`;
  marker.style.top = `${((90 - lat) / 180) * r.height}px`;
  marker.style.display = "block";
}
