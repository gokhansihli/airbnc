function formatPropertyTypes(propertyTypesData) {
  return propertyTypesData.map(({ property_type, description }) => [
    property_type,
    description,
  ]);
}

module.exports = formatPropertyTypes;
