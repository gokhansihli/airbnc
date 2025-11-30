const db = require("../db/connection");

const {
  validateInsertSignup,
} = require("./utils-validations/signup-validations");

exports.insertSignup = async (
  first_name,
  surname,
  phone_number,
  email,
  is_host = false,
  hashedPassword
) => {
  await validateInsertSignup(first_name, surname, email);

  let queryStr = `INSERT INTO users 
  (first_name, surname, phone_number, email, is_host, password_hash) 
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

  const {
    rows: [user],
  } = await db.query(queryStr, [
    first_name,
    surname,
    phone_number,
    email,
    is_host,
    hashedPassword,
  ]);

  return user;
};
