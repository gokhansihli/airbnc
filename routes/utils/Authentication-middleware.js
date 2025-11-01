const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const { TOKEN_SECRET } = process.env;
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).send({ msg: "Access denied!" });
  }
};
