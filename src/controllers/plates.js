const PlatesServices = require("../services/plates");
const platesServices = new PlatesServices();
const uniqid = require("uniqid");

const knex = require("../database/knex");

class PlatesController {
  async getAll(req,res) {
    try {
      const plates = await platesServices.getAll() 
      
      if (plates.length === 0) {
        return res.json({
          message: "Não há pratos.",
          status: 400,
        });
      } else {
        return res.json({
          message: plates,
          status: 200,
        });
      }
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
  }}

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
          status: 400,
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
            message: "Não há pratos com esse ingrediente.",
            status: 400,
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
    const { user: admin } = req;

    const plateImg = req.files.file;
    const uploadPath = __dirname + "/../../public/images/" + plateImg.name;

    plateImg.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
    });

    try {
      const returnedInformation = await platesServices.create(
        plateInformation,
        admin[0].id,
        plateImg.name
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

  async update(req, res) {
    const { id } = req.params;
    const plateInformation = req.body;

    console.log(plateInformation);

    try {
      if (req.files) {
        const plateImg = req.files.file;
        const uploadPath = __dirname + "/../../public/images/" + plateImg.name;

        plateImg.mv(uploadPath, function (err) {
          if (err) return res.status(500).send(err);
        });

        const returnedInformation = await platesServices.update(
          plateInformation,
          id,
          plateImg.name
        );

        return res.json({
          message: returnedInformation.message,
          status: returnedInformation.status,
        });
      } else {
        const returnedInformation = await platesServices.update(
          plateInformation,
          id
        );

        return res.json({
          message: returnedInformation.message,
          status: returnedInformation.status,
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
