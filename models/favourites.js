const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");
const {
  validateInsertPropertyFavourite,
  validateRemovePropertyUserFavourite,
} = require("./utils-validations/favourites-validations");

exports.insertPropertyFavourite = async (guest_id, id, signedUserId) => {
  await validateInsertPropertyFavourite(id, guest_id);
  await checkExists("users", "user_id", guest_id, "User not found!");

  if (signedUserId !== +guest_id) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

  let queryStr = `INSERT INTO favourites (guest_id, property_id)
    VALUES ($1,$2) RETURNING *;`;

  const {
    rows: [favourite],
  } = await db.query(queryStr, [guest_id, id]);

  return favourite;
};

exports.removePropertyUserFavourite = async (
  property_id,
  user_id,
  signedUserId
) => {
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

  if (!favourite) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

  return favourite;
};

exports.fetchUserFavourites = async (id, user_id) => {
  await checkExists("users", "user_id", id, "User not found!");

  if (user_id !== +id) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

  const queryStr = `
    SELECT favourites.favourite_id, properties.property_id, properties.name AS property_name,
      CONCAT(users.first_name, ' ', users.surname) AS host,
      (SELECT image_url FROM images 
         WHERE images.property_id = properties.property_id 
         ORDER BY image_id LIMIT 1) AS image
    FROM favourites
    JOIN users ON favourites.guest_id = users.user_id
    JOIN properties ON favourites.property_id = properties.property_id
    WHERE users.user_id = $1
    ORDER BY favourites.favourite_id ASC;
  `;

  const { rows: favourites } = await db.query(queryStr, [id]);

  return favourites;
};
