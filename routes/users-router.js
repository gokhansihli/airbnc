const usersRouter = require("express").Router();

const { getUserBookings } = require("../controllers/bookings");
const { getUserById, patchUser } = require("../controllers/users");

usersRouter.route("/:id").get(getUserById).patch(patchUser);

usersRouter.route("/:id/bookings").get(getUserBookings);

module.exports = usersRouter;
