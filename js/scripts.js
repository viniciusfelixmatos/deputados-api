const url = "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome";

const templateCard = $(".deputados__card--template");
const deputadosList = $(".deputados__list");

function getAllInfo() {
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log("Deputados carregados:", data.dados.length);
            
            $.each(data.dados, function (index, deputado) {
                const card = templateCard.clone();
                card.css('display', 'flex');
                card.removeClass('deputados__card--template');

                // Preenchimento do card
                card.find(".deputados__card-img").attr('src', deputado.urlFoto);
                card.find(".deputados__card-name").text(deputado.nome);
                card.find(".deputados__card-party").text(`(${deputado.siglaPartido})`);

                // Click handler para abrir o modal
                card.on("click", function () {
                    getDeputadoDetails(deputado.id);
                    $('#exampleModal').modal('show');
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

    const dropdownMenu = $(".dropdown-frentes");
    const dropdownFrenteText = $(".dropdown-frente-text");

    if (dropdownFrenteText.length === 0) {
        console.error("Span com classe 'dropdown-frente-text' não encontrado!");
        return;
    }

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
                        dropdownFrenteText.text("Não disponível");
                    } else {
                        const primeiraFrente = frentes[0].titulo.replace("Frente Parlamentar", "").trim();
                        dropdownFrenteText.text(primeiraFrente);

                        // Adicionar até 5 frentes adicionais ao dropdown
                        frentes.slice(1, 6).forEach(frente => {
                            const nomeFrente = frente.titulo.replace("Frente Parlamentar", "").trim();
                            dropdownMenu.append(`<li><a class="dropdown-item" href="#">${nomeFrente}</a></li>`);
                        });
                    }
                },
                error: function () {
                    dropdownFrenteText.text("Não disponível");
                }
            });
        },
        error: function () {
            dropdownFrenteText.text("Erro ao carregar");
            $('#exampleModal').modal('show');
        }
    });
}

function loadDeputado(detalhes) {
    $("#modal-foto").attr('src', detalhes.ultimoStatus?.urlFoto || "");
    $("#modal-nome").text(detalhes.ultimoStatus?.nomeEleitoral || "Não disponível");
    $("#modal-partido").text(detalhes.ultimoStatus?.siglaPartido || "Não disponível");
    $("#modal-uf").text(detalhes.ultimoStatus?.siglaUf || "Não disponível");
    $("#modal-sexo").text(detalhes.sexo ? (detalhes.sexo === "M" ? "Masculino" : "Feminino") : "Não disponível");
    $("#modal-cpf").text(detalhes.cpf || "Não disponível");
    $("#modal-email").text(detalhes.ultimoStatus?.gabinete?.email || "Não disponível");
    $("#modal-escolaridade").text(detalhes.escolaridade || "Não disponível");
    $("#modal-nomecivil").text(detalhes.nomeCivil || "Não disponível");
    $("#modal-nascimento").text(detalhes.dataNascimento ? formatarData(detalhes.dataNascimento) : "Não disponível");
    $("#modal-naturalidade").text(detalhes.municipioNascimento || "Brasileiro");
}
  
// Formata a data para o padrão brasileiro
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Inicializa quando o documento estiver pronto
$(document).ready(function() {
    getAllInfo();
});
