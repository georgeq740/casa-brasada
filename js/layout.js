(function () {
  const cfg = window.CASA_BRASADA;
  const waLink = (text) =>
    `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;

  const page = document.body.dataset.page || "inicio";

  const nav = [
    ["inicio", "index.html", "Inicio"],
    ["experiencia", "experiencia.html", "Experiencia"],
    ["eventos", "eventos.html", "Eventos"],
    ["cotizar", "cotizar.html", "Cotizar"],
    ["contacto", "contacto.html", "Contacto"],
  ];

  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap header-inner">
        <a class="logo" href="index.html" aria-label="${cfg.brand}">
          <img class="logo-mark" src="assets/icons/favicon.svg" alt="">
          <span>${cfg.brand}</span>
        </a>
        <button class="nav-toggle" type="button" aria-label="Abrir menú">Menú</button>
        <nav class="nav" id="main-nav">
          ${nav
            .map(
              ([id, href, label]) =>
                `<a href="${href}" class="${page === id ? "active" : ""}">${label}</a>`
            )
            .join("")}
          <a class="btn btn-gold" href="${waLink(
            `Hola ${cfg.brand}, quiero información de un evento con asado.`
          )}" target="_blank" rel="noopener">WhatsApp ${cfg.phoneDisplay}</a>
        </nav>
      </div>
    `;
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap footer-grid">
        <div>
          <div class="logo"><img class="logo-mark" src="assets/icons/favicon.svg" alt=""><span>${cfg.brand}</span></div>
          <p class="muted">${cfg.tagline}. Asados en vivo para matrimonios, bautizos, cumpleaños y eventos empresariales en ${cfg.city}.</p>
          <div class="socials">
            <a href="${cfg.social.instagram}" target="_blank" rel="noopener">Instagram</a>
            <a href="${cfg.social.facebook}" target="_blank" rel="noopener">Facebook</a>
            <a href="${cfg.social.tiktok}" target="_blank" rel="noopener">TikTok</a>
          </div>
        </div>
        <div>
          <h3>Contacto</h3>
          <p class="muted"><a href="tel:+573102278456">${cfg.phoneDisplay}</a></p>
        </div>
        <div>
          <h3>Cotiza tu brasa</h3>
          <p class="muted">Dinos el valor del plato y armamos la parrilla: carne, papas, yuca, arepa y bebida.</p>
          <a class="btn btn-ember" href="cotizar.html">Armar mi plato</a>
        </div>
      </div>
      <p class="wrap legal">© ${new Date().getFullYear()} ${cfg.brand}. Todos los derechos reservados.</p>
    `;
  }

  const wa = document.createElement("a");
  wa.className = "wa-float";
  wa.href = waLink(`Hola ${cfg.brand}, quiero cotizar un evento con experiencia de asados.`);
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "Escribir por WhatsApp");
  wa.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-3.5.7.7-3.4-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.2-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3c.1-.2 0-.3 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3 2 3.2 4.9 4.3 2.6.7 3.5.5 1.5-1 1.7-1.9.2-.8.1-.9-.2-.1-.5-.2z"/></svg>`;
  document.body.appendChild(wa);

  const toggle = header?.querySelector(".nav-toggle");
  const menu = header?.querySelector("#main-nav");
  toggle?.addEventListener("click", () => menu.classList.toggle("open"));
})();
