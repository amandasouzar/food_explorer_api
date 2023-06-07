const checkIsAdmin = async (req, res, next) => {
  const {user} = req;

  try {

    if (!user || user[0].isAdmin !== 1) {
      return res.status(403).send({ ok: false, data: "forbidden access" });
    }
    return next();
  } catch (err) {
    return res.status(403).send({ ok: false, data: "forbidden access" });
  }
};

module.exports = checkIsAdmin
