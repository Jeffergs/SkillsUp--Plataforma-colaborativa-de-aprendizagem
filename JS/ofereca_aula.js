// ofereca_aula.js (trechos importantes)
let horariosAulaSelecionados = [];

function setHorarioAula(element) {
  const horarioSelecionado = element.textContent.trim();
  const index = horariosAulaSelecionados.indexOf(horarioSelecionado);
  if (index > -1) {
    element.classList.remove('selected');
    horariosAulaSelecionados.splice(index, 1);
  } else {
    element.classList.add('selected');
    horariosAulaSelecionados.push(horarioSelecionado);
  }
  console.log('[ofereca_aula.js] horários:', horariosAulaSelecionados);
}

function publicarAula() {
  console.log('[ofereca_aula.js] publicarAula chamado');
  const assuntoAula = document.getElementById('assuntoAula')?.value || '';
  const categoriaAula = document.getElementById('categoriaAula')?.value || '';
  const descricaoAula = document.getElementById('descricaoAula')?.value || '';

  if (!assuntoAula || !descricaoAula) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  if (horariosAulaSelecionados.length === 0) {
    alert('Por favor, selecione pelo menos um horário!');
    return;
  }

  const aulasPublicadasArmazenadas = localStorage.getItem('aulasPublicadas');
  const aulasPublicadas = aulasPublicadasArmazenadas ? JSON.parse(aulasPublicadasArmazenadas) : [];

  const novaAula = {
    assunto: assuntoAula,
    categoria: categoriaAula,
    descricao: descricaoAula,
    horarios: [...horariosAulaSelecionados],
    publicadoEm: new Date().toISOString()
  };

  aulasPublicadas.push(novaAula);
  localStorage.setItem('aulasPublicadas', JSON.stringify(aulasPublicadas));
  console.log('[ofereca_aula.js] aula salva em localStorage', novaAula);

  // limpar formulário
  document.getElementById('assuntoAula').value = '';
  document.getElementById('categoriaAula').selectedIndex = 0;
  document.getElementById('descricaoAula').value = '';
  document.querySelectorAll('.slot-btn.selected').forEach(btn => btn.classList.remove('selected'));
  horariosAulaSelecionados = [];

  // ---- tentativa de adicionar crédito usando API global ----
  try {
    if (typeof adicionarCreditos === 'function') {
      adicionarCreditos(1);
      console.log('[ofereca_aula.js] adicionou 1 crédito via adicionarCreditos()');
    } else if (window.CreditSystem && typeof window.CreditSystem.add === 'function') {
      window.CreditSystem.add(1);
      console.log('[ofereca_aula.js] adicionou 1 crédito via CreditSystem.add()');
    } else {
      console.warn('[ofereca_aula.js] API de créditos não encontrada');
    }
  } catch (err) {
    console.error('[ofereca_aula.js] erro ao adicionar crédito:', err);
  }

  alert('Aula publicada com sucesso! Você ganhou um crédito!');
}
