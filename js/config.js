window.CASA_BRASADA = {
  brand: "Casa Brasada",
  tagline: "Asados en vivo para celebrar distinto",
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
  commercialRules: {
    minimumGuests: 10,
    plateMin: 30000,
    plateMax: 150000,
    plateSliderMax: 120000,
    extraWaiterPrice: 80000,
    extraWaiterMax: 10,
    drinkBarPerGuest: 10000,
    beefMinGrams: 150,
    builderMinimumPrice: 30000,
    logisticsBasePrice: null,
    furnitureIncluded: true,
    transportIncluded: false,
    includedWaiters: 1,
    includedGrillCooks: 1,
  },
  includedServices: [
    { id: "grill", label: "1 parrillero" },
    { id: "waiter", label: "1 mesero" },
    { id: "furniture", label: "Mesas y sillas según el número de invitados" },
  ],
  // Completar price solo con valores reales. null = no se cobra ni se inventa.
  decorationOptions: {
    none: {
      id: "none",
      label: "Sin decoración",
      price: 0,
      billingType: "event",
    },
    basic: {
      id: "basic",
      label: "Decoración básica",
      price: null,
      billingType: "event",
    },
    themed: {
      id: "themed",
      label: "Decoración temática",
      price: null,
      billingType: "event",
    },
    custom: {
      id: "custom",
      label: "Decoración personalizada por cotizar",
      price: null,
      billingType: "event",
    },
  },
  // Completar solo con datos reales. Los campos null no se muestran.
  businessProfile: {
    legalName: null,
    taxId: null,
    electronicInvoice: null,
    corporateEmail: null,
    minimumCapacity: null,
    maximumCapacity: null,
    serviceCoverage: null,
    paymentMethods: null,
    availableDocuments: [],
    responseTime: null,
    businessHours: null,
  },
  campaignSources: [
    "instagram",
    "facebook",
    "tiktok",
    "google",
    "whatsapp",
    "linkedin",
  ],
  caseStudies: [],
  // Completar solo con testimonios reales. Campos: quote, name, eventType, guests, location, service, photo.
  testimonials: [],
  clientLogos: [],
  analyticsAliases: {
    quote_start: "quote_started",
    quote_mode_change: "quote_mode_selected",
    wa_cta_click: "whatsapp_click",
    wa_header_click: "whatsapp_click",
    wa_float_click: "whatsapp_click",
    quote_whatsapp_click: "whatsapp_click",
  },
  attributionKey: "cb_attribution",
  hasValue(value) {
    if (value === null || value === undefined || value === "") return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },
  captureAttribution() {
    try {
      const params = new URLSearchParams(window.location.search);
      const stored = JSON.parse(sessionStorage.getItem(this.attributionKey) || "{}");
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
        const value = params.get(key);
        if (value) stored[key] = value;
      });
      const origen = params.get("origen");
      if (origen) stored.origen = origen;
      sessionStorage.setItem(this.attributionKey, JSON.stringify(stored));
      return stored;
    } catch (error) {
      return {};
    }
  },
  getAttribution() {
    try {
      return JSON.parse(sessionStorage.getItem(this.attributionKey) || "{}");
    } catch (error) {
      return {};
    }
  },
  attributionParams() {
    const stored = this.getAttribution();
    return Object.fromEntries(
      Object.entries(stored).filter(([, value]) => this.hasValue(value))
    );
  },
  attributionLine() {
    const stored = this.attributionParams();
    const label = stored.utm_campaign || stored.utm_source || stored.origen;
    if (!label) return "";
    return `Origen de la solicitud: ${label}`;
  },
  filledBusinessFields() {
    const labels = {
      legalName: "Razón social",
      taxId: "NIT",
      electronicInvoice: "Facturación electrónica",
      corporateEmail: "Correo corporativo",
      minimumCapacity: "Capacidad mínima",
      maximumCapacity: "Capacidad máxima",
      serviceCoverage: "Cobertura",
      paymentMethods: "Medios de pago",
      availableDocuments: "Documentos disponibles",
      responseTime: "Tiempo estimado de respuesta",
      businessHours: "Horario",
    };
    return Object.entries(labels)
      .map(([key, label]) => {
        const value = this.businessProfile[key];
        if (!this.hasValue(value)) return null;
        return { key, label, value: Array.isArray(value) ? value.join(", ") : value };
      })
      .filter(Boolean);
  },
  decorationList() {
    return Object.values(this.decorationOptions);
  },
  decorationById(id) {
    return this.decorationList().find((item) => item.id === id) || this.decorationOptions.none;
  },
  decorationHasPrice(option) {
    return Number.isFinite(option?.price) && option.price > 0;
  },
  decorationCost(option, guests) {
    if (!this.decorationHasPrice(option)) return 0;
    const count = option.billingType === "person" ? Math.max(1, Number(guests) || 1) : 1;
    return option.price * count;
  },
  decorationBillingLabel(option) {
    if (!option || option.id === "none") return "";
    if (!this.decorationHasPrice(option)) return "Valor por cotizar";
    const amount = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(option.price);
    return option.billingType === "person" ? `${amount} por persona` : `${amount} por evento`;
  },
  waUrl(text) {
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(text)}`;
  },
  track(eventName, params) {
    const name = this.analyticsAliases[eventName] || eventName;
    const detail = Object.assign(
      { event: name },
      this.attributionParams(),
      params || {}
    );

    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, Object.assign({}, this.attributionParams(), params || {}));
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(detail);
      }
    } catch (error) {
      // La analítica es opcional y nunca debe romper la página.
    }
  },
};
