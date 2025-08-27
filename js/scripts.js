const url = "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome";

const templatecard = document.getElementById("deputadocard");
const deputadoslist = document.getElementById("deputados-list");

async function getAllInfo() {
  const response = await fetch(url); // busca informações da API
  console.log(response);
  const data = await response.json(); // transforma a resposta em JSON
  console.log(data);

  data.dados.forEach((deputado)  => { // pega a resposta vinda da variável dados e percorre todo array para executar a função abaixo

    const card = templatecard.cloneNode(true);
    card.style.display = "flex";
    card.removeAttribute("id");
    card.classList.remove("template");

    card.querySelector(".cardimg").src = deputado.urlFoto;
    card.querySelector(".card-name").innerText = deputado.nome;
    card.querySelector(".card-party").innerText = `(${deputado.siglaPartido})`;

    card.addEventListener("click", async () => {
      let deputadoDetails = `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputado.id}`;
      const idresponse = await fetch(deputadoDetails);
      const jsonresponse = await idresponse.json();
      console.log(jsonresponse);

      const teste = document.getElementById("modal-nascimento").innerText = deputadoDetails.dataNascimento;
      console.log(teste);

      loadDeputado(deputado);
    });

    deputadoslist.appendChild(card);
  });
}

getAllInfo();

function loadDeputado(deputado) {
  document.getElementById("modal-foto").src = deputado.urlFoto;
  document.getElementById("modal-nome").textContent = deputado.nome;
  document.getElementById("modal-partido").textContent = deputado.siglaPartido;
  document.getElementById("modal-uf").textContent = deputado.siglaUf;
  document.getElementById("modal-sexo").textContent = "Não disponível"; /* NÃO EXISTENTE */
  document.getElementById("modal-cpf").textContent = "Não disponível"; /* NÃO EXISTENTE */
  document.getElementById("modal-email").textContent = deputado.email ?? "Não disponível"; /* NÃO EXISTENTE */
  document.getElementById("modal-escolaridade").textContent = "Não disponível"; /* NÃO EXISTENTE */
  document.getElementById("modal-nomecivil").textContent = deputado.nome;
}
