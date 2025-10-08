function formatPropertiesAmenities(propertiesData, insertedProperties) {
  const propertiesAmenitiesArray = [];

  propertiesData.forEach((property, index) => {
    const property_id = insertedProperties[index].property_id;

    property.amenities.forEach((amenity) => {
      propertiesAmenitiesArray.push([property_id, amenity]);
    });
  });

  return propertiesAmenitiesArray;
}

module.exports = formatPropertiesAmenities;
