// ============================================
//  Lab 5 – AJAX simulat cu localStorage
//  Înlocuiește salveaza.php și lista_ajax.php
//  Funcționează complet static pe GitHub Pages
// ============================================

var STORAGE_KEY = "date_auto";

// ── UTILITAR: citește toate înregistrările din localStorage ──────────────────

function citesteDate() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// ── UTILITAR: scrie lista în localStorage ────────────────────────────────────

function scrieDate(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// ── 1. SUBMIT FORMULAR (înlocuiește POST la salveaza.php) ────────────────────

function valideazaSiTrimiteAjax() {
  if (typeof valideazaSiTrimite_intern === "function") {
    var ok = valideazaSiTrimite_intern();
    if (!ok) return false;
  }

  var form = document.getElementById("formAuto");
  var btn  = document.getElementById("btnSubmit");

  // Colectează datele din formular
  var marca    = document.getElementById("marca").value.trim();
  var model    = document.getElementById("model").value.trim();
  var viteza   = parseFloat(document.getElementById("viteza").value);
  var cp       = parseFloat(document.getElementById("cp").value);
  var greutate = parseFloat(document.getElementById("greutate").value);
  var consum   = parseFloat(document.getElementById("consum").value);
  var culoareEl = document.querySelector('input[name="culoare"]:checked');
  var culoare  = culoareEl ? culoareEl.value : "";

  // Stare: se trimite
  btn.disabled = true;
  btn.querySelector("span").textContent = "⏳ Se trimite...";

  // Simulăm latența unui request AJAX real (~300ms)
  setTimeout(function () {

    // Validare server-side simulată
    var erori = [];
    if (!marca)                             erori.push("Marca este obligatorie.");
    if (viteza < 50   || viteza > 500)      erori.push("Viteza invalida.");
    if (cp < 50       || cp > 2000)         erori.push("Cai putere invalizi.");
    if (greutate < 500 || greutate > 5000)  erori.push("Greutate invalida.");
    if (consum < 1    || consum > 50)       erori.push("Consum invalid.");
    if (!culoare)                           erori.push("Culoarea este obligatorie.");

    btn.disabled = false;
    btn.querySelector("span").textContent = "▶ Trimite pe Server";

    if (erori.length > 0) {
      afiseazaEroareAjax(erori.join(" "));
      return;
    }

    // Construiește înregistrarea nouă
    var now       = new Date();
    var timestamp = now.getFullYear() + "-" +
                    String(now.getMonth() + 1).padStart(2, "0") + "-" +
                    String(now.getDate()).padStart(2, "0") + " " +
                    String(now.getHours()).padStart(2, "0") + ":" +
                    String(now.getMinutes()).padStart(2, "0") + ":" +
                    String(now.getSeconds()).padStart(2, "0");

    var inregistrare = {
      marca:    marca,
      model:    model,
      viteza:   viteza,
      cp:       cp,
      greutate: greutate,
      consum:   consum,
      culoare:  culoare,
      timestamp: timestamp
    };

    // Salvează în localStorage
    var lista = citesteDate();
    lista.push(inregistrare);
    scrieDate(lista);

    // Răspuns de succes (imitând raspuns.succes = true)
    var raspuns = { succes: true, date: inregistrare };

    afiseazaRezultatAjax(raspuns.date);
    form.reset();
    document.querySelectorAll(".invalid").forEach(function(el) {
      el.classList.remove("invalid");
    });
    incarcaListaAjax();

  }, 300);

  return false;
}

// ── 2. AFIȘARE REZULTAT INLINE ────────────────────────────────────────────────

function afiseazaRezultatAjax(date) {
  var zona = document.getElementById("zonaRezultat");
  if (!zona) return;

  zona.innerHTML =
    "<div class='ajax-success'>" +
      "<p class='ajax-titlu'>✓ Date salvate cu succes!</p>" +
      "<div class='ajax-card'>" +
        "<div class='ajax-row'><span>Marcă</span><strong>" + escHtml(date.marca) + "</strong></div>" +
        "<div class='ajax-row'><span>Model</span><strong>" + escHtml(date.model || "—") + "</strong></div>" +
        "<div class='ajax-row'><span>Viteză max.</span><strong>" + escHtml(date.viteza) + " km/h</strong></div>" +
        "<div class='ajax-row'><span>Cai putere</span><strong>" + escHtml(date.cp) + " CP</strong></div>" +
        "<div class='ajax-row'><span>Greutate</span><strong>" + escHtml(date.greutate) + " kg</strong></div>" +
        "<div class='ajax-row'><span>Consum</span><strong>" + escHtml(date.consum) + " L/100km</strong></div>" +
        "<div class='ajax-row'><span>Culoare</span><strong>" + escHtml(date.culoare) + "</strong></div>" +
        "<div class='ajax-row'><span>Salvat la</span><strong>" + escHtml(date.timestamp) + "</strong></div>" +
      "</div>" +
    "</div>";

  zona.scrollIntoView({ behavior: "smooth", block: "start" });
}

function afiseazaEroareAjax(mesaj) {
  var zona = document.getElementById("zonaRezultat");
  if (!zona) return;
  zona.innerHTML =
    "<div class='ajax-error'>" +
      "<p>✗ " + escHtml(mesaj) + "</p>" +
    "</div>";
  zona.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── 3. ÎNCĂRCARE LISTĂ (înlocuiește GET la lista_ajax.php) ──────────────────

function incarcaListaAjax() {
  var zona = document.getElementById("zonaLista");
  if (!zona) return;

  zona.innerHTML = "<p class='ajax-loading'>⟳ Se încarcă înregistrările...</p>";

  // Simulăm latența unui request AJAX (~200ms)
  setTimeout(function () {
    var date = citesteDate();
    randeazaLista(date);
  }, 200);
}

function randeazaLista(date) {
  var zona = document.getElementById("zonaLista");
  if (!zona) return;

  if (!date || date.length === 0) {
    zona.innerHTML = "<p style='color:#666; padding:12px'>Nu există înregistrări.</p>";
    return;
  }

  var html = "<table class='ajax-table'>" +
    "<thead><tr>" +
      "<th>#</th><th>Marcă</th><th>Model</th>" +
      "<th>Viteză</th><th>CP</th><th>Greutate</th><th>Consum</th><th>Culoare</th><th>Timestamp</th><th>Acțiuni</th>" +
    "</tr></thead><tbody>";

  date.forEach(function(r, i) {
    html +=
      "<tr>" +
        "<td>" + (i + 1) + "</td>" +
        "<td>" + escHtml(r.marca) + "</td>" +
        "<td>" + escHtml(r.model || "—") + "</td>" +
        "<td>" + escHtml(r.viteza) + " km/h</td>" +
        "<td>" + escHtml(r.cp) + " CP</td>" +
        "<td>" + escHtml(r.greutate) + " kg</td>" +
        "<td>" + escHtml(r.consum) + " L</td>" +
        "<td>" + escHtml(r.culoare) + "</td>" +
        "<td>" + escHtml(r.timestamp) + "</td>" +
        "<td><button onclick='stergeInregistrare(" + i + ")' " +
             "style='background:none;border:1px solid #e05050;color:#e05050;padding:2px 8px;" +
             "border-radius:3px;cursor:pointer;font-size:.75rem'>✕</button></td>" +
      "</tr>";
  });

  html += "</tbody></table>";
  zona.innerHTML = html;
}

// ── 4. ȘTERGERE ──────────────────────────────────────────────────────────────

function stergeInregistrare(index) {
  var lista = citesteDate();
  lista.splice(index, 1);
  scrieDate(lista);
  incarcaListaAjax();
}

function stergeTot() {
  if (confirm("Ești sigur că vrei să ștergi toate înregistrările?")) {
    localStorage.removeItem(STORAGE_KEY);
    incarcaListaAjax();
  }
}

// ── 5. UTILITAR ───────────────────────────────────────────────────────────────

function escHtml(val) {
  if (val === null || val === undefined) return "—";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── 6. INIT ───────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {

  // Înlocuiește onsubmit cu versiunea AJAX
  var form = document.getElementById("formAuto");
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      valideazaSiTrimiteAjax();
      return false;
    };
  }

  // Buton: încarcă lista la click
  var btnLista = document.getElementById("btnIncarcaLista");
  if (btnLista) {
    btnLista.addEventListener("click", function() {
      incarcaListaAjax();
    });
  }

  // Buton: șterge tot
  var btnSterge = document.getElementById("btnStergeTot");
  if (btnSterge) {
    btnSterge.addEventListener("click", function() {
      stergeTot();
    });
  }

  // Încarcă lista automat la deschiderea paginii
  incarcaListaAjax();
});
