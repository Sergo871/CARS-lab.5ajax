// ============================================
//  Lab 4 – JavaScript: Validare formular CGI
//  Sarcina suplimentară: verificare corectitudine
//  date ÎNAINTE de trimitere pe server
// ============================================

// Reguli de validare
var REGULI = {
  viteza:   { min: 50,   max: 500,  label: "Viteză maximă" },
  cp:       { min: 50,   max: 2000, label: "Cai putere" },
  greutate: { min: 500,  max: 5000, label: "Greutate" },
  consum:   { min: 1,    max: 50,   label: "Consum" }
};

// Afișează eroare la un câmp
function setEroare(id, mesaj) {
  var input = document.getElementById(id);
  var err   = document.getElementById("err_" + id);
  if (input)  input.classList.add("invalid");
  if (err) { err.textContent = mesaj; err.style.display = "block"; }
}

// Curăță eroare la un câmp
function clearEroare(id) {
  var input = document.getElementById(id);
  var err   = document.getElementById("err_" + id);
  if (input) input.classList.remove("invalid");
  if (err)   err.style.display = "none";
}

// Atașează listeners de curățare pe toate inputurile
document.addEventListener("DOMContentLoaded", function () {
  ["viteza","cp","greutate","consum","marca"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", function() { clearEroare(id); });
    if (el) el.addEventListener("change", function() { clearEroare(id); });
  });

  // Culoare radio
  document.querySelectorAll('input[name="culoare"]').forEach(function(r) {
    r.addEventListener("change", function() {
      var err = document.getElementById("err_culoare");
      if (err) err.style.display = "none";
    });
  });

  // Feedback live pe câmpuri numerice
  ["viteza","cp","greutate","consum"].forEach(function(id) {
    var input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", function() {
      var val  = parseFloat(input.value);
      var reg  = REGULI[id];
      var hint = document.getElementById("hint_" + id);
      if (!hint) return;
      if (isNaN(val) || input.value === "") {
        hint.textContent = "";
        return;
      }
      if (val < reg.min || val > reg.max) {
        hint.textContent = "⚠ Valoare acceptată: " + reg.min + " – " + reg.max;
        hint.style.color = "#e05050";
      } else {
        hint.textContent = "✓ Valoare corectă";
        hint.style.color = "#4caf82";
      }
    });
  });
});

// Validare completă înainte de submit
function valideazaSiTrimite() {
  var ok = true;

  // Validare câmpuri numerice
  ["viteza","cp","greutate","consum"].forEach(function(id) {
    var input = document.getElementById(id);
    var val   = parseFloat(input.value);
    var reg   = REGULI[id];

    if (input.value === "" || isNaN(val)) {
      setEroare(id, reg.label + " este obligatorie!");
      ok = false;
    } else if (val < reg.min || val > reg.max) {
      setEroare(id, "Valoare acceptată: " + reg.min + " – " + reg.max);
      ok = false;
    } else {
      clearEroare(id);
    }
  });

  // Validare marcă
  var marca = document.getElementById("marca").value;
  if (!marca) {
    setEroare("marca", "Selectați marca!");
    ok = false;
  } else {
    clearEroare("marca");
  }

  // Validare culoare
  var culoare = document.querySelector('input[name="culoare"]:checked');
  var errCuloare = document.getElementById("err_culoare");
  if (!culoare) {
    if (errCuloare) { errCuloare.textContent = "Selectați culoarea!"; errCuloare.style.display = "block"; }
    ok = false;
  } else {
    if (errCuloare) errCuloare.style.display = "none";
  }

  if (!ok) {
    // Scroll la prima eroare
    var prima = document.querySelector(".invalid, .error-msg[style*='block']");
    if (prima) prima.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  // Dacă totul e valid — afișează loading și trimite formularul
  var btn = document.getElementById("btnSubmit");
  if (btn) {
    btn.disabled = true;
    btn.querySelector("span").textContent = "⏳ Se trimite...";
  }

  return true; // permite submit HTML form
}

// Reset formular
function resetFormular() {
  document.getElementById("formAuto").reset();
  document.querySelectorAll(".invalid").forEach(function(el) { el.classList.remove("invalid"); });
  document.querySelectorAll(".error-msg").forEach(function(el) { el.style.display = "none"; });
  document.querySelectorAll("[id^='hint_']").forEach(function(el) { el.textContent = ""; });
}

// ── FUNCȚIE INTERNĂ REUTILIZABILĂ PENTRU AJAX ────────────────────────────────
// (apelată din ajax.js fără să declanșeze submit-ul nativ)
function valideazaSiTrimite_intern() {
  var ok = true;

  ["viteza","cp","greutate","consum"].forEach(function(id) {
    var input = document.getElementById(id);
    var val   = parseFloat(input.value);
    var reg   = REGULI[id];
    if (input.value === "" || isNaN(val)) {
      setEroare(id, reg.label + " este obligatorie!");
      ok = false;
    } else if (val < reg.min || val > reg.max) {
      setEroare(id, "Valoare acceptată: " + reg.min + " – " + reg.max);
      ok = false;
    } else {
      clearEroare(id);
    }
  });

  var marca = document.getElementById("marca").value;
  if (!marca) { setEroare("marca", "Selectați marca!"); ok = false; }
  else { clearEroare("marca"); }

  var culoare = document.querySelector('input[name="culoare"]:checked');
  var errCuloare = document.getElementById("err_culoare");
  if (!culoare) {
    if (errCuloare) { errCuloare.textContent = "Selectați culoarea!"; errCuloare.style.display = "block"; }
    ok = false;
  } else {
    if (errCuloare) errCuloare.style.display = "none";
  }

  if (!ok) {
    var prima = document.querySelector(".invalid, .error-msg[style*='block']");
    if (prima) prima.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return ok;
}
