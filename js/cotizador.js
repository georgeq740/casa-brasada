(function () {
  const cfg = window.CASA_BRASADA;

  function money(n) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function composePlate(price) {
    const p = Math.max(25000, Math.min(150000, Number(price) || 25000));

    if (p < 32000) {
      return {
        name: "Brasa Esencial",
        items: [
          { qty: "150 g", name: "carne de res a la brasa" },
          { qty: "1", name: "papa salada" },
          { qty: "1", name: "arepa" },
          { qty: "1", name: "gaseosa" },
        ],
      };
    }

    if (p < 40000) {
      return {
        name: "Brasa Campestre",
        items: [
          { qty: "200 g", name: "carne de res a la brasa" },
          { qty: "1", name: "papa salada" },
          { qty: "1", name: "yuca" },
          { qty: "1", name: "arepa boyacense" },
          { qty: "1", name: "cerveza o 1 gaseosa" },
        ],
      };
    }

    if (p < 50000) {
      return {
        name: "Brasa Clásica",
        items: [
          { qty: "250 g", name: "carne de res" },
          { qty: "2", name: "papas saladas" },
          { qty: "1", name: "yuca" },
          { qty: "1", name: "arepa boyacense" },
          { qty: "1", name: "cerveza o 2 gaseosas" },
        ],
      };
    }

    if (p < 60000) {
      return {
        name: "Brasa Mayor",
        items: [
          { qty: "300 g", name: "carne de res" },
          { qty: "2", name: "papas saladas" },
          { qty: "1", name: "yuca" },
          { qty: "1", name: "arepa boyacense" },
          { qty: "1", name: "ensalada criolla" },
          { qty: "1", name: "cerveza o 2 gaseosas" },
        ],
      };
    }

    if (p < 75000) {
      return {
        name: "Brasa Mixta",
        items: [
          { qty: "250 g", name: "carne de res" },
          { qty: "150 g", name: "cerdo a la parrilla" },
          { qty: "1", name: "chorizo" },
          { qty: "2", name: "papas saladas" },
          { qty: "1", name: "yuca" },
          { qty: "1", name: "arepa boyacense" },
          { qty: "1", name: "maduro asado" },
          { qty: "1", name: "cerveza o 2 gaseosas" },
        ],
      };
    }

    if (p < 95000) {
      return {
        name: "Brasa de Fiesta",
        items: [
          { qty: "300 g", name: "carne de res" },
          { qty: "150 g", name: "cerdo" },
          { qty: "1", name: "chorizo" },
          { qty: "1", name: "morcilla" },
          { qty: "2", name: "papas saladas" },
          { qty: "1", name: "yuca" },
          { qty: "1", name: "arepa boyacense" },
          { qty: "1", name: "ensalada y hogao" },
          { qty: "1", name: "postre de la casa" },
          { qty: "2", name: "cervezas o 3 gaseosas" },
        ],
      };
    }

    return {
      name: "Brasa Premium",
      items: [
        { qty: "350 g", name: "lomo de res" },
        { qty: "150 g", name: "cerdo ahumado" },
        { qty: "100 g", name: "pollo a la brasa" },
        { qty: "1", name: "chorizo artesanal" },
        { qty: "1", name: "morcilla" },
        { qty: "2", name: "papas saladas" },
        { qty: "1", name: "yuca" },
        { qty: "1", name: "arepa boyacense" },
        { qty: "1", name: "guarnición gourmet y ensalada" },
        { qty: "1", name: "postre" },
        { qty: "1", name: "barra de bebidas por persona" },
      ],
    };
  }

  const form = document.getElementById("quote-form");
  if (!form) return;

  const priceInput = form.querySelector("#price");
  const priceRange = form.querySelector("#price-range");
  const guestsInput = form.querySelector("#guests");
  const plateBox = document.getElementById("plate-box");
  const priceLabel = document.getElementById("price-label");
  const totalLabel = document.getElementById("total-label");
  const plateName = document.getElementById("plate-name");

  function syncPrice(source) {
    const next = Math.max(25000, Math.min(150000, Number(source.value) || 25000));
    priceInput.value = next;
    if (priceRange) priceRange.value = Math.min(120000, next);
    return next;
  }

  function render(event) {
    const source = event?.target?.id === "price-range" ? priceRange : priceInput;
    const price = syncPrice(source || priceInput);
    const guests = Math.max(1, Number(guestsInput.value) || 1);
    const plate = composePlate(price);

    priceLabel.textContent = money(price);
    plateName.textContent = plate.name;
    totalLabel.textContent = money(price * guests);
    plateBox.innerHTML = plate.items
      .map(
        (item) =>
          `<div class="plate-item"><strong>${item.qty}</strong><span>${item.name}</span></div>`
      )
      .join("");
  }

  form.addEventListener("input", render);
  render();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const price = Number(data.get("price"));
    const guests = Number(data.get("guests"));
    const plate = composePlate(price);
    const extras = [...form.querySelectorAll("input[name='extras']:checked")].map(
      (el) => el.value
    );

    const lines = [
      `Hola ${cfg.brand}, quiero cotizar un evento.`,
      "",
      `Nombre: ${data.get("name")}`,
      `Evento: ${data.get("event")}`,
      `Fecha: ${data.get("date") || "por definir"}`,
      `Invitados: ${guests}`,
      `Precio por plato: ${money(price)}`,
      "",
      `Plato ${plate.name}:`,
      ...plate.items.map((item) => `• ${item.qty} ${item.name}`),
      "",
      extras.length ? `Adicionales: ${extras.join(", ")}` : "Adicionales: ninguno por ahora",
      `Total estimado de alimentos: ${money(price * guests)}`,
      data.get("notes") ? `Notas: ${data.get("notes")}` : "",
    ].filter(Boolean);

    window.open(
      `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener"
    );
  });
})();
