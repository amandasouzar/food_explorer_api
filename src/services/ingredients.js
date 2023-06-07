const knex = require('../database/knex')

class IngredientsServices {
    async create(ingredientName) {
        try {
            const id = await knex('Ingredients').insert({name: ingredientName})

            return id
        } catch (err) {
            return err
        }
    }

    async getAll() {
        try {
            const all_ingredients = await knex('Ingredients').select("*")

            return all_ingredients
        } catch (err) {
            return err
        }
    }

    async getById (ingredientId) {
        try {
            const one_ingredient = await knex('Ingredients').where({id: ingredientId})

            return one_ingredient
        } catch (err) {
            return err
        }
    }

    async getByName (ingredientName) {
        try {
            const ingredient = await knex('Ingredients').whereLike("name", `%${ingredientName}%`)

            return ingredient
        } catch (err) {
            return err
        }
    }

    async delete (ingredientId) {
        try {
            await knex('Ingredients').where({id: ingredientId}).delete()
        } catch (err) {
            return err
        }
    }
}

module.exports = IngredientsServices