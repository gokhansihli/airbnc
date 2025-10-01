const db = require("../db/connection");

exports.fetchUsers = async (id) => {
  let queryStr = `SELECT users.user_id, users.first_name, users.surname, 
        users.email, users.phone_number, users.avatar, users.created_at
        FROM users
        WHERE users.user_id = $1;`;

  const {
    rows: [user],
  } = await db.query(queryStr, [id]);

  return user;
};
