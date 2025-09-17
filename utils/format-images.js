function formatImages(imagesData, propertiesData) {
  const propertiesID = propertiesData.reduce((acc, property) => {
    acc[property.name] = property.property_id;
    return acc;
  }, {});

  const imageArray = [];

  imagesData.forEach((image) => {
    const property_id = propertiesID[image.property_name];
    if (property_id !== undefined) {
      imageArray.push([property_id, image.image_url, image.alt_tag]);
    }
  });

  return imageArray;
}

module.exports = formatImages;
