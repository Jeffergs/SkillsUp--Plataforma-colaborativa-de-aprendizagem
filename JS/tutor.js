document.addEventListener("DOMContentLoaded", () => {

  // ========================= LOTTIES =========================
  function playLottie(container, animRef, path, speed = 1, onComplete = null) {
    if (!container) return null;
    if (animRef) {
      try { animRef.destroy(); } catch (e) {}
    }
    const anim = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: path
    });
    anim.setSpeed(speed);
    if (onComplete) anim.addEventListener("complete", onComplete);
    return anim;
  }

  let animCreditos = null;
  let animSelecione = null;
  let animSucesso = null;

  // ========================= CONTROLE DE CRÉDITOS =========================
  function atualizarCreditos() {
    const c = (window.CreditSystem && typeof window.CreditSystem.get === 'function')
      ? window.CreditSystem.get()
      : Number(localStorage.getItem('creditos') || 0);
    const span = document.querySelector("#creditos");
    if (span) span.textContent = c;
  }

  function removerCredito(n = 1) {
    if (window.CreditSystem && typeof window.CreditSystem.remove === 'function') {
      return window.CreditSystem.remove(n);
    } else {
      const atual = Number(localStorage.getItem('creditos') || 0);
      const novo = Math.max(0, atual - n);
      localStorage.setItem('creditos', novo);
      return novo;
    }
  }

  atualizarCreditos();

  // ========================= VARIÁVEIS =========================
  let aulasAgendadas = JSON.parse(localStorage.getItem("aulasAgendadas")) || [];
  let tutorAtual = null;
  let horarioSelecionado = null;

  // ========================= FILTRO =========================
  const searchInput = document.getElementById("area");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      aplicarFiltro(this.value.toLowerCase());
    });
  }

  function aplicarFiltro(valor) {
    document.querySelectorAll(".tutor-card").forEach((card) => {
      const area = card.getAttribute("data-area") || "";
      card.style.display = area.toLowerCase().includes(valor) ? "block" : "none";
    });
  }

  // ========================= CARROSSEL =========================
  const track = document.getElementById("carouselTrack");
  const leftBtn = document.getElementById("carouselLeft");
  const rightBtn = document.getElementById("carouselRight");
  let currentIndex = 0;

  function calcVisibleCount() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function updateCarouselPosition() {
    const cards = Array.from(track.children);
    if (!cards.length) return;
    const visible = calcVisibleCount();
    const first = cards[0];
    const style = getComputedStyle(first);
    const gap = parseFloat(getComputedStyle(track).gap) || 18;
    const cardWidth = first.getBoundingClientRect().width + gap;
    const maxIndex = Math.max(0, cards.length - visible);
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
  }

  leftBtn?.addEventListener('click', () => { currentIndex--; updateCarouselPosition(); });
  rightBtn?.addEventListener('click', () => { currentIndex++; updateCarouselPosition(); });
  window.addEventListener('resize', updateCarouselPosition);

  // ========================= CARREGAR AULAS PUBLICADAS =========================
  function carregarAulasPublicadas() {
    const aulasPublicadas = JSON.parse(localStorage.getItem('aulasPublicadas')) || [];

    aulasPublicadas.forEach(aula => {
      const col = document.createElement("div");
      col.className = "col-card";

      const horarios = aula.horarios || [];

      // Card com data-nome para identificar tutor
col.innerHTML = `
  <div class="tutor-card slide-up" 
      data-area="${aula.categoria || aula.assunto}" 
      data-horarios='${JSON.stringify(horarios)}'
      data-nome="${aula.nomeTutor}">
      <H5> ${aula.nomeTutor}</H5>
    <p>${aula.assunto}</p>
    <p>${aula.categoria || aula.assunto}</p>
    <p>⭐ ⭐ ⭐</p>
    <button class="btn btn-agendar">Agendar</button>
  </div>
`;
      track.appendChild(col);
    });

    attachAgendarHandlers();
    updateCarouselPosition();
    aplicarFiltro(searchInput?.value.toLowerCase() || '');
  }

  carregarAulasPublicadas();

  // ========================= AGENDAR =========================
  function attachAgendarHandlers() {
    document.querySelectorAll(".btn-agendar").forEach(btn => {
      btn.removeEventListener("click", onAgendarClick);
      btn.addEventListener("click", onAgendarClick);
    });
  }

  function onAgendarClick(e) {
    const card = e.target.closest('.tutor-card');
    tutorAtual = card?.getAttribute('data-nome') || '';
    horarioSelecionado = null;

    const horariosCard = card ? JSON.parse(card.getAttribute('data-horarios') || '[]') : [];
    const horarioBtns = document.querySelectorAll(".horario-btn");

    horarioBtns.forEach((btn) => {
      const hora = btn.textContent.trim();
      if (horariosCard.length && !horariosCard.includes(hora)) {
        btn.style.display = "none";
      } else {
        btn.style.display = "inline-block";
      }
      btn.classList.remove("active");
      btn.disabled = false;
    });

    document.getElementById("tutorNome").textContent = tutorAtual;
    atualizarHorariosBloqueados();
    new bootstrap.Modal(document.getElementById("agendarModal")).show();
  }

  document.querySelectorAll(".horario-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      if (this.disabled) return;
      document.querySelectorAll(".horario-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      horarioSelecionado = this.textContent.trim();
    });
  });

  function atualizarHorariosBloqueados() {
    const ocupados = aulasAgendadas.filter(a => a.tutor === tutorAtual).map(a => a.horario);
    document.querySelectorAll(".horario-btn").forEach(btn => {
      const hora = btn.textContent.trim();
      if (ocupados.includes(hora)) {
        btn.classList.add("ocupado");
        btn.disabled = true;
      }
    });
  }

  // ========================= CONFIRMAR AGENDAMENTO =========================
  const btnConfirmar = document.getElementById("btnConfirmar");
  btnConfirmar?.addEventListener("click", () => {
    if (!horarioSelecionado) {
      bootstrap.Modal.getInstance(document.getElementById("agendarModal"))?.hide();
      new bootstrap.Modal(document.getElementById("modalSelecioneHorario")).show();
      animSelecione = playLottie(document.getElementById("lottieSelecione"), animSelecione, "/assets/lottie/clock.json");
      return;
    }

    if ((window.CreditSystem?.get?.() || Number(localStorage.getItem('creditos') || 0)) <= 0) {
      bootstrap.Modal.getInstance(document.getElementById("agendarModal"))?.hide();
      new bootstrap.Modal(document.getElementById("modalCreditosEsgotados")).show();
      animCreditos = playLottie(document.getElementById("lottieCreditos"), animCreditos, "/assets/lottie/sad.json");
      return;
    }

    // REMOVE 1 CRÉDITO
    removerCredito(1);
    atualizarCreditos();

    // SALVA AULA AGENDADA
    aulasAgendadas.push({
      tutor: tutorAtual,
      horario: horarioSelecionado,
      categoria: tutorAtual,
      descricao: `Aula com ${tutorAtual}`
    });
    localStorage.setItem("aulasAgendadas", JSON.stringify(aulasAgendadas));

    document.getElementById("confirmacaoHorario").innerText = `Seu horário foi agendado para ${horarioSelecionado}.`;

    bootstrap.Modal.getInstance(document.getElementById("agendarModal"))?.hide();
    new bootstrap.Modal(document.getElementById("modalAgendado")).show();
    animSucesso = playLottie(document.getElementById("checkLottie"), animSucesso, "/assets/lottie/success.json");

    atualizarHorariosBloqueados();
  });

  attachAgendarHandlers();
  updateCarouselPosition();
});
