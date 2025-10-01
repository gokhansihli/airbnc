const {
  fetchPropertyReviews,
  insertPropertyReview,
} = require("../models/reviews");

exports.getPropertyReviews = async (req, res, next) => {
  const { id } = req.params;
  const { reviews, average_rating } = await fetchPropertyReviews(id);

  if (reviews.length === 0) {
    return res.status(404).send({ msg: "Property not found!" });
  }

  res.status(200).send({ reviews, average_rating });
};

exports.postPropertyReview = async (req, res, next) => {
  const { guest_id, rating, comment } = req.body;
  const { id } = req.params;

  if (!comment) {
    return res.status(400).send({ msg: "Bad Request!" });
  }

  const review = await insertPropertyReview(id, guest_id, rating, comment);

  res.status(201).send({ review });
};
