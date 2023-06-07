const Router = require('express')
const IngredientsController = require('../controllers/ingredients')
const Auth = require('../middlewares/Auth')
const checkIsAdmin = require('../middlewares/CheckIsAdmin')

const ingredientsRoutes = Router()
const ingredientsController = new IngredientsController()

ingredientsRoutes.post('/create', Auth, checkIsAdmin, ingredientsController.create)
ingredientsRoutes.get('/getAll', Auth, ingredientsController.getAll)
ingredientsRoutes.get('/:id', Auth, ingredientsController.getById)
ingredientsRoutes.delete('/:id', Auth, checkIsAdmin, ingredientsController.delete)

module.exports = ingredientsRoutes