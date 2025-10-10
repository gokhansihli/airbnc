const apiRouter = require("express").Router();
const usersRouter = require("./users-router");
const propertiesRouter = require("./properties-router");
const bookingsRouter = require("./bookings-router");
const reviewsRouter = require("./reviews-router");
const amenitiesRouter = require("./amenities-router");

apiRouter.use("/properties", propertiesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/amenities", amenitiesRouter);

module.exports = apiRouter;
