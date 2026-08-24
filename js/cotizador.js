(function () {
  const cfg = window.CASA_BRASADA;
  const forms = cfg?.forms;
  if (!cfg || !forms) return;

  const rules = cfg.commercialRules;
  const MENU = [
    { id: "res", name: "Carne de res", unit: "g", step: 50, min: rules.beefMinGrams, max: 500, price: 100 },
    { id: "cerdo", name: "Cerdo ahumado", unit: "g", step: 50, min: 0, max: 400, price: 80 },
    { id: "pollo", name: "Pollo a la brasa", unit: "g", step: 50, min: 0, max: 400, price: 70 },
    { id: "chorizo", name: "Chorizo", unit: "und", step: 1, min: 0, max: 4, price: 6000 },
    { id: "papa", name: "Papa salada", unit: "und", step: 1, min: 0, max: 6, price: 2000 },
    { id: "yuca", name: "Yuca", unit: "und", step: 1, min: 0, max: 4, price: 3000 },
    { id: "arepa", name: "Arepa asada", unit: "und", step: 1, min: 0, max: 4, price: 3500 },
    { id: "maduro", name: "Maduro asado", unit: "und", step: 1, min: 0, max: 4, price: 3500 },
    { id: "gaseosa", name: "Gaseosa", unit: "und", step: 1, min: 0, max: 6, price: 2500 },
    { id: "cerveza", name: "Cerveza", unit: "und", step: 1, min: 0, max: 6, price: 4500 },
    { id: "ensalada", name: "Ensalada", unit: "und", step: 1, min: 0, max: 3, price: 4000 },
    { id: "postre", name: "Postre", unit: "und", step: 1, min: 0, max: 3, price: 6000 },
  ];

  const INCLUDED_SERVICES = cfg.includedServices || [];

  const qty = Object.fromEntries(MENU.map((item) => [item.id, item.id === "res" ? rules.beefMinGrams : 0]));
  let extraWaiters = 0;
  let mode = "price";
  let builderMinimumReached = false;

  function money(n) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function beefGrams(price) {
    return Math.max(rules.beefMinGrams, 250 + Math.round((price - 40000) / 100));
  }

  function composePlate(price) {
    const p = Math.max(rules.plateMin, Math.min(rules.plateMax, Number(price) || rules.plateMin));
    const items = [];
    let name = "Brasa Esencial";

    if (p < 60000) {
      items.push({
        qty: `${beefGrams(p)} g`,
        name: "carne de res a la brasa",
        highlight: true,
      });
    } else if (p < 75000) {
      items.push({ qty: `${beefGrams(40000)} g`, name: "carne de res a la brasa", highlight: true });
      items.push({
        qty: `${80 + Math.round((p - 60000) / 100)} g`,
        name: "cerdo ahumado",
      });
    } else if (p < 95000) {
      items.push({ qty: "300 g", name: "carne de res a la brasa" });
      items.push({ qty: "150 g", name: "cerdo ahumado" });
      items.push({ qty: "100 g", name: "pollo a la brasa" });
    } else {
      items.push({ qty: "350 g", name: "lomo de res" });
      items.push({ qty: "150 g", name: "cerdo ahumado" });
      items.push({ qty: "100 g", name: "pollo a la brasa" });
    }

    if (p >= 60000) items.push({ qty: "1", name: "chorizo" });

    const papas = p < 38000 ? 1 : 2;
    items.push({
      qty: String(papas),
      name: papas === 1 ? "papa salada" : "papas saladas",
    });

    if (p >= rules.plateMin) items.push({ qty: "1", name: "yuca" });
    items.push({
      qty: "1",
      name: "arepa asada",
    });

    if (p >= 50000) items.push({ qty: "1", name: "ensalada criolla" });
    if (p >= 65000) items.push({ qty: "1", name: "maduro asado" });
    if (p >= 80000) items.push({ qty: "1", name: "postre de la casa" });
    if (p >= 95000) items.push({ qty: "1", name: "guarnición gourmet" });

    if (p < 32000) items.push({ qty: "1", name: "gaseosa" });
    else if (p < 40000) items.push({ qty: "1", name: "cerveza o 1 gaseosa" });
    else if (p < 80000) items.push({ qty: "1", name: "cerveza o 2 gaseosas" });
    else items.push({ qty: "2", name: "cervezas o 3 gaseosas" });

    if (p >= 95000) name = "Brasa Premium";
    else if (p >= 80000) name = "Brasa de Fiesta";
    else if (p >= 60000) name = "Brasa Mixta";
    else if (p >= 50000) name = "Brasa Mayor";
    else if (p >= 40000) name = "Brasa Clásica";
    else if (p >= rules.plateMin) name = "Brasa Campestre";

    return { name, items, unitPrice: p };
  }

  function builtPlate() {
    const items = MENU.filter((item) => qty[item.id] > 0).map((item) => {
      const amount = qty[item.id];
      const line = amount * item.price;
      const label = item.unit === "g" ? `${amount} g` : String(amount);
      return {
        qty: label,
        name: item.name,
        line,
      };
    });
    const unitPrice = items.reduce((sum, item) => sum + item.line, 0);
    return { name: "Plato armado", items, unitPrice };
  }

  const form = document.getElementById("quote-form");
  if (!form) return;

  const dateInput = form.querySelector("#date");
  const priceInput = form.querySelector("#price");
  const priceRange = form.querySelector("#price-range");
  const guestsInput = form.querySelector("#guests");
  const plateBox = document.getElementById("plate-box");
  const priceLabel = document.getElementById("price-label");
  const totalLabel = document.getElementById("total-label");
  const plateName = document.getElementById("plate-name");
  const unitCaption = document.getElementById("unit-caption");
  const builderList = document.getElementById("builder-list");
  const modePrice = document.getElementById("mode-price");
  const modeBuild = document.getElementById("mode-build");

  function applyCommercialRules() {
    if (guestsInput) guestsInput.min = String(rules.minimumGuests);
    if (priceInput) {
      priceInput.min = String(rules.plateMin);
      priceInput.max = String(rules.plateMax);
    }
    if (priceRange) {
      priceRange.min = String(rules.plateMin);
      priceRange.max = String(rules.plateSliderMax);
    }
    const waiterHelp = document.getElementById("waiter-help");
    if (waiterHelp) {
      waiterHelp.textContent = `La propuesta incluye ${rules.includedWaiters} mesero. Cada mesero adicional vale ${money(rules.extraWaiterPrice)}. Máximo ${rules.extraWaiterMax} adicionales.`;
    }
    const waiterRate = document.getElementById("waiter-rate");
    if (waiterRate) waiterRate.textContent = `${money(rules.extraWaiterPrice)} c/u`;
    const drinkText = document.getElementById("drink-bar-text");
    if (drinkText) {
      drinkText.textContent = `Barra de bebidas (${money(rules.drinkBarPerGuest)} por persona)`;
    }
    const buildHelp = document.getElementById("build-help");
    if (buildHelp) {
      buildHelp.textContent = `El plato personalizado parte de una base mínima de ${rules.beefMinGrams} g de carne de res. Puedes agregar otras proteínas, acompañamientos y bebidas.`;
    }
    const minNote = document.getElementById("builder-min-note");
    if (minNote) {
      minNote.textContent = `El plato personalizado debe alcanzar un valor mínimo de ${money(rules.builderMinimumPrice)} por persona.`;
    }
    const rangeHelp = document.getElementById("price-range-help");
    if (rangeHelp) {
      rangeHelp.textContent = `Usa el control hasta ${money(rules.plateSliderMax)} o escribe manualmente un valor de hasta ${money(rules.plateMax)}.`;
    }
  }

  if (dateInput) {
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = iso;
  }

  function syncPrice(source) {
    const next = Math.max(rules.plateMin, Math.min(rules.plateMax, Number(source.value) || rules.plateMin));
    priceInput.value = next;
    if (priceRange) priceRange.value = Math.min(rules.plateSliderMax, next);
    const status = document.getElementById("price-range-status");
    if (status) {
      const above = next > rules.plateSliderMax;
      status.hidden = !above;
      status.textContent = above
        ? `El valor escrito es ${money(next)}, superior al rango visual del control (${money(rules.plateSliderMax)}).`
        : "";
    }
    return next;
  }

  function waiterCost() {
    return extraWaiters * rules.extraWaiterPrice;
  }

  function drinkBarCost(guests) {
    const bar = form.querySelector("#drink-bar");
    if (!bar?.checked) return 0;
    return guests * rules.drinkBarPerGuest;
  }

  function selectedDecoration() {
    const chosen = form.querySelector("input[name='decoration']:checked");
    return cfg.decorationById(chosen?.value || "none");
  }

  function decorationCost(guests) {
    return cfg.decorationCost(selectedDecoration(), guests);
  }

  function eventTotal(plate, guests) {
    return plate.unitPrice * guests + waiterCost() + drinkBarCost(guests) + decorationCost(guests);
  }

  function renderWaiters() {
    const count = document.getElementById("waiter-count");
    if (count) count.textContent = String(extraWaiters);
    const note = document.getElementById("waiter-total-note");
    if (note) {
      const totalWaiters = (rules.includedWaiters || 1) + extraWaiters;
      note.textContent = extraWaiters
        ? `Total de meseros: ${totalWaiters} (${rules.includedWaiters} incluido y ${extraWaiters} adicional${extraWaiters > 1 ? "es" : ""}).`
        : `Total de meseros: ${totalWaiters} incluido.`;
    }
  }

  function renderDecorationOptions() {
    const root = document.getElementById("decoration-options");
    if (!root) return;
    const current = form.querySelector("input[name='decoration']:checked")?.value || "none";
    root.innerHTML = cfg.decorationList()
      .map((option) => {
        const billing = cfg.decorationBillingLabel(option);
        return `<label>
          <input type="radio" name="decoration" value="${option.id}" ${option.id === current ? "checked" : ""}>
          <span>${option.label}${billing ? ` · ${billing}` : ""}</span>
        </label>`;
      })
      .join("");
    syncDecorationNotes();
  }

  function syncDecorationNotes() {
    const wrap = document.getElementById("decoration-notes-wrap");
    if (!wrap) return;
    wrap.hidden = selectedDecoration().id !== "custom";
  }

  function currentPlate() {
    if (mode === "build") return builtPlate();
    return composePlate(Number(priceInput.value));
  }

  function builderMeetsMinimum(plate) {
    return Number.isFinite(plate.unitPrice) && plate.unitPrice >= rules.builderMinimumPrice;
  }

  function updateSubmitState(plate) {
    const submit = form.querySelector("#quote-submit");
    if (!submit) return;
    const blocked = mode === "build" && !builderMeetsMinimum(plate || builtPlate());
    submit.disabled = blocked;
    submit.setAttribute("aria-disabled", String(blocked));
    submit.classList.toggle("is-disabled", blocked);
    submit.textContent = blocked
      ? "Completa el mínimo para continuar"
      : "Solicitar propuesta por WhatsApp";
  }

  function renderPlate() {
    const guests = Math.max(1, Number(guestsInput.value) || 1);
    const plate = currentPlate();
    const food = plate.unitPrice * guests;
    const waiters = waiterCost();
    const drinks = drinkBarCost(guests);
    const decoration = selectedDecoration();
    const decorAmount = decorationCost(guests);
    const total = food + waiters + drinks + decorAmount;
    const incomplete = mode === "build" && !builderMeetsMinimum(plate);
    if (mode === "build") updateBuilderGap();
    syncDecorationNotes();
    updateSubmitState(plate);
    plateName.textContent = plate.name;
    const totalBox = document.querySelector(".total-box");
    const totalCaption = document.getElementById("total-caption");
    const estimateNote = document.getElementById("estimate-note");
    totalBox?.classList.toggle("is-incomplete", incomplete);
    if (incomplete) {
      const missing = rules.builderMinimumPrice - plate.unitPrice;
      if (totalCaption) totalCaption.textContent = "Aún no es una propuesta válida";
      totalLabel.textContent = money(plate.unitPrice);
      if (unitCaption) {
        unitCaption.textContent = `Valor actual del plato: ${money(plate.unitPrice)}. Te faltan ${money(missing)} para el mínimo de ${money(rules.builderMinimumPrice)} por persona.`;
      }
    } else {
      if (totalCaption) totalCaption.textContent = "Total estimado";
      totalLabel.textContent = money(total);
      if (unitCaption) {
        unitCaption.textContent = `${money(plate.unitPrice)} por persona · ${guests} invitados · menú ${money(food)}`;
      }
    }
    if (estimateNote) {
      estimateNote.textContent = decoration.id === "custom"
        ? "Este total no incluye el valor de la decoración personalizada, que será confirmado en la propuesta final."
        : "Este valor es una estimación inicial. La propuesta final puede variar según la fecha, ubicación, número de invitados, transporte y servicios adicionales.";
    }

    const menuRows = plate.items.length
      ? plate.items
          .map((item) => {
            const extra = item.line ? `<em>${money(item.line)}</em>` : "";
            const cls = item.highlight ? " plate-item-main" : "";
            return `<div class="plate-item${cls}"><strong>${item.qty}</strong><span>${item.name}</span>${extra}</div>`;
          })
          .join("")
      : `<p class="muted">Todavía no hay ingredientes en el plato.</p>`;

    const extraRows = [
      extraWaiters
        ? `<div class="plate-item"><strong>${extraWaiters}</strong><span>mesero${extraWaiters > 1 ? "s" : ""} adicional${extraWaiters > 1 ? "es" : ""}</span><em>${money(waiters)}</em></div>`
        : "",
      drinks
        ? `<div class="plate-item"><strong>1</strong><span>barra de bebidas</span><em>${money(drinks)}</em></div>`
        : "",
      decoration.id === "none"
        ? `<div class="plate-item"><strong>—</strong><span>Sin decoración</span><em>${money(0)}</em></div>`
        : `<div class="plate-item"><strong>1</strong><span>${decoration.label}${cfg.decorationBillingLabel(decoration) ? ` · ${cfg.decorationBillingLabel(decoration)}` : ""}</span><em>${cfg.decorationHasPrice(decoration) ? money(decorAmount) : "Por cotizar"}</em></div>`,
    ].filter(Boolean).join("");

    plateBox.innerHTML = `
      <div class="summary-block">
        <p class="eyebrow">Menú</p>
        ${menuRows}
        <div class="plate-item"><strong>${guests}</strong><span>${money(plate.unitPrice)} por persona</span><em>${Number.isFinite(food) ? money(food) : "—"}</em></div>
      </div>
      <div class="summary-block included-box">
        <p class="eyebrow">Incluido en la propuesta</p>
        ${INCLUDED_SERVICES.map(
          (item) =>
            `<div class="plate-item"><strong>Incluido</strong><span>${item.label}</span></div>`
        ).join("")}
      </div>
      <div class="summary-block">
        <p class="eyebrow">Adicionales</p>
        ${extraRows}
      </div>`;
  }

  function render(event) {
    if (mode === "price") {
      const source = event?.target?.id === "price-range" ? priceRange : priceInput;
      const price = syncPrice(source || priceInput);
      priceLabel.textContent = money(price);
    }
    renderPlate();
  }

  function updateBuilderGap() {
    const gap = document.getElementById("builder-gap");
    const current = builtPlate().unitPrice;
    const missing = rules.builderMinimumPrice - current;
    if (gap) {
      gap.textContent = missing > 0
        ? `Te faltan ${money(missing)} para alcanzar el mínimo de ${money(rules.builderMinimumPrice)}.`
        : "Valor mínimo alcanzado.";
    }
    if (missing <= 0 && !builderMinimumReached) {
      builderMinimumReached = true;
      cfg.track("builder_minimum_reached", { unitPrice: current });
    }
  }

  function renderBuilder() {
    updateBuilderGap();
    builderList.innerHTML = MENU.map((item) => {
      const amount = qty[item.id];
      const shown = item.unit === "g" ? `${amount} g` : amount;
      const rate = item.unit === "g" ? `${money(item.price)} / g` : `${money(item.price)} c/u`;
      const atMin = amount <= item.min;
      const badge = item.id === "res" ? '<span class="hint-badge">Base mínima</span>' : "";
      return `
        <div class="builder-row">
          <div>
            <strong>${item.name}${badge}</strong>
            <small>${rate}</small>
          </div>
          <div class="stepper">
            <button type="button" data-id="${item.id}" data-dir="-1" aria-label="Quitar ${item.name}" ${atMin ? "disabled" : ""}>−</button>
            <span>${shown}</span>
            <button type="button" data-id="${item.id}" data-dir="1" aria-label="Agregar ${item.name}">+</button>
          </div>
        </div>`;
    }).join("");
  }

  function setMode(next) {
    mode = next;
    form.querySelectorAll(".mode-btn").forEach((btn) => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    modePrice.hidden = mode !== "price";
    modeBuild.hidden = mode !== "build";
    priceInput.required = mode === "price";
    form.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.tabIndex = btn.dataset.mode === mode ? 0 : -1;
    });
    cfg.track("quote_mode_change", { mode });
    render();
    if (mode === "build") updateBuilderGap();
  }

  const modeButtons = [...form.querySelectorAll(".mode-btn")];
  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });
  form.querySelector(".mode-switch")?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const current = modeButtons.findIndex((btn) => btn.dataset.mode === mode);
    const next = event.key === "ArrowRight"
      ? (current + 1) % modeButtons.length
      : (current - 1 + modeButtons.length) % modeButtons.length;
    modeButtons[next].focus();
    setMode(modeButtons[next].dataset.mode);
  });

  const params = new URLSearchParams(window.location.search);
  const eventSelect = form.querySelector("#event");
  const preset = params.get("evento");
  if (preset && cfg.eventPresets?.[preset] && eventSelect) {
    eventSelect.value = cfg.eventPresets[preset];
  }

  const corporateFields = document.getElementById("corporate-fields");
  function setAudience(value, announce) {
    const radio = form.querySelector(`input[name="audience"][value="${value}"]`);
    if (radio) radio.checked = true;
    if (corporateFields) corporateFields.hidden = value !== "empresa";
    if (announce) cfg.track("audience_selected", { audience: value });
  }
  if (params.get("modo") === "build") setMode("build");

  const origen = params.get("origen") || cfg.getAttribution().origen;
  if (origen === "empresas") {
    setAudience("empresa");
    if (!eventSelect.value) eventSelect.value = cfg.eventPresets.empresarial;
  } else if (origen === "social") {
    setAudience("social");
  }
  form.querySelectorAll("input[name='audience']").forEach((radio) => {
    radio.addEventListener("change", () => setAudience(radio.value, true));
  });

  form.addEventListener("focusin", () => {
    cfg.track("quote_start", { mode });
  }, { once: true });

  builderList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button || button.disabled) return;
    const item = MENU.find((entry) => entry.id === button.dataset.id);
    const dir = Number(button.dataset.dir);
    const next = qty[item.id] + dir * item.step;
    qty[item.id] = Math.min(item.max, Math.max(item.min, next));
    renderBuilder();
    renderPlate();
  });

  document.getElementById("waiter-minus")?.addEventListener("click", () => {
    extraWaiters = Math.max(0, extraWaiters - 1);
    renderWaiters();
    renderPlate();
  });
  document.getElementById("waiter-plus")?.addEventListener("click", () => {
    extraWaiters = Math.min(rules.extraWaiterMax, extraWaiters + 1);
    renderWaiters();
    renderPlate();
  });

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  applyCommercialRules();
  renderDecorationOptions();
  renderBuilder();
  renderWaiters();
  render();

  function validateQuote(plate) {
    forms.clearFieldErrors(form);
    const name = form.querySelector("#name");
    const eventType = form.querySelector("#event");
    const guestsField = form.querySelector("#guests");
    const audience = form.querySelector("input[name='audience']:checked");
    const firstError = [];

    if (!audience) {
      const firstAudience = form.querySelector("input[name='audience']");
      forms.setFieldError(firstAudience, "Indica si cotizas para una empresa o una celebración personal.");
      firstError.push(firstAudience);
    }
    if (audience?.value === "empresa") {
      const company = form.querySelector("#company");
      const role = form.querySelector("#role");
      if (!company?.value.trim()) {
        forms.setFieldError(company, "Indica el nombre de la empresa.");
        firstError.push(company);
      }
      if (!role?.value.trim()) {
        forms.setFieldError(role, "Indica tu cargo o área.");
        firstError.push(role);
      }
    }

    if (!name?.value.trim()) {
      forms.setFieldError(name, "Escribe tu nombre para enviar la propuesta.");
      firstError.push(name);
    }
    if (!eventType?.value) {
      forms.setFieldError(eventType, "Selecciona el tipo de evento.");
      firstError.push(eventType);
    }
    if (!dateInput?.value) {
      forms.setFieldError(dateInput, "Indica una fecha tentativa.");
      firstError.push(dateInput);
    } else if (dateInput.min && dateInput.value < dateInput.min) {
      forms.setFieldError(dateInput, "La fecha tentativa no puede ser anterior a hoy.");
      firstError.push(dateInput);
    }
    const guestCount = Number(guestsField?.value);
    if (!guestCount || guestCount < rules.minimumGuests) {
      forms.setFieldError(guestsField, `Indica al menos ${rules.minimumGuests} invitados.`);
      firstError.push(guestsField);
    }
    const decoration = selectedDecoration();
    if (decoration.id === "custom") {
      const notes = form.querySelector("#decoration-notes");
      if (!notes?.value.trim()) {
        forms.setFieldError(notes, "Describe la decoración personalizada que necesitas.");
        firstError.push(notes);
      }
    }
    if (mode === "price") {
      const price = Number(priceInput.value);
      if (!price || price < rules.plateMin) {
        forms.setFieldError(priceInput, `Elige un valor por persona de al menos ${money(rules.plateMin)}.`);
        firstError.push(priceInput);
      }
    } else {
      if (qty.res < rules.beefMinGrams) {
        const note = document.createElement("p");
        note.className = "field-error";
        note.id = "build-error";
        note.setAttribute("role", "alert");
        note.textContent = `El plato debe incluir al menos ${rules.beefMinGrams} g de carne de res.`;
        modeBuild?.prepend(note);
        firstError.push(builderList);
      } else if (!Number.isFinite(plate.unitPrice) || plate.unitPrice < rules.builderMinimumPrice) {
        const note = document.createElement("p");
        note.className = "field-error";
        note.id = "build-error";
        note.setAttribute("role", "alert");
        note.textContent = `El plato personalizado debe alcanzar un valor mínimo de ${money(rules.builderMinimumPrice)} por persona.`;
        modeBuild?.prepend(note);
        firstError.push(builderList);
      }
    }

    if (firstError.length) {
      cfg.track("form_validation_error", { mode, fields: firstError.length });
      firstError[0].focus?.();
      return false;
    }
    return true;
  }

  function buildWhatsAppMessage(data, plate, guests) {
    const decoration = selectedDecoration();
    const decorAmount = decorationCost(guests);
    const customNotes = String(data.get("decorationNotes") || "").trim();
    const food = plate.unitPrice * guests;
    const estimate = money(eventTotal(plate, guests));

    return [
      `Hola ${cfg.brand}, quiero solicitar una propuesta para mi evento.`,
      "",
      "Datos del evento",
      `Público: ${data.get("audience") === "empresa" ? "Empresa" : "Celebración personal"}`,
      `Nombre: ${String(data.get("name") || "").trim()}`,
      data.get("audience") === "empresa" ? `Empresa: ${String(data.get("company") || "").trim()}` : null,
      data.get("audience") === "empresa" ? `Cargo o área: ${String(data.get("role") || "").trim()}` : null,
      data.get("audience") === "empresa" ? `Facturación: ${data.get("invoice")}` : null,
      `Tipo de evento: ${data.get("event")}`,
      `Fecha tentativa: ${data.get("date")}`,
      `Número de invitados: ${guests}`,
      `Ubicación o notas: ${String(data.get("notes") || "").trim() || "por confirmar"}`,
      "",
      "Modalidad",
      mode === "price"
        ? `Por precio del plato (${money(plate.unitPrice)} por persona)`
        : `Plato armado (${money(plate.unitPrice)} por persona)`,
      "",
      `Menú · ${plate.name}`,
      ...plate.items.map((item) =>
        item.line
          ? `• ${item.qty} ${item.name} (${money(item.line)})`
          : `• ${item.qty} ${item.name}`
      ),
      `Subtotal menú: ${money(food)}`,
      "",
      "Servicios incluidos:",
      "- 1 parrillero",
      "- 1 mesero",
      "- Mesas y sillas para los invitados",
      "",
      "Servicios adicionales:",
      `- Meseros adicionales: ${extraWaiters}${extraWaiters ? ` (${money(waiterCost())})` : ""}`,
      `- Barra de bebidas: ${drinkBarCost(guests) ? money(drinkBarCost(guests)) : "No"}`,
      `- Decoración: ${decoration.label}`,
      `- Valor de decoración: ${cfg.decorationHasPrice(decoration) ? money(decorAmount) : decoration.id === "none" ? money(0) : "Por cotizar"}`,
      decoration.id === "custom" ? `- Descripción de decoración personalizada: ${customNotes}` : null,
      "",
      `Total estimado: ${estimate}`,
      decoration.id === "custom"
        ? "Este total no incluye el valor de la decoración personalizada, que será confirmado en la propuesta final."
        : "Advertencia: este valor es una estimación inicial, pendiente de confirmación según fecha, ubicación, número de invitados, transporte y servicios adicionales.",
      cfg.attributionLine() || null,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const guests = Number(data.get("guests"));
    const plate = currentPlate();
    if (mode === "build" && !builderMeetsMinimum(plate)) {
      updateSubmitState(plate);
      validateQuote(plate);
      return;
    }
    if (!validateQuote(plate)) return;

    const message = buildWhatsAppMessage(data, plate, guests);
    cfg.track("quote_completed", { mode, guests, estimate: plate.unitPrice });
    cfg.track("quote_whatsapp_click", { mode });

    window.open(
      `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener"
    );
  });
})();
