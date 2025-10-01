const createPropertiesRef = require("./properties-ref");

function formatImages(imagesData, propertiesData) {
  const propertiesID = createPropertiesRef(propertiesData);

  const imageArray = [];

  imagesData.forEach((image) => {
    const property_id = propertiesID[image.property_name];

    if (!property_id) {
      throw new Error(`Property not found for image: ${image.property_name}`);
    }

    imageArray.push([property_id, image.image_url, image.alt_tag]);
  });

  return imageArray;
}

module.exports = formatImages;
