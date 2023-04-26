const Router = require('express')
const PlatesController = require('../controllers/plates')
// const AdminAuth = require('../middlewares/isAdminAuth')

const platesRoutes = Router()
const platesController = new PlatesController()

platesRoutes.post('/create/:admin_id', platesController.create)
platesRoutes.put('/update/:id', platesController.update)
platesRoutes.delete('/delete/:id', platesController.delete)
platesRoutes.get('/get/:id', platesController.getById)
platesRoutes.get('/category', platesController.getByCategory)
platesRoutes.get('/ingredients', platesController.getByIngredients)
platesRoutes.get('/filter', platesController.getByName)

module.exports = platesRoutes