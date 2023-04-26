const Router = require('express')
const sessionRoutes = require('./session')
const signUpRoutes = require('./signup')
const platesRoutes = require('./plates')
const categoriesRoutes = require('./categories')
const ingredientsRoutes = require('./ingredients')
const ordersRoutes = require('./orders')

const routes = Router()

routes.use('/session', sessionRoutes)
routes.use('/signup', signUpRoutes)
routes.use('/plates', platesRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/ingredients', ingredientsRoutes)
routes.use('/orders', ordersRoutes)

module.exports = routes