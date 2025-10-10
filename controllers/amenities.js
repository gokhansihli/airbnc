const { fetchAmenities } = require("../models/amenities");

exports.getAmenities = async (req, res, next) => {
  const amenities = await fetchAmenities();

  res.status(200).send({ amenities });
};
