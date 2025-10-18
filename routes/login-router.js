const loginRouter = require("express").Router();

const { postLogin } = require("../controllers/login");
const { handleInvalidMethods } = require("../errors");

loginRouter.route("/").post(postLogin).all(handleInvalidMethods);

module.exports = loginRouter;
