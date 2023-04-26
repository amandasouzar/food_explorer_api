const knex = require("../database/knex");
const {hash} = require("bcryptjs");

class SignUpController {
  async create(req, res) {
    const { name, email, password, isAdmin } = req.body;

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const emailIsUsed = await knex('Users').where({email})

    if (!validateEmail) {
      return res.json({message:"Email inválido.", status: 400});
    }
    if (emailIsUsed.length !== 0) {
      return res.json({message:"Email já em uso.", status: 400});
    }
    if (password.length < 6) {
      return res.json({message:"Senha inválida.", status: 400});
    }

    const hashedPass = await hash(password, 7)

    await knex('Users').insert({
      name,
      email,
      password: hashedPass,
      isAdmin
    });

    return res.json({message: 'Usuário adicionado!', status: 200})
  }
}

module.exports = SignUpController;
