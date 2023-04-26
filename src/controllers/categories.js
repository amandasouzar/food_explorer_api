const CategoriesServices = require("../services/categories");
const categoriesServices = new CategoriesServices()

class CategoriesController {
    async create(req, res) {

    const { name } = req.body;

    try {
        const categoryExists = await categoriesServices.getByName(name)
        
        if (categoryExists.length !== 0) {
            return await res.json({ message: "Já existe uma categoria com esse nome.", status: 400 });
        } else {
            await categoriesServices.create(name);
            return await res.json({ message: "Categoria adicionada", status: 200 });
        }      
    } catch(err) {
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            res.status(401).json({error: 'Acesso não autorizado.'});
          } else {
            res.status(500).json({error: 'Erro interno do servidor.'});
          }
    }
  }

  async getAll(req, res) {
    try {
      const all_categories = await categoriesServices.getAll()

      if (all_categories.length === 0) {
        return res.json({ message: 'Não há categorias.', status: 200 });
      } else {
        return res.json({ message: all_categories, status: 200 });
      }
    } catch(err) {
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            res.status(401).json({error: 'Acesso não autorizado.'});
          } else {
            res.status(500).json({error: 'Erro interno do servidor.'});
          }
    }
  }

  async getById(req, res) {
    const { id } = req.params;

    try {
      const one_category = await categoriesServices.getById(id)

        if (one_category.length === 0) {
            return res.json({ message: 'Categoria não encontrada.', status: 404 });
        } else {
            return res.json({ message: one_category, status: 200 });
        }
    } catch(err) {
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            res.status(401).json({error: 'Acesso não autorizado.'});
          } else {
            res.status(500).json({error: 'Erro interno do servidor.'});
          }
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      await categoriesServices.delete(id)

      return res.json("Categoria apagada!");
    } catch(err) {
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            res.status(401).json({error: 'Acesso não autorizado.'});
          } else {
            res.status(500).json({error: 'Erro interno do servidor.'});
          }
    }
  }
}

module.exports = CategoriesController;
