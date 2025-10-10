exports.ValidateFetchProperties = async (
  minprice,
  maxprice,
  property_type,
  sort,
  order,
  host,
  amenity
) => {
  if ([minprice, maxprice].some((price) => price != null && isNaN(price)))
    return Promise.reject({ status: 400, msg: "Invalid price value!" });

  const propertyTypes = ["APARTMENT", "HOUSE", "STUDIO"];
  if (property_type && !propertyTypes.includes(property_type.toUpperCase()))
    return Promise.reject({ status: 400, msg: "Invalid property type value!" });

  const allowedOrder = ["ASC", "DESC"];
  const orderBy = order.toUpperCase();
  if (!allowedOrder.includes(orderBy))
    return Promise.reject({ status: 400, msg: "Invalid order value!" });

  const sortLookUp = {
    cost_per_night: "price_per_night",
    popularity: "avg_rating",
    favourite: "favourited_count",
  };
  if (!(sort in sortLookUp))
    return Promise.reject({ status: 400, msg: "Invalid sort value!" });

  if (host && isNaN(host))
    return Promise.reject({ status: 400, msg: "Invalid host value!" });

  const amenities = ["WiFi", "TV", "Kitchen", "Parking", "Washer"];
  if (Array.isArray(amenity)) {
    //filter keeps elements where the condition is true
    const invalidAmenities = amenity.filter((val) => !amenities.includes(val));
    if (invalidAmenities.length > 0)
      return Promise.reject({ status: 400, msg: "Invalid amenity value!" });
  } else if (amenity && !amenities.includes(amenity))
    return Promise.reject({ status: 400, msg: "Invalid amenity value!" });
};

exports.validateFetchPropertyById = async (id, user_id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "Property value should be a number!",
    });
  }
  if (user_id && isNaN(user_id)) {
    return Promise.reject({
      status: 400,
      msg: "User value should be a number!",
    });
  }
};
