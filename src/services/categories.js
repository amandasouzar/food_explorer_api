const knex = require("../database/knex");

class CategoriesServices {
  async create(categoryName) {
    try {
      const id = await knex("Categories").insert({
        name: categoryName,
      });

      return id
    } catch (err) {
      return err;
    }
  }

  async getAll() {
    try {
      const all_categories = await knex("Categories").select("*");

      return all_categories;
    } catch (err) {
      return err;
    }
  }

  async getById (categoryId) {
    try {
        const one_category = await knex("Categories").where({ id: categoryId });
  
        return one_category
      } catch (err) {
        return err
      }
  }

  async getByName (categoryName) {
    try {
        const category = await knex('Categories').whereLike("name", `%${categoryName}%`)

        return category
    } catch (err) {
        return err
    }
  }

  async delete (categoryId) {
    try {
        await knex('Categories').where({id: categoryId}).delete()
    } catch (err) {
        return err
    }
  }
}

module.exports = CategoriesServices;
