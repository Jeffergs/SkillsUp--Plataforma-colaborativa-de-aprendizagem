// /JS/global.js - versão ajustada
(function () {
  console.log('[global.js] carregando...');

  const CreditSystem = {
    key: 'creditos',

    get() {
      const value = Number(localStorage.getItem(this.key));
      return Number.isFinite(value) ? value : 0;
    },

    set(value) {
      const novoValor = Math.max(0, Number(value)); // nunca abaixo de 0
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

    // 🔥 Agora atualiza #creditos e #contadorCreditos
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

  // Garantir que rode no carregamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CreditSystem.init());
  } else {
    CreditSystem.init();
  }

  console.log('[global.js] pronto. Funções disponíveis: adicionarCreditos, removerCreditos, getCreditos, setCreditos');
})();

function verificarLogin(destino) {
    const nome = localStorage.getItem("nomeUsuario");

    if (!nome) {
        alert("Você precisa estar logado para oferecer aulas!");
        window.location.href = "Cadastro.html";
        return;
    }

    // autorizado
    window.location.href = destino;
}
