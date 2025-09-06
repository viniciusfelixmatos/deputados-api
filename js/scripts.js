const url = "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome";

const templateCard = $(".deputados__card--template");
const deputadosList = $(".deputados__list");

function getAllInfo() {

  // Requisição AJAX para obter os dados dos deputados
  $.ajax({
    url: url,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      console.log(data);

      $.each(data.dados, function (index, deputado) {
        const card = templateCard.clone();
        card.css('display', 'flex');
        card.removeClass('deputados__card--template');

        // Preenchimento do card com os dados do deputado || Com Ajax
        card.find(".deputados__card-img").attr('src', deputado.urlFoto);
        card.find(".deputados__card-name").text(deputado.nome);
        card.find(".deputados__card-party").text(`(${deputado.siglaPartido})`);

        // Atualização do conteúdo do modal ao clicar no card
        card.on("click", function () {
          getDeputadoDetails(deputado.id);
        });

        deputadosList.append(card);
      });
    },
    error: function (xhr, status, error) {
      console.error('Falha ao carregar os deputados:', error);
    }
  });
}

function getDeputadoDetails(deputadoId) {
  const detailUrl = `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputadoId}`;
  const frentesUrl = `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputadoId}/frentes`;

  const dropdownButton = $(".dropdown-frentes-toggle");
  const dropdownMenu = $(".dropdown-frentes");

  // Limpa o menu
  dropdownMenu.empty();

  $.ajax({
    url: detailUrl,
    method: 'GET',
    dataType: 'json',
    success: function (jsonResponse) {
      const detalhes = jsonResponse.dados;
      loadDeputado(detalhes);

      // Buscar frentes
      $.ajax({
        url: frentesUrl,
        method: 'GET',
        dataType: 'json',
        success: function (frentesResponse) {
          const frentes = frentesResponse.dados;

          if (frentes.length === 0) {
            dropdownButton.text("Não disponível");
          } else {
            // Atualiza o botão com a primeira frente
            const primeiraFrente = frentes[0].titulo.replace("Frente Parlamentar", "").trim();
            dropdownButton.text(primeiraFrente);

            // Adiciona todas as frentes (até 5) no menu
            frentes.slice(0, 5).forEach(frente => {
              const nomeFrente = frente.titulo.replace("Frente Parlamentar", "").trim();
              dropdownMenu.append(`<li><a class="dropdown-item" href="#">${nomeFrente}</a></li>`);
            });
          }
        },
        error: function () {
          dropdownButton.text("Não disponível");
        }
      });
    },
    error: function () {
      dropdownButton.text("Erro ao carregar");
    }
  });
}


function loadDeputado(detalhes) {
  $("#modal-foto").attr('src', detalhes.ultimoStatus.urlFoto);
  $("#modal-nome").text(detalhes.ultimoStatus.nomeEleitoral);
  $("#modal-partido").text(detalhes.ultimoStatus.siglaPartido);
  $("#modal-uf").text(detalhes.ultimoStatus.siglaUf);
  $("#modal-sexo").text(detalhes.sexo || "Não disponível");
  $("#modal-cpf").text(detalhes.cpf || "Não disponível");
  $("#modal-email").text(detalhes.ultimoStatus.gabinete.email || "Não disponível");
  $("#modal-escolaridade").text(detalhes.escolaridade || "Não disponível");
  $("#modal-nomecivil").text(detalhes.nomeCivil || "Não disponível");
  $("#modal-nascimento").text(detalhes.dataNascimento || "Não disponível");
  $("#modal-naturalidade").text("Brasileiro");
}
  
// Inicializa
getAllInfo();
