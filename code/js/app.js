document.addEventListener('DOMContentLoaded', () => {
    // Mapeamento das rotas para os arquivos reais HTML
    const rotas = {
        'home': '<section class="content-area"><h2>Bem-vindo à ONG Mãos Unidas</h2><p>Escolha uma opção no menu acima para navegar pela nossa plataforma.</p></section>',
        'cadastro': 'html/cadastro.html',
        'projetos': 'html/projetos.html'
    };

    const containerPrincipal = document.getElementById('conteudo-principal');

    // Função que carrega o conteúdo dinamicamente
    async function navegarPara(rota) {
        if (!rotas[rota]) {
            containerPrincipal.innerHTML = '<h2>404 - Página Não Encontrada</h2>';
            return;
        }

        // Se for a home, injeta o HTML direto
        if (rota === 'home') {
            containerPrincipal.innerHTML = rotas[rota];
            window.location.hash = rota;
            return;
        }

        // Para cadastro e projetos, busca o arquivo HTML via Fetch API
        try {
            const resposta = await fetch(rotas[rota]);
            const htmlTexto = await resposta.text();
            
            // Extrai apenas o conteúdo dentro da tag <main> para não duplicar header/footer
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlTexto, 'text/html');
            const conteudoMain = doc.querySelector('main');

            if (conteudoMain) {
                containerPrincipal.innerHTML = conteudoMain.innerHTML;
            } else {
                containerPrincipal.innerHTML = htmlTexto;
            }
            
            window.location.hash = rota;
        } catch (erro) {
            containerPrincipal.innerHTML = '<h2>Erro ao carregar o conteúdo.</h2>';
            console.error('Erro de navegação:', erro);
        }
    }

    // Interceptação dos cliques no menu
    document.querySelectorAll('nav a[data-rota]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o recarregamento da página
            
            // Atualiza a classe ativa visualmente
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');

            const rota = link.getAttribute('data-rota');
            navegarPara(rota);
        });
    });
});