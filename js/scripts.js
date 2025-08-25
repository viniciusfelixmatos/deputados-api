const url = "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome";

const templatecard = document.getElementById("deputadocard");
const deputadoslist = document.getElementById("deputados-list");

async function getAllInfo() {
  const response = await fetch(url);
  console.log(response);
  const data = await response.json();
  console.log(data);

  data.dados.forEach((deputado) => {
    const card = templatecard.cloneNode(true);
    card.style.display = "flex";
    card.removeAttribute("id");
    card.classList.remove("template");

    card.querySelector(".cardimg").src = deputado.urlFoto;
    card.querySelector(".card-name").innerText = deputado.nome;
    card.querySelector(".card-party").innerText = `(${deputado.siglaPartido})`;

    // 🔹 Listener direto no card
    card.addEventListener("click", () => {
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
  document.getElementById("modal-sexo").textContent = "Não disponível";
  document.getElementById("modal-nascimento").textContent = "Não disponível";
  document.getElementById("modal-cpf").textContent = "Não disponível";
  document.getElementById("modal-email").textContent = deputado.email ?? "Não disponível";
  document.getElementById("modal-escolaridade").textContent = "Não disponível";
  document.getElementById("modal-nomecivil").textContent = "Não disponível";

}
