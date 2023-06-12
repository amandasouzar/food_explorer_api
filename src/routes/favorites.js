const Router = require('express')
const FavoritesController = require('../controllers/favorites')
const Auth = require('../middlewares/Auth')

const FavoritesRoutes = Router()
const favoritesController = new FavoritesController()

FavoritesRoutes.post('/connect/:plate_id', Auth, favoritesController.connect)
FavoritesRoutes.put('/update/:plate_id', Auth, favoritesController.update)
FavoritesRoutes.get('/getAll', Auth, favoritesController.getAll)
FavoritesRoutes.get('/verify/:plate_id', Auth, favoritesController.verify)


module.exports = FavoritesRoutes