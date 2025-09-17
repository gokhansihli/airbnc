function formatBookings(bookingsData, usersData, propertiesData) {
  const usersID = usersData.reduce((acc, user) => {
    const fullName = `${user.first_name} ${user.surname}`;
    acc[fullName] = user.user_id;
    return acc;
  }, {});

  const propertiesID = propertiesData.reduce((acc, property) => {
    acc[property.name] = property.property_id;
    return acc;
  }, {});

  const bookingArray = [];

  bookingsData.forEach((booking) => {
    const guest_id = usersID[booking.guest_name];
    const property_id = propertiesID[booking.property_name];
    if (guest_id !== undefined && property_id !== undefined) {
      bookingArray.push([
        property_id,
        guest_id,
        booking.check_in_date,
        booking.check_out_date,
      ]);
    }
  });

  return bookingArray;
}

module.exports = formatBookings;
