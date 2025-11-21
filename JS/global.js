// ====================================================
//  🔒 BLOQUEIO COM POP-UP MODAL E REDIRECIONAMENTO AUTOMÁTICO
// ====================================================
(function bloquearTelaComModal() {
  const paginasProtegidas = ["tutor.html", "ofereca_aula.html", "agendamentos.html"];
  
  // Pega o nome do arquivo sem query string
  let arquivoAtual = window.location.pathname.split("/").pop().toLowerCase();
  arquivoAtual = arquivoAtual.split("?")[0];

  const nome = localStorage.getItem("nomeUsuario");
  const modal = document.getElementById("modalBloqueio");

  if (paginasProtegidas.includes(arquivoAtual) && !nome) {
    if (modal) modal.style.display = "flex";

    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el.id !== "modalBloqueio") {
        el.style.display = "none";
      }
    });

    setTimeout(() => {
      window.location.replace("/Cadastro.html");
    }, 2000);
  } else {
    document.body.style.display = "block";
  }
})();

// ====================================================
//  SISTEMA DE CRÉDITOS
// ====================================================
(function () {
  console.log('[global.js] carregando...');

  const CreditSystem = {
    key: 'creditos',

    get() {
      const value = Number(localStorage.getItem(this.key));
      return Number.isFinite(value) ? value : 0;
    },

    set(value) {
      const novoValor = Math.max(0, Number(value));
      localStorage.setItem(this.key, String(novoValor));
      this.updateBadge();
      console.log('[global.js] set ->', novoValor);
      return novoValor;
    },

    add(amount) {
      return this.set(this.get() + Number(amount));
    },

    remove(amount) {
      return this.set(this.get() - Number(amount));
    },

    updateBadge() {
      const valor = this.get();
      const elementos = [
        ...document.querySelectorAll('#creditos'),
        ...document.querySelectorAll('#contadorCreditos')
      ];
      elementos.forEach(el => (el.textContent = valor));
    },

    init() {
      console.log('[global.js] init -> créditos atuais:', this.get());
      this.updateBadge();
    }
  };

  // Expor globalmente
  window.CreditSystem = CreditSystem;
  window.adicionarCreditos = qtd => CreditSystem.add(qtd);
  window.removerCreditos = qtd => CreditSystem.remove(qtd);
  window.setCreditos = qtd => CreditSystem.set(qtd);
  window.getCreditos = () => CreditSystem.get();

  // Inicializa no carregamento da página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CreditSystem.init());
  } else {
    CreditSystem.init();
  }

  console.log('[global.js] pronto. Funções disponíveis: adicionarCreditos, removerCreditos, getCreditos, setCreditos');
})();


// ====================================================
//  🔐 FUNÇÃO PARA BOTÕES QUE REDIRECIONAM
// ====================================================
function verificarLogin(destino) {
  const nome = localStorage.getItem("nomeUsuario");
  const modal = document.getElementById("modalBloqueio");

  if (!nome) {
    // Mostra modal
    if (modal) modal.style.display = "flex";

    // Esconde o restante da página
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el.id !== "modalBloqueio") {
        el.style.display = "none";
      }
    });

    // Redireciona automaticamente
    setTimeout(() => {
      window.location.href = "/Cadastro.html";
    }, 2000);
    return;
  }

  // Usuário autorizado
  window.location.href = destino;
}
