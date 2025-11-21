document.addEventListener("DOMContentLoaded", function () {

    // elementos principais
    const profileWrapper = document.querySelector('.gradient-bg'); 
    const escolhaWrapper = document.querySelector('.tela-escolha-bg'); 
    const nomeSpan = document.getElementById('nomeUsuario');

    const nome = document.getElementById("nome");
    const aprender = document.getElementById("aprender");
    const ensinar = document.getElementById("ensinar");
    const salvarBtn = document.getElementById("salvarBtn");

    const creditModalEl = document.getElementById('creditModal');
    const creditBadge = document.getElementById("creditos");

    // Função para mostrar a tela de escolha
    function mostrarEscolha() {
        const n = localStorage.getItem("nomeUsuario") || "Usuário";
        if (nomeSpan) nomeSpan.textContent = n;

        if (profileWrapper) profileWrapper.classList.add('d-none');

        if (escolhaWrapper) {
            escolhaWrapper.style.display = '';
            escolhaWrapper.classList.remove('d-none');
            escolhaWrapper.classList.add('d-flex');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 🔥🔥 SE O USUÁRIO JÁ FEZ O CADASTRO → PULA O FORMULÁRIO
    const jaCadastrado = localStorage.getItem("nomeUsuario");

    if (jaCadastrado) {
        // oculta formulário
        if (profileWrapper) profileWrapper.classList.add('d-none');

        // mostra tela de escolha
        mostrarEscolha();
        return; // impede que o JS abaixo rode
    }

    if (profileWrapper) {
        profileWrapper.classList.remove('d-none');
        profileWrapper.classList.add('d-flex');
    }

    if (escolhaWrapper) {
        escolhaWrapper.style.display = 'none';
        escolhaWrapper.classList.add('d-none');
    }

    // Botão salvar
    if (salvarBtn) {
        salvarBtn.addEventListener("click", function () {

            const campos = [nome, aprender, ensinar];
            let vazio = false;

            campos.forEach(c => c?.classList.remove("is-invalid"));

            campos.forEach(c => {
                if (!c || c.value.trim() === "") {
                    c.classList.add("is-invalid");
                    vazio = true;
                }
            });

            if (vazio) {
                const primeiro = campos.find(c => c.classList.contains("is-invalid"));
                primeiro?.focus();
                return;
            }

            // salva nome e créditos
            localStorage.setItem("nomeUsuario", nome.value.trim());
            localStorage.setItem("creditos", "5");

            if (creditBadge) creditBadge.textContent = "5";

            // mostra modal caso exista
            if (creditModalEl) {
                const modal = new bootstrap.Modal(creditModalEl);
                modal.show();

                creditModalEl.addEventListener('hidden.bs.modal', function handler() {
                    mostrarEscolha();
                    creditModalEl.removeEventListener('hidden.bs.modal', handler);
                });

            } else {
                mostrarEscolha();
            }
        });
    }

    // remove erro ao digitar
    ["nome", "aprender", "ensinar"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", () => el.classList.remove("is-invalid"));
    });

});
