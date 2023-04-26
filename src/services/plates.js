const knex = require("../database/knex");

class PlatesServices {
  async getById(plateId) {
    try {
      const plate = await knex("Plates").where({ id: plateId });

      const ingredients = await knex
        .select("ingredient_id", "weigth_in_g")
        .from("Ingredients_Plates")
        .where({ plate_id: plateId });

      return { plate, ingredients };
    } catch (err) {
      return err;
    }
  }

  async getByCategory(plateCategory) {
    try {
      const category = await knex("Categories")
        .whereLike("name", `%${plateCategory}%`)
        .first();

      if (category) {
        const platesByCategory = await knex("Plates").where({
          category_id: category.id,
        });

        return platesByCategory;
      } else {
        return null;
      }
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

  async create(plateInformation, adminId) {
    try {
      let categoryIsValid = await knex("Categories").whereLike(
        "name",
        `%${plateInformation.category_name}%`
      );

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
        name: plateInformation.name,
        category_id: categoryIsValid[0].id,
        description: plateInformation.description,
        image: plateInformation.image,
        price: plateInformation.price,
        isFavorite: false,
        admin_id: adminId,
      }));

      console.log(plateInformation.ingredients);

      for await (let element of plateInformation.ingredients) {
        let ingredient = await knex("Ingredients").whereLike(
          "name",
          `%${element.name}%`
        );

        if (ingredient.length === 0) {
          message = "Ingrediente não cadastrado.";
          status = 400;
          await knex("Plates").where({ id: plate_id }).delete();
          return { message, status };
        }

        const ingredient_id = ingredient[0].id;
        const weigth_in_g = element.weigth_in_g;

        await knex("Ingredients_Plates").insert({
          plate_id,
          ingredient_id,
          weigth_in_g,
        });
      }
      message = "Prato adicionado!";
      status = 200;

      return { message, status };
    } catch (err) {
      return err;
    }
  }

  async update(plateInformation, plateId) {
    try {
      let message;
      let status;

      const {plate} = await this.getById(plateId);

      
      if (plate.length === 0) {
          message = "Não há pratos com esse id.";
          status = 400;
          return { message, status };
        }
        
        const newName = plateInformation.name ?? plate[0].name;
        let newCategory_id;
        if (plateInformation.category_name) {
            const category = await knex("Categories")
            .whereLike("name", `%${plateInformation.category_name}%`)
            .first();
            
            if (!category) {
                message = "Categoria não cadastrada.";
                status = 400;
                return { message, status };
            }
            
        newCategory_id = category.id ?? plate[0].category_id;
      }
      const newDescription = plateInformation.description ?? plate[0].description;
      const newImage = plateInformation.image ?? plate[0].image;
      const newPrice = plateInformation.price ?? plate[0].price;
      const newIsFavorite = plateInformation.isFavorite ?? plate[0].isFavorite;

      if (plateInformation.ingredients) {
        for await (const element of plateInformation.ingredients) {
          const ingredient = await knex("Ingredients").whereLike(
            "name",
            `%${element.name}%`
          );

          console.log(ingredient)

          if (ingredient.length === 0) {
            message = "Ingrediente não cadastrado.";
            status = 400;
            return { message, status };
          }

          const ingredient_id = ingredient[0].id;
          const weigth_in_g = element.weigth_in_g;

          const existingIngredient = await knex("Ingredients_Plates")
            .where({ plate_id: plateId, ingredient_id })
            .update({ weigth_in_g });

          if (!existingIngredient) {
            await knex("Ingredients_Plates").insert({
              plate_id: +plateId,
              ingredient_id,
              weigth_in_g,
            });
          }
        }
      }

      await knex("Plates").where({ id: plateId }).update({
        name: newName,
        category_id: newCategory_id,
        description: newDescription,
        image: newImage,
        price: newPrice,
        isFavorite: newIsFavorite,
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
