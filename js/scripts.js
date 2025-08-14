const url = "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome";


const deputadosarea = document.getElementById("deputadocard");
const deputadobox = document.querySelector("#deputados-card");

async function getAllInfo() {
    const response = await fetch (url);
    console.log(response);

    const data = await response.json();
    console.log(data);

    deputadosarea.classList.add("hide");

    data.map((post) => {
        const name = document.createElement("p");
        const partido = document.createElement("p");

        name.innterText = post.nome;
        partido.innerText = post.siglaPartido;

        deputadobox.appendChild(name);
        deputadobox.appendChild(partido);
    })
}

getAllInfo();