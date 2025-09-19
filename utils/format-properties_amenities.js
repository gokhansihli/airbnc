function formatPropertiesAmenities(propertiesData) {
  const propertiesAmenitiesArray = [];

  propertiesData.forEach((property, index) => {
    const property_id = index + 1;

    if (!property_id) {
      throw new Error(`Property not found for amenity: ${property.name}`);
    }
    property.amenities.forEach((amenity) => {
      propertiesAmenitiesArray.push([property_id, amenity]);
    });
  });

  return propertiesAmenitiesArray;
}

module.exports = formatPropertiesAmenities;
