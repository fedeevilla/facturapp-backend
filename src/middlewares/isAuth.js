const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.header("token");

  if (!token) return res.status(401).send("Access Denied");

  try {
    const { user } = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = user;
    next();
  } catch (err) {
    res.status(422).send("Invalid Token");
  }
};

module.exports = isAuth;
