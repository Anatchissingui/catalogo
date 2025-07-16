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
  try {
    const { rows } = await db.query(
      'INSERT INTO filmes (titulo, descricao, ano, poster_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, descricao, ano, poster_url]
    );
    return rows[0];
  } catch (err) {
    console.error('Erro ao criar filme:', err); // 👈 Verifica aqui
    throw err;
  }
};

const deletarFilme = async (id) => {
  const { rowCount } = await db.query('DELETE FROM filmes WHERE id = $1', [id]);
  return rowCount;                 // 1 se deletou, 0 se não encontrou
};
 
// ✅ UPDATE
const atualizarFilme = async (id, { titulo, descricao, ano, poster_url }) => {
  const { rows } = await db.query(
    `UPDATE filmes
       SET titulo = $1,
           descricao = $2,
           ano = $3,
           poster_url = $4
     WHERE id = $5
     RETURNING *`,
    [titulo, descricao, ano, poster_url, id]
  );
  return rows[0];                  // null se não encontrou
};
 
module.exports = {
  getFilmes,
  getFilmePorId,
  criarFilme,
  deletarFilme,
  atualizarFilme
};