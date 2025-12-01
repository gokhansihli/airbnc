const {
  insertPropertyFavourite,
  removePropertyUserFavourite,
  fetchUserFavourites,
} = require("../models/favourites");

exports.postPropertyFavourite = async (req, res, next) => {
  const { guest_id } = req.body;
  const { id } = req.params;
  const signedUserId = req.user.id;

  const favourite = await insertPropertyFavourite(guest_id, id, signedUserId);

  res.status(201).send({
    msg: "Property favourited successfully.",
    favorite_id: favourite.favourite_id,
  });
};

exports.deletePropertyUserFavourite = async (req, res, next) => {
  const { property_id, user_id } = req.params;
  const signedUserId = req.user.id;

  const favourite = await removePropertyUserFavourite(
    property_id,
    user_id,
    signedUserId
  );

  res.status(204).send({ favourite });
};

exports.getUserFavourites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log(id, typeof id);
    console.log(user_id, typeof user_id);

    const favourites = await fetchUserFavourites(id, user_id);

    res.status(200).send({ favourites });
  } catch (error) {
    console.log(error);
    next(err);
  }
};
