const Router = require('express')
const OrdersController = require('../controllers/orders')

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.post('/create/:admin_id/:client_id', ordersController.create)
ordersRoutes.put('/add/:order_id', ordersController.updateForAdding)
ordersRoutes.put('/remove/:order_id', ordersController.updateForRemoving)
ordersRoutes.get('/adminOrders/:admin_id', ordersController.GetByAdminId)
ordersRoutes.get('/clientOrders/:client_id', ordersController.GetByClientId)

module.exports = ordersRoutes