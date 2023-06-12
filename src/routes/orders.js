const Router = require('express')
const OrdersController = require('../controllers/orders')
const Auth = require('../middlewares/Auth')
const checkIsAdmin = require('../middlewares/CheckIsAdmin')

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.post('/create/:admin_id',Auth, ordersController.create)
ordersRoutes.put('/update/:operation_id/:order_id',Auth, ordersController.update)
ordersRoutes.get('/adminOrders/', Auth, checkIsAdmin, ordersController.GetByAdminId)
ordersRoutes.get('/clientOrders',Auth, ordersController.GetByClientId)
ordersRoutes.get('/history',Auth, ordersController.getHistory)
ordersRoutes.put('/close/:order_id', Auth, ordersController.close)
ordersRoutes.delete('/delete/:order_id/:plate_id',Auth, ordersController.deleteItem)

module.exports = ordersRoutes