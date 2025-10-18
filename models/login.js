const db = require("../db/connection");
const {
  validateInsertLogin,
} = require("./utils-validations/login-validations");

exports.insertLogin = async (email) => {
  await validateInsertLogin(email);

  let queryStr = `SELECT * FROM users WHERE email = $1;`;

  const {
    rows: [user],
  } = await db.query(queryStr, [email]);

  return user;
};
