const propertiesRouter = require("express").Router();
const bookingsRouter = require("./bookings-router");
const reviewsRouter = require("./reviews-router");
const favouritesRouter = require("./favourites-router");
const { verifyToken } = require("./utils/Authentication-middleware");

const { getProperties, getPropertyById } = require("../controllers/properties");
const { getPropertyBookings } = require("../controllers/bookings");
const { deletePropertyUserFavourite } = require("../controllers/favourites");
const { handleInvalidMethods } = require("../errors");

propertiesRouter.route("/").get(getProperties).all(handleInvalidMethods);

propertiesRouter.use("/:id", favouritesRouter);
propertiesRouter
  .route("/:property_id/users/:user_id/favourite")
  .delete(verifyToken, deletePropertyUserFavourite)
  .all(handleInvalidMethods);

propertiesRouter.route("/:id").get(getPropertyById).all(handleInvalidMethods);

propertiesRouter.use("/:id/booking", bookingsRouter);
propertiesRouter
  .route("/:id/bookings")
  .get(verifyToken, getPropertyBookings)
  .all(handleInvalidMethods);

propertiesRouter.use("/:id/reviews", reviewsRouter);

module.exports = propertiesRouter;
