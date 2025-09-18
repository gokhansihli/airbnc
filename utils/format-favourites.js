const createUsersRef = require("./users-ref");
const createPropertiesRef = require("./properties-ref");

function formatFavourites(favouritesData, usersData, propertiesData) {
  const usersID = createUsersRef(usersData);
  const propertiesID = createPropertiesRef(propertiesData);

  const favouriteArray = [];

  favouritesData.forEach((favourite) => {
    const guest_id = usersID[favourite.guest_name];
    const property_id = propertiesID[favourite.property_name];

    if (!guest_id) {
      throw new Error(`Guest not found for favourite: ${favourite.guest_name}`);
    }

    favouriteArray.push([guest_id, property_id]);
  });

  return favouriteArray;
}

module.exports = formatFavourites;
