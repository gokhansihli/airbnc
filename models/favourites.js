const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");
const {
  validateInsertPropertyFavourite,
  validateRemovePropertyUserFavourite,
} = require("./utils-validations/favourites-validations");

exports.insertPropertyFavourite = async (guest_id, id) => {
  await validateInsertPropertyFavourite(id, guest_id);
  await checkExists("users", "user_id", guest_id, "User not found!");

  let queryStr = `INSERT INTO favourites (guest_id, property_id)
    VALUES ($1,$2) RETURNING *;`;

  const {
    rows: [favourite],
  } = await db.query(queryStr, [guest_id, id]);

  return favourite;
};

exports.removePropertyUserFavourite = async (property_id, user_id) => {
  await validateRemovePropertyUserFavourite(property_id, user_id);
  await checkExists(
    "properties",
    "property_id",
    property_id,
    "Property not found!"
  );

  await checkExists("users", "user_id", user_id, "User not found!");

  let queryStr = `DELETE FROM favourites WHERE property_id = $1 AND guest_id = $2 RETURNING *`;

  const {
    rows: [favourite],
  } = await db.query(queryStr, [property_id, user_id]);

  return favourite;
};
