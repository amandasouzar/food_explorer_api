const Router = require('express')
const CategoriesController = require('../controllers/categories')
const Auth = require('../middlewares/Auth')
const checkIsAdmin = require('../middlewares/CheckIsAdmin')

const categoriesRoutes = Router()
const categoriesController = new CategoriesController()

categoriesRoutes.post('/create', Auth, checkIsAdmin ,categoriesController.create)
categoriesRoutes.get('/getAll',Auth, categoriesController.getAll)
categoriesRoutes.get('/:id',Auth, categoriesController.getById)
categoriesRoutes.delete('/delete/:id', Auth, checkIsAdmin, categoriesController.delete)

module.exports = categoriesRoutes