const VIDEO = "https://drive.google.com/file/d/1e172kcC3gpoexpXjFTUHh8LupoI4ptJu/preview";
const TEST = "https://script.google.com/macros/s/AKfycbxTlm-JV6Mk29v0l6me65zcucxOD8l4twptLlaSoG-WEF0EG-qA4aDrqbBhPkiwKdLWKg/exec";

const AZIENDE = [
  { id: "arvedi-tubi", users: ["arvedi", "arvedi tubi acciaio"], pass: "tubi", titolo: "Corso — Arvedi Tubi Acciaio", video: VIDEO, test: TEST },
  { id: "acciaieria", users: ["arvedi", "acciaieria", "acciaieria arvedi"], pass: "coil", titolo: "Corso — Acciaieria Arvedi", video: VIDEO, test: TEST },
  { id: "aspireco", users: ["aspireco"], pass: "cisterna", titolo: "Corso — Aspireco", video: VIDEO, test: TEST }
];

function trovaAzienda(user, pass) {
  const u = user.trim().toLowerCase();
  const p = pass.trim().toLowerCase();
  return AZIENDE.find((az) => az.users.includes(u) && az.pass === p) || null;
}

function aziendaPerId(id) {
  return AZIENDE.find((az) => az.id === id) || null;
}

let corsoAttivo = null;

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
  corsoAttivo = az;
  apriCorso(az);
  return false;
}

function logout() {
  corsoAttivo = null;
  document.getElementById("login-form").hidden = false;
  document.getElementById("corsi-area").hidden = true;
  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";
  const iframe = document.getElementById("corso-video");
  if (iframe) iframe.src = "";
  bloccaTest();
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
  bloccaTest();
}

document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("corsi_az");
  sessionStorage.removeItem("corso_fine");
  const test = document.getElementById("corso-test");
  if (test) {
    test.addEventListener("click", (e) => {
      if (test.getAttribute("aria-disabled") === "true") e.preventDefault();
    });
  }
  const fine = document.getElementById("corso-fine");
  if (fine) {
    fine.addEventListener("click", () => {
      if (!corsoAttivo) return;
      sbloccaTest(corsoAttivo.test);
      window.open(corsoAttivo.test, "_blank", "noopener");
    });
  }
});
