const usersRouter = require("express").Router();
const { verifyToken } = require("./utils/auth-middleware");

const { getUserBookings } = require("../controllers/bookings");
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

module.exports = usersRouter;
