const authRouter = require("express").Router();

const signupRouter = require("./signup-router");
const loginRouter = require("./login-router");

authRouter.use("/signup", signupRouter);
authRouter.use("/login", loginRouter);

module.exports = authRouter;
