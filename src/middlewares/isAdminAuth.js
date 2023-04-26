const {verify} = require('jsonwebtoken')
const authConfig = require('../config/auth')
const knex = require('../database/knex')

const isAdminAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.json('Usuário sem token.')
    } else {
        const token = authHeader.split('')[0]
    }

    try {
        const {sub: user_id} = verify(token, authConfig.jwt.secret)

        if (!user_id) {
            throw new Error('JWT inválido.')
        } 

        const user = await knex('Users').where({id: user_id})

        req.user = {
            user
        }

        console.log(user)

        return next()
    } catch {
        err => console.log(err)
    }
}

module.exports = isAdminAuth