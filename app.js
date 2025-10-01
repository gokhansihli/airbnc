const express = require("express");
const db = require("./db/connection");
const { getProperties, getPropertyById } = require("./controllers/properties");
const {
  getPropertyReviews,
  postPropertyReview,
} = require("./controllers/reviews");
const { getUsers } = require("./controllers/users");
const {
  handlePathNotFound,
  handleServerErrors,
  handleBadRequests,
} = require("./errors/index");

const app = express();

app.use(express.json());

app.get("/api/properties", getProperties);
app.get("/api/properties/:id", getPropertyById);
app.get("/api/properties/:id/reviews", getPropertyReviews);

app.get("/api/users/:id", getUsers);

app.post("/api/properties/:id/reviews", postPropertyReview);

app.all("/*path", handlePathNotFound);
app.use(handleBadRequests);
app.use(handleServerErrors);

module.exports = app;
