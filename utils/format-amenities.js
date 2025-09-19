function createAmenities(propertiesData) {
  const propertiesAmenities = propertiesData.reduce((amenities, property) => {
    property.amenities.forEach((amenity) => {
      amenities.push(amenity);
    });
    return amenities;
  }, []);
  const settedAmenities = new Set(propertiesAmenities);

  return Array.from(settedAmenities).map((amenity) => [amenity]);
}

module.exports = createAmenities;
