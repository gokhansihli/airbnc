const express = require("express");
const { getProperties, getPropertyById } = require("./controllers/properties");
const {
  getPropertyReviews,
  postPropertyReview,
  deleteReview,
} = require("./controllers/reviews");
const { getUserById, patchUser } = require("./controllers/users");
const {
  handlePathNotFound,
  handleBadRequests,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index");

const {
  postPropertyFavourite,
  deletePropertyUserFavourite,
} = require("./controllers/favourites");

const {
  getPropertyBookings,
  postPropertyBooking,
  deleteBooking,
  patchBooking,
  getUserBookings,
} = require("./controllers/bookings");

const { getAmenities } = require("./controllers/amenities");

const app = express();

app.use(express.json());

app.get("/api/properties", getProperties);
app.get("/api/properties/:id", getPropertyById);

app.get("/api/properties/:id/reviews", getPropertyReviews);
app.post("/api/properties/:id/reviews", postPropertyReview);
app.delete("/api/reviews/:id", deleteReview);

app.get("/api/users/:id", getUserById);
app.patch("/api/users/:id", patchUser);

app.post("/api/properties/:id/favourite", postPropertyFavourite);
app.delete(
  "/api/properties/:property_id/users/:user_id/favourite",
  deletePropertyUserFavourite
);

app.get("/api/properties/:id/bookings", getPropertyBookings);
app.get("/api/users/:id/bookings", getUserBookings);
app.post("/api/properties/:id/booking", postPropertyBooking);
app.delete("/api/bookings/:id", deleteBooking);
app.patch("/api/bookings/:id", patchBooking);

app.get("/api/amenities", getAmenities);

app.all("/*path", handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequests);
app.use(handleServerErrors);

module.exports = app;
