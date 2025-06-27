const db = require('./db');

const getFilmes = async () => {
    const { rows } = await db.query('SELECT * FROM filmes ORDER BY id ASC');
    return rows;
};

const getFilmePorId = async (id) => {
    const { rows } = await db.query('SELECT * FROM filmes WHERE id = $1', [id]);
    return rows[0];
};

const criarFilme = async ({ titulo, descricao, ano, poster_url }) => {
    const { rows } = await db.query(
        'INSERT INTO filmes (titulo, descricao, ano, poster_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [titulo, descricao, ano, poster_url]
    );
    return rows[0];
};

const deletarFilme = async (id) => {
    const { rowCount } = await db.query('DELETE FROM filmes WHERE id = $1', [id]);
    return rowCount; // Retorna 1 se deletou, 0 se não encontrou
};

// Desafio para você: implementar a função de ATUALIZAR um filme!

module.exports = {
    getFilmes,
    getFilmePorId,
    criarFilme,
    deletarFilme,
};