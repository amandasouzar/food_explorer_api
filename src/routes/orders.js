const Router = require('express')
const OrdersController = require('../controllers/orders')

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.post('/create/:admin_id/:client_id', ordersController.create)
ordersRoutes.put('/update/:operation_id/:order_id', ordersController.update)
ordersRoutes.get('/adminOrders/:admin_id', ordersController.GetByAdminId)
ordersRoutes.get('/clientOrders/:client_id', ordersController.GetByClientId)
ordersRoutes.delete('/delete/:order_id', ordersController.delete)

module.exports = ordersRoutes