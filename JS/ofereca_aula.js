let horariosAulaSelecionados = [];

function publicarAula() {
  const assuntoAula = document.getElementById("assuntoAula").value;
  const categoriaAula = document.getElementById("categoriaAula").value;
  const descricaoAula = document.getElementById("descricaoAula").value;

  if (!assuntoAula || !descricaoAula) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  if (horariosAulaSelecionados.length === 0) {
    alert("Por favor, selecione pelo menos um horário!");
    return;
  }

  const aulasPublicadasArmazenadas = localStorage.getItem("aulasPublicadas");
  let aulasPublicadas;
  if (aulasPublicadasArmazenadas === null) {
    aulasPublicadas = [];
  } else {
    aulasPublicadas = JSON.parse(aulasPublicadasArmazenadas);
  }

  const novaAula = {
    assunto: assuntoAula,
    categoria: categoriaAula,
    descricao: descricaoAula,
    horarios: [...horariosAulaSelecionados],
  };

  aulasPublicadas.push(novaAula);

  localStorage.setItem("aulasPublicadas", JSON.stringify(aulasPublicadas));

  document.getElementById("assuntoAula").value = "";
  document.getElementById("categoriaAula").selectedIndex = 0;
  document.getElementById("descricaoAula").value = "";

  document.querySelectorAll(".slot-btn.selected").forEach((btn) => {
    btn.classList.remove("selected");
  });

  horariosAulaSelecionados = [];

  alert("Aula publicada com sucesso!");
  alert("Você ganhou um crédito!"); // TODO: inserir função do crédito
}

function setHorarioAula(element) {
  const horarioSelecionado = element.textContent.trim();

  const index = horariosAulaSelecionados.indexOf(horarioSelecionado);

  if (index > -1) {
    element.classList.remove("selected");
    horariosAulaSelecionados.splice(index, 1);
  } else {
    element.classList.add("selected");
    horariosAulaSelecionados.push(horarioSelecionado);
  }

  console.log("Horários selecionados:", horariosAulaSelecionados);
}
