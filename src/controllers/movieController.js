import * as model from '../models/movieModel.js';

export const getAll = async (req, res) => {
    try {
        const filmes = await model.findAll(req.query);

        if (!filmes || filmes.length === 0) {
            return res.status(200).json({
                message: 'Nenhum filme encontrado.',
            });
        }
        res.json(filmes);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
};

export const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        const { title, description, duration, genre, rating, available } = req.body;

        if (!title) return res.status(400).json({ error: 'O título (título) é obrigatório!' });
        if (!duration) return res.status(400).json({ error: 'A duração (duração) é obrigatória!' });
        if (!genre) return res.status(400).json({ error: 'O gênero (gênero) é obrigatório!' });

        //Regras de negócio
        // 1.
        if (!title) {
            return res.status(400)({
                error: 'O título é obrigatório'
            })
        }

if (title.length < 3)
	return res.status(400).json({ error: `O título deve ter mais de três caracteres!` });

if (description.length < 10)
	return res.status(400).json({ error:  `A descrição deve ter mais de dez caracteres!`});

if (!Number.isInteger(duration) || duration <= 0)
	return res.status(400).json({ error: `A duração deve ser um número inteiro positivo!`});

if (duration > 300)
return res.status(400).json({ error: `Filmes com duração superior a 300 minutos não podem ser cadastrados!`});

const validGenre = [
  'Drama',
  'Comédia',
  'Terror',
  'Romance',
  'Animação',
  'Ficção Científica',
  'Suspense'
];

try {
  if (!validGenre.includes(genre)) {
    return res.status(400).json({ error: 'Gênero inválido' });
  }

  if (rating < 0 || rating > 10) {
    return res.status(400).json({ error: 'A nota deve estar entre 0 e 10!' });
  }

  const data = await model.create({
    title,
    description,
    duration,
    genre,
    rating,
    available: true,
  });

  return res.status(201).json({
    message: 'Filme cadastrado com sucesso!',
    data,
  });

} catch (error) {
  console.error('Erro ao criar:', error);
  return res.status(500).json({
    error: 'Erro interno no servidor ao salvar o filme',
  });
}


} catch (error) {
    console.error('Erro ao criar:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao salvar o registro.' });
}
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const data = await model.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }
        res.json({ data });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro' });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (exists.available === false) {
            return res.status(400).json({
                error: 'Filmes indisponíveis não podem ser atualizados.'
            })
        }

        const { title, description, duration, genre, rating } = req.body;

        if (rating !== undefined && (rating < 0 || 10)) {
            return res.status(400).json({
                error: 'A nota deve estar entre 0 e 10!'
            })
        }

        if (duration !== undefined) {
            if (!Number.isInteger(duration) || duration <= 0) {
                return res.status(400).json({
                    error: 'A duração deve ser um número positivo!'
                })
            }

            if (duration > 300) {
                return res.status(400).json({
                    error: 'Filmes com duração superior a 300 minutos não podem ser cadastrados!'
                })
            }
        }

        if (title !== undefined && title.length < 3) {
            return res.status(400).json({
                error: 'O título deve conter mais de 3 caracteres!'
            })
        }

        if (description !== undefined && description.length < 10) {
            return res.status(400).json({
                error: 'A descrição deve conter mais de 10 caracteres!'
            })
        }

        const validGenre = [
            'Drama',
            'Comédia',
            'Terror',
            'Romance',
            'Animação',
            'Ficção Científica',
            'Suspense',
        ];

        if (genre !== undefined && !validGenre.includes(genre)) {
            return res.status(400).json({
                error: 'Gênero inválido!'
            })
        }

        if (title !== undefined && title !== exists.title) {
            const existsTitle = await model.FindbyTitle(title);
            if (existsTitle) {
                return res.status(400).json({
                    error: 'Já existe um filme com esse título'
                })
            }
        }

        const data = await model.update(id, req.body);
        res.json({
            message: `O registro "${data.nome}" foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const filmes = await model.findById(id);
        if (!filmes) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await model.remove(id);
        res.json({
            message: `O registro "${filmes.nome}" foi deletado com sucesso!`,
            deletado: filmes,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
    }
};
