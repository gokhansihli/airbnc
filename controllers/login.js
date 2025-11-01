const { insertLogin } = require("../models/login");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = process.env;

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!password) {
    return Promise.reject({
      status: 400,
      msg: "Password should be provided!",
    });
  }

  const user = await insertLogin(email);

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    res.status(401).send({ msg: "Incorrect credentials!" });
  } else {
    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      TOKEN_SECRET
    );
    res.status(201).send({ token });
  }
};
