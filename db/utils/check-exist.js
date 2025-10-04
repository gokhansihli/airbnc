const format = require("pg-format");
const db = require("../connection");

const checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const { rows } = await db.query(queryStr, [value]);

  if (rows.length === 0) {
    throw { status: 404, msg: `Resource not found!` };
  }
};

module.exports = checkExists;
