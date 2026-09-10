(function () {
  const PHONE = "348 696 7893";
  const TEL = "tel:+393486967893";
  const MAIL =
    "mailto:matteo.piemonti@gmail.com?subject=" +
    encodeURIComponent("Richiesta appuntamento telefonico senza impegno") +
    "&body=" +
    encodeURIComponent("Buongiorno dottor Piemonti,\nvorrei un breve confronto telefonico senza impegno sul seguente tema:\n\n");
  const WA = "https://wa.me/393486967893";
  const MAX_TURNS = 5;

  const HANDOFF =
    "Per un parere puntuale le consiglio di sentire direttamente il dottor Matteo Piemonti. Può prenotare un appuntamento telefonico senza impegno al " +
    PHONE +
    " oppure scrivere a matteo.piemonti@gmail.com. La chiamata non la impegna in nulla.";

  const OPENING =
    "Buongiorno, sono Chiara, la segreteria dello studio del dottor Matteo Piemonti. Mi dica pure in modo semplice il suo quesito: rifiuti, impianti, ADR/RID o formazione. Se serve un parere del dottore, le propongo io una chiamata senza impegno.";

  const REPLIES = [
    {
      keys: ["ciao", "buongiorno", "buonasera", "salve", "hey"],
      text: "Buongiorno, sono Chiara. Sono qui per orientarla. Di cosa ha bisogno? Consulenza rifiuti, nomina ADR/RID, impianto o un corso?"
    },
    {
      keys: ["chi sei", "chi è", "chi e", "present", "dottor", "piemonti", "matteo"],
      text: "Il dottor Matteo Piemonti è chimico iscritto all’Albo di Brescia n. 344 sezione A. Si è laureato in Chimica Applicata e Ambientale nel 2014. Ha lavorato in ricerca su biogas da matrici non zootecniche, sul recupero della gomma da pneumatici fuori uso, come responsabile di laboratorio in discarica (monitoraggio AIA) e come responsabile di impianto per rifiuti pericolosi e non. Oggi fa consulenza e formazione; è consulente ADR e RID per tutte le classi."
    },
    {
      keys: ["adr", "rid", "merce pericolos", "merci pericolos", "trasporto", "classe", "carico", "scarico", "nomina"],
      text: "Il dottor Piemonti è consulente per la sicurezza del trasporto di merci pericolose su strada (ADR) e ferrovia (RID), tutte le classi: 1, 2, 7 e 3-9. Il certificato CE è il n. C07142, valido fino al 28 novembre 2027. Segue imprese di trasporto e chi effettua carico o scarico. Per capire se nel suo caso serve la nomina, è meglio una breve chiamata con lui."
    },
    {
      keys: ["rifiut", "cer", "classific", "caratterizz", "analisi", "laboratorio", "campion"],
      text: "Sulla gestione rifiuti lo studio copre classificazione, caratterizzazione, campionamenti e lettura delle prescrizioni. Il dottore ha fatto il responsabile di laboratorio interno in discariche del Nord Italia. Se ha un codice CER, un rapporto di prova o un dubbio di accettabilità in impianto, glielo può descrivere: poi, se serve il merito tecnico, la faccio parlare con lui."
    },
    {
      keys: ["discaric", "impianto", "aia", "tritur", "miscel", "pericolos", "trattamento", "autorizzaz"],
      text: "Ha esperienza diretta come responsabile di impianto per il trattamento di rifiuti pericolosi e non pericolosi, comprese miscelazione e triturazione, e sul monitoraggio delle prescrizioni AIA in discarica. Per un caso concreto (autorizzazione, prescrizione, gestione operativa) serve il suo parere: si prenota una telefonata senza impegno."
    },
    {
      keys: ["biogas", "palma", "fangh", "pfu", "pneumatic", "gomma"],
      text: "Il percorso parte dalla ricerca: impianti a biogas alimentati da matrici non zootecniche (scarti di olio di palma, fanghi di depurazione industriale) e poi un laboratorio di ricerca e sviluppo sul recupero della gomma da pneumatici fuori uso. Oggi l’attività è consulenza e formazione, non gestione quotidiana di quegli impianti."
    },
    {
      keys: ["corso", "corsi", "formaz", "credenzial", "lezione", "aula"],
      text: "I corsi sono riservati a chi ha le credenziali. I contenuti riguardano classificazione e ADR, impianti e registri, adempimenti del consulente. Per iscriversi o capire quale modulo le serve, le consiglio di sentire il dottor Piemonti al " + PHONE + "."
    },
    {
      keys: ["prezzo", "costo", "quanto", "parcella", "preventivo", "fattur"],
      text: "I compensi dipendono dall’incarico (nomina, audit, corso, assistenza su un impianto). Io non posso quotare da qui. Il dottor Piemonti le fa un orientamento in una chiamata senza impegno."
    },
    {
      keys: ["appunt", "chiam", "telefon", "contatt", "prenot", "disponib", "quando"],
      text: HANDOFF
    },
    {
      keys: ["email", "mail", "scriv", "pec"],
      text: "Può scrivere a matteo.piemonti@gmail.com oppure chiamare il " + PHONE + ". Se preferisce, le lascio entrambi i riferimenti e lei sceglie."
    },
    {
      keys: ["dove", "sede", "brescia", "roccafranca", "zona"],
      text: "Lo studio è legato a Roccafranca, in provincia di Brescia. L’operatività è sul Nord Italia, con incarichi anche nazionali. Molti primi colloqui si fanno per telefono."
    },
    {
      keys: ["albo", "ordine", "chimic", "344", "titolo", "laurea"],
      text: "È dottore chimico, iscritto all’Ordine dei Chimici e dei Fisici della Provincia di Brescia al n. 344, sezione A, dal giugno 2022. Laurea in Chimica Applicata e Ambientale nel 2014. Gli attestati in PDF sono nella sezione Attestati del sito."
    }
  ];

  const logEl = document.getElementById("segr-log");
  const panel = document.getElementById("segr-panel");
  const form = document.getElementById("segr-form");
  const input = document.getElementById("segr-input");
  let turns = 0;
  let opened = false;

  function add(role, text, extra) {
    const row = document.createElement("div");
    row.className = "segr-msg " + role;
    const p = document.createElement("p");
    p.textContent = text;
    row.appendChild(p);
    if (extra) row.appendChild(extra);
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function cta() {
    const box = document.createElement("div");
    box.className = "segr-cta";
    box.innerHTML =
      '<a href="' + TEL + '">Chiama il dottor Piemonti</a>' +
      '<a href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a>' +
      '<a href="' + MAIL + '">Scrivi una email</a>';
    return box;
  }

  function match(text) {
    const t = text.toLowerCase();
    for (const r of REPLIES) {
      if (r.keys.some((k) => t.includes(k))) return r.text;
    }
    return null;
  }

  function answer(userText) {
    turns += 1;
    const hit = match(userText);
    if (!hit || turns >= MAX_TURNS) {
      add("bot", hit && turns >= MAX_TURNS
        ? "Ho raccolto gli elementi. " + HANDOFF
        : "Su questo punto non posso sostituirmi al dottore. " + HANDOFF, cta());
      return;
    }
    add("bot", hit);
    if (turns === MAX_TURNS - 1) {
      add("bot", "Se vuole entrare nel dettaglio del suo caso, il passo giusto è una telefonata breve con il dottor Piemonti, senza impegno.", cta());
    }
  }

  function openPanel() {
    panel.hidden = false;
    if (!opened) {
      add("bot", OPENING);
      opened = true;
    }
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
  }

  document.getElementById("segr-open").addEventListener("click", openPanel);
  document.getElementById("segr-close").addEventListener("click", closePanel);
  const heroBtn = document.getElementById("open-segr-hero");
  if (heroBtn) heroBtn.addEventListener("click", openPanel);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    add("user", text);
    input.value = "";
    window.setTimeout(function () { answer(text); }, 350);
  });
})();
