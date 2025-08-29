const url = "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome";

const templateCard = document.querySelector(".deputados__card--template");
const deputadosList = document.querySelector(".deputados__list");

async function getAllInfo() {
  const response = await fetch(url); // Faz a requisição da API
  const data = await response.json(); // Converte a resposta em JSON

  data.dados.forEach((deputado) => { // Vai percorrer cada deputado
    const card = templateCard.cloneNode(true);
    card.style.display = "flex";
    card.classList.remove("deputados__card--template");

    // Preenchimento dos dados do card
    card.querySelector(".deputados__card-img").src = deputado.urlFoto;
    card.querySelector(".deputados__card-name").innerText = deputado.nome;
    card.querySelector(".deputados__card-party").innerText = `(${deputado.siglaPartido})`;

    // Atualização do conteúdo do modal ao clicar no card
    card.addEventListener("click", async () => {
      try {
        const idResponse = await fetch(`https://dadosabertos.camara.leg.br/api/v2/deputados/${deputado.id}`);
        const jsonResponse = await idResponse.json();
        const detalhes = jsonResponse.dados;

        loadDeputado(detalhes);
      } catch (error) {
        console.error("Erro ao buscar detalhes do deputado:", error);
      }
    });

    deputadosList.appendChild(card);
  });
}

getAllInfo();

function loadDeputado(detalhes) {
  document.getElementById("modal-foto").src = detalhes.ultimoStatus.urlFoto;
  document.getElementById("modal-nome").textContent = detalhes.ultimoStatus.nomeEleitoral;
  document.getElementById("modal-partido").textContent = detalhes.ultimoStatus.siglaPartido;
  document.getElementById("modal-uf").textContent = detalhes.ultimoStatus.siglaUf;
  document.getElementById("modal-sexo").textContent = detalhes.sexo ?? "Não disponível";
  document.getElementById("modal-cpf").textContent = detalhes.cpf ?? "Não disponível";
  document.getElementById("modal-email").textContent = detalhes.ultimoStatus.gabinete.email ?? "Não disponível";
  document.getElementById("modal-escolaridade").textContent = detalhes.escolaridade ?? "Não disponível";
  document.getElementById("modal-nomecivil").textContent = detalhes.nomeCivil ?? "Não disponível";
  document.getElementById("modal-nascimento").textContent = detalhes.dataNascimento ?? "Não disponível";
}
