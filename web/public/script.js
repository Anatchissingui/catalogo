const API_URL = 'http://localhost:3001/api/filmes'; // URL da nossa API
const movieGrid = document.getElementById('movie-grid');
const addMovieForm = document.getElementById('add-movie-form');

// LER: Busca todos os filmes na API e exibe na tela
async function carregarFilmes() {
    try {
        const response = await fetch(API_URL);
        const filmes = await response.json();
        
        movieGrid.innerHTML = ''; // Limpa a grade
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
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    }
}

// CRIAR: Pega os dados do formulário e envia para a API
addMovieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const novoFilme = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        ano: parseInt(document.getElementById('ano').value),
        poster_url: document.getElementById('poster_url').value,
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoFilme),
        });
        addMovieForm.reset(); // Limpa o formulário
        carregarFilmes(); // Recarrega a lista de filmes
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
            carregarFilmes(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao deletar filme:', error);
        }
    }
});

// Carrega os filmes assim que a página é aberta
document.addEventListener('DOMContentLoaded', carregarFilmes);