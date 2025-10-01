const db = require("../db/connection");

exports.fetchPropertyReviews = async (id) => {
  let queryStr = `SELECT reviews.review_id, reviews.comment, reviews.rating, reviews.created_at,
  CONCAT(users.first_name, ' ', users.surname) AS guest, 
  users.avatar AS guest_avatar
  FROM reviews
  LEFT JOIN users ON reviews.guest_id = users.user_id
  WHERE reviews.property_id = $1
  ORDER BY reviews.created_at DESC;`;

  const { rows: reviews } = await db.query(queryStr, [id]);

  const average_rating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return { reviews, average_rating };
};

exports.insertPropertyReview = async (id, guest_id, rating, comment) => {
  let queryStr = `INSERT INTO reviews (property_id, guest_id, rating, comment)
                  VALUES
                  ($1, $2, $3, $4) RETURNING *;`;

  const { rows: review } = await db.query(queryStr, [
    id,
    guest_id,
    rating,
    comment,
  ]);

  return review;
};
