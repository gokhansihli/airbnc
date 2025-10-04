function createPropertiesRef(propertiesData) {
  const propertiesID = propertiesData.reduce((ref, property) => {
    ref[property.name] = property.property_id;
    return ref;
  }, {});

  return propertiesID;
}

module.exports = createPropertiesRef;
