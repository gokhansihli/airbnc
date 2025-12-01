const usersRouter = require("express").Router();
const { verifyToken } = require("./utils/Authentication-middleware");

const { getUserBookings } = require("../controllers/bookings");
const { getUserFavourites } = require("../controllers/favourites");
const { getUserById, patchUser } = require("../controllers/users");
const { handleInvalidMethods } = require("../errors");

usersRouter
  .route("/:id")
  .get(verifyToken, getUserById)
  .patch(verifyToken, patchUser)
  .all(handleInvalidMethods);

usersRouter
  .route("/:id/bookings")
  .get(verifyToken, getUserBookings)
  .all(handleInvalidMethods);

usersRouter
  .route("/:id/favourites")
  .get(verifyToken, getUserFavourites)
  .all(handleInvalidMethods);

module.exports = usersRouter;
