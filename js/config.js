window.CASA_BRASADA = {
  brand: "Casa Brasada",
  tagline: "Asados en vivo con esencia boyacense",
  city: "Bogotá y alrededores",
  phoneDisplay: "310 227 8456",
  phoneTel: "+573102278456",
  whatsapp: "573102278456",
  social: {
    instagram: "https://www.instagram.com/casabrasada",
    facebook: "https://www.facebook.com/casabrasada",
    tiktok: "https://www.tiktok.com/@casabrasada",
  },
  // GitHub Pages es la URL pública actual. casabrasada.com responde 503.
  // Cuando el dominio oficial esté activo, cambia siteUrl y las canónicas de cada página.
  siteUrl: "https://georgeq740.github.io/casa-brasada",
  officialDomainPending: "https://casabrasada.com",
  eventPresets: {
    empresarial: "Evento empresarial",
    "fin-de-ano": "Despedida de fin de año",
    cumpleanos: "Cumpleaños",
    matrimonio: "Matrimonio",
    bautizo: "Bautizo",
    comunion: "Primera comunión",
    quince: "15 años",
    grado: "Grado",
    finca: "Finca o en casa",
  },
  waUrl(text) {
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(text)}`;
  },
  track(eventName, params) {
    const detail = Object.assign({ event: eventName }, params || {});
    try {
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(detail);
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params || {});
      }
    } catch (err) {
      // Analytics is optional; never break the page.
    }
  },
};
