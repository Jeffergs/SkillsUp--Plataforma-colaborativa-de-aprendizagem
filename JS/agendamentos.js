function excluirAulaAgendada(index) {
  if (confirm("Tem certeza que deseja cancelar esta aula?")) {
    const aulasAgendadas =
      JSON.parse(localStorage.getItem("aulasAgendadas")) || [];
    aulasAgendadas.splice(index, 1);
    localStorage.setItem("aulasAgendadas", JSON.stringify(aulasAgendadas));
    agendarAula();
  }
}

function excluirAulaPublicada(index) {
  if (confirm("Tem certeza que deseja excluir esta aula publicada?")) {
    const aulasPublicadas =
      JSON.parse(localStorage.getItem("aulasPublicadas")) || [];
    aulasPublicadas.splice(index, 1);
    localStorage.setItem("aulasPublicadas", JSON.stringify(aulasPublicadas));
    carregarAulas();
    alert("Você perdeu um crédito!"); // TODO: inserir função do crédito
  }
}

function agendarAula() {
  const aulasAgendadas =
    JSON.parse(localStorage.getItem("aulasAgendadas")) || [];
  const agendamentoAulasEl = document.getElementById("agendamentoAulas");

  if (aulasAgendadas.length === 0) {
    agendamentoAulasEl.innerHTML = `
            <div class="alert alert-warning" role="alert">
              <i class="bi bi-info-circle"></i> Você ainda não agendou nenhuma aula
            </div>
          `;
  } else {
    agendamentoAulasEl.innerHTML = "";
    for (const aulaAgendada of aulasAgendadas) {
      const div = document.createElement("div");
      div.innerHTML = `
              <div class="card mb-3">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-md-8">
                      <h5 class="text-primary mb-2">${
                        aulaAgendada.categoria
                      }</h5>
                      <p class="mb-1 text-muted">${aulaAgendada.descricao}</p> 
                      <p class="mb-0"><strong><i class="bi bi-clock"></i> Horário:</strong> ${
                        aulaAgendada.horario || "Não definido"
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
            `;
      agendamentoAulasEl.appendChild(div);
    }
  }
}

function carregarAulas() {
  const aulasPublicadas =
    JSON.parse(localStorage.getItem("aulasPublicadas")) || [];
  const aulasPublicadasEl = document.getElementById("aulasPublicadas");
  aulasPublicadasEl.innerHTML = "";

  if (aulasPublicadas.length === 0) {
    aulasPublicadasEl.innerHTML = `
            <div class="alert alert-warning" role="alert">
              <i class="bi bi-info-circle"></i> Você ainda não publicou nenhuma aula
            </div>
          `;
  } else {
    aulasPublicadasEl.innerHTML = "";

    aulasPublicadas.forEach((aulaPublicada, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
              <div class="card mb-3">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-md-9">
                      <h5 class="text-danger mb-2">${
                        aulaPublicada.categoria
                      }</h5>
                      <p class="mb-1 text-muted">${aulaPublicada.descricao}</p> 
                      <p class="mb-0"><strong><i class="bi bi-clock"></i> Horários:</strong> ${
                        aulaPublicada.horarios
                          ? aulaPublicada.horarios.join(" | ")
                          : "Não definido"
                      }</p>
                    </div>
                    <div class="col-md-3 text-end">
                      <button class="btn btn-danger btn-sm" onclick="excluirAulaPublicada(${index})">
                        <i class="bi bi-trash"></i> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
      aulasPublicadasEl.appendChild(div);
    });
  }
}

agendarAula();
carregarAulas();
