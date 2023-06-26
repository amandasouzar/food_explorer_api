const knex = require("../database/knex");

class FavoritesServices {
  async connect(plate_id, user) {
    try {
      const alreadyConnect = await knex("Favorites").where({
        plate_id,
        client_id: user.id,
      });

      if (alreadyConnect.length !== 0 ) {
        return;
      } else {
        const id = await knex("Favorites").insert({
          plate_id,
          client_id: user.id,
          isFavorite: false,
        });

        return id;
      }
    } catch (err) {
      return err;
    }
  }

  async verify(plate_id, user) {
    try {
        const isFavorite = await knex('Favorites').where({plate_id, client_id: user.id, isFavorite: true})

        if (isFavorite.length > 0) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return err;
      }
  }

  async update(plate_id, user) {
    try {
      const selectItem = await knex("Favorites").where({
        plate_id,
        client_id: user.id,
      });

      if (!selectItem) {
        return { message: "Item não encontrado", status: 400 };
      } else {
        await knex("Favorites")
          .where({ plate_id, client_id: user.id })
          .update({ isFavorite: !selectItem[0].isFavorite });
        return { message: "Item atualizado", status: 200 };
      }
    } catch (err) {
      return err;
    }
  }

  async getAll(user) {
    try {
      const all_favorites = await knex("Favorites").where({
        client_id: user.id,
        isFavorite: true
      });

      return all_favorites;
    } catch (err) {
      return err;
    }
  }
}

module.exports = FavoritesServices;
