// ============================================
//  Efecte vizuale JavaScript – Sarcina Supimentară
//  Se aplică pe toate paginile (index, bmw, mclaren, porsche)
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // 1. EFECT: Fade-in la încărcarea paginii pentru carduri
  var cards = document.querySelectorAll(".model-card, .brand-card");
  cards.forEach(function (card, i) {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    setTimeout(function () {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 150 * i);
  });

  // 2. EFECT: Titlu header – apariție literă cu literă
  var h1 = document.querySelector("header h1");
  if (h1) {
    var text = h1.textContent;
    h1.textContent = "";
    h1.style.opacity = "1";
    text.split("").forEach(function (litera, i) {
      var span = document.createElement("span");
      span.textContent = litera === " " ? "\u00A0" : litera;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      span.style.transition = "opacity 0.05s ease";
      h1.appendChild(span);
      setTimeout(function () {
        span.style.opacity = "1";
      }, 40 * i);
    });
  }

  // 3. EFECT: Hover pe imaginile din model-card – zoom + overlay mesaj
  var modelImgs = document.querySelectorAll(".model-card img");
  modelImgs.forEach(function (img) {
    var card = img.closest(".model-card");
    img.addEventListener("mouseenter", function () {
      img.style.filter = "brightness(1.15) saturate(1.2)";
    });
    img.addEventListener("mouseleave", function () {
      img.style.filter = "";
    });
  });

  // 4. EFECT: Click pe brand-card – ripple effect
  var brandCards = document.querySelectorAll(".brand-card");
  brandCards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      var ripple = document.createElement("span");
      ripple.style.cssText = [
        "position:absolute",
        "border-radius:50%",
        "background:rgba(201,168,76,0.25)",
        "width:10px",
        "height:10px",
        "transform:scale(0)",
        "animation:ripple 0.6s linear",
        "pointer-events:none",
        "left:" + (e.offsetX - 5) + "px",
        "top:"  + (e.offsetY - 5) + "px"
      ].join(";");

      card.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  });

  // Injecteaza animatia ripple in CSS
  if (!document.getElementById("ripple-style")) {
    var style = document.createElement("style");
    style.id = "ripple-style";
    style.textContent = "@keyframes ripple { to { transform: scale(40); opacity: 0; } }";
    document.head.appendChild(style);
  }

  // 5. EFECT: Scroll — nav link activ se evidentiaza la scroll
  var navLinks = document.querySelectorAll("nav ul li a");
  var paginaCurenta = window.location.pathname.split("/").pop();
  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === paginaCurenta) {
      link.classList.add("active");
    }
  });

  // 6. EFECT: Contor animat pentru pagina index (număr carduri disponibile)
  var heroP = document.querySelector(".hero p");
  if (heroP) {
    var numar = document.querySelectorAll(".brand-card").length;
    if (numar > 0) {
      var contor = 0;
      var interval = setInterval(function () {
        contor++;
        heroP.textContent = "Descoperă cele mai performante " + contor + " mărci din lume";
        if (contor >= numar) clearInterval(interval);
      }, 300);
    }
  }

});
