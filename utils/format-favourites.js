function formatFavourites(favouritesData, usersData, propertiesData) {
  const usersID = usersData.reduce((acc, user) => {
    const fullName = `${user.first_name} ${user.surname}`;
    acc[fullName] = user.user_id;
    return acc;
  }, {});

  const propertiesID = propertiesData.reduce((acc, property) => {
    acc[property.name] = property.property_id;
    return acc;
  }, {});

  const favouriteArray = [];

  favouritesData.forEach((favourite) => {
    const guest_id = usersID[favourite.guest_name];
    const property_id = propertiesID[favourite.property_name];
    if (guest_id !== undefined && property_id !== undefined) {
      favouriteArray.push([guest_id, property_id]);
    }
  });

  return favouriteArray;
}

module.exports = formatFavourites;
