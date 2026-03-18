let criancas = JSON.parse(localStorage.getItem("criancas")) || [];

const funcoes = [
  "Direção 🎯",
  "Quebra-gelo 🧊",
  "Louvor 🎤",
  "Oferta 💰",
  "Oração 🙏"
];

let selecionado = null;

function salvar() {
  localStorage.setItem("criancas", JSON.stringify(criancas));
}

function atualizar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  criancas.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "item";

    if (i === selecionado) {
      div.classList.add("selecionado");
    }

    div.innerText = `${c.ativo ? "✅" : "❌"} ${c.nome}`;

    div.onclick = () => {
      selecionado = i;
      atualizar();
    };

    lista.appendChild(div);
  });
}

function adicionar() {
  const input = document.getElementById("nome");
  const nome = input.value.trim();

  if (!nome) return;

  criancas.push({
    nome,
    ativo: true,
    ultima: ""
  });

  salvar();
  atualizar();
  input.value = "";
}

function ativar() {
  if (selecionado === null) return;

  criancas[selecionado].ativo = !criancas[selecionado].ativo;
  salvar();
  atualizar();
}

function editar() {
  if (selecionado === null) return;

  let novo = prompt("Novo nome:");
  if (novo) {
    criancas[selecionado].nome = novo;
    salvar();
    atualizar();
  }
}

function excluir() {
  if (selecionado === null) return;

  criancas.splice(selecionado, 1);
  selecionado = null;
  salvar();
  atualizar();
}

function sortear() {
  let participantes = criancas.filter(c => c.ativo);

  // precisa de pelo menos 6 (porque louvor usa 2)
  if (participantes.length < funcoes.length + 1) {
    alert("Precisa de mais crianças ativas!");
    return;
  }

  let lista = document.getElementById("lista");
  lista.classList.add("rodando");

  let intervalo = setInterval(() => {
    let nomes = participantes
      .map(c => c.nome)
      .sort(() => Math.random() - 0.5);

    lista.innerHTML = nomes.map(n => `<div class="item">${n}</div>`).join("");
  }, 80);

  setTimeout(() => {
    clearInterval(intervalo);
    lista.classList.remove("rodando");

    let usados = [];
    let resultado = {};

    funcoes.forEach(f => {

      // 🎤 LOUVOR (2 PESSOAS)
      if (f.includes("Louvor")) {

        let candidatos = participantes.filter(c => c.ultima !== f && !usados.includes(c));

        if (candidatos.length < 2) {
          alert("Não há crianças suficientes para Louvor!");
          return;
        }

        let escolhidos = [];

        for (let i = 0; i < 2; i++) {
          let disponiveis = candidatos.filter(c => !escolhidos.includes(c));
          let escolhido = disponiveis[Math.floor(Math.random() * disponiveis.length)];
          escolhidos.push(escolhido);
          usados.push(escolhido);
        }

        resultado[f] = escolhidos.map(e => e.nome).join(" e ");
      }

      // 🎯 OUTRAS FUNÇÕES (1 PESSOA)
      else {
        let candidatos = participantes.filter(c => c.ultima !== f && !usados.includes(c));

        let escolhido = candidatos[Math.floor(Math.random() * candidatos.length)];
        resultado[f] = escolhido.nome;
        usados.push(escolhido);
      }

    });

    // salvar última função
    criancas.forEach(c => {
      for (let f in resultado) {
        if (resultado[f].includes(c.nome)) {
          c.ultima = f;
        }
      }
    });

    salvar();

    confetti({
      particleCount: 200,
      spread: 100
    });

    mostrarResultado(resultado);

    atualizar();

  }, 3000);
}

function mostrarResultado(resultado) {
  const box = document.getElementById("resultado");

  box.innerHTML = "<h2>🎉 Resultado</h2>";

  for (let f in resultado) {
    box.innerHTML += `<div><strong>${f}:</strong> ${resultado[f]}</div>`;
  }

  box.style.display = "block";
}

atualizar();sss