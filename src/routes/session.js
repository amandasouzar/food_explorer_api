const Router = require('express')
const SessionController = require('../controllers/session')
const Auth = require('../middlewares/Auth')

const sessionRoutes = Router()
const sessionController = new SessionController()

sessionRoutes.post('/', sessionController.create)
sessionRoutes.get('/check',Auth, sessionController.isAdmin)

module.exports = sessionRoutes

