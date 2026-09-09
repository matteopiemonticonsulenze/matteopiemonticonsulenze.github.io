// Credenziali di esempio. CAMBIALE prima di pubblicare.
// Per qualcosa di più serio: Firebase Auth (piano gratuito) o Netlify Identity.
const CREDENTIALS = {
  user: "corso",
  pass: "cambia-questa-password"
};

function login(e) {
  e.preventDefault();
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pass").value;
  const err = document.getElementById("login-err");
  if (u === CREDENTIALS.user && p === CREDENTIALS.pass) {
    err.hidden = true;
    document.getElementById("login-form").hidden = true;
    document.getElementById("corsi-area").hidden = false;
    sessionStorage.setItem("corsi_ok", "1");
  } else {
    err.hidden = false;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem("corsi_ok");
  document.getElementById("login-form").hidden = false;
  document.getElementById("corsi-area").hidden = true;
}

if (sessionStorage.getItem("corsi_ok") === "1") {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-form").hidden = true;
    document.getElementById("corsi-area").hidden = false;
  });
}
