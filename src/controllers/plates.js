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
    const { category_id } = req.params;

    try {
      const platesByCategory = await platesServices.getByCategory(category_id);

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

  async filter(req, res) {
    const { ingredient_name, plate_name } = req.query;

    try {
      if (ingredient_name) {
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
            message: "Não há pratos com esse ingrediente. Analisando nomes...",
            status: 200,
          });
        }

        return res.json({ message: platesByIngredient, status: 200 });
      }

      if (plate_name) {
        const platesByName = await platesServices.getByName(plate_name);


        if (platesByName.length === 0) {
          return res.json({
            message: "Não há pratos com esse nome. Analisando ingredientes...",
            status: 400,
          });
        }

        return res.json({ message: platesByName, status: 200 });
      }
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

    const {user: admin} = req
    
    try {
      const returnedInformation = await platesServices.create(
        plateInformation,
        admin.id
      );

      return res.json({
        message: returnedInformation.message,
        status: returnedInformation.status,
      });
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
      const returnedInformation = await platesServices.update(
        plateInformation,
        id
      );

      return res.json({
        message: returnedInformation.message,
        status: returnedInformation.status,
      });
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
