const favouritesRouter = require("express").Router({ mergeParams: true });

const { postPropertyFavourite } = require("../controllers/favourites");
const { handleInvalidMethods } = require("../errors");

favouritesRouter
  .route("/favourite")
  .post(postPropertyFavourite)
  .all(handleInvalidMethods);

module.exports = favouritesRouter;
