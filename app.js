const VIDEO = "https://drive.google.com/file/d/1e172kcC3gpoexpXjFTUHh8LupoI4ptJu/preview";
const TEST = "https://script.google.com/macros/s/AKfycbxTlm-JV6Mk29v0l6me65zcucxOD8l4twptLlaSoG-WEF0EG-qA4aDrqbBhPkiwKdLWKg/exec";

const AZIENDE = [
  { id: "arvedi-tubi", user: "Arvedi", pass: "Tubi", titolo: "Corso — Arvedi Tubi Acciaio", video: VIDEO, test: TEST },
  { id: "acciaieria", user: "Arvedi", pass: "Coil", titolo: "Corso — Acciaieria Arvedi", video: VIDEO, test: TEST },
  { id: "aspireco", user: "Aspireco", pass: "Cisterna", titolo: "Corso — Aspireco", video: VIDEO, test: TEST }
];

function trovaAzienda(user, pass) {
  const u = user.trim().toLowerCase();
  return AZIENDE.find((az) => az.user.toLowerCase() === u && az.pass === pass) || null;
}

function aziendaPerId(id) {
  return AZIENDE.find((az) => az.id === id) || null;
}

function login(e) {
  e.preventDefault();
  const err = document.getElementById("login-err");
  const az = trovaAzienda(
    document.getElementById("user").value,
    document.getElementById("pass").value
  );
  if (!az) {
    err.hidden = false;
    return false;
  }
  err.hidden = true;
  sessionStorage.setItem("corsi_az", az.id);
  sessionStorage.removeItem("corso_fine");
  apriCorso(az);
  return false;
}

function logout() {
  sessionStorage.removeItem("corsi_az");
  sessionStorage.removeItem("corso_fine");
  document.getElementById("login-form").hidden = false;
  document.getElementById("corsi-area").hidden = true;
  const iframe = document.getElementById("corso-video");
  if (iframe) iframe.src = "";
}

function bloccaTest() {
  const test = document.getElementById("corso-test");
  const lock = document.getElementById("corso-lock");
  test.setAttribute("aria-disabled", "true");
  test.href = "#";
  if (lock) lock.hidden = false;
}

function sbloccaTest(url) {
  const test = document.getElementById("corso-test");
  const lock = document.getElementById("corso-lock");
  test.setAttribute("aria-disabled", "false");
  test.href = url;
  if (lock) lock.hidden = true;
}

function apriCorso(az) {
  document.getElementById("login-form").hidden = true;
  document.getElementById("corsi-area").hidden = false;
  document.getElementById("corso-titolo").textContent = az.titolo;
  document.getElementById("corso-video").src = az.video;
  if (sessionStorage.getItem("corso_fine") === "1") sbloccaTest(az.test);
  else bloccaTest();
}

document.addEventListener("DOMContentLoaded", () => {
  const test = document.getElementById("corso-test");
  if (test) {
    test.addEventListener("click", (e) => {
      if (test.getAttribute("aria-disabled") === "true") e.preventDefault();
    });
  }
  const fine = document.getElementById("corso-fine");
  if (fine) {
    fine.addEventListener("click", () => {
      const az = aziendaPerId(sessionStorage.getItem("corsi_az"));
      if (!az) return;
      sessionStorage.setItem("corso_fine", "1");
      sbloccaTest(az.test);
      window.open(az.test, "_blank", "noopener");
    });
  }
  const az = aziendaPerId(sessionStorage.getItem("corsi_az"));
  if (az) apriCorso(az);
});
