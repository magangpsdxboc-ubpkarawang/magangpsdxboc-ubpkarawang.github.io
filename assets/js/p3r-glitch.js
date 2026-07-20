function setGlitchText(id, text){
  const el = document.getElementById(id);
  if (!el) return;
  const t = text ?? "—";
  el.textContent = t;
  // kalau elemen punya class p3r-glitch, sync data-text
  if (el.classList.contains("p3r-glitch")) el.setAttribute("data-text", t);
}

// panggil ini sekali setelah render
function initAlterGlitch(){
  const body = document.body;
  if (!body.classList.contains("p3r-alter")) return;

  function burst(){
    body.classList.add("is-glitch");
    setTimeout(() => body.classList.remove("is-glitch"), 120 + Math.random()*140);
  }

  // burst random halus
  const timer = setInterval(() => {
    if (Math.random() < 0.22) burst();
  }, 900);

  // kalau user klik mana aja, kasih burst kecil
  window.addEventListener("click", burst, { passive:true });

  // kalau mau: stop saat tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) body.classList.remove("is-glitch");
  });

  // kalau kamu perlu cleanup (biasanya ga perlu di static page)
  window.__p3rStopGlitch = () => clearInterval(timer);
}