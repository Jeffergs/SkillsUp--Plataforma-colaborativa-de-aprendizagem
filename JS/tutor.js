document.addEventListener("DOMContentLoaded", () => {

  // ========================= CONTROLE DE CRÉDITOS =========================
  let creditos = 5;
  const creditBox = document.querySelector(".credit-box");

  function atualizarCreditos() {
    creditBox.textContent = `CRÉDITOS DISPONÍVEIS: ${creditos}`;
  }

  atualizarCreditos();



  // ========================= LOCALSTORAGE: AGENDA POR TUTOR =========================
  let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || {};

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



  // ========================= ABRIR MODAL =========================
  document.querySelectorAll(".btn-agendar").forEach((btn) => {
    btn.addEventListener("click", function () {

      const nomeTutor = this.parentElement.querySelector("h5").textContent;
      tutorAtual = nomeTutor;

      // Se o tutor não existe na estrutura, cria
      if (!agendamentos[tutorAtual]) {
        agendamentos[tutorAtual] = [];
      }

      document.getElementById("tutorNome").textContent = nomeTutor;

      // Atualiza horários bloqueados do tutor
      atualizarHorariosBloqueados();

      const modal = new bootstrap.Modal(document.getElementById("agendarModal"));
      modal.show();
    });
  });



  // ========================= MARCAR HORÁRIO =========================
  document.querySelectorAll(".horario-btn").forEach((botao) => {
    botao.addEventListener("click", function () {

      if (this.disabled) return; // impede clique em horário ocupado

      document.querySelectorAll(".horario-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      horarioSelecionado = this.textContent.trim();
    });
  });



  // ========================= APLICAR BLOQUEIOS POR TUTOR =========================
  function atualizarHorariosBloqueados() {
    const ocupados = agendamentos[tutorAtual] || [];

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



  // ========================= CONFIRMAR AGENDAMENTO =========================
  const btnConfirmar = document.getElementById("btnConfirmar");

  btnConfirmar.addEventListener("click", () => {

    if (!horarioSelecionado) {
      alert("Selecione um horário antes de confirmar.");
      return;
    }

    if (creditos > 0) {
      creditos--;
      atualizarCreditos();
    } else {
      alert("Você não possui créditos suficientes.");
      return;
    }

    // Marca o horário como ocupado para o tutor atual
    agendamentos[tutorAtual].push(horarioSelecionado);

    // Salva no localStorage
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

    document.getElementById("confirmacaoHorario").innerText =
      `Seu horário foi agendado para ${horarioSelecionado}.`;

    const modalConfirm = new bootstrap.Modal(document.getElementById("modalAgendado"));
    modalConfirm.show();
  });



  // ========================= LOTTIE =========================
  const checkContainer = document.getElementById("checkLottie");
  let lottieAnim = null;

  document.getElementById("modalAgendado").addEventListener("shown.bs.modal", () => {
    if (lottieAnim) lottieAnim.destroy();

    lottieAnim = lottie.loadAnimation({
      container: checkContainer,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "/assets/lottie/success.json"
    });
  });

});
