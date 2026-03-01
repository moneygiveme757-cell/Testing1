const currentUser = localStorage.getItem("currentUser");
const list = document.getElementById("historyList");

if (!currentUser) {
  list.innerHTML = `<div class="alert alert-warning">Login required</div>`;
  throw "";
}

const users = JSON.parse(localStorage.getItem("users"));
const saved = users[currentUser].saved;

if (!saved.length) {
  list.innerHTML = `<div class="alert alert-info">No saved data</div>`;
  throw "";
}

list.innerHTML = saved.map(s => `
  <div class="card mb-2 p-2">
    🌡 ${s.temperature}°C | ⏱ ${s.time}
  </div>
`).join("");

new Chart(document.getElementById("tempChart"), {
  type: "line",
  data: {
    labels: saved.map(s => s.time),
    datasets: [{
      label: "Temperature (°C)",
      data: saved.map(s => s.temperature),
      borderColor: "red",
      tension: 0.3
    }]
  }
});
