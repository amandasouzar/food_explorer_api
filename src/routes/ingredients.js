const Router = require('express')
const IngredientsController = require('../controllers/ingredients')

const ingredientsRoutes = Router()
const ingredientsController = new IngredientsController()

ingredientsRoutes.post('/create', ingredientsController.create)
ingredientsRoutes.get('/getAll', ingredientsController.getAll)
ingredientsRoutes.get('/:id', ingredientsController.getById)
ingredientsRoutes.delete('/:id', ingredientsController.delete)

module.exports = ingredientsRoutes