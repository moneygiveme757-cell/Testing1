async function loadSeedUsers() {
  if (!localStorage.getItem("users")) {
    const res = await fetch("assets/users.json");
    const data = await res.json();
    localStorage.setItem("users", JSON.stringify(data.users));
  }
}
loadSeedUsers();

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const guestBtn = document.getElementById("guestBtn");
const errorEl = document.getElementById("authError");

loginBtn.onclick = () => auth("login");
signupBtn.onclick = () => auth("signup");

guestBtn.onclick = () => {
  localStorage.setItem("guest", "true");
  localStorage.removeItem("currentUser");
  window.location.href = "app.html";
};

function auth(mode) {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    errorEl.textContent = "All fields required";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (mode === "signup") {
    if (users[username]) {
      errorEl.textContent = "User already exists";
      return;
    }
    users[username] = { password, saved: [] };
  }

  if (!users[username] || users[username].password !== password) {
    errorEl.textContent = "Invalid credentials";
    return;
  }

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", username);
  localStorage.removeItem("guest");
  window.location.href = "app.html";
}
