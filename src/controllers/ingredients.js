// const knex = require('../database/knex')

const IngredientsServices = require('../services/ingredients')
const ingredientsServices = new IngredientsServices()

class IngredientsController {
    async create (req, res) {
        const {name} = req.body

        try {
            const ingredientExists = await ingredientsServices.getByName(name)

            if (ingredientExists.length !== 0) {
                return res.json({message: 'Já existe um ingrediente com esse nome.', status: 400})
            } else {
                await ingredientsServices.create(name)
    
                return res.json({message: 'Ingrediente adicionado', status: 200})
            }
        } catch(err) {
            if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
                res.status(401).json({error: 'Acesso não autorizado.'});
              } else {
                res.status(500).json({error: 'Erro interno do servidor.'});
              }
        }
    }
    
    async getAll (req, res) {
        try {
            const all_ingredients = await ingredientsServices.getAll()

            if (all_ingredients.length === 0) {
                return res.json({message: 'Não há ingredientes cadastrados.', status: 200})
            } else {
                return res.json({message: all_ingredients, status: 200})
            }
        } catch(err) {
            if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
                res.status(401).json({error: 'Acesso não autorizado.'});
              } else {
                res.status(500).json({error: 'Erro interno do servidor.'});
              }
        }
    }

    async getById (req, res) {
        const {id} = req.params

        try {
            const one_ingredient = await ingredientsServices.getById(id)

            if (one_ingredient.length === 0) {
                return res.json({message: 'Ingrediente não existe.', status: 400})
            } else {
                return res.json({message: one_ingredient, status: 200})
            }
        } catch(err) {
            if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
                res.status(401).json({error: 'Acesso não autorizado.'});
              } else {
                res.status(500).json({error: 'Erro interno do servidor.'});
              }
        }
    }

    async delete (req, res) {
        const {id} = req.params

        try {

            const ingredientExists = await ingredientsServices.getById(id)
            
            if (ingredientExists.length === 0) {
                return res.json({message: 'Ingrediente não existe.', status: 400})
            } else { 
                await ingredientsServices.delete(id)
                return res.json({message: 'Ingrediente apagado.', status: 200})
            }
        } catch(err) {
            if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
                res.status(401).json({error: 'Acesso não autorizado.'});
              } else {
                res.status(500).json({error: 'Erro interno do servidor.'});
              }
        }
    }
}

module.exports = IngredientsController