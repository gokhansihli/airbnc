const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");
const {
  validateFetchUserById,
  validateUpdateUser,
} = require("./utils-validations/users-validations");

exports.fetchUserById = async (id, user_id) => {
  await validateFetchUserById(id);

  await checkExists("users", "user_id", id, "User not found!");

  if (user_id !== +id) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

  let queryStr = `SELECT users.user_id, users.first_name, users.surname, 
        users.email, users.phone_number, users.avatar, users.created_at
        FROM users
        WHERE users.user_id = $1;`;

  const {
    rows: [user],
  } = await db.query(queryStr, [id]);

  return user;
};

exports.updateUser = async (fieldstoUpdate, id, user_id) => {
  await checkExists("users", "user_id", id, "User not found!");

  if (user_id !== +id) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

  const allowedFields = ["first_name", "surname", "email", "phone", "avatar"];

  const fields = Object.keys(fieldstoUpdate);
  const validFields = fields.filter((field) => allowedFields.includes(field));

  await validateUpdateUser(validFields);

  const setUpdate = validFields
    .map((field, index) => {
      const column = field === "phone" ? "phone_number" : field;
      return `${column} = $${index + 1}`;
    })
    .join(", ");

  const queryValues = validFields.map((field) => fieldstoUpdate[field]);
  queryValues.push(id);

  let queryStr = `
    UPDATE users
    SET ${setUpdate} 
    WHERE user_id = $${validFields.length + 1} 
    RETURNING user_id, first_name, surname, email, phone_number AS phone, avatar, is_host, created_at`;

  const {
    rows: [user],
  } = await db.query(queryStr, queryValues);

  return user;
};
