const bookingsRouter = require("express").Router({ mergeParams: true });

const {
  postPropertyBooking,
  deleteBooking,
  patchBooking,
} = require("../controllers/bookings");

bookingsRouter.route("/:id").delete(deleteBooking).patch(patchBooking);

bookingsRouter.route("/").post(postPropertyBooking);

module.exports = bookingsRouter;
