const favouritesRouter = require("express").Router({ mergeParams: true });
const { verifyToken } = require("./utils/Authentication-middleware");

const { postPropertyFavourite } = require("../controllers/favourites");
const { handleInvalidMethods } = require("../errors");

favouritesRouter
  .route("/favourite")
  .post(verifyToken, postPropertyFavourite)
  .all(handleInvalidMethods);

module.exports = favouritesRouter;
