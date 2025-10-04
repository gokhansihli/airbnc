const db = require("../db/connection");
const checkExists = require("../db/utils/check-exist");

exports.insertPropertyFavourite = async (guest_id, id) => {
  if (!guest_id) throw { status: 400, msg: "Guest id should be provided!" };
  if (isNaN(guest_id)) throw { status: 400, msg: "Guest id should be number!" };

  let queryStr = `INSERT INTO favourites (guest_id, property_id)
    VALUES ($1,$2) RETURNING *;`;

  const {
    rows: [favourite],
  } = await db.query(queryStr, [guest_id, id]);

  return favourite;
};

exports.removePropertyUserFavourite = async (property_id, user_id) => {
  if (property_id && isNaN(property_id))
    throw { status: 400, msg: "Invalid property value!" };
  if (user_id && isNaN(user_id))
    throw { status: 400, msg: "Invalid user value!" };

  await checkExists("properties", "property_id", property_id);

  await checkExists("users", "user_id", user_id);

  let queryStr = `DELETE FROM favourites WHERE property_id = $1 AND guest_id = $2 RETURNING *`;

  const {
    rows: [favourite],
  } = await db.query(queryStr, [property_id, user_id]);

  return favourite;
};
