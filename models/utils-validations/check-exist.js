const format = require("pg-format");
const db = require("../../db/connection");

const checkExists = async (table, column, value, msg) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const { rows } = await db.query(queryStr, [value]);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: msg || `Resource not found!` });
  }
};

module.exports = checkExists;
