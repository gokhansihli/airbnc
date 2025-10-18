const express = require("express");
const path = require("path");

const {
  handlePathNotFound,
  handleBadRequests,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index");
const apiRouter = require("./routes/api-router");
const authRouter = require("./routes/auth-router");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);
app.use("/", authRouter);

app.all("/*path", handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequests);
app.use(handleServerErrors);

module.exports = app;
