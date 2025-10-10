const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");
const {
  validateInsertPropertyReview,
  validateRemoveReview,
} = require("./utils-validations/reviews-validations");

exports.fetchPropertyReviews = async (id) => {
  await checkExists("properties", "property_id", id);

  let queryStr = `SELECT reviews.review_id, reviews.comment, reviews.rating, reviews.created_at,
  CONCAT(users.first_name, ' ', users.surname) AS guest, 
  users.avatar AS guest_avatar
  FROM reviews
  LEFT JOIN users ON reviews.guest_id = users.user_id
  WHERE reviews.property_id = $1
  ORDER BY reviews.created_at DESC;`;

  const { rows: reviews } = await db.query(queryStr, [id]);

  const average_rating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return { reviews, average_rating };
};

exports.insertPropertyReview = async (id, guest_id, rating, comment) => {
  await checkExists("properties", "property_id", id, "Property not found!");
  await validateInsertPropertyReview(guest_id, rating, comment);
  await checkExists("users", "user_id", guest_id, "User not found!");

  let queryStr = `INSERT INTO reviews (property_id, guest_id, rating, comment)
                  VALUES
                  ($1, $2, $3, $4) RETURNING *;`;

  const {
    rows: [review],
  } = await db.query(queryStr, [id, guest_id, rating, comment]);

  return review;
};

exports.removeReview = async (id) => {
  await validateRemoveReview(id);
  await checkExists("reviews", "review_id", id, "Review not found!");

  let queryStr = `DELETE FROM reviews WHERE review_id = $1 RETURNING *`;

  const {
    rows: [review],
  } = await db.query(queryStr, [id]);

  return review;
};
