const reviewsRouter = require("express").Router({ mergeParams: true });

const {
  deleteReview,
  getPropertyReviews,
  postPropertyReview,
} = require("../controllers/reviews");

reviewsRouter.route("/:id").delete(deleteReview);
reviewsRouter.route("/").get(getPropertyReviews).post(postPropertyReview);

module.exports = reviewsRouter;
