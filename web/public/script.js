const API_URL = 'http://localhost:3001/api/filmes';
 
const movieGrid = document.getElementById('movie-grid');

const addMovieForm = document.getElementById('add-movie-form');

const searchInput = document.getElementById('search-input');
 
let filmesCarregados = [];

let filmeAtual = null;
 
// --- Elementos do modal

const modal = document.getElementById('details-modal');

const modalImg = document.getElementById('modal-img');

const modalTitle = document.getElementById('modal-title');

const modalDesc = document.getElementById('modal-desc');

const modalYear = document.getElementById('modal-year');

const modalPoster = document.getElementById('modal-poster');

const editBtn = document.getElementById('edit-btn');

const saveBtn = document.getElementById('save-btn');

const cancelBtn = document.getElementById('cancel-btn');

const closeBtn = document.getElementById('close-modal');
 
// --- CRUD ---
 
// Ler: Buscar todos os filmes na API e mostrar

async function carregarFilmes() {

  try {

    const resp = await fetch(API_URL);

    filmesCarregados = await resp.json();

    exibirFilmes(filmesCarregados);

  } catch (e) {

    console.error('Erro ao carregar filmes:', e);

  }

}
 
// Mostrar os filmes na tela

function exibirFilmes(filmes) {

  movieGrid.innerHTML = '';

  filmes.forEach(filme => {

    const card = document.createElement('div');

    card.className = 'movie-card';

    card.innerHTML = `
<img src="${filme.poster_url || 'https://placehold.co/200x300'}">
<h3>${filme.titulo} (${filme.ano || 'N/A'})</h3>
<button class="delete-btn" data-id="${filme.id}">X</button>

    `;

    // Detalhes do filme ao clicar (menos no botão de deletar)

    card.addEventListener('click', (e) => {

      if (!e.target.classList.contains('delete-btn')) {

        abrirModal(filme);

      }

    });

    movieGrid.appendChild(card);

  });

}
 
// Adicionar novo filme

addMovieForm.addEventListener('submit', async (e) => {

  e.preventDefault();

  const anoInput = document.getElementById('ano');

  const anoExtraido = anoInput.value ? parseInt(anoInput.value) : null;

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
 
// Deletar filme

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
 
// --- MODAL Detalhes/Edição ---
 
// Função que autoajusta a altura do textarea da descrição

function ajustarAlturaTextarea() {

  modalDesc.style.height = "auto";

  modalDesc.style.height = modalDesc.scrollHeight + "px";

}
 
// Adiciona o eventListener apenas uma vez

modalDesc.removeEventListener("input", ajustarAlturaTextarea); // previne duplicatas

modalDesc.addEventListener("input", ajustarAlturaTextarea);
 
// Preenche e exibe o modal

function abrirModal(filme) {

  if (!filme) return;

  filmeAtual = filme;
 
 modalImg.src = filme.poster_url || 'https://placehold.co/500x750';

  modalImg.alt = filme.titulo || '';

  modalTitle.value = filme.titulo || '';

  modalDesc.value = filme.descricao || '';

  modalYear.value = filme.ano || '';

  modalPoster.value = filme.poster_url || '';
 
  setCamposReadonly(true);

  editBtn.classList.remove('hidden');

  saveBtn.classList.add('hidden');

  cancelBtn.classList.add('hidden');
 
  modal.classList.remove('hidden');

  ajustarAlturaTextarea();

}
 
// Fecha o modal

closeBtn.addEventListener('click', () => {

  modal.classList.add('hidden');

});
 
// Entra no modo edição

editBtn.addEventListener('click', () => {

  setCamposReadonly(false);

  editBtn.classList.add('hidden');

  saveBtn.classList.remove('hidden');

  cancelBtn.classList.remove('hidden');

  ajustarAlturaTextarea();

});
 
// Cancela edição e restaura os valores originais

cancelBtn.addEventListener('click', () => {

  abrirModal(filmeAtual);

});
 
// Salva as alterações

saveBtn.addEventListener('click', async () => {

  if (!filmeAtual) return;

  const filmeAtualizado = {

    titulo: modalTitle.value,

    descricao: modalDesc.value,

    ano: parseInt(modalYear.value),

    poster_url: modalPoster.value,

  };

  try {

    await fetch(`${API_URL}/${filmeAtual.id}`, {

      method: 'PUT',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify(filmeAtualizado),

    });

    modal.classList.add('hidden');

    carregarFilmes();

  } catch (error) {

    console.error('Erro ao salvar alterações:', error);

  }

});
 
// Bloqueia ou libera campos do modal

function setCamposReadonly(ativo) {

  modalTitle.readOnly = ativo;

  modalDesc.readOnly = ativo;

  modalYear.readOnly = ativo;

  modalPoster.readOnly = ativo;

}
 
// --- FILTRO DINÂMICO BUSCA

searchInput.addEventListener('input', (e) => {

  const termo = e.target.value.toLowerCase();

  const filtrados = filmesCarregados.filter(filme =>

    filme.titulo.toLowerCase().includes(termo)

  );

  exibirFilmes(filtrados);

});
 
// --- INICIAR ---

document.addEventListener('DOMContentLoaded', carregarFilmes);

 