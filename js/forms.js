window.CASA_BRASADA.forms = {
  clearFieldErrors(form) {
    form.querySelectorAll(".field-error").forEach((element) => element.remove());
    form.querySelectorAll("[aria-invalid]").forEach((element) => {
      element.removeAttribute("aria-invalid");
    });
    form.querySelectorAll("[aria-describedby]").forEach((element) => {
      element.removeAttribute("aria-describedby");
    });
  },
  setFieldError(input, message) {
    if (!input) return;
    input.setAttribute("aria-invalid", "true");
    const error = document.createElement("p");
    error.className = "field-error";
    error.id = `${input.id || "field"}-error`;
    error.setAttribute("role", "alert");
    error.textContent = message;
    input.insertAdjacentElement("afterend", error);
    input.setAttribute("aria-describedby", error.id);
  },
};
