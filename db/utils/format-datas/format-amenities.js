function formatAmenities(propertiesData) {
  const propertiesAmenities = propertiesData.reduce((amenities, property) => {
    property.amenities.forEach((amenity) => {
      if (!amenities.includes(amenity)) {
        amenities.push(amenity);
      }
    });
    return amenities;
  }, []);

  return propertiesAmenities.map((amenity) => [amenity]);
}

module.exports = formatAmenities;
