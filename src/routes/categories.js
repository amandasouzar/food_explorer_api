const Router = require('express')
const CategoriesController = require('../controllers/categories')

const categoriesRoutes = Router()
const categoriesController = new CategoriesController()

categoriesRoutes.post('/create', categoriesController.create)
categoriesRoutes.get('/getAll', categoriesController.getAll)
categoriesRoutes.get('/:id', categoriesController.getById)
categoriesRoutes.delete('/delete/:id', categoriesController.delete)

module.exports = categoriesRoutes