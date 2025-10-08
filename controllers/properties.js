const { fetchProperties, fetchPropertyById } = require("../models/properties");

exports.getProperties = async (req, res, next) => {
  try {
    const { minprice, maxprice, property_type, sort, order, host } = req.query;

    const properties = await fetchProperties(
      minprice,
      maxprice,
      property_type,
      sort,
      order,
      host
    );
    res.status(200).send({ properties });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.query;

  try {
    const property = await fetchPropertyById(id, user_id);
    res.status(200).send({ property });
  } catch (error) {
    next(error);
  }
};
