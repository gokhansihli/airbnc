const bookingsRouter = require("express").Router({ mergeParams: true });

const {
  postPropertyBooking,
  deleteBooking,
  patchBooking,
} = require("../controllers/bookings");
const { handleInvalidMethods } = require("../errors");

bookingsRouter
  .route("/:id")
  .delete(deleteBooking)
  .patch(patchBooking)
  .all(handleInvalidMethods);

bookingsRouter.route("/").post(postPropertyBooking).all(handleInvalidMethods);

module.exports = bookingsRouter;
