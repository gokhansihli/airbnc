const createUsersRef = require("./users-ref");
const createPropertiesRef = require("./properties-ref");

function formatBookings(bookingsData, usersData, propertiesData) {
  const usersID = createUsersRef(usersData);
  const propertiesID = createPropertiesRef(propertiesData);

  const bookingArray = [];

  bookingsData.forEach((booking) => {
    const guest_id = usersID[booking.guest_name];
    const property_id = propertiesID[booking.property_name];

    if (!guest_id) {
      throw new Error(`Guest not found for booking: ${booking.guest_name}`);
    }
    if (!property_id) {
      throw new Error(
        `Property not found for booking: ${booking.property_name}`
      );
    }

    bookingArray.push([
      property_id,
      guest_id,
      booking.check_in_date,
      booking.check_out_date,
    ]);
  });

  return bookingArray;
}

module.exports = formatBookings;
