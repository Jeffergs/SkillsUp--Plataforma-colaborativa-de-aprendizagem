// Inicializa o saldo usando localStorage para manter o valor entre páginas
function inicializarSaldo() {
  const elementoSaldo = document.getElementById("saldo-creditos");
  if (!elementoSaldo) return; // página sem saldo

  let saldoAtual = localStorage.getItem("skillloop_saldo");

  if (saldoAtual === null) {
    // saldo inicial da simulação
    saldoAtual = 5;
    localStorage.setItem("skillloop_saldo", saldoAtual);
  }

  elementoSaldo.innerText = saldoAtual;
}

// Atualiza valor em tela e no localStorage
function atualizarSaldo(novoSaldo) {
  localStorage.setItem("skillloop_saldo", novoSaldo);
  const elementoSaldo = document.getElementById("saldo-creditos");
  if (elementoSaldo) {
    elementoSaldo.innerText = novoSaldo;
  }
}

// usuário ensinou -> ganha crédito
function ganharCredito() {
  let saldo = Number(localStorage.getItem("skillloop_saldo") || "0");
  saldo += 1;
  atualizarSaldo(saldo);
  alert("Parabéns! Você ensinou alguém e ganhou +1 Crédito Skill.");
}

// usuário aprendeu -> gasta crédito
function gastarCredito() {
  let saldo = Number(localStorage.getItem("skillloop_saldo") || "0");

  if (saldo <= 0) {
    alert("Você não tem créditos disponíveis. Ensine algo para ganhar Créditos Skill!");
    return;
  }

  saldo -= 1;
  atualizarSaldo(saldo);
  alert("Você usou 1 Crédito Skill para aprender com alguém da comunidade.");
}

// Simulação rápida de sessão concluída ensinando
function simularSessaoConcluida() {
  let saldo = Number(localStorage.getItem("skillloop_saldo") || "0");
  saldo += 1;
  atualizarSaldo(saldo);
  alert("Sessão de ensino concluída! Seu saldo foi incrementado em +1 Crédito Skill.");
}

// Solicitar aula na tela de matches
function solicitarAula(nomeMentor, tema) {
  let saldo = Number(localStorage.getItem("skillloop_saldo") || "0");

  if (saldo <= 0) {
    alert(
      "Você ainda não possui créditos suficientes para solicitar essa aula.\n" +
      "Experimente ensinar algo para ganhar Créditos Skill."
    );
    return;
  }

  // Aqui apenas simulamos. Não descontamos automaticamente para o aluno poder testar à vontade.
  alert(
    `Solicitação enviada para ${nomeMentor}!\n\n` +
    `Tema: ${tema}\n\n` +
    "Em uma versão completa, essa aula seria agendada e 1 crédito seria reservado " +
    "do seu saldo após a confirmação."
  );
}

// Ao carregar qualquer página, tentamos inicializar o saldo
document.addEventListener("DOMContentLoaded", inicializarSaldo);
