const createUsersRef = require("./users-ref");
const createPropertiesRef = require("./properties-ref");

function formatReviews(reviewsData, usersData, propertiesData) {
  const usersID = createUsersRef(usersData);
  const propertiesID = createPropertiesRef(propertiesData);

  const reviewArray = [];

  reviewsData.forEach((review) => {
    const guest_id = usersID[review.guest_name];
    const property_id = propertiesID[review.property_name];

    if (!guest_id) {
      throw new Error(`Guest not found for review: ${review.guest_name}`);
    }
    if (!property_id) {
      throw new Error(`Property not found for review: ${review.property_name}`);
    }

    reviewArray.push([
      property_id,
      guest_id,
      review.rating,
      review.comment,
      review.created_at,
    ]);
  });

  return reviewArray;
}

module.exports = formatReviews;
