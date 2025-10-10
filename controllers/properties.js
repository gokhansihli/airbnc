const { fetchProperties, fetchPropertyById } = require("../models/properties");

exports.getProperties = async (req, res, next) => {
  const { minprice, maxprice, property_type, sort, order, host, amenity } =
    req.query;

  const properties = await fetchProperties(
    minprice,
    maxprice,
    property_type,
    sort,
    order,
    host,
    amenity
  );

  res.status(200).send({ properties });
};

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.query;

  const property = await fetchPropertyById(id, user_id);

  res.status(200).send({ property });
};
