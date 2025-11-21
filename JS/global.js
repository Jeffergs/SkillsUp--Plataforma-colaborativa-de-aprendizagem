// ==========================
// global.js - bloqueio universal
// ==========================

// Lista de páginas que exigem login
const paginasProtegidas = ["tutor.html", "ofereca_aula.html", "agendamentos.html"];
let arquivoAtual = window.location.pathname.split("/").pop().split("?")[0].toLowerCase();
if (arquivoAtual === "") arquivoAtual = "index.html";

// Verifica se o usuário está logado
const nome = localStorage.getItem("nomeUsuario");

if (paginasProtegidas.includes(arquivoAtual) && !nome) {
  // Trava tela imediatamente
  document.documentElement.style.display = "none";

  // Cria modal dinamicamente
  const modal = document.createElement("div");
  modal.id = "modalBloqueio";
  modal.style.cssText = `
    position: fixed; z-index: 9999; top:0; left:0; width:100%; height:100%;
    background-color: rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center;
  `;
  modal.innerHTML = `
    <div style="background:#fff; padding:2rem; border-radius:10px; text-align:center; max-width:400px; width:90%; font-family:sans-serif;">
      <h2 style="margin-bottom:1rem; color:#d9534f;">Atenção!</h2>
      <p style="margin-bottom:1rem;">Você não tem acesso a esta página.</p>
      <p style="margin-bottom:0;">Redirecionando para a tela de cadastro...</p>
    </div>
  `;
  document.body.appendChild(modal);

  // Mostra modal imediatamente
  document.documentElement.style.display = "block";

  // Redireciona automaticamente
  setTimeout(() => {
    window.location.replace("/Cadastro.html");
  }, 2000);
}

// ==========================
// Sistema de Créditos
// ==========================
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
    return novoValor;
  },

  add(amount) { return this.set(this.get() + Number(amount)); },
  remove(amount) { return this.set(this.get() - Number(amount)); },

  updateBadge() {
    const valor = this.get();
    const elementos = [
      ...document.querySelectorAll('#creditos'),
      ...document.querySelectorAll('#contadorCreditos')
    ];
    elementos.forEach(el => el.textContent = valor);
  },

  init() { this.updateBadge(); }
};

window.CreditSystem = CreditSystem;
window.adicionarCreditos = qtd => CreditSystem.add(qtd);
window.removerCreditos = qtd => CreditSystem.remove(qtd);
window.setCreditos = qtd => CreditSystem.set(qtd);
window.getCreditos = () => CreditSystem.get();
document.addEventListener("DOMContentLoaded", () => CreditSystem.init());

// ==========================
// Função para botões
// ==========================
function verificarLogin(destino) {
  const nome = localStorage.getItem("nomeUsuario");

  if (!nome) {
    const modalExistente = document.getElementById("modalBloqueio");
    if (!modalExistente) {
      const modal = document.createElement("div");
      modal.id = "modalBloqueio";
      modal.style.cssText = `
        position: fixed; z-index: 9999; top:0; left:0; width:100%; height:100%;
        background-color: rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center;
      `;
      modal.innerHTML = `
        <div style="background:#fff; padding:2rem; border-radius:10px; text-align:center; max-width:400px; width:90%; font-family:sans-serif;">
          <h2 style="margin-bottom:1rem; color:#d9534f;">Atenção!</h2>
          <p style="margin-bottom:1rem;">Você não tem acesso a esta página.</p>
          <p style="margin-bottom:0;">Redirecionando para a tela de cadastro...</p>
        </div>
      `;
      document.body.appendChild(modal);
    }
    setTimeout(() => window.location.href = "/Cadastro.html", 2000);
    return;
  }

  window.location.href = destino;
}
