const API_URL = 'http://localhost:3001/api/filmes';
const movieGrid = document.getElementById('movie-grid');
const addMovieForm = document.getElementById('add-movie-form');
 
let filmesCarregados = []; // Armazena todos os filmes carregados
 
// LER: Busca todos os filmes na API e exibe na tela
async function carregarFilmes() {
    try {
        const response = await fetch(API_URL);
        filmesCarregados = await response.json();
        exibirFilmes(filmesCarregados);
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    }
}

// Exibe os filmes na tela
function exibirFilmes(filmes) {
    movieGrid.innerHTML = '';
    filmes.forEach(filme => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
<img src="${filme.poster_url || 'https://via.placeholder.com/200x300'}" alt="${filme.titulo}">
<h3>${filme.titulo} (${filme.ano || 'N/A'})</h3>
<button class="delete-btn" data-id="${filme.id}">X</button>
        `;
        movieGrid.appendChild(card);
    });
}
 
// CRIAR: Pega os dados do formulário e envia para a API
addMovieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
 
    // Extrai apenas o ano da data
    const anoInput = document.getElementById('ano');
const dataCompleta = anoInput.value;
const anoExtraido = dataCompleta ? new Date(dataCompleta).getFullYear() : null;
 
const novoFilme = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    ano: anoExtraido,
    poster_url: document.getElementById('poster_url').value,
};
 
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoFilme),
        });
        addMovieForm.reset();
        carregarFilmes();
    } catch (error) {
        console.error('Erro ao adicionar filme:', error);
    }
});
 
// DELETAR: Escuta cliques nos botões de deletar
movieGrid.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            carregarFilmes();
        } catch (error) {
            console.error('Erro ao deletar filme:', error);
        }
    }
});
 
// FILTRO DINÂMICO
document.getElementById('search-input').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = filmesCarregados.filter(filme =>
        filme.titulo.toLowerCase().includes(termo)
    );
    exibirFilmes(filtrados);
});
 
// Inicia o carregamento ao abrir a página
document.addEventListener('DOMContentLoaded', carregarFilmes);