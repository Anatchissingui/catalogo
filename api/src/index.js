const express = require('express');
const cors = require('cors');
const queries = require('./queries');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Essencial para receber dados em JSON no corpo da requisição (body)

// Rota para testar se a API está no ar
app.get('/', (req, res) => {
    res.send('API do Catálogo de Filmes está funcionando!');
});

// --- ROTAS CRUD ---

// R (Read) - Ler todos os filmes
app.get('/api/filmes', async (req, res) => {
    try {
        const filmes = await queries.getFilmes();
        res.status(200).json(filmes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar filmes.' });
    }
});

// C (Create) - Adicionar um novo filme
app.post('/api/filmes', async (req, res) => {
    const { titulo, descricao, ano, poster_url } = req.body;
    if (!titulo) {
        return res.status(400).json({ error: 'O título é obrigatório.' });
    }
    try {
        const novoFilme = await queries.criarFilme({ titulo, descricao, ano, poster_url });
        res.status(201).json(novoFilme);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar filme.' });
    }
});

// D (Delete) - Deletar um filme
app.delete('/api/filmes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletado = await queries.deletarFilme(id);
        if (deletado) {
            res.status(200).json({ message: 'Filme deletado com sucesso.' });
        } else {
            res.status(404).json({ error: 'Filme não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar filme.' });
    }
});


app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
