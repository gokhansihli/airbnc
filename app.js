const express = require("express");

const {
  handlePathNotFound,
  handleBadRequests,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index");

const app = express();

app.use(express.static("public"));

const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*path", handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequests);
app.use(handleServerErrors);

module.exports = app;
