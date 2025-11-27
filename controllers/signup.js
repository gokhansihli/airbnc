const { insertSignup } = require("../models/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = process.env;

exports.postSignup = async (req, res, next) => {
  const { first_name, surname, email, is_host, password } = req.body;
  if (!password) {
    return Promise.reject({
      status: 400,
      msg: "Password should be provided!",
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await insertSignup(
    first_name,
    surname,
    email,
    is_host,
    hashedPassword
  );

  const token = jwt.sign(
    {
      id: user.user_id,
      first_name: user.first_name,
      surname: user.surname,
      is_host: user.is_host,
      email: user.email,
    },
    TOKEN_SECRET
  );

  res.status(201).send({ token });
};
