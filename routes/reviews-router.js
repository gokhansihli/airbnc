const reviewsRouter = require("express").Router({ mergeParams: true });

const {
  deleteReview,
  getPropertyReviews,
  postPropertyReview,
} = require("../controllers/reviews");
const { handleInvalidMethods } = require("../errors");

reviewsRouter.route("/:id").delete(deleteReview).all(handleInvalidMethods);
reviewsRouter
  .route("/")
  .get(getPropertyReviews)
  .post(postPropertyReview)
  .all(handleInvalidMethods);

module.exports = reviewsRouter;
