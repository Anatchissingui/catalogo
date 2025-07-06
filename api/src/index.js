const express = require('express');

const cors = require('cors');

const queries = require('./queries');

const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');
 
const app = express();

const PORT = 3001;
 
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

*           description: O ID gerado automaticamente do filme.

*         titulo:

*           type: string

*           description: O título do filme.

*         descricao:

*           type: string

*           description: Uma breve sinopse do filme.

*         ano:

*           type: integer

*           description: O ano de lançamento do filme.

*         poster_url:

*           type: string

*           description: A URL do pôster do filme.

*/
 
// ------------------------ swagger config ------------------------

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

  apis: ['./src/index.js'], // Ajuste conforme a localização do arquivo

};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
 
// ------------------------ middlewares ------------------------

app.use(cors());

app.use(express.json()); // essencial para JSON no body

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
/**

* @swagger

* /:

*   get:

*     summary: Endpoint de verificação de saúde da API

*     responses:

*       200:

*         description: API está no ar.

*/

app.get('/', (req, res) => {

  res.send('API do Catálogo de Filmes está funcionando!');

});
 
// ------------------------ ROTAS CRUD ------------------------
 
/**

* @swagger

* /api/filmes:

*   get:

*     summary: Retorna a lista de todos os filmes

*     tags: [Filmes]

*     responses:

*       200:

*         description: Lista de filmes retornada com sucesso.

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

  } catch (error) {

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

*         description: Filme criado com sucesso.

*         content:

*           application/json:

*             schema:

*               $ref: '#/components/schemas/Filme'

*       400:

*         description: Dados de entrada inválidos.

*/

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
 
/**

* @swagger

* /api/filmes/{id}:

*   delete:

*     summary: Remove um filme pelo ID

*     tags: [Filmes]

*     parameters:

*       - in: path

*         name: id

*         required: true

*         schema:

*           type: integer

*         description: O ID do filme a ser removido

*     responses:

*       200:

*         description: Filme removido com sucesso.

*       404:

*         description: Filme não encontrado.

*/

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
 
// ------------------------ start server ------------------------

app.listen(PORT, () => {

  console.log(`API rodando na porta ${PORT} | Docs em http://localhost:${PORT}/api-docs`);

});

 