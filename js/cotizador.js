(function () {
  const cfg = window.CASA_BRASADA;
  const MENU = [
    { id: "res", name: "Carne de res", unit: "g", step: 50, min: 150, max: 500, price: 100 },
    { id: "cerdo", name: "Cerdo ahumado", unit: "g", step: 50, min: 0, max: 400, price: 80 },
    { id: "pollo", name: "Pollo a la brasa", unit: "g", step: 50, min: 0, max: 400, price: 70 },
    { id: "chorizo", name: "Chorizo", unit: "und", step: 1, min: 0, max: 4, price: 6000 },
    { id: "papa", name: "Papa salada", unit: "und", step: 1, min: 0, max: 6, price: 2000 },
    { id: "yuca", name: "Yuca", unit: "und", step: 1, min: 0, max: 4, price: 3000 },
    { id: "arepa", name: "Arepa boyacense", unit: "und", step: 1, min: 0, max: 4, price: 3500 },
    { id: "maduro", name: "Maduro asado", unit: "und", step: 1, min: 0, max: 4, price: 3500 },
    { id: "gaseosa", name: "Gaseosa", unit: "und", step: 1, min: 0, max: 6, price: 2500 },
    { id: "cerveza", name: "Cerveza", unit: "und", step: 1, min: 0, max: 6, price: 4500 },
    { id: "ensalada", name: "Ensalada", unit: "und", step: 1, min: 0, max: 3, price: 4000 },
    { id: "postre", name: "Postre", unit: "und", step: 1, min: 0, max: 3, price: 6000 },
  ];

  const INCLUDED = [
    { qty: "1", name: "parrillero" },
    { qty: "1", name: "mesero" },
    { qty: "Incluye", name: "mesas y sillas" },
  ];
  const qty = Object.fromEntries(MENU.map((item) => [item.id, item.id === "res" ? 150 : 0]));
  const WAITER_PRICE = 80000;
  const WAITER_MAX = 10;
  let extraWaiters = 0;
  let mode = "price";

  function money(n) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function beefGrams(price) {
    return Math.max(150, 250 + Math.round((price - 40000) / 100));
  }

  function composePlate(price) {
    const p = Math.max(30000, Math.min(150000, Number(price) || 30000));
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

    if (p >= 30000) items.push({ qty: "1", name: "yuca" });
    items.push({
      qty: "1",
      name: p >= 35000 ? "arepa boyacense" : "arepa",
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
    else if (p >= 30000) name = "Brasa Campestre";

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
  if (dateInput) {
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = iso;
  }

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

  function syncPrice(source) {
    const next = Math.max(30000, Math.min(150000, Number(source.value) || 30000));
    priceInput.value = next;
    if (priceRange) priceRange.value = Math.min(120000, next);
    return next;
  }

  function waiterCost() {
    return extraWaiters * WAITER_PRICE;
  }

  function drinkBarCost(guests) {
    const bar = form.querySelector("#drink-bar");
    if (!bar?.checked) return 0;
    return guests * Number(bar.dataset.perGuest || 0);
  }

  function eventTotal(plate, guests) {
    return plate.unitPrice * guests + waiterCost() + drinkBarCost(guests);
  }

  function renderWaiters() {
    const count = document.getElementById("waiter-count");
    if (count) count.textContent = String(extraWaiters);
  }

  function currentPlate() {
    if (mode === "build") return builtPlate();
    return composePlate(Number(priceInput.value));
  }

  function renderPlate() {
    const guests = Math.max(1, Number(guestsInput.value) || 1);
    const plate = currentPlate();
    const food = plate.unitPrice * guests;
    const waiters = waiterCost();
    const drinks = drinkBarCost(guests);
    plateName.textContent = plate.name;
    totalLabel.textContent = money(food + waiters + drinks);
    if (unitCaption) {
      const foodLine =
        plate.unitPrice > 0
          ? `${money(plate.unitPrice)} por persona · ${guests} invitados`
          : "Agrega ingredientes para ver el costo";
      const waiterLine = extraWaiters
        ? ` · ${extraWaiters} mesero${extraWaiters > 1 ? "s" : ""} adicional${extraWaiters > 1 ? "es" : ""} (${money(waiters)})`
        : "";
      const drinkLine = drinks ? ` · barra de bebidas (${money(drinks)})` : "";
      unitCaption.textContent = foodLine + waiterLine + drinkLine;
    }
    const waiterRows = extraWaiters
      ? `<div class="plate-item"><strong>${extraWaiters}</strong><span>mesero${extraWaiters > 1 ? "s" : ""} adicional${extraWaiters > 1 ? "es" : ""}</span><em>${money(waiters)}</em></div>`
      : "";
    const drinkRow = drinks
      ? `<div class="plate-item"><strong>1</strong><span>barra de bebidas</span><em>${money(drinks)}</em></div>`
      : "";
    plateBox.innerHTML =
      (plate.items.length
        ? plate.items
            .map((item) => {
              const extra = item.line ? `<em>${money(item.line)}</em>` : "";
              const cls = item.highlight ? " plate-item-main" : "";
              return `<div class="plate-item${cls}"><strong>${item.qty}</strong><span>${item.name}</span>${extra}</div>`;
            })
            .join("")
        : `<p class="muted">Todavía no hay ingredientes en el plato.</p>`) +
      `<div class="included-box">
        <p class="eyebrow">También incluye</p>
        ${INCLUDED.map(
          (item) =>
            `<div class="plate-item"><strong>${item.qty}</strong><span>${item.name}</span></div>`
        ).join("")}
        ${waiterRows}
        ${drinkRow}
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

  function renderBuilder() {
    builderList.innerHTML = MENU.map((item) => {
      const amount = qty[item.id];
      const shown = item.unit === "g" ? `${amount} g` : amount;
      const rate = item.unit === "g" ? `${money(item.price)} / g` : `${money(item.price)} c/u`;
      return `
        <div class="builder-row">
          <div>
            <strong>${item.name}</strong>
            <small>${rate}</small>
          </div>
          <div class="stepper">
            <button type="button" data-id="${item.id}" data-dir="-1" aria-label="Quitar ${item.name}">−</button>
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
    cfg.track("quote_mode_change", { mode });
    render();
  }

  form.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  const preset = new URLSearchParams(window.location.search).get("evento");
  const eventSelect = form.querySelector("#event");
  if (preset && cfg.eventPresets?.[preset] && eventSelect) {
    eventSelect.value = cfg.eventPresets[preset];
  }

  let quoteStarted = false;
  form.addEventListener("focusin", () => {
    if (quoteStarted) return;
    quoteStarted = true;
    cfg.track("quote_start", { mode });
  }, { once: true });

  builderList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
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
    extraWaiters = Math.min(WAITER_MAX, extraWaiters + 1);
    renderWaiters();
    renderPlate();
  });

  form.addEventListener("input", render);
  renderBuilder();
  renderWaiters();
  render();

  function clearFieldErrors() {
    form.querySelectorAll(".field-error").forEach((el) => el.remove());
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  }

  function setFieldError(input, message) {
    if (!input) return;
    input.setAttribute("aria-invalid", "true");
    const error = document.createElement("p");
    error.className = "field-error";
    error.id = `${input.id || "field"}-error`;
    error.setAttribute("role", "alert");
    error.textContent = message;
    input.insertAdjacentElement("afterend", error);
    input.setAttribute("aria-describedby", error.id);
  }

  function validateQuote(plate) {
    clearFieldErrors();
    const name = form.querySelector("#name");
    const eventType = form.querySelector("#event");
    const guestsField = form.querySelector("#guests");
    const firstError = [];

    if (!name?.value.trim()) {
      setFieldError(name, "Escribe tu nombre para enviar la propuesta.");
      firstError.push(name);
    }
    if (!eventType?.value) {
      setFieldError(eventType, "Selecciona el tipo de evento.");
      firstError.push(eventType);
    }
    if (!dateInput?.value) {
      setFieldError(dateInput, "Indica una fecha tentativa.");
      firstError.push(dateInput);
    } else if (dateInput.min && dateInput.value < dateInput.min) {
      setFieldError(dateInput, "La fecha tentativa no puede ser anterior a hoy.");
      firstError.push(dateInput);
    }
    const guestCount = Number(guestsField?.value);
    if (!guestCount || guestCount < 10) {
      setFieldError(guestsField, "Indica al menos 10 invitados.");
      firstError.push(guestsField);
    }
    if (mode === "price") {
      const price = Number(priceInput.value);
      if (!price || price < 30000) {
        setFieldError(priceInput, "Elige un valor por persona de al menos $30.000.");
        firstError.push(priceInput);
      }
    } else if (plate.unitPrice <= 0) {
      const note = document.createElement("p");
      note.className = "field-error";
      note.id = "build-error";
      note.setAttribute("role", "alert");
      note.textContent = "Agrega al menos un ingrediente para armar el menú.";
      modeBuild?.prepend(note);
      firstError.push(builderList);
    }

    if (firstError.length) {
      firstError[0].focus?.();
      return false;
    }
    return true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const guests = Number(data.get("guests"));
    const plate = currentPlate();
    if (!validateQuote(plate)) return;

    const extras = [...form.querySelectorAll("input[name='extras']:checked")].map(
      (el) => el.value
    );
    const otherExtras = extras.filter((item) => item !== "Barra de bebidas");
    const estimate = money(eventTotal(plate, guests));

    const lines = [
      `Hola ${cfg.brand}, quiero solicitar una propuesta para mi evento.`,
      "",
      "Datos del evento",
      `Nombre: ${String(data.get("name") || "").trim()}`,
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
      "",
      "Servicios adicionales",
      "Incluido en la estimación: parrillero, 1 mesero, mesas y sillas.",
      extraWaiters
        ? `Meseros adicionales: ${extraWaiters} (${money(waiterCost())})`
        : "Meseros adicionales: no",
      drinkBarCost(guests)
        ? `Barra de bebidas: ${money(drinkBarCost(guests))}`
        : "Barra de bebidas: no",
      otherExtras.length ? `Otros adicionales: ${otherExtras.join(", ")}` : null,
      "",
      `Inversión estimada: ${estimate}`,
      "",
      "Advertencia: este valor es una estimación inicial, pendiente de confirmación según fecha, ubicación, número de invitados, transporte, montaje y servicios seleccionados.",
    ].filter((line) => line !== null);

    cfg.track("quote_completed", { mode, guests, estimate: plate.unitPrice });
    cfg.track("quote_whatsapp_click", { mode });

    window.open(
      `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener"
    );
  });
})();
