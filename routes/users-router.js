const usersRouter = require("express").Router();

const { getUserBookings } = require("../controllers/bookings");
const { getUserById, patchUser } = require("../controllers/users");
const { handleInvalidMethods } = require("../errors");

usersRouter
  .route("/:id")
  .get(getUserById)
  .patch(patchUser)
  .all(handleInvalidMethods);

usersRouter
  .route("/:id/bookings")
  .get(getUserBookings)
  .all(handleInvalidMethods);

module.exports = usersRouter;
