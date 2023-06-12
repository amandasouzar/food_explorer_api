const { verify } = require("jsonwebtoken");
const authConfig = require("../config/auth");
const knex = require("../database/knex");

const Auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ message: "Usuário sem token.", status: 403 });
  }
  const token = authHeader.slice(1, -1);

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    if (!user_id) {
      throw new Error("JWT inválido.");
    }

    const user = await knex("Users").where({ id: user_id });
    const isAdmin = user[0].isAdmin

    req.user = user;
    req.isAdmin = isAdmin

    return next();
  } catch {
    (err) => console.log(err);
  }
};

module.exports = Auth;
