(function () {
  const cfg = window.CASA_BRASADA;
  const forms = cfg?.forms;
  if (!cfg || !forms) return;

  const advisor = document.getElementById("empresas-advisor");
  if (advisor) {
    advisor.href = cfg.waUrl(
      `Hola ${cfg.brand}, soy de un área empresarial y quiero hablar con un asesor sobre un evento con asado en vivo.`
    );
  }

  const profileRoot = document.getElementById("business-profile");
  if (profileRoot) {
    const fields = cfg.filledBusinessFields();
    if (fields.length) {
      profileRoot.innerHTML = `
        <dl class="profile-list">
          ${fields.map((item) => `<div><dt>${item.label}</dt><dd>${item.value}</dd></div>`).join("")}
        </dl>`;
    } else {
      const infoUrl = cfg.waUrl(
        `Hola ${cfg.brand}, necesito información para registrarlos como proveedor. ¿Me comparten los datos empresariales disponibles?`
      );
      profileRoot.innerHTML = `
        <p class="muted">¿Necesitas información para registrar a Casa Brasada como proveedor? Solicítala directamente con nuestro equipo.</p>
        <p><a class="btn btn-gold js-track-wa" data-track="wa_cta_click" href="${infoUrl}" target="_blank" rel="noopener">Solicitar información empresarial</a></p>`;
    }
  }

  const form = document.getElementById("corporate-form");
  if (!form) return;

  const dateInput = form.querySelector("#corp-date");
  const guestsInput = form.querySelector("#corp-guests");
  if (dateInput) {
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }
  if (guestsInput) guestsInput.min = String(cfg.commercialRules.minimumGuests);

  form.addEventListener("focusin", () => {
    cfg.track("corporate_form_start");
  }, { once: true });

  function validate() {
    forms.clearFieldErrors(form);
    const firstError = [];
    const required = [
      ["#corp-name", "Escribe tu nombre."],
      ["#corp-company", "Indica el nombre de la empresa."],
      ["#corp-role", "Indica tu cargo o área."],
      ["#corp-event", "Selecciona el tipo de evento."],
      ["#corp-date", "Indica una fecha tentativa."],
      ["#corp-guests", `Indica al menos ${cfg.commercialRules.minimumGuests} asistentes.`],
      ["#corp-city", "Indica la ciudad o ubicación."],
      ["#corp-budget", "Indica un presupuesto estimado."],
    ];

    required.forEach(([selector, message]) => {
      const field = form.querySelector(selector);
      if (!field?.value.trim()) {
        forms.setFieldError(field, message);
        firstError.push(field);
      }
    });

    if (dateInput?.value && dateInput.min && dateInput.value < dateInput.min) {
      forms.setFieldError(dateInput, "La fecha tentativa no puede ser anterior a hoy.");
      firstError.push(dateInput);
    }

    const guests = Number(guestsInput?.value);
    if (guestsInput?.value && guests < cfg.commercialRules.minimumGuests) {
      forms.setFieldError(
        guestsInput,
        `Indica al menos ${cfg.commercialRules.minimumGuests} asistentes.`
      );
      firstError.push(guestsInput);
    }

    const services = [...form.querySelectorAll("input[name='services']:checked")];
    if (!services.length) {
      const anchor = document.getElementById("corp-services-anchor");
      forms.setFieldError(anchor, "Selecciona al menos un servicio requerido.");
      firstError.push(form.querySelector("input[name='services']"));
    }

    if (firstError.length) {
      cfg.track("form_validation_error", { form: "empresas", fields: firstError.length });
      firstError[0].focus?.();
      return false;
    }
    return true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;

    const data = new FormData(form);
    const services = [...form.querySelectorAll("input[name='services']:checked")].map((el) => el.value);
    const attribution = cfg.attributionLine();
    const message = [
      `Hola ${cfg.brand}, quiero solicitar una propuesta empresarial.`,
      "",
      "Datos de contacto",
      `Nombre: ${String(data.get("name") || "").trim()}`,
      `Cargo o área: ${String(data.get("role") || "").trim()}`,
      "",
      "Datos de la empresa",
      `Empresa: ${String(data.get("company") || "").trim()}`,
      `Facturación: ${data.get("invoice") || "Por confirmar"}`,
      "",
      "Información del evento",
      `Tipo de evento: ${data.get("event")}`,
      `Fecha tentativa: ${data.get("date")}`,
      `Número de asistentes: ${data.get("guests")}`,
      `Ciudad o ubicación: ${String(data.get("city") || "").trim()}`,
      "",
      "Servicios requeridos",
      ...services.map((item) => `• ${item}`),
      "",
      "Presupuesto",
      String(data.get("budget") || "").trim(),
      "",
      "Observaciones",
      String(data.get("notes") || "").trim() || "Sin observaciones",
      "",
      "Nota: esta solicitud está pendiente de confirmación de fecha, ubicación, alcance y condiciones comerciales.",
      attribution || null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    cfg.track("corporate_form_completed");
    cfg.track("quote_whatsapp_click", { audience: "empresa" });

    window.open(cfg.waUrl(message), "_blank", "noopener");
  });
})();
