const signupRouter = require("express").Router();

const { postSignup } = require("../controllers/signup");
const { handleInvalidMethods } = require("../errors");

signupRouter.route("/").post(postSignup).all(handleInvalidMethods);

module.exports = signupRouter;
