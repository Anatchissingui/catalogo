const express = require('express');

const cors = require('cors');

const queries = require('./queries');

const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');
 
const app = express();

const PORT = 3001;
 
// ---------- Swagger config ----------

const swaggerOptions = {

  swaggerDefinition: {

    openapi: '3.0.0',

    info: {

      title: 'API do Catálogo de Filmes',

      version: '1.0.0',

      description: 'Uma API para gerenciar um catálogo de filmes.',

    },

    servers: [{ url: `http://localhost:${PORT}` }],

  },

  apis: ['./index.js'],

};
 
const swaggerSpec = swaggerJsdoc(swaggerOptions);
 
// ---------- Middlewares ----------

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
// ---------- Swagger extra endpoints ----------

/**

* @swagger

* /:

*   get:

*     summary: Verificação de saúde da API

*     responses:

*       200:

*         description: API está no ar.

*/
 
/**

* @swagger

* /api-docs:

*   get:

*     summary: Interface Swagger UI

*     description: Abre a documentação interativa da API.

*     responses:

*       200:

*         description: Documentação carregada com sucesso.

*/
 
// ---------- Schemas ----------

/**

* @swagger

* components:

*   schemas:

*     Filme:

*       type: object

*       required:

*         - titulo

*       properties:

*         id:

*           type: integer

*           description: ID gerado automaticamente.

*         titulo:

*           type: string

*           description: Título do filme.

*         descricao:

*           type: string

*           description: Sinopse ou descrição.

*         ano:

*           type: integer

*           description: Ano de lançamento.

*         poster_url:

*           type: string

*           description: URL da imagem do pôster.

*/
 
// ---------- Rotas ----------

app.get('/', (req, res) => {

  res.send('API do Catálogo de Filmes está funcionando!');

});
 
/**

* @swagger

* /api/filmes:

*   get:

*     summary: Lista todos os filmes

*     tags: [Filmes]

*     responses:

*       200:

*         description: Lista de filmes.

*         content:

*           application/json:

*             schema:

*               type: array

*               items:

*                 $ref: '#/components/schemas/Filme'

*/

app.get('/api/filmes', async (req, res) => {

  try {

    const filmes = await queries.getFilmes();

    res.status(200).json(filmes);

  } catch {

    res.status(500).json({ error: 'Erro ao buscar filmes.' });

  }

});
 
/**

* @swagger

* /api/filmes:

*   post:

*     summary: Cria um novo filme

*     tags: [Filmes]

*     requestBody:

*       required: true

*       content:

*         application/json:

*           schema:

*             $ref: '#/components/schemas/Filme'

*     responses:

*       201:

*         description: Filme criado.

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Filme'

*       400:

*         description: Título obrigatório.

*/

app.post('/api/filmes', async (req, res) => {
  
  console.log('Dados recebidos:', req.body);
  const { titulo, descricao, ano, poster_url } = req.body;

  if (!titulo) return res.status(400).json({ error: 'O título é obrigatório.' });
 
  try {

    const novoFilme = await queries.criarFilme({ titulo, descricao, ano, poster_url });

    res.status(201).json(novoFilme);

  } catch {

    res.status(500).json({ error: 'Erro ao criar filme.' });

  }

});
 
/**

* @swagger

* /api/filmes/{id}:

*   delete:

*     summary: Deleta um filme por ID

*     tags: [Filmes]

*     parameters:

*       - in: path

*         name: id

*         required: true

*         schema:

*           type: integer

*     responses:

*       200:

*         description: Filme deletado.

*       404:

*         description: Filme não encontrado.

*/

app.delete('/api/filmes/:id', async (req, res) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });
 
  try {

    const deletado = await queries.deletarFilme(id);

    if (deletado) {

      res.status(200).json({ message: 'Filme deletado com sucesso.' });

    } else {

      res.status(404).json({ error: 'Filme não encontrado.' });

    }

  } catch {

    res.status(500).json({ error: 'Erro ao deletar filme.' });

  }

});
 
/**

* @swagger

* /api/filmes/{id}:

*   put:

*     summary: Atualiza um filme

*     tags: [Filmes]

*     parameters:

*       - in: path

*         name: id

*         required: true

*         schema:

*           type: integer

*     requestBody:

*       required: true

*       content:

*         application/json:

*           schema:

*             $ref: '#/components/schemas/Filme'

*     responses:

*       200:

*         description: Filme atualizado.

*       400:

*         description: Dados inválidos.

*       404:

*         description: Filme não encontrado.

*/

app.put('/api/filmes/:id', async (req, res) => {

  const id = parseInt(req.params.id);

  const { titulo, descricao, ano, poster_url } = req.body;
 
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

  if (!titulo) return res.status(400).json({ error: 'O título é obrigatório.' });
 
  try {

    const atualizado = await queries.atualizarFilme(id, { titulo, descricao, ano, poster_url });

    if (atualizado) return res.status(200).json(atualizado);

    res.status(404).json({ error: 'Filme não encontrado.' });

  } catch (err) {

    res.status(500).json({ error: 'Erro ao atualizar filme.' });

  }

});
 
// ---------- Inicia servidor ----------

app.listen(PORT, () => {

  console.log(`✅ API rodando na porta ${PORT} | Swagger: http://localhost:${PORT}/api-docs`);

});

 