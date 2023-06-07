const knex = require('../database/knex')
const {compare} = require('bcryptjs')
const authConfig = require('../config/auth')
const {sign} = require('jsonwebtoken')

class SessionController {
    async create(req, res) {
        const {email, password} = req.body

        const user = await knex('Users').where({email}).first()

        const {secret, expiresIn} = authConfig.jwt

        if (!user) {
            return res.json({message: 'Email e/ou senha incorretos.'})
        } else {
            const comparedPass = await compare(password, user.password)

            if (!comparedPass) {
                return res.json({message: 'Email e/ou senha incorretos.'})
            } else {
                const token = sign({}, secret, {
                    subject: String(user.id),
                    expiresIn
                })

                return res.json({token, isAdmin: user.isAdmin})
            }
        }

    }
}

module.exports = SessionController

