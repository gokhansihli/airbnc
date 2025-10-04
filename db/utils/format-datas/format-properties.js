const createUsersRef = require("./users-ref");

function formatProperties(propertiesData, usersData) {
  const usersID = createUsersRef(usersData);
  const propertyArray = [];

  propertiesData.forEach((property) => {
    const host_id = usersID[property.host_name];

    if (!host_id) {
      throw new Error(`Host not found for property: ${property.name}`);
    }

    propertyArray.push([
      host_id,
      property.name,
      property.location,
      property.property_type,
      property.price_per_night,
      property.description,
    ]);
  });

  return propertyArray;
}

module.exports = formatProperties;
