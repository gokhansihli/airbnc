const bookingsRouter = require("express").Router({ mergeParams: true });
const { verifyToken } = require("./utils/auth-middleware");

const {
  postPropertyBooking,
  deleteBooking,
  patchBooking,
} = require("../controllers/bookings");
const { handleInvalidMethods } = require("../errors");

bookingsRouter
  .route("/:id")
  .delete(verifyToken, deleteBooking)
  .patch(verifyToken, patchBooking)
  .all(handleInvalidMethods);

bookingsRouter
  .route("/")
  .post(verifyToken, postPropertyBooking)
  .all(handleInvalidMethods);

module.exports = bookingsRouter;
