const FavoritesServices = require("../services/favorites");
const favoritesServices = new FavoritesServices();

class FavoritesController {
  async connect(req, res) {
    const { user: client } = req;
    const { plate_id } = req.params;

    try {
      const id = await favoritesServices.connect(plate_id, client[0]);

      if (id) {
        return res.json({ message: "Prato conectado", status: 200 });
      } else {
        return res.json({ message: "Prato já foi conectado", status: 200 });
      }

    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async verify(req, res) {
    const { user: client } = req;
    const { plate_id } = req.params;

    try {
      const isFavorite = await favoritesServices.verify(plate_id, client[0]);

      if (isFavorite) {
          return res.json({ message: "Prato é favorito", isFavorite, status: 200 });
      } else {
        return res.json({ message: "Prato não é favorito", isFavorite, status: 200 });
      }

    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }}}

  async update(req, res) {
    const { plate_id } = req.params;
    const { user: client } = req;


    try {
        const returnedObject = await favoritesServices.update(plate_id, client[0]);
         

        return res.json(returnedObject);
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }}

  async getAll(req, res) {
    const {user: client} = req

    try {
      const all_favorites = await favoritesServices.getAll(client[0]);

      if (all_favorites.length === 0) {
        return res.json({
          message: "Não há pratos favoritados.",
          status: 400,
        });
      } else {
        return res.json({ message: all_favorites, status: 200 });
      }
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }
}

module.exports = FavoritesController;
