const reviewsRouter = require("express").Router({ mergeParams: true });
const { verifyToken } = require("./utils/auth-middleware");

const {
  deleteReview,
  getPropertyReviews,
  postPropertyReview,
} = require("../controllers/reviews");
const { handleInvalidMethods } = require("../errors");

reviewsRouter
  .route("/:id")
  .delete(verifyToken, deleteReview)
  .all(handleInvalidMethods);
reviewsRouter
  .route("/")
  .get(getPropertyReviews)
  .post(verifyToken, postPropertyReview)
  .all(handleInvalidMethods);

module.exports = reviewsRouter;
