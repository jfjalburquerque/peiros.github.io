// Web corporativa: selector de tema y formulario de contacto.

(() => {
  const root = document.documentElement;
  const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = () => root.dataset.theme || (prefersDark() ? "dark" : "light");

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("peiros-theme", next); } catch (_) {}
  });

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    status.className = "form-status";
    if (!data.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email.trim())) {
      status.textContent = "Escribe tu nombre y un correo electrónico válido.";
      status.classList.add("error");
      return;
    }
    // En la web estática (GitHub Pages) la app vive en otro dominio; en la propia app, la misma
    const appUrl = "PEIROS_APP_URL" in window ? window.PEIROS_APP_URL : "";
    if (appUrl === null) {
      status.textContent = "El formulario se activará en unos días. Gracias por tu interés.";
      return;
    }
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    status.textContent = "Enviando…";
    try {
      const response = await fetch(`${appUrl}/api/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      form.reset();
      status.textContent = "Gracias. Te escribiremos en unos días para concertar la demo.";
      status.classList.add("ok");
    } catch (_) {
      status.textContent = "No se ha podido enviar. Inténtalo de nuevo en unos minutos.";
      status.classList.add("error");
    } finally {
      button.disabled = false;
    }
  });
})();

// En el móvil, la portada del vídeo vertical
(() => {
  const video = document.querySelector(".demo-video video");
  if (video && matchMedia("(max-width: 640px)").matches) video.poster = video.dataset.posterV;
})();
