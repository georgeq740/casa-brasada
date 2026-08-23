(function () {
  const cfg = window.CASA_BRASADA;
  if (!cfg) return;

  const page = document.body.dataset.page || "inicio";

  const nav = [
    ["inicio", "index.html", "Inicio"],
    ["experiencia", "experiencia.html", "Experiencia"],
    ["eventos", "eventos.html", "Eventos"],
    ["cotizar", "cotizar.html", "Cotizar"],
    ["contacto", "contacto.html", "Contacto"],
  ];

  function injectSkipLink() {
    if (document.querySelector(".skip-link")) return;
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#contenido";
    skip.textContent = "Ir al contenido";
    document.body.prepend(skip);
  }

  function injectSchema() {
    if (document.getElementById("org-schema")) return;
    const data = {
      "@context": "https://schema.org",
      "@type": ["Caterer", "LocalBusiness"],
      name: cfg.brand,
      description:
        "Casa de banquetes especializada en asados en vivo con esencia boyacense para eventos sociales y empresariales en Bogotá y alrededores.",
      url: `${cfg.siteUrl}/`,
      telephone: cfg.phoneTel,
      areaServed: {
        "@type": "AdministrativeArea",
        name: cfg.city,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bogotá",
        addressCountry: "CO",
      },
      sameAs: [cfg.social.instagram, cfg.social.facebook, cfg.social.tiktok],
      servesCuisine: "Asados colombianos",
    };
    const script = document.createElement("script");
    script.id = "org-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function renderFaq(root) {
    const items = [
      [
        "¿Con cuánta anticipación debo reservar?",
        "La disponibilidad depende de la fecha y el tipo de evento. Te recomendamos consultar con anticipación, especialmente para fines de semana y temporadas empresariales.",
      ],
      [
        "¿Atienden eventos fuera de Bogotá?",
        "Sí. Atendemos eventos dentro y fuera de Bogotá. El transporte y la logística se calculan según la ubicación.",
      ],
      [
        "¿Puedo elegir el menú y los acompañamientos?",
        "Sí. Puedes seleccionar un presupuesto por persona o construir una propuesta con las carnes, acompañamientos y servicios que prefieras.",
      ],
      [
        "¿El servicio incluye mesas, sillas y meseros?",
        "Depende del plan seleccionado. El cotizador indica los servicios incluidos y permite agregar opciones adicionales.",
      ],
      [
        "¿La cotización de la página es definitiva?",
        "No. Es una estimación inicial sujeta a confirmación de fecha, ubicación, cantidad de invitados y condiciones del evento.",
      ],
      [
        "¿Cómo reservo la fecha?",
        "Después de confirmar la propuesta, nuestro equipo te informará las condiciones de reserva y pago.",
      ],
    ];
    root.innerHTML = `
      <section class="faq-section" aria-labelledby="faq-title">
        <div class="wrap">
          <div class="section-head">
            <p class="eyebrow">Preguntas frecuentes</p>
            <h2 id="faq-title">Antes de encender la parrilla</h2>
          </div>
          <div class="faq-list">
            ${items
              .map(
                ([q, a]) => `
              <details class="faq-item">
                <summary>${q}</summary>
                <p>${a}</p>
              </details>`
              )
              .join("")}
          </div>
        </div>
      </section>`;
  }

  function renderFinalCta(root) {
    const wa = cfg.waUrl(`Hola ${cfg.brand}, quiero cotizar un evento con asado en vivo.`);
    root.innerHTML = `
      <section class="final-cta" aria-labelledby="final-cta-title">
        <div class="wrap">
          <p class="eyebrow">Hablemos</p>
          <h2 id="final-cta-title">Cuéntanos cuándo, dónde y con cuántos invitados.</h2>
          <p class="muted">Nosotros diseñamos el menú, llevamos la parrilla y encendemos la experiencia.</p>
          <div class="hero-actions">
            <a class="btn btn-ember" href="cotizar.html">Cotizar mi evento</a>
            <a class="btn btn-ghost js-track-wa" data-track="wa_cta_click" href="${wa}" target="_blank" rel="noopener">Hablar por WhatsApp</a>
          </div>
        </div>
      </section>`;
  }

  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap header-inner">
        <a class="logo" href="index.html">
          <span class="logo-badge"><img class="logo-mark" src="assets/icons/logo.png" alt="Casa Brasada" width="58" height="58"></span>
          <span class="logo-text">
            <strong>${cfg.brand}</strong>
            <small>${cfg.tagline}</small>
          </span>
        </a>
        <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-controls="main-nav" aria-expanded="false">Menú</button>
        <nav class="nav" id="main-nav" aria-label="Principal">
          ${nav
            .map(
              ([id, href, label]) =>
                `<a href="${href}" class="${page === id ? "active" : ""}"${page === id ? ' aria-current="page"' : ""}>${label}</a>`
            )
            .join("")}
          <a class="btn btn-gold btn-wa js-track-wa" data-track="wa_header_click" href="${cfg.waUrl(
            `Hola ${cfg.brand}, quiero información de un evento con asado.`
          )}" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-3.5.7.7-3.4-.2-.3A9 9 0 1 1 12 20.5z"/></svg>
            WhatsApp ${cfg.phoneDisplay}
          </a>
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
          <div class="logo"><img class="logo-mark" src="assets/icons/logo.png" alt="Casa Brasada" width="58" height="58"><span>${cfg.brand}</span></div>
          <p class="muted">${cfg.tagline}. Llevamos la parrilla, el personal y el montaje a matrimonios, cumpleaños y eventos empresariales en ${cfg.city}.</p>
          <div class="socials">
            <a class="js-track-social" data-network="instagram" href="${cfg.social.instagram}" target="_blank" rel="noopener">Instagram</a>
            <a class="js-track-social" data-network="facebook" href="${cfg.social.facebook}" target="_blank" rel="noopener">Facebook</a>
            <a class="js-track-social" data-network="tiktok" href="${cfg.social.tiktok}" target="_blank" rel="noopener">TikTok</a>
          </div>
        </div>
        <div>
          <h2>Contacto</h2>
          <p class="muted"><a class="js-track-phone" href="tel:${cfg.phoneTel}">${cfg.phoneDisplay}</a></p>
        </div>
        <div>
          <h2>Cotiza tu evento</h2>
          <p class="muted">Elige un presupuesto por persona o arma el menú. Recibes una estimación inicial para enviar por WhatsApp.</p>
          <a class="btn btn-ember" href="cotizar.html">Cotizar mi evento</a>
        </div>
      </div>
      <p class="wrap legal">© ${new Date().getFullYear()} ${cfg.brand}. Todos los derechos reservados.</p>
    `;
  }

  const faqRoot = document.getElementById("site-faq");
  if (faqRoot) renderFaq(faqRoot);

  const ctaRoot = document.getElementById("site-cta");
  if (ctaRoot) renderFinalCta(ctaRoot);

  const wa = document.createElement("a");
  wa.className = "wa-float js-track-wa";
  wa.dataset.track = "wa_float_click";
  wa.href = cfg.waUrl(`Hola ${cfg.brand}, quiero cotizar un evento con experiencia de asados.`);
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "Escribir por WhatsApp");
  wa.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-3.5.7.7-3.4-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.2-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3c.1-.2 0-.3 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3 2 3.2 4.9 4.3 2.6.7 3.5.5 1.5-1 1.7-1.9.2-.8.1-.9-.2-.1-.5-.2z"/></svg>`;
  document.body.appendChild(wa);

  const toggle = header?.querySelector(".nav-toggle");
  const menu = header?.querySelector("#main-nav");

  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  toggle?.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (event) => {
    const waLink = event.target.closest(".js-track-wa");
    if (waLink) cfg.track(waLink.dataset.track || "wa_click");

    const social = event.target.closest(".js-track-social");
    if (social) cfg.track("social_click", { network: social.dataset.network });

    const phone = event.target.closest(".js-track-phone");
    if (phone) cfg.track("phone_click");
  });

  injectSkipLink();
  injectSchema();
})();
