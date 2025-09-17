function formatProperties(propertiesData, usersData) {
  const usersID = usersData.reduce((acc, user) => {
    const fullName = `${user.first_name} ${user.surname}`;
    acc[fullName] = user.user_id;
    return acc;
  }, {});

  const propertyArray = [];

  propertiesData.forEach((property) => {
    const host_id = usersID[property.host_name];
    if (host_id !== undefined) {
      propertyArray.push([
        host_id,
        property.name,
        property.location,
        property.property_type,
        property.price_per_night,
        property.description,
      ]);
    }
  });

  return propertyArray;
}

module.exports = formatProperties;
