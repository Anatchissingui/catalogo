CREATE TABLE filmes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    ano INTEGER,
    poster_url VARCHAR(255)
);


-- Inserindo alguns filmes de exemplo para começar
INSERT INTO filmes (titulo, descricao, ano, poster_url) VALUES
('O Poderoso Chefão', 'A saga de uma família mafiosa italiana em Nova York.', 1972, 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/oJagOzvsBUTTs1YQoRrR427210i.jpg'),
('Pulp Fiction', 'Várias histórias interligadas de crime e redenção em Los Angeles.', 1994, 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/i5Pj823aT6i0O5prrW3aBeGgG7I.jpg'),
('O Senhor dos Anéis: A Sociedade do Anel', 'Um jovem hobbit herda um anel mágico e perigoso.', 2001, 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/e5k0w2synoHk9Ies20eHn1aTj2u.jpg');


