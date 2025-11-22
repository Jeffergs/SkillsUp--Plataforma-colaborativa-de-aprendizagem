// JS/tutor.js — versão MERGE completa (original + alert 0 créditos + correções)
// Gerado para manter tudo que você já tinha e adicionar só o necessário.

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------
  // Container / track
  // ---------------------------
  const container = document.querySelector('.tutor-grid');
  if (!container) return;

  // este é o elemento onde cards estáticos/dinâmicos são colocados
  const track = document.getElementById("tutorGrid");

  // ---------------------------
  // Carrega aulas publicadas iniciais e injeta cards existentes
  // ---------------------------
  const aulasPublicadas = JSON.parse(localStorage.getItem("aulasPublicadas")) || [];

  aulasPublicadas.forEach(aula => {
    const card = gerarCardAula(aula);
    container.appendChild(card);
  });

  // ---------------------------
  // Helper seguro para adicionar event listeners se elemento existir
  // ---------------------------
  function onIfExists(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
    return el;
  }

  // ---------------------------
  // LOTTIES (uniformiza duração)
  // ---------------------------
  const DURACAO_PADRAO = 1.5;

  function playLottie(container, animRef, path, onComplete = null) {
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
    anim.addEventListener("DOMLoaded", () => {
      try {
        const frames = anim.totalFrames;
        const fps = anim.frameRate || 60;
        const duracaoOriginal = frames / fps;
        const novaVelocidade = duracaoOriginal / DURACAO_PADRAO;
        if (Number.isFinite(novaVelocidade) && novaVelocidade > 0) anim.setSpeed(novaVelocidade);
      } catch (e) {}
    });
    if (onComplete) anim.addEventListener("complete", onComplete);
    return anim;
  }

  let animCreditos = null;
  let animSelecione = null;
  let animSucesso = null;

  onIfExists("modalCreditosEsgotados", "shown.bs.modal", () => {
    animCreditos = playLottie(document.getElementById("lottieCreditos"), animCreditos, "/assets/lottie/sad.json");
  });
  onIfExists("modalSelecioneHorario", "shown.bs.modal", () => {
    animSelecione = playLottie(document.getElementById("lottieSelecione"), animSelecione, "/assets/lottie/clock.json");
  });
  onIfExists("modalAgendado", "shown.bs.modal", () => {
    animSucesso = playLottie(document.getElementById("checkLottie"), animSucesso, "/assets/lottie/success.json");
  });

  // ---------------------------
  // CONTROLE DE CRÉDITOS
  // - mantém compatibilidade: se não existir, inicializa
  // - adiciona get/set/atualizar
  // - adiciona verificação de 0 (alert)
  // ---------------------------

  // Preserve behavior: inicializa créditos se não existir
  if (!localStorage.getItem("creditos")) localStorage.setItem("creditos", "5");

  const creditosNumberEl = document.getElementById("creditosNumber");

  function getCreditos() {
    return parseInt(localStorage.getItem("creditos")) || 0;
  }

  function setCreditos(v) {
    localStorage.setItem("creditos", String(v));
    atualizarCreditos();
  }

  function atualizarCreditos() {
    if (creditosNumberEl) creditosNumberEl.textContent = String(getCreditos());
  }

  // ========================= ALERT DE 0 CRÉDITOS =========================
  function verificarZeroCreditsTutor() {
    if (getCreditos() <= 0) {
      alert(
        "Se você gostou da experiência e quer continuar consumindo os conteúdos,\n" +
        "pode conseguir mais Skill Coins oferecendo aulas!"
      );
    }
  }

  // inicializa exibição
  atualizarCreditos();

  // ---------------------------
  // FUNÇÕES AUXILIARES DE MODAL (se não existirem no seu sistema, usamos fallback)
  // - abrirModalDescricao(nome, assunto, descricao)
  // - abrirModalAgendamento(aula)
  // ---------------------------

  function abrirModalDescricao(nome = "Tutor", assunto = "", descricao = "") {
    // se existir modal #descricaoModal, preenche e abre; caso contrário, usa alert
    const label = document.getElementById("descricaoModalLabel");
    const texto = document.getElementById("descricaoModalTexto");
    if (label) label.textContent = nome;
    if (texto) texto.textContent = (descricao || assunto || "Sem descrição disponível.");
    const m = document.getElementById("descricaoModal");
    if (m) {
      try { new bootstrap.Modal(m).show(); } catch (e) { console.warn(e); }
    } else {
      alert(`${nome}\n\n${assunto}\n\n${descricao}`);
    }
  }

  function abrirModalAgendamento(aula = {}) {
    // Preenche campos do modal de agendamento se existir e abre.
    const tutorNomeSpan = document.getElementById("tutorNome");
    if (tutorNomeSpan) tutorNomeSpan.textContent = aula.nomeTutor || aula.nome || "Tutor";
    // Habilita/oculta horários conforme aula.horarios se fornecer
    const horariosCard = aula.horarios || [];
    document.querySelectorAll(".horario-btn").forEach(btn => {
      const hora = btn.textContent.trim();
      btn.style.display = (!horariosCard.length || horariosCard.includes(hora)) ? "" : "none";
      btn.classList.remove("active");
      btn.disabled = false;
    });
    // abrir modal
    const ag = document.getElementById("agendarModal");
    if (ag) {
      try { new bootstrap.Modal(ag).show(); } catch (e) { console.warn(e); }
    } else {
      alert(`Abrir modal de agendamento para ${aula.nomeTutor || aula.nome || "Tutor"}`);
    }
  }

  // ---------------------------
  // GERAR CARD (para itens dinâmicos)
  // ---------------------------
  function gerarCardAula(aula) {
    const card = document.createElement('div');
    card.classList.add('tutor-card');

    // atributos para popup e filtros
    card.dataset.area = aula.categoria || "geral";
    card.dataset.nome = aula.nomeTutor || aula.nome || "Tutor";
    card.dataset.descricao = aula.descricao || aula.assunto || "Sem descrição disponível.";
    card.dataset.horarios = JSON.stringify(aula.horarios || []);

    // HTML interno — similar aos seus cards
    card.innerHTML = `
      <h5>${aula.nomeTutor || aula.nome || 'Tutor'}</h5>
      <p class="categoria-tutor">${aula.categoria || ''}</p>
      <p class="descricao-tutor">${aula.assunto || aula.descricao || ''}</p>
      <div class="stars">⭐⭐⭐⭐</div>
      <button class="btn btn-agendar w-100 btn-agendar-dinamico">Agendar</button>
      <button class="btn btn-outline-primary w-100 mt-2 btn-descricao">Ver descrição</button>
    `;

    // handlers
    const btnDesc = card.querySelector('.btn-descricao');
    if (btnDesc) btnDesc.addEventListener('click', () => {
      abrirModalDescricao(card.dataset.nome, aula.assunto || "", card.dataset.descricao);
    });

    const btnAg = card.querySelector('.btn-agendar-dinamico');
    if (btnAg) btnAg.addEventListener('click', onAgendarClick);

    return card;
  }

  // ---------------------------
  // VARIÁVEIS DE AGENDA
  // ---------------------------
  let aulasAgendadas = JSON.parse(localStorage.getItem("aulasAgendadas")) || [];
  let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || {};
  let tutorAtual = null;
  let descricaoTutor = null;
  let categoriaTutor = null;
  let horarioSelecionado = null;

  // ---------------------------
  // FILTRO DE TUTORES (campo #area)
  // ---------------------------
  const searchInput = document.getElementById("area");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const valor = this.value.toLowerCase();
      document.querySelectorAll(".tutor-card").forEach(card => {
        const area = (card.getAttribute("data-area") || "");
        card.style.display = area.toLowerCase().includes(valor) ? "" : "none";
      });
    });
  }

  // ---------------------------
  // HANDLERS: descrição e agendar (remove listeners antigos antes)
  // ---------------------------
  function attachDescricaoHandlers(root = document) {
    root.querySelectorAll(".btn-descricao").forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });
    root.querySelectorAll(".btn-descricao").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".tutor-card");
        if (!card) return;
        const nome = card.dataset.nome || "Tutor";
        const descricao = card.dataset.descricao || "Sem descrição disponível.";
        const label = document.getElementById("descricaoModalLabel");
        const texto = document.getElementById("descricaoModalTexto");
        if (label) label.textContent = nome;
        if (texto) texto.textContent = descricao;
        const m = document.getElementById("descricaoModal");
        if (m) new bootstrap.Modal(m).show();
      });
    });
  }

  function attachAgendarHandlers(root = document) {
    root.querySelectorAll(".btn-agendar").forEach(btn => {
      btn.replaceWith(btn.cloneNode(true)); // remove duplicados de event listeners
    });
    root.querySelectorAll(".btn-agendar").forEach(btn => btn.addEventListener("click", onAgendarClick));
  }

  // inicial attach nos elementos já presentes
  attachDescricaoHandlers(document);
  attachAgendarHandlers(document);

  // ---------------------------
  // CARREGAR AULAS DINÂMICAS DO localStorage (e anexa ao track)
  // ---------------------------
  function carregarAulasPublicadas() {
    const aulas = JSON.parse(localStorage.getItem("aulasPublicadas")) || [];
    if (!track) return;
    aulas.forEach(aula => {
      const col = document.createElement("div");
      col.className = "col-card";
      col.innerHTML = `
        <div class="tutor-card slide-up"
          data-area="${(aula.categoria || aula.assunto || '').replace(/"/g, '&quot;')}"
          data-horarios='${JSON.stringify(aula.horarios || [])}'
          data-nome="${(aula.nomeTutor || aula.nome || '').replace(/"/g, '&quot;')}"
          data-descricao="${(aula.descricao || aula.assunto || 'Sem descrição disponível.').replace(/"/g, '&quot;')}">
          <h5>${aula.nomeTutor || aula.nome || 'Tutor'}</h5>
          <p><strong>${aula.assunto || ''}</strong></p>
          <p class="text-muted">${aula.categoria || ''}</p>
          <button class="btn btn-descricao btn-outline-secondary mt-2">Descrição</button>
          <button class="btn btn-agendar btn-primary mt-2">Agendar</button>
        </div>
      `;
      track.appendChild(col);
    });
    attachDescricaoHandlers(track);
    attachAgendarHandlers(track);
  }

  carregarAulasPublicadas();

  // ---------------------------
  // AGENDA / HORÁRIOS
  // ---------------------------
  function onAgendarClick(e) {
    if (getCreditos() <= 0) {
      const m = document.getElementById("modalCreditosEsgotados");
      if (m) new bootstrap.Modal(m).show();
      verificarZeroCreditsTutor();
      return;
    }

    const card = e.target.closest(".tutor-card");
    if (!card) return;
    tutorAtual = card.dataset.nome || card.querySelector("h5")?.textContent || "Tutor";
    descricaoTutor = card.querySelector(".descricao-tutor") ? card.querySelector(".descricao-tutor").textContent : (card.dataset.descricao || "");
    categoriaTutor = card.querySelector(".categoria-tutor") ? card.querySelector(".categoria-tutor").textContent : (card.dataset.area || "");

    horarioSelecionado = null;

    const horariosCard = JSON.parse(card.dataset.horarios || "[]");

    // habilita/oculta botões de horário (se existirem)
    document.querySelectorAll(".horario-btn").forEach(btn => {
      const hora = btn.textContent.trim();
      btn.style.display = (!horariosCard.length || horariosCard.includes(hora)) ? "" : "none";
      btn.classList.remove("active");
      btn.disabled = false;
    });

    const tutorNomeSpan = document.getElementById("tutorNome");
    if (tutorNomeSpan) tutorNomeSpan.textContent = tutorAtual;

    atualizarHorariosBloqueados();

    const agendarModal = document.getElementById("agendarModal");
    if (agendarModal) new bootstrap.Modal(agendarModal).show();
  }

  // horário click (global)
  document.querySelectorAll(".horario-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      document.querySelectorAll(".horario-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      horarioSelecionado = btn.textContent.trim();
    });
  });

  function atualizarHorariosBloqueados() {
    const ocupados = aulasAgendadas.filter(a => a.tutor === tutorAtual).map(a => a.horario);
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

  // botão confirmar agendamento
  const btnConfirmar = document.getElementById("btnConfirmar");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      const modalAgendar = document.getElementById("agendarModal") ? bootstrap.Modal.getInstance(document.getElementById("agendarModal")) : null;

      if (!horarioSelecionado) {
        if (modalAgendar) modalAgendar.hide();
        const sel = document.getElementById("modalSelecioneHorario");
        if (sel) new bootstrap.Modal(sel).show();
        return;
      }

      if (getCreditos() <= 0) {
        if (modalAgendar) modalAgendar.hide();
        const m = document.getElementById("modalCreditosEsgotados");
        if (m) new bootstrap.Modal(m).show();
        verificarZeroCreditsTutor();
        return;
      }

      aulasAgendadas.push({ tutor: tutorAtual, horario: horarioSelecionado, descricao: descricaoTutor, categoria: categoriaTutor});
      localStorage.setItem("aulasAgendadas", JSON.stringify(aulasAgendadas));
      setCreditos(getCreditos() - 1);
      verificarZeroCreditsTutor();

      const conf = document.getElementById("confirmacaoHorario");
      if (conf) conf.innerText = `Aula com ${tutorAtual} agendada para ${horarioSelecionado}.`;

      const msg = document.getElementById("msgCreditoConsumido");
      if (msg) msg.style.display = "block";

      if (modalAgendar) modalAgendar.hide();
      const ag = document.getElementById("modalAgendado");
      if (ag) new bootstrap.Modal(ag).show();
    });
  }

  // ---------------------------
  // BLOCO DO DESIGN — esconder skills quando colidir com navbar
  // ---------------------------
  const navbar = document.querySelector(".navbar");
  const skillsCoins = document.querySelector(".skillsCoinsBox");
  const voltarBtn = document.querySelector(".voltar");

  if (navbar && skillsCoins && voltarBtn) {

    function checarColisao() {
      const navBottom = navbar.getBoundingClientRect().bottom;
      const skillsTop = skillsCoins.getBoundingClientRect().top;
      const voltarTop = voltarBtn.getBoundingClientRect().top;

      if (skillsTop <= navBottom || voltarTop <= navBottom) {
        skillsCoins.style.opacity = "0";
        skillsCoins.style.pointerEvents = "none";

        voltarBtn.style.opacity = "0";
        voltarBtn.style.pointerEvents = "none";
      } 
      else {
        skillsCoins.style.opacity = "1";
        skillsCoins.style.pointerEvents = "auto";

        voltarBtn.style.opacity = "1";
        voltarBtn.style.pointerEvents = "auto";
      }
    }

    window.addEventListener("scroll", checarColisao);
    checarColisao();
  }

  // finalmente: handlers para os cards estáticos presentes no HTML
  attachDescricaoHandlers(document);
  attachAgendarHandlers(document);

  // utility: se você tiver um carrossel posicionado, a função de updatePosition pode ficar aqui.
  // (deixei de fora por você pedir manutenção sem carousel)


}); // fim DOMContentLoaded
