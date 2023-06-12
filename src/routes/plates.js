const Router = require('express')
const PlatesController = require('../controllers/plates')
const Auth = require('../middlewares/Auth')
const checkIsAdmin = require('../middlewares/CheckIsAdmin')

const platesRoutes = Router()
const platesController = new PlatesController()

platesRoutes.post('/create', Auth, checkIsAdmin, platesController.create)
platesRoutes.post('/update/:id', Auth, platesController.update)
platesRoutes.delete('/delete/:id', Auth, checkIsAdmin, platesController.delete)
platesRoutes.get('/get/:id', Auth, platesController.getById)
platesRoutes.get('/category/:category_id', Auth, platesController.getByCategory)
platesRoutes.get('/filter', Auth, platesController.filter)

module.exports = platesRoutes