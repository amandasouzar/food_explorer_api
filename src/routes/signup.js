const Router = require('express')
const SignUpController = require('../controllers/signup')

const signUpRoutes = Router()
const signUpController = new SignUpController()

signUpRoutes.post('/', signUpController.create)

module.exports = signUpRoutes
