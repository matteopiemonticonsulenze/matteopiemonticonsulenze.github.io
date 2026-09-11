// Una voce per azienda. L'utente è la chiave (minuscolo).
const AZIENDE = {
  esempio: {
    pass: "cambia-questa-password",
    titolo: "Corso — accesso di prova",
    video: "https://drive.google.com/file/d/1e172kcC3gpoexpXjFTUHh8LupoI4ptJu/preview",
    test: "https://script.google.com/macros/s/AKfycbxTlm-JV6Mk29v0l6me65zcucxOD8l4twptLlaSoG-WEF0EG-qA4aDrqbBhPkiwKdLWKg/exec"
  },
  arvedi: {
    pass: "Tubi",
    titolo: "Corso — Arvedi Tubi Acciaio",
    video: "https://drive.google.com/file/d/1e172kcC3gpoexpXjFTUHh8LupoI4ptJu/preview",
    test: "https://script.google.com/macros/s/AKfycbxTlm-JV6Mk29v0l6me65zcucxOD8l4twptLlaSoG-WEF0EG-qA4aDrqbBhPkiwKdLWKg/exec"
  },
  acciaieria: {
    pass: "Coil",
    titolo: "Corso — Acciaieria Arvedi",
    video: "https://drive.google.com/file/d/1e172kcC3gpoexpXjFTUHh8LupoI4ptJu/preview",
    test: "https://script.google.com/macros/s/AKfycbxTlm-JV6Mk29v0l6me65zcucxOD8l4twptLlaSoG-WEF0EG-qA4aDrqbBhPkiwKdLWKg/exec"
  },
  aspireco: {
    pass: "cisterna",
    titolo: "Corso — Aspireco",
    video: "https://drive.google.com/file/d/1e172kcC3gpoexpXjFTUHh8LupoI4ptJu/preview",
    test: "https://script.google.com/macros/s/AKfycbxTlm-JV6Mk29v0l6me65zcucxOD8l4twptLlaSoG-WEF0EG-qA4aDrqbBhPkiwKdLWKg/exec"
  }
};

function trovaAzienda(user, pass) {
  const key = user.trim().toLowerCase();
  const az = AZIENDE[key];
  if (!az || az.pass !== pass) return null;
  return { key, ...az };
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
  sessionStorage.setItem("corsi_az", az.key);
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
      const key = sessionStorage.getItem("corsi_az");
      const az = key && AZIENDE[key];
      if (!az) return;
      sessionStorage.setItem("corso_fine", "1");
      sbloccaTest(az.test);
    });
  }
  const key = sessionStorage.getItem("corsi_az");
  if (key && AZIENDE[key]) apriCorso({ key, ...AZIENDE[key] });
});
