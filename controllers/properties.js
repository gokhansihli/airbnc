const { fetchProperties, fetchPropertyById } = require("../models/properties");

exports.getProperties = async (req, res, next) => {
  const { minprice, maxprice, property_type, sort, order } = req.query;

  if ((minprice && isNaN(minprice)) || (maxprice && isNaN(maxprice))) {
    return res.status(400).send({ msg: "Invalid price value!" });
  }
  if (sort && !["cost_per_night", "popularity"].includes(sort)) {
    return res.status(400).send({ msg: "Invalid sort value!" });
  }
  if (order && !["ASC", "DESC"].includes(order && order.toUpperCase())) {
    return res.status(400).send({ msg: "Invalid order value!" });
  }
  if (
    property_type &&
    !["APARTMENT", "HOUSE", "STUDIO"].includes(
      property_type && property_type.toUpperCase()
    )
  ) {
    return res.status(400).send({ msg: "Invalid property type value!" });
  }

  const properties = await fetchProperties(
    minprice,
    maxprice,
    property_type,
    sort,
    order
  );

  res.status(200).send({ properties });
};

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.query;

  if (isNaN(id)) {
    return res.status(400).send({ msg: "Invalid property value!" });
  }
  if (user_id && isNaN(user_id)) {
    return res.status(400).send({ msg: "Invalid user id value!" });
  }

  const property = await fetchPropertyById(id, user_id);

  if (!property) {
    return res.status(404).send({ msg: "Property not found!" });
  }

  res.status(200).send({ property });
};
