function formatReviews(reviewsData, usersData, propertiesData) {
  const usersID = usersData.reduce((acc, user) => {
    const fullName = `${user.first_name} ${user.surname}`;
    acc[fullName] = user.user_id;
    return acc;
  }, {});

  const propertiesID = propertiesData.reduce((acc, property) => {
    acc[property.name] = property.property_id;
    return acc;
  }, {});

  const reviewArray = [];

  reviewsData.forEach((review) => {
    const guest_id = usersID[review.guest_name];
    const property_id = propertiesID[review.property_name];
    if (guest_id !== undefined && property_id !== undefined) {
      reviewArray.push([
        property_id,
        guest_id,
        review.rating,
        review.comment,
        review.created_at,
      ]);
    }
  });

  return reviewArray;
}

module.exports = formatReviews;
