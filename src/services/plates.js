const knex = require("../database/knex");
const uniqid = require('uniqid')

class PlatesServices {
  async getById(plateId) {
    try {
      const plate = await knex("Plates").where({ id: plateId });

      const ingredients = await knex
        .select("ingredient_id")
        .from("Ingredients_Plates")
        .where({ plate_id: plateId });

      return { plate, ingredients };
    } catch (err) {
      return err;
    }
  }

  async getByCategory(category_id) {
    try {
      const platesByCategory = await knex("Plates").where({
        category_id,
      });

      return platesByCategory;
    } catch (err) {
      return err;
    }
  }

  async getByName(plateName) {
    try {
      const platesByName = await knex("Plates")
        .whereLike("name", `%${plateName}%`)
        .orderBy("name");

      return platesByName;
    } catch (err) {
      return err;
    }
  }

  async getByIngredients(ingredientName) {
    try {
      const ingredient = await knex("Ingredients")
        .whereLike("name", `%${ingredientName}%`)
        .first();

      if (!ingredient) {
        return null;
      } else {
        const platesByIngredient = await knex
          .select("*")
          .from("Ingredients_Plates")
          .innerJoin("Plates", "Ingredients_Plates.plate_id", "Plates.id")
          .where({
            ingredient_id: ingredient.id,
          });

        return platesByIngredient;
      }
    } catch (err) {
      return err;
    }
  }

  async create(plateInformation, adminId, imgName) {
    const parsedName = JSON.parse(plateInformation.name)
    const parsedCategoryId = JSON.parse(plateInformation.category_id)
    const parseDescription = JSON.parse(plateInformation.description)
    const parsedPrice = JSON.parse(plateInformation.price)
    const parsedIngredientsIds = JSON.parse(plateInformation.ingredientsId)

    try {
      let categoryIsValid = await knex("Categories").where({
        id: plateInformation.category_id,
      });

      let adminIsValid = await knex("Users").where({ id: adminId });

      let message;
      let status;

      if (adminIsValid.length === 0) {
        message = "Administrador não existe.";
        status = 400;
        return { message, status };
      }

      if (categoryIsValid.length === 0) {
        message = "Categoria não cadastrada.";
        status = 400;
        return { message, status };
      }

      const plate_id = +(await knex("Plates").insert({
        name: parsedName,
        category_id: parsedCategoryId,
        description: parseDescription,
        image: uniqid() + '/' +  imgName,
        price: parsedPrice,
        admin_id: adminId,
      }));

      for await (let id of parsedIngredientsIds) {
        let ingredient = await knex("Ingredients").where({ id: id });

        if (ingredient.length === 0) {
          message = "Ingrediente não cadastrado.";
          status = 400;
          await knex("Plates").where({ id: plate_id }).delete();
          return { message, status };
        }

        const ingredient_id = ingredient[0].id;

        await knex("Ingredients_Plates").insert({
          plate_id,
          ingredient_id,
        });
      }
      message = "Prato adicionado!";
      status = 200;

      return { message, status };
    } catch (err) {
      return err;
    }
  }

  async update(plateInformation, plateId, imgName) {
    try {
      let message;
      let status;

      const { plate } = await this.getById(plateId);

      const parsedName = JSON.parse(plateInformation.name)
      const parsedCategoryId = JSON.parse(plateInformation.category_id)
      const parseDescription = JSON.parse(plateInformation.description)
      const parsedPrice = JSON.parse(plateInformation.price)
      const parsedIngredientsIds = JSON.parse(plateInformation.ingredientsId)
      const parsedRemovedItens = JSON.parse(plateInformation.removedItens)

      if (plate.length === 0) {
        message = "Não há pratos com esse id.";
        status = 400;
        return { message, status };
      }

      const newName = parsedName ?? plate[0].name;

      const newCategory_id =
        parsedCategoryId ?? plate[0].category_id;
      const newDescription =
        parseDescription ?? plate[0].description;
      const newImage = uniqid() + '/' +  imgName ?? plate[0].image;
      const newPrice = parsedPrice ?? plate[0].price;

      if (parsedIngredientsIds) {
        for await (const element of parsedIngredientsIds) {
          const ingredient = await knex("Ingredients").where({
            id: element,
          });

          if (ingredient.length === 0) {
            message = "Ingrediente não cadastrado.";
            status = 400;
            return { message, status };
          }

          const ingredient_id = ingredient[0].id;

          const existingIngredient = await knex("Ingredients_Plates")
            .where({
              plate_id: +plateId,
              ingredient_id,
            })
            .first();

          if (!existingIngredient) {
            await knex("Ingredients_Plates").insert({
              plate_id: +plateId,
              ingredient_id,
            });
          }
        }
      }

      if (parsedRemovedItens) {
        for await (const element of parsedRemovedItens) {
          const ingredient = await knex("Ingredients").where({
            id: element,
          });

          const ingredient_id = ingredient[0].id;

          await knex("Ingredients_Plates")
            .where({
              plate_id: +plateId,
              ingredient_id,
            })
            .delete();
        }
      }

      await knex("Plates").where({ id: plateId }).update({
        name: newName,
        category_id: newCategory_id,
        description: newDescription,
        image: newImage,
        price: newPrice
      });

      return { message: "Prato atualizado!", status: 200 };
    } catch (err) {
      return err;
    }
  }

  async delete(plateId) {
    try {
      const deletedPlate = await knex("Plates").where({ id: plateId }).delete();

      return deletedPlate;
    } catch (err) {
      return err;
    }
  }
}

module.exports = PlatesServices;
