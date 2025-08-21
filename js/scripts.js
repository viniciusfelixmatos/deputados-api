const url = "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome";

const templatecard = document.getElementById("deputadocard");
const deputadoslist = document.getElementById("deputados-list");

async function getAllInfo() {
    const response = await fetch(url);
    console.log(response);

    const data = await response.json();
    console.log(data);

    data.dados.map((deputado) => {
        const card = templatecard.cloneNode(true);
        card.style.display = "flex";
        card.removeAttribute("id");
        card.classList.remove("template");

        card.querySelector(".cardimg").src = deputado.urlFoto;
        card.querySelector(".card-name").innerText = deputado.nome;
        card.querySelector(".card-party").innerText = `(${deputado.siglaPartido})`;

        deputadoslist.appendChild(card);
    });
}

getAllInfo();


