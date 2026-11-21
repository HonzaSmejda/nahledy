// Šablona webu: menu na mobilu a odeslání formuláře bez obnovení stránky.
(function () {
  var tlacitko = document.querySelector(".hlavicka__menu-tlacitko");
  var menu = document.getElementById("menu");
  if (tlacitko && menu) {
    tlacitko.addEventListener("click", function () {
      var otevrene = menu.classList.toggle("menu--otevrene");
      tlacitko.setAttribute("aria-expanded", otevrene ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("menu--otevrene");
        tlacitko.setAttribute("aria-expanded", "false");
      }
    });
  }

  var formular = document.querySelector(".formular");
  if (!formular) return;
  var stav = formular.querySelector(".formular__stav");

  formular.addEventListener("submit", function (e) {
    e.preventDefault();
    var chybi = Array.prototype.filter.call(formular.querySelectorAll("[required]"), function (pole) {
      return !pole.value.trim();
    });
    if (chybi.length) {
      stav.textContent = "Vyplňte prosím všechna pole.";
      chybi[0].focus();
      return;
    }
    var odeslat = formular.querySelector("button[type=submit]");
    odeslat.disabled = true;
    stav.textContent = "Odesílám…";
    fetch(formular.action, { method: "POST", body: new FormData(formular), headers: { "Accept": "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (data) {
        if (data.ok) {
          formular.reset();
          stav.textContent = "Děkujeme, zpráva odešla. Ozveme se co nejdřív.";
        } else {
          stav.textContent = data.chyba || "Zprávu se nepodařilo odeslat. Zavolejte nám prosím.";
        }
      })
      .catch(function () { stav.textContent = "Zprávu se nepodařilo odeslat. Zavolejte nám prosím."; })
      .finally(function () { odeslat.disabled = false; });
  });
})();
