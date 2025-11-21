document.addEventListener("DOMContentLoaded", () => {

  // ========================= LOTTIES =========================
  function playLottie(container, animRef, path, speed = 1, onComplete = null) {
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
    const c = CreditSystem.get();
    const span = document.querySelector("#creditos");
    if (span) span.textContent = c;
  }

  atualizarCreditos();

  // ========================= LOCALSTORAGE =========================
  // AGORA ESTÁ CORRETO ⬇⬇⬇
  let aulasAgendadas = JSON.parse(localStorage.getItem("aulasAgendadas")) || [];

  let tutorAtual = null;
  let horarioSelecionado = null;

  // ========================= FILTRO =========================
  const searchInput = document.getElementById("area");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const value = this.value.toLowerCase();
      document.querySelectorAll(".tutor-card").forEach((card) => {
        const area = card.getAttribute("data-area") || "";
        card.style.display = area.includes(value) ? "block" : "none";
      });
    });
  }

  // ========================= CLICOU EM AGENDAR =========================
  document.querySelectorAll(".btn-agendar").forEach((btn) => {
    btn.addEventListener("click", function () {

      if (CreditSystem.get() <= 0) {
        const modal = new bootstrap.Modal(document.getElementById("modalCreditosEsgotados"));
        modal.show();

        animCreditos = playLottie(
          document.getElementById("lottieCreditos"),
          animCreditos,
          "/assets/lottie/sad.json",
          1
        );

        return;
      }

      tutorAtual = this.parentElement.querySelector("h5").textContent;
      horarioSelecionado = null;

      document.querySelectorAll(".horario-btn").forEach(b => b.classList.remove("active"));

      document.getElementById("tutorNome").textContent = tutorAtual;

      atualizarHorariosBloqueados();

      new bootstrap.Modal(document.getElementById("agendarModal")).show();
    });
  });

  // ========================= MARCAR HORÁRIO =========================
  document.querySelectorAll(".horario-btn").forEach((botao) => {
    botao.addEventListener("click", function () {
      if (this.disabled) return;

      document.querySelectorAll(".horario-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      horarioSelecionado = this.textContent.trim();
    });
  });

  // ========================= BLOQUEAR HORÁRIOS =========================
  function atualizarHorariosBloqueados() {
    const ocupados = aulasAgendadas
      .filter(a => a.tutor === tutorAtual)
      .map(a => a.horario);

    document.querySelectorAll(".horario-btn").forEach(btn => {
      const hora = btn.textContent.trim();
      if (ocupados.includes(hora)) {
        btn.classList.add("ocupado");
        btn.disabled = true;
      } else {
        btn.classList.remove("ocupado");
        btn.disabled = false;
      }
    });
  }

  // ========================= CONFIRMAR =========================
  const btnConfirmar = document.getElementById("btnConfirmar");
  btnConfirmar.addEventListener("click", () => {

    const modalAgendar = bootstrap.Modal.getInstance(document.getElementById("agendarModal"));

    if (!horarioSelecionado) {
      modalAgendar?.hide();

      const modal = new bootstrap.Modal(document.getElementById("modalSelecioneHorario"));
      modal.show();

      animSelecione = playLottie(
        document.getElementById("lottieSelecione"),
        animSelecione,
        "/assets/lottie/clock.json",
        1
      );
      return;
    }

    if (CreditSystem.get() <= 0) {
      modalAgendar?.hide();

      const modal = new bootstrap.Modal(document.getElementById("modalCreditosEsgotados"));
      modal.show();

      animCreditos = playLottie(
        document.getElementById("lottieCreditos"),
        animCreditos,
        "/assets/lottie/sad.json",
        1
      );
      return;
    }

    // DESCONTA CRÉDITO
    CreditSystem.remove(1);
    atualizarCreditos();

    // SALVAR FORMATADO
    aulasAgendadas.push({
      tutor: tutorAtual,
      horario: horarioSelecionado,
      categoria: tutorAtual,
      descricao: `Aula com ${tutorAtual}`
    });

    localStorage.setItem("aulasAgendadas", JSON.stringify(aulasAgendadas));

    document.getElementById("confirmacaoHorario").innerText =
      `Seu horário foi agendado para ${horarioSelecionado}.`;

    modalAgendar?.hide();

    const modal = new bootstrap.Modal(document.getElementById("modalAgendado"));
    modal.show();

    animSucesso = playLottie(
      document.getElementById("checkLottie"),
      animSucesso,
      "/assets/lottie/success.json",
      1
    );
  });

});
