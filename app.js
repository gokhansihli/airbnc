const express = require("express");
const path = require("path");

const {
  handlePathNotFound,
  handleBadRequests,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index");

const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.static(path.join(__dirname, "public/index")));

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequests);
app.use(handleServerErrors);

module.exports = app;
