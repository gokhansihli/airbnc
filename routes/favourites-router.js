const favouritesRouter = require("express").Router({ mergeParams: true });

const {
  postPropertyFavourite,
  deletePropertyUserFavourite,
} = require("../controllers/favourites");

favouritesRouter.route("/favourite").post(postPropertyFavourite);

module.exports = favouritesRouter;
