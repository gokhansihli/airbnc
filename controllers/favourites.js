const {
  insertPropertyFavourite,
  removePropertyUserFavourite,
} = require("../models/favourites");

exports.postPropertyFavourite = async (req, res, next) => {
  const { guest_id } = req.body;
  const { id } = req.params;

  const favourite = await insertPropertyFavourite(guest_id, id);

  res.status(201).send({
    msg: "Property favourited successfully.",
    favorite_id: favourite.favourite_id,
  });
};

exports.deletePropertyUserFavourite = async (req, res, next) => {
  const { property_id, user_id } = req.params;

  const favourite = await removePropertyUserFavourite(property_id, user_id);

  res.status(204).send({ favourite });
};
