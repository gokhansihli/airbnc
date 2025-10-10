const propertiesRouter = require("express").Router();
const bookingsRouter = require("./bookings-router");
const reviewsRouter = require("./reviews-router");
const favouritesRouter = require("./favourites-router");

const { getProperties, getPropertyById } = require("../controllers/properties");
const { getPropertyBookings } = require("../controllers/bookings");
const { deletePropertyUserFavourite } = require("../controllers/favourites");

propertiesRouter.route("/").get(getProperties);

propertiesRouter.use("/:id", favouritesRouter);
propertiesRouter
  .route("/:property_id/users/:user_id/favourite")
  .delete(deletePropertyUserFavourite);

propertiesRouter.route("/:id").get(getPropertyById);

propertiesRouter.use("/:id/booking", bookingsRouter);
propertiesRouter.route("/:id/bookings").get(getPropertyBookings);

propertiesRouter.use("/:id/reviews", reviewsRouter);

module.exports = propertiesRouter;
