// Define os caminhos locais
        const localCSSPath = 'lib/bootstrap/css/bootstrap.min.css';
        const localJSPath = 'lib/bootstrap/js/bootstrap.min.js';
        
        // Função para carregar o arquivo CSS local
        function loadLocalCSS() {
            console.log("Falha ao carregar CDN. Carregando CSS local...");
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = localCSSPath;
            document.head.appendChild(link);
        }

        // Função para carregar o arquivo JS local
        function loadLocalJS() {
            console.log("Falha ao carregar CDN. Carregando JS local...");
            // Se estiver usando o Bootstrap 4, você precisaria carregar Popper.js e jQuery primeiro.
            
            const script = document.createElement('script');
            script.src = localJSPath;
            document.body.appendChild(script);
        }

        // 1. VERIFICAÇÃO DO CSS
        // Testa se a classe do CSS do Bootstrap foi aplicada corretamente no body
        // Se a internet falhar, o CSS CDN não será aplicado, e o 'height' será o padrão.
        // O método mais confiável é usar a verificação de integridade no elemento CDN diretamente
        // ou tentar acessar um objeto global do Bootstrap para o JS.

        // Uma verificação mais simples para o CSS:
        // Crie um elemento e verifique o estilo computado (precisa de um tempo para carregar o CDN)
        const cdnLink = document.getElementById('bootstrap-css-cdn');
        
        // Este evento dispara se o carregamento do recurso falhar (e a internet estiver fora)
        cdnLink.onerror = function() {
            loadLocalCSS();
        };

        // 2. VERIFICAÇÃO DO JAVASCRIPT
        // Verifica se o objeto global 'bootstrap' (ou 'jQuery' para versões antigas) existe.
        // Se a internet falhou e o script CDN não carregou, o objeto não existirá.
        
window.addEventListener('load', function() {
    // Verifica a disponibilidade do objeto global 'bootstrap' (usado a partir da v5)
    if (typeof bootstrap === 'undefined') {
        // Assume que loadLocalJS() é uma função que carrega JS localmente.
        loadLocalJS(); 
    }
    // Inicia a requisição após o carregamento da página.
    requisita('./tabela.json'); 
});

// A função 'requisita' agora é assíncrona
async function requisita(arquivo) {
    try {
        // 1. Faz a requisição Fetch.
        // O Fetch lida com a assincronicidade por meio de Promises.
        const response = await fetch(arquivo);

        // 2. Trata erros HTTP (e.g., 404, 500).
        // Fetch não rejeita Promises em status de erro HTTP, então verificamos manualmente.
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        // 3. Lê o corpo da resposta como JSON.
        // response.json() é assíncrono e seguro, substituindo o eval().
        const dados = await response.json(); 
        
        // 4. Exibe a resposta na tabela.
        exibeResposta(dados);

    } catch (error) {
        // 5. Captura erros de rede ou a rejeição manual (throw new Error).
        console.error('Falha ao requisitar o arquivo JSON:', error);
        // Aqui você pode adicionar lógica para mostrar uma mensagem de erro ao usuário.
    }
}

// A função 'exibeResposta' agora recebe diretamente o objeto de dados.
function exibeResposta(dados) {
    console.log(dados);
    
    // Certifica-se de que 'dados' é um array antes de iterar
    if (!Array.isArray(dados)) {
        console.error("Dados recebidos não são um array.");
        return;
    }
    
    var tbody = document.getElementById("tabela-corpo");

    // Limpa o corpo da tabela
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.lastChild);
    }

    // Cria e insere as novas linhas
    for (var i = 0; i < dados.length; i++) {
        var tr = document.createElement("tr");
        
        // Usa uma função auxiliar para simplificar a criação das células
        function createTd(text) {
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(text));
            return td;
        }

        tr.appendChild(createTd(dados[i].ingrediente));
        tr.appendChild(createTd(dados[i].xicara));
        tr.appendChild(createTd(dados[i].colherSopa));
        tr.appendChild(createTd(dados[i].colherCha));

        tbody.appendChild(tr);
    }
}

// O window.onload antigo foi substituído pelo evento 'load' no topo, tornando esta linha redundante e removida:
// window.onload = function () {
//     requisita("./tabela.json");
// };