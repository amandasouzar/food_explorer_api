const PlatesServices = require("../services/plates");
const platesServices = new PlatesServices();

const knex = require("../database/knex");

class PlatesController {
  async getById(req, res) {
    const { id } = req.params;

    try {
      const plateInfo = await platesServices.getById(id);

      if (plateInfo.plate.length === 0) {
        return res.json({
          message: "Não há pratos com essa id.",
          status: 400,
        });
      } else {
        return res.json({
          message: plateInfo,
          status: 200,
        });
      }
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async getByCategory(req, res) {
    const { category_name } = req.body;

    try {
      const platesByCategory = await platesServices.getByCategory(
        category_name
      );

      if (!platesByCategory) {
        return res.json({ message: "Categoria não cadastrada.", status: 400 });
      }

      if (platesByCategory.length === 0) {
        return res.json({
          message: "Não há pratos nessa categoria.",
          status: 200,
        });
      }

      return res.json({ message: platesByCategory, status: 200 });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async getByName(req, res) {
    const { nameInput } = req.body;

    try {
      const platesByName = await platesServices.getByName(nameInput);

      if (platesByName.length === 0) {
        return res.json({
          message: "Não há pratos com esse nome. ",
          status: 400,
        });
      }

      return res.json({ message: platesByName, status: 200 });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async getByIngredients(req, res) {
    const { ingredient_name } = req.body;

    try {
      const platesByIngredient = await platesServices.getByIngredients(
        ingredient_name
      );

      if (!platesByIngredient) {
        return res.json({
          message: "Ingrediente não cadastrado.",
          status: 400,
        });
      }

      if (platesByIngredient.length === 0) {
        return res.json({
          message: "Não há pratos com esse ingrediente.",
          status: 200,
        });
      }

      return res.json({ message: platesByIngredient, status: 200 });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async create(req, res) {
    const plateInformation = req.body;

    const { admin_id } = req.params;
    // depois isso virá da requisição com o user definido
    try {
      const returnedInformation = await platesServices.create(
        plateInformation,
        admin_id
      );

      return res.json({ message: returnedInformation.message, status: returnedInformation.status });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
    // devo adicionar algo que verifique se o prato é repetido?
  }

  async update(req, res) {
    const { id } = req.params;
    const plateInformation = req.body;

    try {
      const returnedInformation = await platesServices.update(plateInformation, id)

      return res.json({ message: returnedInformation.message, status: returnedInformation.status });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const existingPlate = await platesServices.delete(id);

      if (existingPlate == 0) {
        return res.json({ message: "Insira um id válido.", status: 200 });
      }

      return res.json({ message: "Prato deletado!", status: 200 });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }
}

module.exports = PlatesController;
